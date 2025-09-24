import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, createContext } from "react";
import type { ProjectResponse } from "../types/ProjectTypes";
import ProjectDetails from "./ProjectDetails";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line react-refresh/only-export-components
export const ProjectContext = createContext<ProjectResponse | null>(null);

// ✅ API call functions
async function fetchProjects(): Promise<ProjectResponse[]> {
  const res = await axios.get<ProjectResponse[]>(
    "https://devtracker-0es2.onrender.com/project/all",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

async function fetchProject(projId: string): Promise<ProjectResponse> {
  const res = await axios.get<ProjectResponse>(
    `https://devtracker-0es2.onrender.com/project/search/${projId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
}

export default function ProjectLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1️⃣ Fetch all projects (cached for 5 mins)
  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery<ProjectResponse[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  });

  // 2️⃣ Fetch single project (only if id exists)
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery<ProjectResponse>({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id, // don’t run if no id yet
    staleTime: 5 * 60 * 1000,
  });

  // 3️⃣ Ensure projectId logic (recent project / fallback to min project)
  useEffect(() => {
    if (!id && projects.length > 0) {
      const recentId = localStorage.getItem("recentProjectId");
      if (recentId) {
        navigate(`/projects/${recentId}`, { replace: true });
      } else {
        const minProject = projects.reduce((a, b) =>
          a.projectId < b.projectId ? a : b
        );
        navigate(`/projects/${minProject.projectId}`, { replace: true });
      }
    }
  }, [id, projects, navigate]);

  // ✅ Save projectId to localStorage when project loads
  useEffect(() => {
    if (project?.projectId !== undefined) {
      localStorage.setItem("recentProjectId", project.projectId.toString());
      // Pre-cache this project in queryClient for faster access later
      queryClient.setQueryData(["project", project.projectId.toString()], project);
    }
  }, [project, queryClient]);

  if (projectsLoading || projectLoading) {
    return (
      <section
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div
          className="container row mt-5 custom-width"
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
  if (projectsError || projectError) {
    return <p className="text-danger">Error loading projects.</p>;
  }

  if (!project) return <p>No project found.</p>;


  return (
    <ProjectContext.Provider value={project}>
      <section
        className="container d-flex justify-content-center flex-column "
        style={{ height: "100vh" }}
      >
        <div
          className="custom-width m-auto"
          style={{  height: "70%" }}
        >
          <h1 className="ps-3 ps-md-2">#{(project.projectId)}  {(project.projectName.substring(0,1).toUpperCase())+project.projectName.substring(1)}</h1>
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
