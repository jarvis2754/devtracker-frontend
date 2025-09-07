// services/ChatService.ts
import { Client, type IMessage, type Frame, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatMessageDTO, MessageModel, ChatMode } from "../types/MessageTypes";

/**
 * ChatService: singleton-like wrapper around STOMP client.
 * - Uses SockJS (server: /ws)
 * - Call connect() then subscribe to topics or provide callbacks
 */
export type OnMessageFn = (msg: MessageModel) => void;
export type OnStatusFn = (connected: boolean, reason?: string) => void;

export class ChatService {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private onMessage?: OnMessageFn;
  private onStatus?: OnStatusFn;

  private wsUrl: string;
  private userId?: string | number;
  private connectHeaders?: Record<string, string>;

  constructor(
    wsUrl: string,
    userId?: string | number,
    connectHeaders?: Record<string, string> // optional: pass JWT here
  ) {
    this.wsUrl = wsUrl;
    this.userId = userId;
    this.connectHeaders = connectHeaders;
  }

  setOnMessage(fn: OnMessageFn) { this.onMessage = fn; }
  setOnStatus(fn: OnStatusFn) { this.onStatus = fn; }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client && this.client.active) return resolve();

      this.client = new Client({
        // use SockJS for broad compatibility
        webSocketFactory: () => new SockJS(this._wsUrlWithUser()),
        reconnectDelay: 5000,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 20000,
        debug: () => {}, // set to console.log for debug
        onConnect: (frame: Frame) => {
          this.onStatus?.(true);
          resolve();
        },
        onStompError: (frame) => {
          const msg = frame?.headers?.message ?? "Broker error";
          this.onStatus?.(false, msg);
          reject(new Error(msg));
        },
        onWebSocketClose: (evt) => {
          this.onStatus?.(false, "socket-closed");
        },
      });

      if (this.connectHeaders) {
        // for JWT: this.client.connectHeaders = {...}
        // @ts-ignore - library supports this property
        this.client.connectHeaders = this.connectHeaders;
      }

      this.client.activate();
    });
  }

  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.client) return resolve();
      this.subscriptions.forEach((s) => {
        try { s.unsubscribe(); } catch {}
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
      this.onStatus?.(false);
      resolve();
    });
  }

  // subscribe to private user queue: /user/queue/messages
  subscribePrivate() {
    this._ensureClient();
    const key = "private";
    if (this.subscriptions.has(key)) return;
    const sub = this.client!.subscribe(`/user/${this.userId}/queue/messages`, (msg: IMessage) => {
      this._handleIncoming(msg, "PRIVATE");
    });
    this.subscriptions.set(key, sub);
  }

  subscribeOrganization() {
    this._ensureClient();
    const key = "org";
    if (this.subscriptions.has(key)) return;
    const sub = this.client!.subscribe("/topic/organization", (msg: IMessage) => {
      this._handleIncoming(msg, "ORGANIZATION");
    });
    this.subscriptions.set(key, sub);
  }

  subscribeProject(projectId: number) {
    this._ensureClient();
    const key = `project:${projectId}`;
    if (this.subscriptions.has(key)) return;
    const sub = this.client!.subscribe(`/topic/project.${projectId}`, (msg: IMessage) => {
      this._handleIncoming(msg, "PROJECT");
    });
    this.subscriptions.set(key, sub);
  }

  unsubscribeProject(projectId: number) {
    const key = `project:${projectId}`;
    const sub = this.subscriptions.get(key);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  sendPrivate(dto: ChatMessageDTO) {
    this._ensureClient();
    this.client!.publish({
      destination: "/app/chat.private",
      body: JSON.stringify(dto),
    });
  }

  sendProject(dto: ChatMessageDTO) {
    this._ensureClient();
    this.client!.publish({
      destination: "/app/chat.project",
      body: JSON.stringify(dto),
    });
  }

  sendOrganization(dto: ChatMessageDTO) {
    this._ensureClient();
    this.client!.publish({
      destination: "/app/chat.organization",
      body: JSON.stringify(dto),
    });
  }

  // low level: direct publish (destination arbitrary)
  publish(destination: string, payload: any) {
    this._ensureClient();
    this.client!.publish({ destination, body: JSON.stringify(payload) });
  }

  private _handleIncoming(msg: IMessage, type: ChatMode) {
    try {
      const body = JSON.parse(msg.body) as ChatMessageDTO;
      const model: MessageModel = {
        id: this._makeId(),
        content: body.content,
        senderId: body.senderId,
        recipientId: body.recipientId ?? null,
        projectId: body.projectId ?? null,
        type,
        timestamp: body.timestamp ?? new Date().toISOString(),
        direction: (body.senderId === Number(this.userId)) ? "out" : "in",
      };
      this.onMessage?.(model);
    } catch (e) {
      // ignore parse errors
      console.error("parse incoming", e);
    }
  }

  private _wsUrlWithUser() {
    const base = this.wsUrl;
    if (!this.userId) return base;
    // include userId as query param (matches the HandshakeInterceptor approach)
    return base.includes("?") ? `${base}&userId=${this.userId}` : `${base}?userId=${this.userId}`;
  }

  private _ensureClient() {
    if (!this.client) throw new Error("Client not connected — call connect()");
  }

  private _makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }
}