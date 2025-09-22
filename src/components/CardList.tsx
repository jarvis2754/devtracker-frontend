import { Droppable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";
import { Plus } from "lucide-react";
import type { IssueResponse } from "../types/IssueTypes";
import AddTask from "./AddTask";
import { useState } from "react";

interface CardListProps {
  todoList: IssueResponse[]; // now uses IssueResponse
  type: "TODO" | "IN_PROGRESS" | "AWAIT_APPROVAL" | "COMPLETED";
  id: string;
  onTaskAdded: (newTask: IssueResponse) => void; // now uses IssueResponse
}

const CardList: React.FC<CardListProps> = ({ todoList, type, id, onTaskAdded }) => {
  const [showPopup, setShowPopup] = useState(false);

  const borderColor = () => {
    if (type === "TODO") return "border-primary";
    if (type === "IN_PROGRESS") return "border-warning";
    if (type === "AWAIT_APPROVAL") return "border-info";
    return "border-success";
  };

  const headerTitle = () => {
    if (type === "TODO") return "To Do";
    if (type === "IN_PROGRESS") return "In Progress";
    if (type === "AWAIT_APPROVAL") return "Review";
    return "Done";
  };

  const listColor = () => {
    if (type === "TODO") return "bg-primary";
    if (type === "IN_PROGRESS") return "bg-warning";
    if (type === "AWAIT_APPROVAL") return "bg-info";
    return "bg-success";
  };

  return (
    <div>
      <div className="bg-light rounded p-3 shadow">
        <header
          className={`d-flex align-items-center gap-2 pb-2 mb-3 ${borderColor()}`}
          style={{ borderBottom: "3px solid" }}
        >
          <span className={`rounded-circle ${listColor()}`} style={{ width: "10px", height: "10px" }}></span>
          <span className="fw-semibold">{headerTitle()}</span>
          <span className="badge bg-secondary">{todoList.length}</span>
          {type === "TODO" && (
            <button className="ms-auto border-0 rounded" onClick={() => setShowPopup(true)}>
              <Plus size={16} />
            </button>
          )}
        </header>

        <Droppable droppableId={id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="d-flex flex-column gap-1">
              {todoList.map((todo, index) => (
                <CardItem
                  key={todo.id} // now id is required in IssueResponse
                  todo={todo}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {showPopup && (
        <AddTask
          projectId={Number(id)}
          onClose={() => setShowPopup(false)}
          onTaskAdded={onTaskAdded} // expects IssueResponse
        />
      )}
    </div>
  );
};

export default CardList;
