// types/MessageTypes.ts
export type ChatMode = "PRIVATE" | "PROJECT" | "ORGANIZATION";

export interface ChatMessageDTO {
  sender: number;
  recipient?: number | null;
  projectId?: number | null;
  content: string;
  timestamp?: string;
}

export interface MessageModel {
  id: string;                // client generated id for UI
  content: string;
  sender: number;
  recipient?: number | null;
  projectId?: number | null;
  type: ChatMode | "SYSTEM";
  timestamp: string;         // ISO string
  direction?: "in" | "out" | "system";
}