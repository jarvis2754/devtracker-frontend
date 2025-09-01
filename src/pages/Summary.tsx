import { useEffect, useState } from "react";
import type { Project } from "../types/ProjectTypes";
import { useParams } from "react-router-dom";

const Summary: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                const res = await fetch(`http://localhost:8080/project/search/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch project");

                const data: Project = await res.json();
                setProject(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) return <p>Loading project...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!project) return <p>No project found.</p>;
    return (
        <div className="m-3 ">
            <div className="row rounded shadow border-0 p-3">
                <div className="col-12 col-md-2  p-2"><span className="fs-1">#{project.projectId} </span> </div>
                <div className="col-12 col-md-7  p-2"><span className="fs-1"><b>{project.projectName}</b></span> </div>
                <div className="col-12 col-md-3  d-flex align-items-center">Priority: <span className="rounded-pill bg-danger text-light px-3 py-1">High</span></div>
                <div className="col-12 col-md-6 mt-3"><i>Created By: {project.createdBy}</i></div>
                <div className="col-12 col-md-6 mt-3"><i>Created at:{project.createdAt}</i></div>
                <div className="col-12 p-4 mt-3"><p className="fs-6" style={{ textIndent: "3rem" }}>{project.projectDesc}</p></div>
                <div className="col-12"><h5>Team Leader: <b>{project.teamLead}</b></h5></div>
                <div className="col-12 mt-3">
                    <h6>Team Members</h6>
                    {/* <ol className="mx-2">
                        {project.teamMembers.map((proj) => (
                            <li>{proj.id}</li>
                        ))}
                    </ol> */}
                </div>

                <div className="col-12 col-lg-6"><p className="fs-5"><i>Deadline: {project.deadLine}</i></p></div>
                <div className="col-12 col-lg-6"><p className="fs-5"><i>Project Status: <span className="text-success"><b>{project.status}</b></span></i></p></div>
            </div>
        </div>
    );
}
export default Summary;