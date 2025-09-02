import { useContext } from "react";
import { ProjectContext } from "./ProjectLayout";

const Summary: React.FC = () => {
  const project = useContext(ProjectContext);

  if (!project) return <p>No project data available.</p>;

  return (
    <div className="m-3">
      <div className="row rounded shadow border-0 p-3">
        <div className="col-12 col-md-2 p-2">
          <span className="fs-1">#{project.projectId}</span>
        </div>
        <div className="col-12 col-md-7 p-2">
          <span className="fs-1">
            <b>{project.projectName}</b>
          </span>
        </div>
        <div className="col-12 col-md-3 d-flex align-items-center">
          Priority:
          <span className="rounded-pill bg-danger text-light px-3 py-1">
            High
          </span>
        </div>
        <div className="col-12 col-md-6 mt-3">
          <i>Created By: {project.createdBy}</i>
        </div>
        <div className="col-12 col-md-6 mt-3">
          <i>Created at: {project.createdAt}</i>
        </div>
        <div className="col-12 p-4 mt-3">
          <p className="fs-6" style={{ textIndent: "3rem" }}>
            {project.projectDesc}
          </p>
        </div>
        <div className="col-12">
          <h5>
            Team Leader: <b>{project.teamLead}</b>
          </h5>
        </div>
        <div className="col-12 mt-3">
          <h6>Team Members</h6>
        </div>
        <div className="col-12 col-lg-6">
          <p className="fs-5">
            <i>Deadline: {project.deadLine}</i>
          </p>
        </div>
        <div className="col-12 col-lg-6">
          <p className="fs-5">
            <i>
              Project Status:{" "}
              <span className="text-success">
                <b>{project.status}</b>
              </span>
            </i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
