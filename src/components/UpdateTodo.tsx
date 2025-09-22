import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "../App.css";
import type { ProjectRequest, ProjectResponse,TeamMember } from "../types/ProjectTypes";

interface TodoProps {
  onClose: () => void;
  onProjectUpdated: (project: ProjectResponse) => void;
  project: ProjectResponse;
}
const UpdateTodo: React.FC<TodoProps> = ({
  onClose,
  onProjectUpdated,
  project,
}) => {
  const [projectName, setProjectName] = useState(project.projectName);
  const [projectDesc, setProjectDesc] = useState(project.projectDesc);
  const [teamLeadId, setTeamLeadId] = useState(
    project.teamLeadId && (project.teamLeadId as TeamMember).uuid
      ? (project.teamLeadId as TeamMember).uuid
      : ""
  );
  const [deadline, setDeadline] = useState(
    project.deadline ? project.deadline.substring(0, 10) : ""
  );

  const [teams, setTeams] = useState<string[]>(project.teamMemberIds.map(member=>member.uuid) || []);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamUuid, setTeamUuid] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const addTeam = () => {
    if (teamUuid.trim() && !teams.includes(teamUuid.trim())) {
      setTeams([...teams, teamUuid.trim()]);
      setTeamUuid("");
      setShowTeamInput(false);
    }
  };

  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
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
      teamMemberIds: teams,
    };

    try {
      const response = await axios.put<ProjectResponse>(
        `https://devtracker-0es2.onrender.com/project/update/${project.projectId}`,
        newProject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedProject: ProjectResponse = {
        projectId: response.data.projectId,
        projectName: response.data.projectName || projectName,
        projectDesc: response.data.projectDesc || projectDesc,
        teamLeadId: response.data.teamLeadId || teamLeadId,
        status: response.data.status || "ACTIVE",
        deadline: response.data.deadline || deadline,
        teamMemberIds: response.data.teamMemberIds || teams,
      };

      onProjectUpdated(updatedProject);
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
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
            value={teamLeadId as string}
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
              <span
                key={index}
                className="badge bg-secondary d-flex align-items-center gap-1"
              >
                {team}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => removeTeam(index)}
                />
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
            Update Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodo;
