import React, { useState } from "react";
import axios from "axios";
import type { Issue } from "../types/IssueTypes";

interface AddTaskProps {
  onClose: () => void;
  onTaskAdded: (newTask: Issue) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onClose, onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TASK");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [projectId, setProjectId] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/task/add",
        {
          title,
          description,
          type,
          status,
          priority,
          projectId: Number(projectId),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        // ✅ response.data is just a string, not JSON
        console.log("✅ Task added:", response.data);

        // Instead of passing the string, trigger a refresh
        onTaskAdded({
          id: Date.now(), // temporary id
          title,
          description,
          type,
          status,
          priority,
          projectId: Number(projectId),
          assignerId: 0,
          reporterId: 0,
          createdAt: new Date().toISOString(),
          comments: [],
        });
      }
    } catch (err) {
      console.error("❌ Error adding task:", err);
      alert("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h4>Add New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Type</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="BUG">Bug</option>
            <option value="FEATURE">Feature</option>
            <option value="TASK">Task</option>
            <option value="IMPROVEMENT">Improvement</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="AWAIT_APPROVAL">Await Approval</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Priority</label>
          <select
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Project ID</label>
          <input
            type="number"
            className="form-control"
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value ? Number(e.target.value) : "")
            }
            required
          />
        </div>

        <button type="submit" className="btn btn-success me-2">
          Add Task
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddTask;
