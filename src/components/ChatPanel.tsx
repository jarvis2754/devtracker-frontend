// ChatPanel.tsx
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, type Frame, type Message as StompMessage } from "@stomp/stompjs";
import { decodeJwt } from "jose";
import axios from "axios";
import Sidebar from "./MessageSidebar";
import MessageBubble from "./MessageBubble";

type ChatMode = "PRIVATE" | "PROJECT" | "ORGANIZATION";

export interface ChatMessage {
  id?: string;
  sender: number;
  recipient?: number | null;
  projectId?: number | null;
  content: string;
  timestamp: string;
}

/** Change this if your backend WS URL differs */
const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:8080/ws";

export default function ChatPanel() {
  const [mode, setMode] = useState<ChatMode>("PRIVATE");
  const [recipient, setRecipient] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const clientRef = useRef<Client | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set()); // dedupe by id
  const endRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // auto-scroll when new message appended and user is near bottom
  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    // scroll into view
    el.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect once on mount
  useEffect(() => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      setError("No JWT token found in localStorage under key 'token'.");
      return;
    }

    // strip possible "Bearer " prefix
    const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

    let uid: number | null = null;
    try {
      const decoded: any = decodeJwt(token);
      uid = decoded?.userId ?? null;
      if (!uid) {
        setError("Token does not contain userId claim.");
        return;
      }
      setUserId(uid);
    } catch (err) {
      setError("Failed to decode JWT token.");
      console.error(err);
      return;
    }

    // create stomp client (using @stomp/stompjs)
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}?userId=${uid}&token=${token}`),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: (frame: Frame) => {
        setConnected(true);
        setError(null);
        console.info("STOMP connected:", frame);
        // subscribe to channels
        subscribeToTopics(client, uid);
      },
      onStompError: (frame) => {
        console.error("Broker reported error: ", frame);
        setError(frame?.message ?? "STOMP broker error");
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onWebSocketClose: (evt) => {
        setConnected(false);
        console.warn("WS closed", evt);
      },
      debug: () => { }, // silence verbose logs; set to console.log while debugging
    });

    clientRef.current = client;
    client.activate();

    return () => {
      // cleanup: deactivate the client (safe to call even if not connected)
      try {
        client.deactivate();
      } catch (e) {
        // ignore errors during cleanup
      } finally {
        clientRef.current = null;
        setConnected(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  function subscribeToTopics(client: Client, uid: number) {
    // private queue (user-destination)
    try {
      client.subscribe(`/user/${uid}/queue/messages`, (m: StompMessage) => {
        safePushIncoming(m);
      });
    } catch (e) {
      console.error("Failed subscribe private", e);
    }

    // organization
    try {
      client.subscribe("/topic/organization", (m: StompMessage) => {
        safePushIncoming(m);
      });
    } catch (e) {
      console.error("Failed subscribe org", e);
    }

    // NOTE: do not auto-subscribe to every project; subscribe to project topic when user selects a project
    // For demo/test, you may keep sample subscription:
    // client.subscribe("/topic/project.1", (m) => safePushIncoming(m));
  }

  // safe handler for incoming stomp messages
  function safePushIncoming(stompMsg: StompMessage) {
    try {
      const body = JSON.parse(stompMsg.body) as ChatMessage;
      // normalize id: backend should ideally send an id
      const incomingId = body.id ?? `${body.sender}-${body.timestamp ?? Date.now()}`;
      if (seenIdsRef.current.has(incomingId)) return; // already have it
      seenIdsRef.current.add(incomingId);

      const normalized: ChatMessage = {
        id: incomingId,
        sender: body.sender,
        recipient: body.recipient?? null,
        projectId: body.projectId ?? null,
        content: body.content,
        timestamp: body.timestamp ?? new Date().toISOString(),
      };

      setMessages((prev) => [...prev, normalized]);
    } catch (e) {
      console.error("Error parsing incoming message", e);
    }
  }

  // Fetch history when conversation changes
  useEffect(() => {
    if (!userId) return;

    let url: string | null = null;
    if (mode === "PRIVATE" && recipient) {
      url = `/message/private/${userId}/${recipient}`;
    } else if (mode === "PROJECT" && projectId) {
      url = `/message/project/${projectId}`;
    } else if (mode === "ORGANIZATION") {
      url = `/message/organization`;
    }

    if (!url) {
      setMessages([]);
      seenIdsRef.current.clear();
      return;
    }

    setLoadingHistory(true);
    setError(null);

    axios
      .get(url)
      .then((res) => {
        console.log("History response:", res.data); // 👈 check actual shape
        console.log("History raw:", res.data.content); // 👈 check actual shape
        // Make sure it's an array
        const rawList = Array.isArray(res.data) ? res.data : [];

        const list: ChatMessage[] = rawList.map((m: any) => {
          const id = m.id?.toString() ?? `${m.sender}-${m.timestamp}`;
          seenIdsRef.current.add(id);
          return {
            id,
            sender: m.sender ?? m.sender,
            recipient: m.recipient ?? m.recipientId ?? null,
            projectId: m.project ?? m.projectId ?? null,
            content: m.content,
            timestamp: m.timestamp,
          };
        });

        setMessages(list);
      })
      .catch((err) => {
        console.error("Failed to load history", err);
        setError("Failed to load history");
      })
      .finally(() => {
        setLoadingHistory(false);
      });
  }, [mode, recipient, projectId, userId]);


  // send message
  function send() {
    setError(null);
    if (!clientRef.current || !userId) {
      setError("Not connected or missing userId");
      return;
    }
    if (!connected) {
      setError("Not connected yet");
      return;
    }
    if (!messageText.trim()) return;

    let destination = "";
    const payload: Partial<ChatMessage> = {
      sender: userId,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    if (mode === "PRIVATE") {
      if (!recipient) {
        setError("Select a recipient for private chat");
        return;
      }
      destination = "/app/chat.private";
      payload.recipient = recipient;
    } else if (mode === "PROJECT") {
      if (!projectId) {
        setError("Select a project for project chat");
        return;
      }
      destination = "/app/chat.project";
      payload.projectId = projectId;
    } else {
      destination = "/app/chat.organization";
    }

    // clientRef.current is @stomp/stompjs client
    try {
      const client = clientRef.current!;
      client.publish({ destination, body: JSON.stringify(payload) });

      // Show outgoing locally (optimistic)
      const localId = `o-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      seenIdsRef.current.add(localId);
      setMessages((prev) => [
        ...prev,
        {
          id: localId,
          sender: payload.sender!,
          recipient: payload.recipient ?? null,
          projectId: payload.projectId ?? null,
          content: payload.content!,
          timestamp: payload.timestamp!,
        },
      ]);
      setMessageText("");
    } catch (e) {
      console.error("Failed to send message", e);
      setError("Failed to send message");
    }
  }

  // helper: subscribe to a project when selected (you can call unsubscribeProject when switched away)
  function subscribeProject(project: number) {
    const client = clientRef.current;
    if (!client || !connected) return;
    const key = `/topic/project.${project}`;
    // avoid duplicate subscription - stompjs client subscribe returns Subscription object; for simplicity we don't track here
    client.subscribe(key, (msg) => safePushIncoming(msg));
  }

  return (
    <section className="container d-flex justify-content-center flex-column" style={{ height: "100vh" }}>
      <div className="container m-auto" style={{ width: "90%", height: "70%" }}>
        <div className="d-flex" style={{ height: "85vh", minHeight: 600 }}>
          <Sidebar
            mode={mode}
            setMode={(m) => {
              setMode(m);
              // when switching mode, you might want to clear selection or subscribe/unsubscribe
            }}
            recipient={recipient}
            setRecipient={(id) => {
              setRecipient(id);
            }}
            projectId={projectId}
            setProjectId={(pid) => {
              setProjectId(pid);
              if (pid != null) subscribeProject(pid);
            }}
          />

          <div className="flex-grow-1 d-flex flex-column">
            <div className="border-bottom p-2 d-flex justify-content-between align-items-center">
              <div>
                <strong>DevTracker Chat</strong>
                <span className={`ms-2 badge ${connected ? "bg-success" : "bg-danger"}`}>
                  {connected ? "Online" : "Offline"}
                </span>
              </div>
              <div className="text-end small text-muted">
                Mode: <strong>{mode}</strong>
                {mode === "PRIVATE" && recipient ? ` • To #${recipient}` : ""}
                {mode === "PROJECT" && projectId ? ` • Project #${projectId}` : ""}
              </div>
            </div>

            <div className="flex-grow-1 overflow-auto p-3" style={{ background: "#eef2f7" }}>
              {loadingHistory && <div className="text-center text-muted mb-2">Loading history...</div>}
              {messages.map((m) => (
                <MessageBubble key={m.id ?? `${m.sender}-${m.timestamp}`} msg={m} currentUserId={userId ?? -1} />
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-top bg-white">
              {error && <div className="alert alert-danger py-1">{error}</div>}
              <div className="input-group">
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder={
                    mode === "PRIVATE" ? "Message user..." : mode === "PROJECT" ? "Message project..." : "Message organization..."
                  }
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button className="btn btn-primary ms-2" onClick={send} disabled={!messageText.trim() || !connected}>
                  Send
                </button>
              </div>
              <div className="text-muted small mt-1">Tip: Enter to send • Shift+Enter newline</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
