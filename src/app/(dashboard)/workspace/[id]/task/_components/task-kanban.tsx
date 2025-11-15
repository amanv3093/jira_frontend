"use client";

import React, { useEffect, useState } from "react";
import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "@/lib/axiosInstance"; // ✅ Import your configured axios instance
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useUpdateTask } from "@/hooks/task";

interface TaskKanbanProps {
  data: Task[];
  onPersist?: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

const STATUS_ORDER = [
  { key: "BACKLOG", label: "Backlog" },
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "DONE", label: "Done" },
];

type Column = {
  key: string;
  label: string;
  tasks: Task[];
};

export default function TaskKanban({ data, onPersist }: TaskKanbanProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const [columns, setColumns] = useState<Column[]>(
    STATUS_ORDER.map((s) => ({ ...s, tasks: [] }))
  );

  useEffect(() => {
    const grouped = STATUS_ORDER.map((status) => ({
      ...status,
      tasks: data.filter((t) => t.status === status.key),
    }));
    setColumns(grouped);
  }, [data]);

  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    sourceList: Task[],
    destList: Task[],
    source: any,
    destination: any
  ) => {
    const sourceClone = Array.from(sourceList);
    const destClone = Array.from(destList);
    const [moved] = sourceClone.splice(source.index, 1);
    destClone.splice(destination.index, 0, moved);
    return { source: sourceClone, destination: destClone, moved };
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColIdx = columns.findIndex((c) => c.key === source.droppableId);
    const destColIdx = columns.findIndex(
      (c) => c.key === destination.droppableId
    );
    if (sourceColIdx < 0 || destColIdx < 0) return;

    // Reorder inside same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = reorder(
        columns[sourceColIdx].tasks,
        source.index,
        destination.index
      );
      const newCols = [...columns];
      newCols[sourceColIdx] = { ...columns[sourceColIdx], tasks: newTasks };
      setColumns(newCols);
      return;
    }

    // Move between columns (status change)
    const {
      source: newSourceTasks,
      destination: newDestTasks,
      moved,
    } = move(
      columns[sourceColIdx].tasks,
      columns[destColIdx].tasks,
      source,
      destination
    );

    const newCols = [...columns];
    newCols[sourceColIdx] = { ...columns[sourceColIdx], tasks: newSourceTasks };
    newCols[destColIdx] = { ...columns[destColIdx], tasks: newDestTasks };

    const movedWithStatus = { ...moved, status: newCols[destColIdx].key };
    newCols[destColIdx].tasks[destination.index] = movedWithStatus;
    setColumns(newCols);

    // ✅ Persist change
    try {
      if (onPersist) {
        await onPersist(moved.id, { status: newCols[destColIdx].key });
      } else {
        updateTask({
          id: moved.id,
          payload: { status: newCols[destColIdx].key },
        });
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Optional: revert UI change if request fails
      setColumns(columns);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map(({ key, label, tasks }) => (
          <Droppable droppableId={key} key={key}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 min-w-[300px] bg-gray-50 border border-gray-200 rounded-lg flex flex-col ${
                  snapshot.isDraggingOver
                    ? "ring-2 ring-offset-1 ring-indigo-200"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2 p-3 ">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {label}
                  </h3>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 rounded">
                    {tasks.length}
                  </span>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[70vh] p-1 cursor-default">
                  {tasks.map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                      
                    >
                      {(dragProvided, dragSnapshot) => {
                        const [hovered, setHovered] = useState(false);
                        const [editing, setEditing] = useState(false);
                        const [newName, setNewName] = useState(task.task_name);
                        const [loading, setLoading] = useState(false);

                        const handleSave = () => {
                          updateTask({
                            id: task.id,
                            payload: { task_name: newName },
                          });
                          setEditing(false)
                        };

                        return (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`mb-2 relative !cursor-pointer ${
                              dragSnapshot.isDragging ? "z-50" : ""
                            }`}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                          >
                            <Card className="border border-gray-200 bg-white hover:shadow-sm transition rounded-sm">
                              <CardContent className="p-2 relative">
                                {/* Edit button (visible only on hover and when not editing) */}
                                {!editing && hovered && (
                                  <button
                                    onClick={() => setEditing(true)}
                                    className="absolute top-1 right-1 text-gray-400 hover:text-gray-700 transition"
                                  >
                                    <Edit size={14} />
                                  </button>
                                )}

                                {/* Normal view */}
                                {!editing && (
                                  <>
                                    <p className="text-sm font-medium text-gray-800">
                                      {task.task_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {task.priority} • {task.project?.name}
                                    </p>
                                  </>
                                )}

                                {/* Edit mode */}
                                {editing && (
                                  <div className="space-y-2">
                                    <textarea
                                      value={newName}
                                      onChange={(e) =>
                                        setNewName(e.target.value)
                                      }
                                      className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                      rows={2}
                                      autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditing(false);
                                          setNewName(task.task_name);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={loading}
                                      >
                                        {loading ? "Saving..." : "Save"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
