import { useState } from "react";
import "../App.css";
import { X } from "lucide-react";

interface Project {
  name: string;
  description: string;
  teamLead: string;
  deadline: string;
  priority: string;
  tags: string[];
  teams: string[];
}

interface TodoProps {
  onClose: () => void; // parent controls closing
}

const Todo: React.FC<TodoProps> = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [tagText, setTagText] = useState("");
  const [teamText, setTeamText] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  const today = new Date().toISOString().split("T")[0];

  const handlePrioritySelect = (selected: string) => setPriority(selected);

  const addTag = () => {
    if (tagText.trim()) {
      setTags([...tags, tagText.trim()]);
      setTagText("");
      setShowTagInput(false);
    }
  };

  const addTeam = () => {
    if (teamText.trim()) {
      setTeams([...teams, teamText.trim()]);
      setTeamText("");
      setShowTeamInput(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}/${dd}/${d.getFullYear()}`;
  };

  const handleSubmit = () => {
    if (!projectName || !teamLead || !deadline || !priority) {
      alert("Please fill Project Name, Team Lead, Deadline, and select a Priority.");
      return;
    }

    const newProject: Project = {
      name: projectName,
      description: projectDesc,
      teamLead,
      deadline,
      priority,
      tags,
      teams,
    };

    setProjects([...projects, newProject]);
    setProjectName("");
    setProjectDesc("");
    setTeamLead("");
    setDeadline("");
    setPriority("");
    setTags([]);
    setTeams([]);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-danger text-white";
      case "Medium":
        return "bg-warning text-dark";
      case "Low":
        return "bg-info text-white";
      default:
        return "bg-info text-white";
    }
  };

  return (
    <div className="popup-overlay">
      <div
        className="card p-4 shadow-sm position-relative"
        style={{ width: "500px", margin: "0 auto" }}
      >
        {/* Close button */}
        <button
          className="btn-style bg-danger border-0 text-light p-0.8 px-1 position-absolute top-0 end-0"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Form */}
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label fw-bold me-0.3" style={{ width: "150px" }}>
            Project Name
          </label>
          <input
            type="text"
            className="form-control rounded-pill"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className="mb-3 d-flex align-items-center">
          <label className="form-label fw-bold me-0.3" style={{ width: "150px" }}>
            Project Desc
          </label>
          <input
            type="text"
            className="form-control rounded-pill"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
          />
        </div>

        <div className="mb-3 d-flex align-items-center">
          <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
            Team Lead
          </label>
          <input
            type="text"
            className="form-control rounded-pill"
            value={teamLead}
            onChange={(e) => setTeamLead(e.target.value)}
          />
        </div>

        <div className="mb-3 d-flex align-items-center">
          <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
            Deadline
          </label>
          <input
            type="date"
            className="form-control rounded-pill"
            value={deadline}
            min={today}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="mb-3 d-flex align-items-center">
          <label className="form-label fw-bold me-5" >
            Priority
          </label>
          <div className="d-flex gap-2">
            {["High", "Medium", "Low"].map((p) => (
              <span
                key={p}
                className={`badge ${getPriorityClass(p)} rounded-pill cursor-pointer ${
                  priority === p ? "border border-dark" : ""
                }`}
                onClick={() => handlePrioritySelect(p)}
                style={{ transform: priority === p ? "scale(1.05)" : "none" }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label className="form-label fw-bold d-inline-block" style={{ width: "98px" }}>
            Tag
          </label>
          <span
            className="badge bg-primary rounded-pill cursor-pointer ms-2"
            onClick={() => setShowTagInput(true)}
          >
            + Tag
          </span>
          {showTagInput && (
            <div className="d-flex gap-2 mt-2 ms-5">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter tag"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
              />
              <button className="btn btn-primary rounded-pill" onClick={addTag}>
                Add
              </button>
            </div>
          )}
          <div className="d-flex flex-wrap gap-2 mt-2 ms-5">
            {tags.map((tag, index) => (
              <span key={index} className="badge bg-primary rounded-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div className="mb-3">
          <label className="form-label fw-bold d-inline-block" style={{ width: "98px" }}>
            Team
          </label>
          <span
            className="badge bg-primary rounded-pill cursor-pointer ms-2"
            onClick={() => setShowTeamInput(true)}
          >
            + Team
          </span>
          {showTeamInput && (
            <div className="d-flex gap-2 mt-2 ms-5">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter team member"
                value={teamText}
                onChange={(e) => setTeamText(e.target.value)}
              />
              <button className="btn btn-primary rounded-pill" onClick={addTeam}>
                Add
              </button>
            </div>
          )}
          <div className="d-flex flex-wrap gap-2 mt-2 ms-5">
            {teams.map((team, index) => (
              <span key={index} className="badge bg-primary rounded-pill">
                {team}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-primary rounded-pill px-4" onClick={handleSubmit}>
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
