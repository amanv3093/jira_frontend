"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function onSubmit(values: ProjectFormValues) {
    try {
      setSubmitting(true);
      setServerError(null);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("workspaceId", values.workspaceId);

      console.log("values",values)
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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}  encType="multipart/form-data" className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name
              </label>
              <Input
                placeholder="e.g., Apollo Redesign"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                placeholder="Short summary of the project…"
                className="min-h-[100px]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Workspace */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Workspace
              </label>
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
                    <div className="px-3 py-2 text-sm opacity-70">
                      No workspaces
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.workspaceId && (
                <p className="text-sm text-red-600">
                  {errors.workspaceId.message}
                </p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Picture
              </label>
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
                  className="mt-2 h-24 w-24 rounded-lg object-cover"
                />
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-600">{serverError}</p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
