import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "../App.css";
import type { IssueResponse, IssueRequest } from "../types/IssueTypes";

interface TodoProps {
    onClose: () => void;
    onTaskUpdated: (task: IssueResponse) => void;
    task: IssueResponse;
}

const UpdateTaskTodo: React.FC<TodoProps> = ({
    onClose,
    onTaskUpdated,
    task,
}) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [type, setType] = useState(task.type);
    const [status, setStatus] = useState(task.status);
    const [priority, setPriority] = useState(task.priority);
    const [assignee, setAssignee] = useState(task.assignerId?.uuid || "");
    const [loading, setLoading] = useState(false);

    const projectId = task.projectId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            alert("Please fill Title.");
            return;
        }

        const newTask: IssueRequest = {
            title,
            description,
            type,
            status,
            priority,
            projectId,
            assignerId: assignee || "", // ✅ always send uuid string or null
        };

        try {
            setLoading(true);

            const response = await axios.put(
                `http://localhost:8080/task/update/${task.id}`,
                newTask,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                // ✅ Take backend response directly
                const updatedTask: IssueResponse = response.data;
                onTaskUpdated(updatedTask);
                onClose();
            }
        } catch (err: any) {
            console.error("❌ Error updating task:", err);
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to update task. Please try again.");
            }
        } finally {
            setLoading(false);
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
                <h4 className="text-center mb-3">Update Task</h4>

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

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-success rounded-pill px-4 me-2"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Task"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary rounded-pill px-4"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTaskTodo;
