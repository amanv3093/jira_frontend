// src/app/(dashboard)/workspace/[id]/task/_components/TaskActions.tsx
"use client";

import { Task } from "@/types";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  task: Task;
}

const TaskAction: React.FC<TaskActionsProps> = ({ task }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("View", task.id)}>
          <Eye className="text-green-500"/>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Edit", task.id)}>
          <Pencil className="text-blue-500"/>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => console.log("Open project", task.projectId)}
        >
          <SquareArrowOutUpRight className="text-orange-500"/>
          Open Project
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => console.log("Delete", task.id)}
          className="text-red-500"
        >
          <Trash  className="text-red-500"/>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskAction;
