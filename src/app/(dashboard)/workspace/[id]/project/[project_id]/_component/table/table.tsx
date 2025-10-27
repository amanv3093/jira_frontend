"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useForm, FormProvider } from "react-hook-form";
// import TaskFilters from "./TaskFilters";

import { Task, TaskStatus } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Columns } from "./column";

interface ProjectTableProps {
  data: Task[];
 
}

export default function ProjectTable({ data}: ProjectTableProps) {
  const formMethods = useForm({
    defaultValues: {
      status: [],
      assignees: [],
      projects: [],
      dueDate: [undefined, undefined],
    },
  });

  const filterValues = formMethods.watch();

//   const filteredTasks = useMemo(() => {
//     return tasks.filter((task) => {
//       if (filterValues.status.length > 0 && !filterValues.status.includes(task.status)) return false;
//       if (filterValues.assignees.length > 0 && !task.assignees.some((a) => filterValues.assignees.includes(a))) return false;
//       if (filterValues.projects.length > 0 && !filterValues.projects.includes(task.project)) return false;

//       const taskDate = new Date(task.dueDate);
//       const [start, end] = filterValues.dueDate;
//       if (start && taskDate < start) return false;
//       if (end && taskDate > end) return false;

//       return true;
//     });
//   }, [tasks, filterValues]);

  const table = useReactTable({
    data: data,
    columns: Columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <FormProvider {...formMethods}>
      {/* <TaskFilters allAssignees={allAssignees} allProjects={allProjects} /> */}
      <Table className="mt-4">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormProvider>
  );
}
