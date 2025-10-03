// taskColumns.tsx
import { Task, TaskStatus } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const Columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Task Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => getValue<TaskStatus>().replace("_", " "),
  },
  {
    accessorKey: "assignees",
    header: "Assignees",
    cell: ({ getValue }) => (getValue<string[]>() || []).join(", "),
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) =>
      getValue<string>() ? new Date(getValue<string>()).toLocaleDateString() : "-",
  },
];
