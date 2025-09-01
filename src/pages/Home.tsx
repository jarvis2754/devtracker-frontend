import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Todo from "../components/Todo";
import type { Project } from "../types/ProjectTypes";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [project, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProjectAdded = (newProject: Project) => {
    setProjects([...project, newProject]); // add the new project to the state
  };


  useEffect(() => {
    fetch("http://localhost:8080/project/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // if secured with JWT token
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        return res.json();
      })
      .then((data: Project[]) => {
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
        <div className="col-12 col-md-6 col-lg-4 p-2">
          <div className="bg-light card shadow border-dark p-3 w-100 h-100">
            <h4>Create</h4>
            <p>Click add to create your project</p>

            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-primary  rounded-pill"
                onClick={() => setShowPopup(true)}
              >
                <Plus size={20} className="me-2" /> Add Project
              </button>
            </div>
          </div>
        </div>
        {project.map((proj) => (

          <div key={proj.projectId} className="col-12 col-md-6 col-lg-4 p-2">
            <Link to={`/projects/${proj.projectId}`} className="text-primary text-decoration-none">
              <div className="bg-light card shadow border-0 p-3 w-100 h-100">
                <h5 className="clamp-title">{proj.projectName}</h5>
                <p className="clamp-description">{proj.projectDesc}</p>
                <p>
                  <strong>Team Lead:</strong> {proj.teamLead}
                </p>
                <p>
                  <strong>Status:</strong> {proj.status}
                </p>
                <p>
                  <strong>Deadline:</strong> {proj.deadLine}
                </p>
              </div>
            </Link>
          </div>



        ))}


      </div>
      {showPopup && <Todo onClose={() => setShowPopup(false)} onProjectAdded={handleProjectAdded} />}
    </section>
  );
};
export default Home;
