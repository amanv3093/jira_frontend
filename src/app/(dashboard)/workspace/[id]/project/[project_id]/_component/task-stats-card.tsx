"use client";

import React from "react";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Task } from "@/types";

interface TaskStatsCardsProps {
  tasks: Task[];
}

export default function TaskStatsCards({ tasks }: TaskStatsCardsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "IN_REVIEW"
  ).length;
  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "DONE"
  ).length;
  const incomplete = total - completed;

  const items = [
    { id: "total", label: "Total Tasks", value: total, Icon: ClipboardList },
    { id: "in_progress", label: "In Progress", value: inProgress, Icon: Clock },
    { id: "completed", label: "Completed", value: completed, Icon: CheckCircle },
    { id: "overdue", label: "Overdue", value: overdue, Icon: AlertTriangle },
    { id: "incomplete", label: "Incomplete", value: incomplete, Icon: XCircle },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 shadow-sm transition hover:shadow-md bg-[#1868db]"
          >
            <div className="flex flex-col">
              <span className="text-xs text-white/80">{item.label}</span>
              <span className="mt-0.5 text-xl font-bold text-white">
                {item.value}
              </span>
            </div>
            <item.Icon className="h-6 w-6 text-white/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
