// taskColumns.tsx
import { Task, TaskStatus } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import TaskAction from "./action";

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
    cell: ({ getValue }) => {
      const assignments = getValue<any[]>() || [];
      return assignments
        .map((a) => a.member?.user?.full_name || "Unknown")
        .join(", ");
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
