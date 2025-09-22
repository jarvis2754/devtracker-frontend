import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "../App.css";
import type { CommentResponse, CommentRequest } from "../types/CommentTypes";

interface CommentProps {
  onClose: () => void;
  onCommentUpdated: (comment: CommentResponse) => void;
  comment: CommentResponse;
}

const UpdateCommentTodo: React.FC<CommentProps> = ({
  onClose,
  onCommentUpdated,
  comment,
}) => {
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    const updatedComment: CommentRequest = {
      id: comment.id,
      content,
    };

    try {
      setLoading(true);

      const response = await axios.put(
        `https://devtracker-0es2.onrender.com/comments/update/${comment.id}`,
        updatedComment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const updated: CommentResponse = response.data;
        onCommentUpdated(updated);
        onClose();
      }
    } catch (err: any) {
      console.error("❌ Error updating comment:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to update comment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div
        className="card p-4 shadow-sm position-relative"
        style={{ width: "400px", margin: "0 auto" }}
      >
        {/* Close button */}
        <button
          className="btn-style bg-danger border-0 text-light p-0.8 px-1 position-absolute top-0 end-0"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h5 className="text-center mb-3">Update Comment</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control rounded"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-success rounded-pill px-4 me-2"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
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

export default UpdateCommentTodo;
