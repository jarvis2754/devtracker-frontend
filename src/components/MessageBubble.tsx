import type { ChatMessage } from "./ChatPanel";

export default function MessageBubble({ msg, currentUserId }: { msg: ChatMessage; currentUserId: number }) {

  const isSelf = msg.senderId === currentUserId;
  const dt = new Date(msg.timestamp);
  const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


  return (
    <div className={`d-flex mb-2 ${isSelf ? "justify-content-end" : "justify-content-start"}`}>
      <div className={`p-2 rounded shadow-sm ${isSelf ? "bg-primary text-white" : "bg-white"}`} style={{ maxWidth: "70%" }}>
        <div className="small text-muted mb-1">
          {!isSelf ? `User #${msg.senderId}` : `You → ${msg.recipientId ?? ""}`} • {time}
        </div>
        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
      </div>
    </div>
  );
}
