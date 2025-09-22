import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "../App.css";
import type { IssueRequest, IssueResponse } from "../types/IssueTypes";

interface AddTaskProps {
  onClose: () => void;
  onTaskAdded: (newTask: IssueResponse) => void;
  projectId: number; // ✅ passed from parent
}

const AddTask: React.FC<AddTaskProps> = ({ onClose, onTaskAdded, projectId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TASK");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignee,setAssignee]=useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert("Please fill Title.");
      return;
    }

    const newTask:IssueRequest ={
          title,
          description,
          type,
          status,
          priority,
          projectId,
          assignerId: assignee, // ✅ comes from state now
        }

    try {
      const response = await axios.post(
        "https://devtracker-0es2.onrender.com/task/add",newTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;

        // ✅ Use backend ID instead of random temp ID
        const addedTask: IssueResponse={
          
          id: data.id,
          title: data.title || title,
          description: data.description || description,
          type: data.type || type,
          status: data.status || status,
          priority: data.priority || priority,
          projectId,
          assignerId: data.assignerId,
          reporterId: data.reporterId,
          createdAt: data.createdAt || new Date().toISOString(),
          comments: data.comments || [],
        
        }
        onTaskAdded(addedTask);

        onClose();
      }
    } catch (err: any) {
      console.error("❌ Error adding task:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to add task. Please try again.");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div
        className="card p-4 shadow-sm position-relative"
        style={{ width: "500px", margin: "0 auto" }}
      >
        {/* Close button */}
        <button
          className="btn-style bg-danger border-0 text-light p-0.8 px-1 position-absolute top-0 end-0"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h4 className="text-center mb-3">Add New Task</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex align-items-center">
            <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
              Title
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
              Description
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3 d-flex align-items-center">
            <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
              Assignee
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
              Type
            </label>
            <select
              className="form-control rounded-pill"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="BUG">Bug</option>
              <option value="FEATURE">Feature</option>
              <option value="TASK">Task</option>
              <option value="IMPROVEMENT">Improvement</option>
            </select>
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
              Status
            </label>
            <select
              className="form-control rounded-pill"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="AWAIT_APPROVAL">Await Approval</option>
            </select>
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label className="form-label fw-bold me-3" style={{ width: "120px" }}>
              Priority
            </label>
            <select
              className="form-control rounded-pill"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* ✅ Project ID field removed, since it's passed via props */}

          <div className="text-center">
            <button type="submit" className="btn btn-success rounded-pill px-4 me-2">
              Add Task
            </button>
            <button
              type="button"
              className="btn btn-secondary rounded-pill px-4"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
