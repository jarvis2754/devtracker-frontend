import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Todo from "../components/Todo";
import type { ProjectResponse, TeamMember } from "../types/ProjectTypes";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [project, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProjectAdded = (newProject: ProjectResponse) => {
    setProjects([...project, newProject]); // add the new project to the state
  };

  useEffect(() => {
    fetch("http://localhost:8080/project/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // if secured with JWT token
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        return res.json();
      })
      .then((data: ProjectResponse[]) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading projects...</p>;
  return (
    <section
      className="container d-flex justify-content-center flex-column "
      style={{ height: "90vh" }}
    >
      <div
        className="container row m-auto"
        style={{ width: "85%", height: "55%" }}
      >
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

        {project.map((proj) => (
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
                    <strong>Team Lead:</strong> {(proj.teamLeadId as TeamMember).uuid}
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
      </div>
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
