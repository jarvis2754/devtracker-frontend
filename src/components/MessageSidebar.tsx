import type { ChatMode } from "../types/MessageTypes";

export default function Sidebar({
  mode, setMode, recipientId, setRecipientId, projectId, setProjectId
}: {
  mode: ChatMode;
  setMode: (m: ChatMode) => void;
  recipientId: number | null;
  setRecipientId: (v: number | null) => void;
  projectId: number | null;
  setProjectId: (v: number | null) => void;
}) {
  return (
    <div className="border-end p-2" style={{ width: 280 }}>
      <div className="mb-3">
        <strong>Conversations</strong>
      </div>
      <div className="btn-group w-100 mb-3">
        <input type="radio" className="btn-check" name="mode" id="private" checked={mode === "PRIVATE"} onChange={() => setMode("PRIVATE")} />
        <label className="btn btn-outline-primary" style={{fontSize:"0.8rem"}}  htmlFor="private">Private</label>

        <input type="radio" className="btn-check" name="mode" id="project" checked={mode === "PROJECT"} onChange={() => setMode("PROJECT")} />
        <label className="btn btn-outline-primary" style={{fontSize:"0.8rem"}}  htmlFor="project">Project</label>

        <input type="radio" className="btn-check" name="mode" id="org" checked={mode === "ORGANIZATION"} onChange={() => setMode("ORGANIZATION")} />
        <label className="btn btn-outline-primary" style={{fontSize:"0.8rem"}} htmlFor="org">Organization</label>
      </div>

      {mode === "PRIVATE" && (
        <input type="number" className="form-control mb-2" placeholder="Recipient ID" value={recipientId ?? ""} onChange={e => setRecipientId(e.target.value ? Number(e.target.value) : null)} />
      )}
      {mode === "PROJECT" && (
        <input type="number" className="form-control mb-2" placeholder="Project ID" value={projectId ?? ""} onChange={e => setProjectId(e.target.value ? Number(e.target.value) : null)} />
      )}
    </div>
  );
}
