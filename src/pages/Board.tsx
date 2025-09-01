import { useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import CardList from "../components/CardList";
import type { Todo } from "../components/CardItem";

const Board: React.FC = () => {
  const boardData = [
    {
      title: "activity bar",
      description: "implement this feature",
      type: "BUG",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      assignerId: 1,
      projectId: 1,
      id: 2,
      comments: [1,2,3],
      reporterId: 1,
      createdAt: "2025-08-31T08:37:03.230+00:00"
    },
    {
      title: "field object",
      description: "implement this feature",
      type: "BUG",
      status: "TODO",
      priority: "HIGH",
      assignerId: 2,
      projectId: 1,
      id: 3,
      comments: [],
      reporterId: 1,
      createdAt: "2025-08-31T08:50:40.556+00:00"
    },
    {
      title: "scroll position implement",
      description: "implement this feature",
      type: "FEATURE",
      status: "COMPLETED",
      priority: "LOW",
      assignerId: 2,
      projectId: 1,
      id: 4,
      comments: [],
      reporterId: 1,
      createdAt: "2025-08-31T08:50:40.556+00:00"
    },
    {
      title: "scroll position implement",
      description: "implement this feature",
      type: "FEATURE",
      status: "AWAIT_APPROVAL",
      priority: "LOW",
      assignerId: 2,
      projectId: 1,
      id: 5,
      comments: [],
      reporterId: 1,
      createdAt: "2025-08-31T08:50:40.556+00:00"
    },

  ];
  const [notStartedTodos, setNotStartedTodos] = useState<Todo[]>(
    boardData.filter((todo: Todo) => todo.status === "TODO")
  );
  const [startedTodos, setStartedTodos] = useState<Todo[]>(
    boardData.filter((todo: Todo) => todo.status === "IN_PROGRESS")
  );
  const [awaitTodos, setAwaitTodos] = useState<Todo[]>(
    boardData.filter((todo: Todo) => todo.status === "AWAIT_APPROVAL")
  );
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(
    boardData.filter((todo: Todo) => todo.status === "COMPLETED")
  );

  const findTodoById = (id: string, array: Todo[]): Todo | undefined =>
    array.find((todo) => todo.id.toString() === id);

  const removeTodoById = (id: string, array: Todo[]): Todo[] =>
    array.filter((todo) => todo.id.toString() !== id);

  const onDragEnd = (result: DropResult) => {
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
    let updatedawait = [...awaitTodos];
    let updatedCompleted = [...completedTodos];

    const todo =
      findTodoById(draggableId, notStartedTodos) ||
      findTodoById(draggableId, startedTodos) ||
      findTodoById(draggableId, awaitTodos) ||
      findTodoById(draggableId, completedTodos);

    if (!todo) return;

    if (source.droppableId === "1") {
      updatedNotStarted = removeTodoById(draggableId, updatedNotStarted);
    } else if (source.droppableId === "2") {
      updatedStarted = removeTodoById(draggableId, updatedStarted);
    } 
    else if (source.droppableId === "3") {
      updatedawait = removeTodoById(draggableId, updatedawait);
    } else {
      updatedCompleted = removeTodoById(draggableId, updatedCompleted);
    }

    if (destination.droppableId === "1") {
      updatedNotStarted.splice(destination.index, 0, {
        ...todo,
        status: "TODO",
      });
    } else if (destination.droppableId === "2") {
      updatedStarted.splice(destination.index, 0, {
        ...todo,
        status: "IN_PROGRESS",
      });
    }else if (destination.droppableId === "3") {
      updatedawait.splice(destination.index, 0, {
        ...todo,
        status: "AWAIT_APPROVAL",
      });
    } else {
      updatedCompleted.splice(destination.index, 0, {
        ...todo,
        status: "COMPLETED",
      });
    }

    setNotStartedTodos(updatedNotStarted);
    setStartedTodos(updatedStarted);
    setCompletedTodos(updatedCompleted);
    setAwaitTodos(updatedawait);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row g-3">
        <div className="col-lg-3">
          <CardList todoList={notStartedTodos} type="TODO" id="1" />
        </div>
        <div className="col-lg-3">
          <CardList todoList={startedTodos} type="IN_PROGRESS" id="2" />
        </div>
        <div className="col-lg-3">
          <CardList todoList={awaitTodos} type="AWAIT_APPROVAL" id="3" />
        </div>
        <div className="col-lg-3">
          <CardList todoList={completedTodos} type="COMPLETED" id="4" />
        </div>

      </div>
    </DragDropContext>
  );
};

export default Board;

