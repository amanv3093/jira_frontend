"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { useCreateProject } from "@/hooks/project";

// ---------------- Zod Schema ----------------
const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  workspaceId: z.string().min(1, "Select a workspace"),
  profilePic: z
    .custom<File>((file) => file instanceof File, {
      message: "Profile picture is required",
    })

});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;

export type WorkspaceOption = {
  id: string;
  name: string;
};

export default function ProjectCreateForm({
  workspaces,
  onClose,
}: {
  workspaces: WorkspaceOption[];
  onClose: () => void;
}) {
  const params = useParams();
  const workspaceIdFromUrl = params?.id as string | undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      workspaceId: workspaceIdFromUrl || "",
      profilePic: undefined,
    },
  });

  const createProject = useCreateProject();
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function onSubmit(values: ProjectFormValues) {
    try {
      setServerError(null);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("workspaceId", values.workspaceId);

      if (values.profilePic instanceof File) {
        formData.append("profilePic", values.profilePic);
      }

      createProject.mutate(formData, {
        onSuccess: () => {
          reset();
          setPreview(null);
          onClose();
        },
      });
    } catch (err: any) {
      setServerError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Project</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
        {/* Project Name */}
        <div>
          <Label>Project Name</Label>
          <Input
            placeholder="e.g., Apollo Redesign"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            placeholder="Short summary of the project..."
            className="min-h-[100px]"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Workspace */}
        <div>
          <Label>Workspace</Label>
          <Select
            onValueChange={(val) =>
              setValue("workspaceId", val, { shouldValidate: true })
            }
            defaultValue={workspaceIdFromUrl || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces?.length ? (
                workspaces.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No workspaces
                </div>
              )}
            </SelectContent>
          </Select>
          {errors.workspaceId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.workspaceId.message}
            </p>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <Label>Profile Picture</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue("profilePic", file, { shouldValidate: true });
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-20 w-20 rounded-lg object-cover border border-border"
            />
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500">{serverError}</p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createProject.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
