import React, { useMemo } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CardList from "../../components/CardList";
import NoContent from "../../components/NoContent";
import Loading from "../../components/Loading";
import type { IssueResponse } from "../../types/IssueTypes";

// API helpers
const fetchTasks = async (id: string): Promise<IssueResponse[]> => {
  const res = await fetch(`https://devtracker-0es2.onrender.com/task/all/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

const updateTaskStatus = async ({
  taskId,
  projectId,
  status,
}: {
  taskId: number | string;
  projectId: string;
  status: IssueResponse["status"];
}) => {
  const res = await fetch(
    `https://devtracker-0es2.onrender.com/task/update-status/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status, projectId }),
    }
  );
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Fetch tasks with React Query
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<IssueResponse[]>({
    queryKey: ["tasks", id],
    queryFn: () => fetchTasks(id!),
    enabled: !!id,
    // optional: tune staleTime/cacheTime as needed
  });

  // Mutation for updating status (invalidates tasks on success)
  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  // Called by CardList/AddTask when a new task is created (or returned)
  const handleTaskAdded = (newIssue: IssueResponse) => {
    if (!id) return; // guard if no project id available

    // ensure there's an id (some local creations might not have backend id yet)
    if (!newIssue.id) {
      // assign a temporary id so lists render without key collisions
      // note: if backend later returns real id, parent component that created it
      // should call invalidate or call onTaskAdded with the server-side created object.
      newIssue.id = Date.now();
    }

    queryClient.setQueryData<IssueResponse[]>(
      ["tasks", id],
      (old = []) => [...old, newIssue]
    );
  };

  // derive columns
  const notStartedTodos = useMemo(() => tasks.filter((t) => t.status === "TODO"), [tasks]);
  const startedTodos = useMemo(() => tasks.filter((t) => t.status === "IN_PROGRESS"), [tasks]);
  const awaitTodos = useMemo(() => tasks.filter((t) => t.status === "AWAIT_APPROVAL"), [tasks]);
  const completedTodos = useMemo(() => tasks.filter((t) => t.status === "COMPLETED"), [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const todo = tasks.find((t) => t.id.toString() === draggableId);
    if (!todo || !id) return;

    let newStatus: IssueResponse["status"] = "TODO";
    if (destination.droppableId === "2") newStatus = "IN_PROGRESS";
    else if (destination.droppableId === "3") newStatus = "AWAIT_APPROVAL";
    else if (destination.droppableId === "4") newStatus = "COMPLETED";

    // Optimistic cache update
    queryClient.setQueryData<IssueResponse[]>(
      ["tasks", id],
      (old = []) => old.map((t) => (t.id === todo.id ? { ...t, status: newStatus } : t))
    );

    // Persist change
    mutation.mutate({ taskId: todo.id, projectId: id, status: newStatus });
  };

  if (isLoading) return <Loading name="Kanban board" />;
  if (isError) return <NoContent />;

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
