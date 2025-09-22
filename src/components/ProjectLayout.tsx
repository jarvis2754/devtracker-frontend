import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import type { ProjectResponse } from "../types/ProjectTypes";
import ProjectDetails from "./ProjectDetails";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const ProjectContext = createContext<ProjectResponse | null>(null);

export default function ProjectLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject(projId: string) {
      try {
        const res = await axios.get<ProjectResponse>(
          `https://devtracker-0es2.onrender.com/project/search/${projId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProject(res.data);

        // ✅ Save recent project
        if (res.data.projectId !== undefined) {
          localStorage.setItem("recentProjectId", res.data.projectId.toString());
        }
      } catch (error) {
        console.error("Error fetching project", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    async function ensureProjectId() {
      if (id) {
        await fetchProject(id);
        return;
      }

      try {
        // 1️⃣ Check recent project first
        const recentId = localStorage.getItem("recentProjectId");
        if (recentId) {
          navigate(`/projects/${recentId}`, { replace: true });
          return;
        }

        // 2️⃣ Otherwise, fetch all projects
        const response = await axios.get<ProjectResponse[]>(
          "https://devtracker-0es2.onrender.com/project/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const projects = response.data;
        if (projects.length === 0) {
          navigate("/"); // no projects → home
        } else {
          // Pick the min project
          const minProject = projects.reduce((a, b) =>
            a.projectId < b.projectId ? a : b
          );
          navigate(`/projects/${minProject.projectId}`, { replace: true });
        }
      } catch (error) {
        console.error("Error fetching projects", error);
        navigate("/"); // fallback
      }
    }

    ensureProjectId();
  }, [id, navigate]);

  if (loading) {
    return (
      <section
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div
          className="container row mt-5"
          style={{ width: "85%"}}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="fw-bold">Loading project...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!project) return <p>No project found.</p>;

  return (
    <ProjectContext.Provider value={project}>
      <section
        className="container d-flex justify-content-center flex-column "
        style={{ height: "100vh" }}
      >
        <div
          className="container m-auto"
          style={{ width: "90%", height: "70%" }}
        >
          <h1>#{(project.projectId)}  {(project.projectName.substring(0,1).toUpperCase())+project.projectName.substring(1)}</h1>
          <ProjectDetails />
          <Outlet />
          <div
            className="col-12"
            style={{ width: "100%", height: "100px" }}
          ></div>
        </div>
      </section>
    </ProjectContext.Provider>
  );
}
