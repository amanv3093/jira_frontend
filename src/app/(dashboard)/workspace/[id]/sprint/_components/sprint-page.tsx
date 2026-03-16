"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Modal from "@/components/modal/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Loader2,
  Calendar,
  Trash2,
  Play,
  CheckCircle2,
  Pencil,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Sprint, SprintStatus, Project } from "@/types";
import {
  useGetSprintsByWorkspaceId,
  useCreateSprint,
  useUpdateSprint,
  useDeleteSprint,
  useStartSprint,
  useCompleteSprint,
} from "@/hooks/sprint";
import { useGetWorkspaceById } from "@/hooks/workspace";
import Loader from "@/app/Loader";
import SprintDetail from "./sprint-detail";

const SprintSchema = z
  .object({
    name: z.string().min(1, "Sprint name is required"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Project is required"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type SprintFormData = z.infer<typeof SprintSchema>;

const statusBadgeClasses: Record<SprintStatus, string> = {
  [SprintStatus.PLANNING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  [SprintStatus.ACTIVE]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  [SprintStatus.COMPLETED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

function SprintPage() {
  const params = useParams();
  const workspaceId = params?.id as string;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [expandedSprintId, setExpandedSprintId] = useState<string | null>(null);

  const { data: sprints, isLoading: sprintsLoading } =
    useGetSprintsByWorkspaceId(workspaceId);
  const { data: workspaceData, isLoading: workspaceLoading } =
    useGetWorkspaceById(workspaceId);

  const createSprint = useCreateSprint();
  const updateSprint = useUpdateSprint();
  const deleteSprint = useDeleteSprint();
  const startSprint = useStartSprint();
  const completeSprint = useCompleteSprint();

  const createForm = useForm<SprintFormData>({
    resolver: zodResolver(SprintSchema),
    defaultValues: {
      name: "",
      description: "",
      projectId: "",
      startDate: "",
      endDate: "",
    },
  });

  const editForm = useForm<SprintFormData>({
    resolver: zodResolver(SprintSchema),
    defaultValues: {
      name: "",
      description: "",
      projectId: "",
      startDate: "",
      endDate: "",
    },
  });

  const onCreateSubmit = (data: SprintFormData) => {
    createSprint.mutate(
      {
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      },
      {
        onSuccess: () => {
          createForm.reset();
          setIsCreateModalOpen(false);
        },
      }
    );
  };

  const onEditSubmit = (data: SprintFormData) => {
    if (!editingSprint) return;
    updateSprint.mutate(
      {
        id: editingSprint.id,
        payload: {
          name: data.name,
          description: data.description,
          projectId: data.projectId,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
        },
      },
      {
        onSuccess: () => {
          editForm.reset();
          setEditingSprint(null);
          setIsEditModalOpen(false);
        },
      }
    );
  };

  const handleEdit = (sprint: Sprint) => {
    setEditingSprint(sprint);
    editForm.reset({
      name: sprint.name,
      description: sprint.description || "",
      projectId: sprint.projectId,
      startDate: sprint.startDate
        ? new Date(sprint.startDate).toISOString().slice(0, 16)
        : "",
      endDate: sprint.endDate
        ? new Date(sprint.endDate).toISOString().slice(0, 16)
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (sprintId: string) => {
    if (window.confirm("Are you sure you want to delete this sprint?")) {
      deleteSprint.mutate(sprintId);
      if (expandedSprintId === sprintId) {
        setExpandedSprintId(null);
      }
    }
  };

  const handleStart = (sprintId: string) => {
    startSprint.mutate(sprintId);
  };

  const handleComplete = (sprintId: string) => {
    if (
      window.confirm(
        "Complete this sprint? Incomplete tasks will be moved out of the sprint."
      )
    ) {
      completeSprint.mutate(sprintId);
    }
  };

  const toggleExpand = (sprintId: string) => {
    setExpandedSprintId((prev) => (prev === sprintId ? null : sprintId));
  };

  if (sprintsLoading || workspaceLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  const sprintList: Sprint[] = sprints || [];
  const projects: Project[] = workspaceData?.projects || [];

  const activeSprints = sprintList.filter(
    (s) => s.status === SprintStatus.ACTIVE
  );
  const planningSprints = sprintList.filter(
    (s) => s.status === SprintStatus.PLANNING
  );
  const completedSprints = sprintList.filter(
    (s) => s.status === SprintStatus.COMPLETED
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTaskProgress = (sprint: Sprint) => {
    const total = sprint._count?.tasks || sprint.tasks?.length || 0;
    if (total === 0) return { total: 0, completed: 0, percentage: 0 };
    const completed =
      sprint.taskStatusBreakdown?.DONE ||
      sprint.tasks?.filter((t) => t.status === "DONE").length ||
      0;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const renderSprintCard = (sprint: Sprint) => {
    const progress = getTaskProgress(sprint);
    const isExpanded = expandedSprintId === sprint.id;

    return (
      <div
        key={sprint.id}
        className="border border-border rounded-lg bg-card overflow-hidden"
      >
        <div
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleExpand(sprint.id)}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {isExpanded ? (
                <ChevronDown size={18} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={18} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm truncate">
                      {sprint.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusBadgeClasses[sprint.status]
                      }`}
                    >
                      {sprint.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getProjectName(sprint.projectId)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar size={12} />
                    <span>
                      {formatDate(sprint.startDate)} -{" "}
                      {formatDate(sprint.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sprint.status === SprintStatus.PLANNING && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleStart(sprint.id)}
                        disabled={startSprint.isPending}
                      >
                        <Play size={12} className="mr-1" />
                        <span className="hidden sm:inline">Start</span>
                      </Button>
                    )}
                    {sprint.status === SprintStatus.ACTIVE && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleComplete(sprint.id)}
                        disabled={completeSprint.isPending}
                      >
                        <CheckCircle2 size={12} className="mr-1" />
                        <span className="hidden sm:inline">Complete</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(sprint)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(sprint.id)}
                      disabled={deleteSprint.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-border">
            <SprintDetail
              sprintId={sprint.id}
              projectId={sprint.projectId}
            />
          </div>
        )}
      </div>
    );
  };

  const renderSprintGroup = (title: string, groupSprints: Sprint[]) => {
    if (groupSprints.length === 0) return null;
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title} ({groupSprints.length})
        </h2>
        <div className="space-y-2">
          {groupSprints.map((sprint) => renderSprintCard(sprint))}
        </div>
      </div>
    );
  };

  const renderSprintForm = (
    form: ReturnType<typeof useForm<SprintFormData>>,
    onSubmit: (data: SprintFormData) => void,
    onClose: () => void,
    isPending: boolean,
    title: string,
    submitLabel: string
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Sprint Name */}
        <div>
          <Label htmlFor="sprintName">Sprint Name</Label>
          <Input
            id="sprintName"
            placeholder="Enter sprint name"
            {...form.register("name")}
            className={form.formState.errors.name ? "border-red-500" : ""}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="sprintDescription">Description (optional)</Label>
          <Input
            id="sprintDescription"
            placeholder="Enter description"
            {...form.register("description")}
          />
        </div>

        {/* Project Select */}
        <div>
          <Label>Project</Label>
          <Controller
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.projectId && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.projectId.message}
            </p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              {...form.register("startDate")}
              className={
                form.formState.errors.startDate ? "border-red-500" : ""
              }
            />
            {form.formState.errors.startDate && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="datetime-local"
              {...form.register("endDate")}
              className={
                form.formState.errors.endDate ? "border-red-500" : ""
              }
            />
            {form.formState.errors.endDate && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">Sprint Planning</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your project sprints
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsCreateModalOpen(true)}
          className="!py-1 !h-[30px] !rounded-none font-normal flex items-center gap-1 shrink-0 w-fit"
        >
          <Plus size={16} />
          Create Sprint
        </Button>
      </div>

      {sprintList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <p className="text-muted-foreground mb-4">
            No sprints found. Create your first sprint to get started.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Create Sprint
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSprintGroup("Active Sprints", activeSprints)}
          {renderSprintGroup("Planning", planningSprints)}
          {renderSprintGroup("Completed", completedSprints)}
        </div>
      )}

      {/* Create Sprint Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        >
          {renderSprintForm(
            createForm,
            onCreateSubmit,
            () => {
              createForm.reset();
              setIsCreateModalOpen(false);
            },
            createSprint.isPending,
            "Create Sprint",
            "Create Sprint"
          )}
        </Modal>
      )}

      {/* Edit Sprint Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingSprint(null);
          }}
        >
          {renderSprintForm(
            editForm,
            onEditSubmit,
            () => {
              editForm.reset();
              setEditingSprint(null);
              setIsEditModalOpen(false);
            },
            updateSprint.isPending,
            "Edit Sprint",
            "Update Sprint"
          )}
        </Modal>
      )}
    </div>
  );
}

export default SprintPage;
