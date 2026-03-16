// taskColumns.tsx
import { Task, TaskStatus } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import TaskAction from "./action";
import AssigneeEditor from "../../../task/_components/assignee-editor";
import { UserPlus } from "lucide-react";

export const Columns: ColumnDef<Task>[] = [
  {
    accessorKey: "task_name",
    header: "Task Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => getValue<TaskStatus>().replace("_", " "),
  },
  {
    accessorKey: "assignments",
    header: "Assignees",
    cell: ({ row }) => {
      const task = row.original;
      const assignments = task.assignments || [];
      const names = assignments
        .map((a: any) => a.member?.user?.full_name || "Unknown")
        .join(", ");

      return (
        <AssigneeEditor taskId={task.id} assignments={assignments}>
          {assignments.length > 0 ? (
            <span className="text-sm">{names}</span>
          ) : (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <UserPlus className="h-3.5 w-3.5" />
              Assign
            </span>
          )}
        </AssigneeEditor>
      );
    },
  },
  {
    accessorKey: "projectId",
    header: "Project",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) =>
      getValue<string>()
        ? new Date(getValue<string>()).toLocaleDateString()
        : "-",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <TaskAction task={row.original} />,
  },
];
