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

import {
  Task,
  TaskStatus,
  TaskPriority,
  Member,
  Project,
  Workspace,
} from "@/types";

import { useCreateTask } from "@/hooks/task";
interface Props {
  onClose: () => void;
  members: Member[];
  project: Project[];
}

export const TaskSchema = z.object({
  task_name: z.string().min(1),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z
    .preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return new Date(val).toISOString();
      }
      return val;
    }, z.string().datetime("Invalid datetime"))
    .refine((val) => !!val, { message: "Due date is required" }),

  projectId: z.string().min(1, "Project is required"),
  assignments: z
    .array(z.object({ userId: z.string(), assignedAt: z.string().optional() }))
    .min(1, "At least one assignment is required"),
});

type TaskFormData = z.infer<typeof TaskSchema>;

const TaskCreateModal = ({ onClose, members, project }: Props) => {
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
      projectId: "",
      status: TaskStatus.BACKLOG,
      priority: TaskPriority.MEDIUM,
      dueDate: undefined,
      assignments: [],
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className="space-y-4 mx-auto w-[22rem] p-4">
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
        {/* Project Select */}
        <div>
          <Label>Project</Label>
          <Controller
            control={control}
            name="projectId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {project?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.projectId.message}
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
        <div className="">
          <Label className="w-1/3 text-left">Due Date</Label>
          <Input
            type="datetime-local"
            {...register("dueDate")}
            className="w-full"
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500 mt-1">
              {errors.dueDate.message}
            </p>
          )}
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
                  {members?.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.user?.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.assignments && (
            <p className="text-sm text-red-500 mt-1">
              {errors.assignments.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </div>
  );
};

export default TaskCreateModal;
