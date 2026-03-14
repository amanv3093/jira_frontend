"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    {
      id: "total",
      label: "Total Tasks",
      value: total,
      Icon: ClipboardList,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      id: "in_progress",
      label: "In Progress",
      value: inProgress,
      Icon: Clock,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950",
    },
    {
      id: "completed",
      label: "Completed",
      value: completed,
      Icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      id: "overdue",
      label: "Overdue",
      value: overdue,
      Icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950",
    },
    {
      id: "incomplete",
      label: "Incomplete",
      value: incomplete,
      Icon: XCircle,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-4">
      {items.map((item) => (
        <Card key={item.id} className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <item.Icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
