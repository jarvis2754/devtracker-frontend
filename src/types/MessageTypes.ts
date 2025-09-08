export type ChatMode = "PRIVATE" | "PROJECT" | "ORGANIZATION";

export interface ChatMessageDTO {
  sender: number;
  recipientId?: number | null;
  projectId?: number | null;
  content: string;
  timestamp?: string;
}

export interface MessageModel {
  id: string;               
  content: string;
  senderId: number;
  recipientId?: number | null;
  projectId?: number | null;
  type: ChatMode | "SYSTEM";
  timestamp: string;         // ISO string
  direction?: "in" | "out" | "system";
}