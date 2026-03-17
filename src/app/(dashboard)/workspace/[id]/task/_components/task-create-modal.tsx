"use client";

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
import { X, Loader2, Check } from "lucide-react";
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
  project?: Project[];
  projectAutoSelect?: Project;
}

export const TaskSchema = z.object({
  task_name: z.string().min(1),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid datetime")
    .transform((val) => new Date(val).toISOString()),

  projectId: z.string().min(1, "Project is required"),
  assignments: z
    .array(z.object({ userId: z.string(), assignedAt: z.string().optional() }))
    .min(1, "At least one assignment is required"),
});

type TaskFormData = z.infer<typeof TaskSchema>;


const TaskCreateModal = ({
  onClose,
  members,
  project,
  projectAutoSelect,
}: Props) => {
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
      projectId: projectAutoSelect ? projectAutoSelect?.id : "",
      status: TaskStatus.BACKLOG,
      priority: TaskPriority.MEDIUM,
      dueDate: "",
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                  {projectAutoSelect ? (
                    <SelectItem
                      key={projectAutoSelect.id}
                      value={projectAutoSelect.id}
                    >
                      {projectAutoSelect.name}
                    </SelectItem>
                  ) : (
                    project?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
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

        {/* Status & Priority Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* Due Date */}
        <div>
          <Label>Due Date</Label>
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
          <Label>Assign Members</Label>
          <Controller
            control={control}
            name="assignments"
            render={({ field }) => {
              const selectedIds = (field.value || []).map(
                (a: any) => a.userId
              );
              const uniqueMembers = members?.filter(
                (m, i, arr) =>
                  arr.findIndex((x) => x.userId === m.userId) === i
              );

              const toggle = (userId: string) => {
                if (selectedIds.includes(userId)) {
                  field.onChange(
                    field.value.filter((a: any) => a.userId !== userId)
                  );
                } else {
                  field.onChange([
                    ...field.value,
                    {
                      userId,
                      assignedAt: new Date().toISOString(),
                    },
                  ]);
                }
              };

              return (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {uniqueMembers && uniqueMembers.length > 0 ? (
                    uniqueMembers.map((member) => {
                      const isSelected = selectedIds.includes(member.userId);
                      return (
                        <button
                          type="button"
                          key={member.userId}
                          onClick={() => toggle(member.userId)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors text-sm ${
                            isSelected
                              ? "bg-primary/10"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium overflow-hidden">
                            {member.user?.avatarUrl ? (
                              <img
                                src={member.user.avatarUrl}
                                alt={member.user.full_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              member.user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"
                            )}
                          </div>
                          <span className="flex-1 truncate">
                            {member.user?.full_name}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-3">
                      No members available
                    </p>
                  )}
                </div>
              );
            }}
          />
          {errors.assignments && (
            <p className="text-sm text-red-500 mt-1">
              {errors.assignments.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={createTask.isPending}>
          {createTask.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Task"
          )}
        </Button>
      </form>
    </div>
  );
};

export default TaskCreateModal;
