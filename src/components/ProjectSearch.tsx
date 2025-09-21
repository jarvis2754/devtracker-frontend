import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { ProjectResponse } from "../types/ProjectTypes";
import { Link } from "react-router-dom";

interface ProjectSearchProps {
  onSelect?: (projectName: string) => void; // optional callback when a project is selected
}

export default function ProjectSearch({ onSelect }: ProjectSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const cancelTokenRef = useRef<any>(null);

  const highlightQuery = (name:string) =>{
    const parts = name.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? 
          <span key={index} className="bg-secondary text-light">{part}</span> : 
          part
        )}
      </>
    );
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFilteredProjects([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch projects from backend as user types
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProjects([]);
      return;
    }

    const rawToken = localStorage.getItem("token");
    const token = rawToken?.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

    if (!token) {

      return;
    }

    // Cancel previous request if still pending
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }
    cancelTokenRef.current = axios.CancelToken.source();

    axios
      .get<ProjectResponse[]>("http://localhost:8080/project/search", {
        params: { keyword: searchQuery },
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelTokenRef.current.token,
      })
      .then((res) => {
        setFilteredProjects(res.data);

      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
 
          console.error(err);
        }
      });

    return () => {
      if (cancelTokenRef.current) cancelTokenRef.current.cancel();
    };
  }, [searchQuery]);

  return (
    <div className="position-relative w-100" ref={searchRef}>
      <input
        type="text"
        placeholder="Search projects..."
        className="d-none d-md-block rounded border border-dark py-2 px-3 w-100"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Dropdown */}
      {filteredProjects.length > 0 && (
        <ul
          className="list-group position-absolute"
          style={{
            top: "100%",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {filteredProjects.map((project) => (
            <Link
              to={`/projects/${project.projectId}`}
              className="text-decoration-none"
              onClick={() => setSearchQuery("")}
            >
            <li
              key={project.projectId}
              className="list-group-item text-dark list-group-item-action border-0 p-2"
              onClick={() => {
                setSearchQuery(project.projectName);
                setFilteredProjects([]);
                if (onSelect) onSelect(project.projectName);
              }}
              style={{ cursor: "pointer" }}
            > 
              {highlightQuery(project.projectName)}
            </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
