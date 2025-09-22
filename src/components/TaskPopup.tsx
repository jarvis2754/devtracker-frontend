import React, { useEffect, useState } from "react";
import axios from "axios";
import type { IssueResponse } from "../types/IssueTypes";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import { EllipsisVertical } from "lucide-react";
import DeleteTodo from "./DeleteTodo";
import UpdateTaskTodo from "./UpdateTaskTodo";
import UpdateCommentTodo from "./UpdateCommentTodo";
import type { CommentResponse } from "../types/CommentTypes";

interface TaskProps {
  onClose: () => void;
  taskId: number;
}

const TaskPopup: React.FC<TaskProps> = ({ onClose, taskId }) => {
  const [task, setTask] = useState<IssueResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // For new comment
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showCommentDeletePopup, setShowCommentDeletePopup] = useState(false);
  const [showCommentUpdatePopup, setShowCommentUpdatePopup] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentResponse | null>(null);
  const [commentId, setCommentId] = useState<number>()
  const [refresh, setRefresh] = useState(false);

  const handleTaskDeleted = () => {
    setShowDeletePopup(false);
    window.location.reload();
  };

  const handleTaskUpdated = () => {
    setShowUpdatePopup(false);
    window.location.reload();
  };

  const handleCommentDeleted = () => {
    setShowCommentDeletePopup(false)
    setRefresh(!refresh);
  };
  
  const handleCommentUpdated = () => {
    setShowCommentUpdatePopup(false);
    setRefresh(!refresh)
  };

  useEffect(() => {
    fetchTask();
  }, [taskId, refresh]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `https://devtracker-0es2.onrender.com/task/get/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTask(response.data);
    } catch (err) {
      console.error("❌ Error fetching task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(
        "https://devtracker-0es2.onrender.com/comments/add",
        {
          issueId: taskId,
          content: newComment,

        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewComment("");
      fetchTask(); // refresh comments after adding
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white text-dark">
            <div className="modal-body text-center">
              <p className="text-danger mb-4">Task not found</p>
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-white shadow-lg rounded-4 border-0">
          {/* Header */}
          <div
            className="modal-header border-0 text-white rounded-top-4"
            style={{
              background: "linear-gradient(135deg, #4e73df, #1cc88a)",
            }}
          >
            <div>
              <h1 className="modal-title fs-4 fw-bold">
                <span className="text-light opacity-75 me-2">#{task.id}</span>
                {task.title}
              </h1>
            </div>
            <button
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body pt-4 px-4">
            {/* --- Existing design intact --- */}

            {/* Status & Priority */}
            <div className="d-flex flex-wrap justify-content-between mb-4">
              <div className="d-flex gap-2">
                <span className="badge bg-warning px-3 py-2 rounded-pill shadow-sm">
                  {task.type}
                </span>
                <span
                  className={`badge px-3 py-2 rounded-pill shadow-sm ${task.status === "TODO"
                    ? "bg-secondary"
                    : task.status === "IN_PROGRESS"
                      ? "bg-info text-dark"
                      : task.status === "COMPLETED"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                >
                  {task.status}
                </span>
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">
                  {task.priority}
                </span>
              </div>
              <div>
                <Dropdown>
                  <Dropdown.Toggle
                    as="button"
                    id="menu-dropdown"
                    bsPrefix="p-0 border-0 bg-transparent"
                    className="p-0 border-0 bg-transparent text-transparent"
                  >
                    <EllipsisVertical className="text-dark me-3" size={24} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowUpdatePopup(true)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowDeletePopup(true)}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* Task Metadata */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="p-3 rounded bg-light shadow-sm h-100">
                  <h6 className="text-muted small mb-1">Created At</h6>
                  <p className="fw-semibold text-dark mb-0">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded bg-light shadow-sm h-100">
                  <h6 className="text-muted small mb-1">Project ID</h6>
                  <p className="fw-semibold text-dark mb-0">{task.projectId}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded bg-light shadow-sm h-100">
                  <h6 className="text-muted small mb-1">Reporter</h6>
                  <p className="fw-semibold text-dark mb-0">
                    {task.reporterId?.userName || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded bg-light shadow-sm h-100">
                  <h6 className="text-muted small mb-1">Assignee</h6>
                  <p className="fw-semibold text-dark mb-0">
                    {task.assignerId?.userName || "Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="text-muted text-uppercase small">Description</h6>
              <div className="p-3 bg-light rounded shadow-sm">
                <p className="text-dark lh-lg mb-0">
                  {task.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="border-top pt-4">
              <h5 className="fw-bold text-dark mb-3">Comments</h5>
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment, idx) => (
                  <div key={idx} className="d-flex align-items-start mb-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 shadow-sm"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "14px",
                      }}
                    >
                      {comment.authorId.userName
                        ? comment.authorId.userName.charAt(0).toUpperCase()
                        : "A"}
                    </div>

                    <div className="card border-0 shadow-sm flex-grow-1">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title mb-0 text-primary fw-bold">
                            {comment.authorId.userName || "Anonymous"}
                          </h6>
                          <small className="text-muted">
                            {new Date(comment.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <p className="card-text text-dark mb-0">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center ms-2 h-100">
                      <Dropdown>
                        <Dropdown.Toggle
                          as="button"
                          id="menu-dropdown"
                          bsPrefix="p-0 border-0 bg-transparent"
                          className="p-0 border-0 bg-transparent text-transparent"
                        >
                          <EllipsisVertical className="text-dark me-3" size={24} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => { setShowCommentUpdatePopup(true); setSelectedComment(comment) }}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => { setShowCommentDeletePopup(true); setCommentId(comment.id) }}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted fst-italic">No comments yet.</p>
              )}

              <div className="mt-4">
                <h6 className="text-muted">Add a Comment</h6>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setNewComment("")}
                    disabled={submitting}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddComment}
                    disabled={submitting}
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeletePopup && (
        <DeleteTodo
          task={`task/delete/${task.id}`}
          onClose={() => setShowDeletePopup(false)}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
      {showUpdatePopup && (
        <UpdateTaskTodo
          task={task}
          onClose={() => setShowUpdatePopup(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
      {showCommentDeletePopup && (
        <DeleteTodo
          task={`comments/delete/${commentId}`}
          onClose={() => setShowCommentDeletePopup(false)}
          onTaskDeleted={handleCommentDeleted}
        />
      )}
      {showCommentUpdatePopup && selectedComment && (
        <UpdateCommentTodo
          comment={selectedComment}
          onClose={() => setShowCommentUpdatePopup(false)}
          onCommentUpdated={handleCommentUpdated}
        />
      )}
    </div>
  );
};

export default TaskPopup;
