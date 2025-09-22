import React, { useEffect, useState } from "react";
import type { IssueResponse } from "../../types/IssueTypes";
import { useParams } from "react-router-dom";

import { Plus } from "lucide-react";
import AddTask from "../../components/AddTask";
import TaskPopup from "../../components/TaskPopup";
import NoContent from "../../components/NoContent";

const ListTasks: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showPopup, setShowPopup] = useState(false);
  const [showTaskPopup, setShowTaskPopup]= useState(false);
  const [tasks, setTasks] = useState<IssueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const[taskId,setTaskId] =useState(0);


  const handleTaskAdded = (newIssue: IssueResponse) => {
    setTasks([...tasks, newIssue]);
  };

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`https://devtracker-0es2.onrender.com/task/all/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch Task");

        const data: IssueResponse[] = await res.json();
        setTasks(data);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          setError("Something went wrong");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id,showPopup,showTaskPopup]);

  const priorityColor = (priority: string) => {
    if (priority === "LOW") {
      return "bg-primary"

    } else if (priority === "MEDIUM") {
      return "bg-info"

    } else if (priority === "HIGH") {
      return "bg-warning"
    } else {
      return "bg-danger"
    }
  }
  const listColor = (status:string) => {
    if (status === "TODO") return "bg-primary";
    else if ((status === "IN_PROGRESS")) return "bg-warning";
    else if (status === "AWAIT_APPROVAL") return "bg-info";
    else return "bg-success";
  }

  const popupParams =(showPopup:boolean,taskid:number)=>{
    setShowTaskPopup(showPopup);
    setTaskId(taskid);
  }

  return (
    <div className="p-3 card bg-light min-vh-50 ">
      <div className="d-flex mx-2 justify-content-between">
        <div>
          <h2 className="text-secondary">Tasks</h2>
        </div>
        <div className="d-flex">
          <button
            className="btn btn-primary d-flex align-items-center rounded-pill"
            onClick={() => setShowPopup(true)}
          >
            <Plus size={16} className="me-md-2" />
            <span className="d-none d-md-block">Add Task</span>
          </button>
        </div>
      </div>
      <div className="inner-content mt-3">
        {loading ? (
          <p>Loading project...</p>
        ) : error ? (
          <NoContent />
        ) : !tasks ? (
          <NoContent />
        ) : (
          <ul className="list-unstyled">
            {tasks.map((task) => {
              const date = new Date(task.createdAt);
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              const formattedDate = `${day}-${month}-${year}`;

              return (
                <li key={task.id} className="task-card px-4 py-3 mb-3">
                  <button className="w-100 border-0 bg-white" onClick={() => popupParams(true,task.id)}>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-10">
                      <div className="d-flex justify-content-between">
                        <p className="fw-semibold text-dark mb-1" style={{fontSize:"1.2rem"}}>
                          <span className="text-danger">[{task.type}]</span>{" "}
                          {task.title}
                        </p>
                        <small className="text-muted">
                          By: <i>{task.reporterId?task.reporterId.uuid:"None"}</i>
                        </small>
                      </div>

                      <div className="d-flex flex-wrap align-items-center text-secondary">
                        <span className="me-3 fw-bold fs-4 text-primary">
                          #{task.id}
                        </span>

                        <span className="me-3">
                          <span className={`badge rounded-pill px-3 py-2 fw-bold shadow-sm text-white ${listColor(task.status)}`}>
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
                        className={`badge rounded-pill px-3 py-2 fw-bold shadow-sm text-white ${priorityColor(task.priority)}`}
                        style={{ fontSize: "0.85rem" }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  </button>
                </li>
                
              );
            })}
          </ul>
        )}
      </div>
      {showPopup && (
        <AddTask
          onClose={() => setShowPopup(false)}
          onTaskAdded={handleTaskAdded}
          projectId={Number(id)}
        />
      )}
      {showTaskPopup &&(
        <TaskPopup onClose={()=>setShowTaskPopup(false)} 
        taskId={taskId}/>
      )}

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
