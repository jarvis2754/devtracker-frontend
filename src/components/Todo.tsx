import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "../App.css";
import type { ProjectRequest, ProjectResponse, TeamMember } from "../types/ProjectTypes";

interface TodoProps {
  onClose: () => void;
  onProjectAdded: (project: ProjectResponse) => void;
}

const Todo: React.FC<TodoProps> = ({ onClose, onProjectAdded }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [deadline, setDeadline] = useState("");

  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamUuid, setTeamUuid] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Add team member (UUID only)
  const addTeam = () => {
    if (teamUuid.trim()) {
      const newMember: TeamMember = { uuid: teamUuid.trim() };
      setTeams([...teams, newMember]);
      setTeamUuid("");
      setShowTeamInput(false);
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !teamLeadId || !deadline) {
      alert("Please fill Project Name, Team Lead, and Deadline.");
      return;
    }

    const newProject: ProjectRequest = {
      projectId: 0, // temporary, backend will override
      projectName,
      projectDesc,
      teamLeadId,
      deadline,
      status: "ACTIVE",
      // ✅ map to UUID strings only
      teamMemberIds: teams.map((t) => t.uuid),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/project/add",
        newProject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const addedProject: ProjectResponse = {
        projectId: response.data.projectId,
        projectName: response.data.projectName || projectName,
        projectDesc: response.data.projectDesc || projectDesc,
        teamLeadId: response.data.teamLeadId || teamLeadId,
        status: response.data.status || "ACTIVE",
        deadline: response.data.deadline || deadline,
        // ✅ backend should also return UUID array
        teamMemberIds: response.data.teamMemberIds || teams.map((t) => t.uuid),
      };

      onProjectAdded(addedProject);
      onClose();
    } catch (error) {
      console.error("❌ Error creating project:", error);
      alert("Failed to create project.");
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

        {/* Project Name */}
        <div className="mb-3 d-flex align-items-center">
          <label
            className="form-label fw-bold me-0.3"
            style={{ width: "150px" }}
          >
            Project Name
          </label>
          <input
            type="text"
            className="form-control rounded-pill"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* Project Desc */}
        <div className="mb-3 d-flex align-items-center">
          <label
            className="form-label fw-bold me-0.3"
            style={{ width: "150px" }}
          >
            Project Desc
          </label>
          <textarea
            className="w-100 border rounded"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
          />
        </div>

        {/* Team Lead */}
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
            Team Lead
          </label>
          <input
            type="text"
            className="form-control rounded-pill"
            value={teamLeadId}
            onChange={(e) => setTeamLeadId(e.target.value)}
          />
        </div>

        {/* Deadline */}
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

        {/* Teams (UUID only) */}
        <div className="mb-3">
          <label
            className="form-label fw-bold d-inline-block"
            style={{ width: "98px" }}
          >
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
                placeholder="Member UUID"
                value={teamUuid}
                onChange={(e) => setTeamUuid(e.target.value)}
              />
              <button
                className="btn btn-primary rounded-pill"
                onClick={addTeam}
              >
                Add
              </button>
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 mt-2 ms-5">
            {teams.map((team, index) => (
              <span key={index} className="badge bg-secondary rounded-pill">
                {team.uuid}
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={handleSubmit}
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
