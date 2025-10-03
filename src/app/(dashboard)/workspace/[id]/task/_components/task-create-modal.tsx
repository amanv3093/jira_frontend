"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";


import { TaskPriority, TaskStatus } from "@/types";
import { useCreateTask } from "@/hooks/task";
interface Props {
  onClose: () => void;
  users?: { id: string; name: string }[]; 
}

export const TaskSchema = z.object({
  task_name: z.string().min(1),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string(),
  assignments: z
    .array(z.object({ userId: z.string(), assignedAt: z.string().optional() }))
    .optional(),
});

type TaskFormData = z.infer<typeof TaskSchema>;

const TaskCreateModal = ({ onClose, users = [] }: Props) => {
  const createTask = useCreateTask();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      task_name: "",
      projectId:"1",
      status: TaskStatus.BACKLOG,
      priority: TaskPriority.MEDIUM,
      dueDate: undefined,
      assignments: [],
    },
  });

  const onSubmit = (data: TaskFormData) => {
    // createTask.mutate(data, {
    //   onSuccess: () => {
    //     reset();
    //     onClose();
    //   },
    // });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Task Name */}
        <div>
          <Label htmlFor="taskName">Task Name</Label>
          <Input
            id="taskName"
            placeholder="Enter task name"
            {...register("task_name")}
            className={errors.task_name ? "border-red-500" : ""}
          />
          {errors.task_name && (
            <p className="text-sm text-red-500 mt-1">
              {errors.task_name.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["BACKLOG", "IN_PROGRESS", "COMPLETED"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Priority */}
        <div>
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {["LOW", "MEDIUM", "HIGH"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Due Date */}
        <div>
          <Label>Due Date</Label>
          <Input type="datetime-local" {...register("dueDate")} />
        </div>

        {/* Assignments */}
        <div>
          <Label>Assign Users</Label>
          <Controller
            control={control}
            name="assignments"
            render={({ field }) => (
              <Select
                onValueChange={(val) =>
                  field.onChange(
                    val
                      ? [{ userId: val, assignedAt: new Date().toISOString() }]
                      : []
                  )
                }
                value={field.value?.[0]?.userId || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </div>
  );
};

export default TaskCreateModal;
