import axios from "axios";
import { X } from "lucide-react";
import "../App.css";

interface DeleteTodoProps {
  onClose: () => void;
  onTaskDeleted: (task:string) => void;
  task: string; // the ID of the project to delete
}

const DeleteTodo: React.FC<DeleteTodoProps> = ({ onClose, onTaskDeleted, task }) => {
  const handleDelete = async () => {
    try {

      await axios.delete(`http://localhost:8080/${task}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onTaskDeleted(task);
      onClose();
    } catch (error) {
      console.error("❌ Error deleting:", error);
      alert("Failed to delete.");
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
          className="btn-style bg-danger border-0 text-light p-1 px-2 position-absolute top-0 end-0"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h5 className="text-center fw-bold mb-3">Delete Project</h5>
        <p className="text-center mb-4">
          Are you sure you want to delete this project?
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-secondary rounded-pill px-4"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="btn btn-danger rounded-pill px-4"
            onClick={handleDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTodo;
