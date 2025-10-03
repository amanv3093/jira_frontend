// TaskFilters.tsx
"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TaskStatus } from "@/types";

interface TaskFiltersProps {
  allAssignees: string[];
  allProjects: string[];
}

export default function TaskFilters({ allAssignees, allProjects }: TaskFiltersProps) {
  const { control, watch, reset } = useFormContext<any>();
  const filterValues = watch();

  return (
    <div className="flex flex-wrap gap-4">
      {/* Status Multi-select */}
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            multiple
            onValueChange={(vals) => field.onChange(vals)}
            value={field.value}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Assignees Multi-select */}
      <Controller
        control={control}
        name="assignees"
        render={({ field }) => (
          <Select multiple onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              {allAssignees.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Projects Multi-select */}
      <Controller
        control={control}
        name="projects"
        render={({ field }) => (
          <Select multiple onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              {allProjects.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {/* Due Date */}
      <Controller
        control={control}
        name="dueDate"
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {field.value[0] && field.value[1]
                  ? `${format(field.value[0], "MM/dd/yyyy")} - ${format(
                      field.value[1],
                      "MM/dd/yyyy"
                    )}`
                  : "Due Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <Calendar
                mode="range"
                selected={field.value as [Date | undefined, Date | undefined]}
                onSelect={(range) => field.onChange(range as [Date, Date])}
              />
              <Button size="sm" onClick={() => field.onChange([undefined, undefined])}>
                Clear
              </Button>
            </PopoverContent>
          </Popover>
        )}
      />

      <Button variant="outline" onClick={() => reset()}>
        Reset Filters
      </Button>
    </div>
  );
}
