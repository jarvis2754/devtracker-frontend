import { useContext, useState } from "react";
import type { TeamMember } from "../../types/ProjectTypes";
import Dropdown from "react-bootstrap/Dropdown";
import { EllipsisVertical } from "lucide-react";
import DeleteTodo from "../../components/DeleteTodo";
import UpdateTodo from "../../components/UpdateTodo";
import { ProjectContext } from "../../components/ProjectLayout";

const Summary: React.FC = () => {
  const project = useContext(ProjectContext);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const handleProjectDeleted = () => {
    setShowDeletePopup(false);
    window.location.reload();
  };
  const handleProjectUpdated = () => {
    setShowUpdatePopup(false);
    window.location.reload();
  };

  if (!project)
    return (
      <p className="text-center text-muted mt-4">No project data available.</p>
    );

  return (
    <div className="container my-4">
      {/* Project Summary Card */}
      <div
        className="card shadow-sm border-0 rounded"
        style={{ background: "#ffffff" }}
      >
        <div className="card-header bg-primary d-flex justify-content-between text-white rounded py-3">
          <h3 className="mb-0 fw-bold">
            #{project.projectId} : {project.projectName}
          </h3>

          {/* ✅ Dropdown menu */}
          <Dropdown>
            <Dropdown.Toggle
              as="button"
              id="menu-dropdown"
              bsPrefix="p-0 border-0 bg-transparent"
              className="p-0 border-0 bg-transparent text-transparent"
            >
              <EllipsisVertical className="text-white me-3" size={24} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowUpdatePopup(true)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowDeletePopup(true)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="card-body mx-2">
          {/* Meta Info */}
          <div className="row mb-3 text-muted small">
            <div className="col-md-6 fs-6">
              <i className="bi bi-person-fill me-2"></i> Created By:{" "}
              <b>{(project.createdById as TeamMember).uuid} ({(project.createdById as TeamMember).userName})</b>
            </div>
            <div className="col-md-6 text-md-end fs-6">
              <i className="bi bi-calendar-event me-2"></i> Created At:{" "}
              {project.createdAt?.substring(0, 10)}
            </div>
          </div>

          {/* Description */}
          <p className="fs-6 lh-lg " style={{ textIndent: "2rem" }}>
            {project.projectDesc}
          </p>

          {/* Leader, Deadline, Status */}
          <div className="row mt-4">
            <div className="col-lg-4 mb-3">
              <h6 className="text-primary mb-1">
                <i className="bi bi-person-badge-fill"></i> Team Leader
              </h6>
              <p className="fw-semibold ms-1">
                {project.teamLeadId && (project.teamLeadId as TeamMember).uuid
                  ? `${(project.teamLeadId as TeamMember).uuid} (${(project.teamLeadId as TeamMember).userName})`
                  : <span className="text-muted">Not assigned</span>}
              </p>
            </div>
            <div className="col-lg-4 mb-3">
              <h6 className="text-primary mb-1">
                <i className="bi bi-clock-history"></i> Deadline
              </h6>
              <p className="fw-semibold">
                {project.deadline ? project.deadline.substring(0, 10) : "None"}
              </p>
            </div>
            <div className="col-lg-4 mb-3">
              <h6 className="text-primary mb-1">
                <i className="bi bi-check-circle-fill me-2"></i> Status
              </h6>
              <span
                className={`badge rounded-pill px-3 py-2 fs-6 ${
                  project.status === "ACTIVE"
                    ? "bg-success"
                    : project.status === "ON_HOLD"
                    ? "bg-warning"
                    : "bg-secondary"
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="card shadow-sm border-0 rounded-4 mt-4">
        <div className="card-header bg-light border-0 rounded-top-4 py-3">
          <h5 className="mb-0 text-primary fw-bold">
            <i className="bi bi-people-fill me-2"></i> Team Members
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-primary">
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Email</th>
                  <th scope="col">User ID</th>
                  <th scope="col">Member Name</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                {project.teamMemberIds?.length ? (
                  project.teamMemberIds.map(
                    (member: unknown, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{(member as TeamMember).email}</td>
                        <td>{(member as TeamMember).uuid}</td>
                        <td>{(member as TeamMember).userName}</td>
                        <td>{(member as TeamMember).position}</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-3">
                      No team members assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*  Delete popup */}
      {showDeletePopup && (
        <DeleteTodo
          task={`project/delete/${project.projectId}`}
          onClose={() => setShowDeletePopup(false)}
          onTaskDeleted={handleProjectDeleted}
        />
      )}
      {showUpdatePopup && (
        <UpdateTodo
          project={project}
          onClose={() => setShowUpdatePopup(false)}
          onProjectUpdated={handleProjectUpdated}
        />
      )}
    </div>
  );
};

export default Summary;
