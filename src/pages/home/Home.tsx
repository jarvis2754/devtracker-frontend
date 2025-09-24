import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Todo from "../../components/Todo";
import type { ProjectResponse, TeamMember } from "../../types/ProjectTypes";
import { Link } from "react-router-dom";

const fetchProjects = async (): Promise<ProjectResponse[]> => {
  const res = await fetch("https://devtracker-0es2.onrender.com/project/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
};

const Home: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  // useQuery will cache projects so it loads faster on revisit
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 2, // 2 minutes - avoids refetching immediately
  });

  const handleProjectAdded = (newProject: ProjectResponse) => {
    // optimistically add project to cached list
    projects.push(newProject);
  };

  if (isLoading) {
    return (
      <section
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div className="container row mt-5" style={{ width: "85%" }}>
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="fw-bold">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        Failed to load projects. Please try again.
      </div>
    );
  }

  return (
    <section
      className="container d-flex justify-content-center flex-column"
      style={{ height: "90vh" }}
    >
      <div className="row m-auto custom-width" style={{ height: "55%" }}>
        {/* Create Project Card */}
        <div
          className="col-12 col-md-6 col-lg-4 p-2"
          style={{ height: "250px" }}
        >
          <div
            className="custom-card border-0 shadow rounded-4 h-100 p-3"
            style={{ background: "#f5faff" }}
          >
            <div className="card-body d-flex flex-column">
              <div>
                <h5 className="text-primary fw-bold">Create Project</h5>
                <p className="text-muted">Click add to create your project</p>
              </div>
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => setShowPopup(true)}
                >
                  <Plus size={20} className="me-2" />
                  Add Project
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Cards */}
        {projects.map((proj) => (
          <div
            key={proj.projectId}
            className="col-12 col-md-6 col-lg-4 p-2"
            style={{ height: "250px" }}
          >
            <Link
              to={`/projects/${proj.projectId}`}
              className="text-decoration-none"
            >
              <div
                className="custom-card border-0 shadow rounded-4 h-100 p-3"
                style={{
                  background: "#ffffff",
                  borderLeft: "5px solid #0d6efd",
                }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="text-primary fw-bold mb-2 clamp-title">
                    {proj.projectName}
                  </h5>
                  <p className="text-secondary mb-3 clamp-description">
                    {proj.projectDesc}
                  </p>
                  <p className="my-1">
                    <strong>Team Lead:</strong>{" "}
                    {(proj.teamLeadId as TeamMember) !== null
                      ? (proj.teamLeadId as TeamMember).uuid
                      : "Unassigned"}
                  </p>
                  <p className="my-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge rounded-pill ${
                        proj.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </p>
                  <p className="my-1">
                    <strong>Deadline:</strong>{" "}
                    {proj.deadline ? proj.deadline.substring(0, 10) : "None"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}

        <div
          className="col-12 col-md-6 col-lg-4 p-2"
          style={{ height: "100px" }}
        >
          <div className="custom-card rounded-4 h-100 p-3"></div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Todo
          onClose={() => setShowPopup(false)}
          onProjectAdded={handleProjectAdded}
        />
      )}
    </section>
  );
};

export default Home;
