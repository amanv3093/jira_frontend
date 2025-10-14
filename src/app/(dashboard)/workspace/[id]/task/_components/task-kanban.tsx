"use client";

import React from "react";
import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface TaskKanbanProps {
  data: Task[];
}

const STATUS_ORDER = [
  { key: "BACKLOG", label: "Backlog" },
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "DONE", label: "Done" },
];

export default function TaskKanban({ data }: TaskKanbanProps) {
  // Group tasks by status
  const grouped = STATUS_ORDER.map((status) => ({
    ...status,
    tasks: data.filter((task) => task.status === status.key),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {grouped.map(({ key, label, tasks }) => (
        <div
          key={key}
          className="flex-1 min-w-[250px] bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 rounded">
              {tasks.length}
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[70vh]">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-2 border border-gray-200 bg-white hover:shadow-sm transition"
                >
                  <CardContent className="p-2">
                    <p className="text-sm font-medium text-gray-800">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.priority} • {task.project?.name}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded">
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
