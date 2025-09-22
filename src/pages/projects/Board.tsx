import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import CardList from "../../components/CardList";
import type { IssueResponse } from "../../types/IssueTypes";
import { useParams } from "react-router-dom";
import NoContent from "../../components/NoContent";


const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<IssueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notStartedTodos, setNotStartedTodos] = useState<IssueResponse[]>([]);
  const [startedTodos, setStartedTodos] = useState<IssueResponse[]>([]);
  const [awaitTodos, setAwaitTodos] = useState<IssueResponse[]>([]);
  const [completedTodos, setCompletedTodos] = useState<IssueResponse[]>([]);

  const handleTaskAdded = (newIssue: IssueResponse) => {
    if (!newIssue.id) {
      newIssue.id = Date.now(); // temporary ID until backend gives real one
    }
    setTasks(prev => [...prev, newIssue]);
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
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  useEffect(() => {
    if (tasks.length > 0) {
      setNotStartedTodos(tasks.filter((todo) => todo.status === "TODO"));
      setStartedTodos(tasks.filter((todo) => todo.status === "IN_PROGRESS"));
      setAwaitTodos(tasks.filter((todo) => todo.status === "AWAIT_APPROVAL"));
      setCompletedTodos(tasks.filter((todo) => todo.status === "COMPLETED"));
    }
  }, [tasks]);

  const findTodoById = (id: string, array: IssueResponse[]): IssueResponse | undefined =>
    array.find((todo) => todo.id.toString() === id);

  const removeTodoById = (id: string, array: IssueResponse[]): IssueResponse[] =>
    array.filter((todo) => todo.id.toString() !== id);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let updatedNotStarted = [...notStartedTodos];
    let updatedStarted = [...startedTodos];
    let updatedAwait = [...awaitTodos];
    let updatedCompleted = [...completedTodos];

    const todo =
      findTodoById(draggableId, notStartedTodos) ||
      findTodoById(draggableId, startedTodos) ||
      findTodoById(draggableId, awaitTodos) ||
      findTodoById(draggableId, completedTodos);

    if (!todo) return;

    // Remove from source column
    if (source.droppableId === "1") {
      updatedNotStarted = removeTodoById(draggableId, updatedNotStarted);
    } else if (source.droppableId === "2") {
      updatedStarted = removeTodoById(draggableId, updatedStarted);
    } else if (source.droppableId === "3") {
      updatedAwait = removeTodoById(draggableId, updatedAwait);
    } else {
      updatedCompleted = removeTodoById(draggableId, updatedCompleted);
    }

    // Determine new status
    let newStatus: IssueResponse["status"] = "TODO";
    if (destination.droppableId === "1") {
      newStatus = "TODO";
      updatedNotStarted.splice(destination.index, 0, { ...todo, status: newStatus });
    } else if (destination.droppableId === "2") {
      newStatus = "IN_PROGRESS";
      updatedStarted.splice(destination.index, 0, { ...todo, status: newStatus });
    } else if (destination.droppableId === "3") {
      newStatus = "AWAIT_APPROVAL";
      updatedAwait.splice(destination.index, 0, { ...todo, status: newStatus });
    } else {
      newStatus = "COMPLETED";
      updatedCompleted.splice(destination.index, 0, { ...todo, status: newStatus });
    }

    // Optimistic UI update
    setNotStartedTodos(updatedNotStarted);
    setStartedTodos(updatedStarted);
    setCompletedTodos(updatedCompleted);
    setAwaitTodos(updatedAwait);

    try {
      // 🔥 Call backend to persist status change
      await fetch(`https://devtracker-0es2.onrender.com/task/update-status/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus, projectId: id }),
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError("Could not update task status. Please refresh.");
      // Optional: rollback here by re-fetching tasks
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <NoContent/>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row g-3">
        <div className="col-lg-3">
          <CardList todoList={notStartedTodos} type="TODO" id="1" onTaskAdded={handleTaskAdded} />
        </div>
        <div className="col-lg-3">
          <CardList todoList={startedTodos} type="IN_PROGRESS" id="2" onTaskAdded={handleTaskAdded} />
        </div>
        <div className="col-lg-3">
          <CardList todoList={awaitTodos} type="AWAIT_APPROVAL" id="3" onTaskAdded={handleTaskAdded} />
        </div>
        <div className="col-lg-3">
          <CardList todoList={completedTodos} type="COMPLETED" id="4" onTaskAdded={handleTaskAdded} />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
