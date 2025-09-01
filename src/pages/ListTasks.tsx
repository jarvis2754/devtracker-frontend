import React, { useEffect, useState } from "react";
import type {Issue} from "../types/IssueTypes"
import { useParams } from "react-router-dom";


// const issues: Issue[] = [
//   {
//     id: 1,
//     title: "field feature",
//     description: "implement this feature",
//     type: "BUG",
//     status: "ACTIVE",
//     priority: "CRITICAL",
//     assignerId: 1,
//     projectId: 1,
//     reporterId: 1,
//     comments: [],
//     createdAt: "2025-08-31T07:54:44.965+00:00",
//   },
//   {
//     id: 2,
//     title: "login error",
//     description: "fix login issue",
//     type: "BUG",
//     status: "ACTIVE",
//     priority: "CRITICAL",
//     assignerId: 2,
//     projectId: 1,
//     reporterId: 2,
//     comments: [],
//     createdAt: "2025-08-31T08:20:00.000+00:00",
//   },
//   {
//     id: 3,
//     title: "UI bug",
//     description: "fix dashboard color mismatch",
//     type: "BUG",
//     status: "ACTIVE",
//     priority: "CRITICAL",
//     assignerId: 3,
//     projectId: 1,
//     reporterId: 3,
//     comments: [],
//     createdAt: "2025-08-31T09:10:00.000+00:00",
//   },
//   {
//     id: 4,
//     title: "API bug",
//     description: "backend API response issue",
//     type: "BUG",
//     status: "ACTIVE",
//     priority: "CRITICAL",
//     assignerId: 4,
//     projectId: 1,
//     reporterId: 4,
//     comments: [],
//     createdAt: "2025-08-31T10:00:00.000+00:00",
//   },
//   {
//     id: 5,
//     title: "database bug",
//     description: "migration issue in MySQL 8",
//     type: "BUG",
//     status: "ACTIVE",
//     priority: "CRITICAL",
//     assignerId: 5,
//     projectId: 1,
//     reporterId: 5,
//     comments: [],
//     createdAt: "2025-08-31T10:30:00.000+00:00",
//   },
//   {
//     id: 6,
//     title: "report bug",
//     description: "PDF export not working",
//     type: "BUG",
//     status: "ACTIVE",
//     priority: "CRITICAL",
//     assignerId: 6,
//     projectId: 1,
//     reporterId: 6,
//     comments: [],
//     createdAt: "2025-08-31T11:15:00.000+00:00",
//   },
// ];

const ListTasks: React.FC = () => {
  const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchTask = async () => {
            try {
                const res = await fetch(`http://localhost:8080/task/all/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch Task");

                const data: Issue = await res.json();
                setTasks(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    if (loading) return <p>Loading project...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!tasks) return <p>No project found.</p>;
  return (
    <div className="p-3 bg-light min-vh-100">
      <ul className="list-unstyled">
        {tasks.map((task) => {
          const date = new Date(task.createdAt);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const formattedDate = `${day}-${month}-${year}`;

          return (
            <li key={task.id} className="task-card px-4 py-3 mb-3">
              <div className="row align-items-center">
                <div className="col-12 col-md-10">
                  <div className="d-flex justify-content-between">
                    <p className="fs-5 fw-semibold text-dark mb-1">
                      <span className="text-danger">[{task.type}]</span> {task.title}
                    </p>
                    <small className="text-muted">
                      By: <i>{task.assignerId}</i>
                    </small>
                  </div>

                  <div className="d-flex flex-wrap align-items-center text-secondary">
                    <span className="me-3 fw-bold text-primary">#{task.id}</span>

                    <span className="me-3">
                      <span className="badge rounded-pill px-3 py-2 fw-bold shadow-sm bg-success text-white">
                        {task.status}
                      </span>
                    </span>

                    <span className="me-3">
                      <i>Opened: {formattedDate}</i>
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-2 d-flex justify-content-md-end mt-2 mt-md-0">
                  <span
                    className="badge rounded-pill px-3 py-2 fw-bold shadow-sm bg-danger text-white"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <style>{`
        .task-card {
          background: #ffffff;
          border: 2px solid rgba(0, 123, 255, 0.3);
          border-radius: 14px;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .task-card:hover {
          transform: scale(1.02);
          box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
          border-color: rgba(0, 123, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default ListTasks;
