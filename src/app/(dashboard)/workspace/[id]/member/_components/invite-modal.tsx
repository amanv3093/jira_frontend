"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LinkIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useGetAllWorkspace } from "@/hooks/workspace";
import { useGetProjectByWorkspaceId } from "@/hooks/project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteFormValues {
  workspaceId: string;
  projectId: string;
}

interface InvitePageProps {
  onClose: () => void;
}

export default function InvitePage({ onClose }: InvitePageProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: workspaces, isLoading: workspacesLoading } = useGetAllWorkspace();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  const { data: projects, isLoading: projectsLoading } =
    useGetProjectByWorkspaceId(selectedWorkspace);

  const { register, handleSubmit, setValue, watch, reset } = useForm<InviteFormValues>();

  const workspaceId = watch("workspaceId");
  const projectId = watch("projectId");

  const onSubmit = async (data: InviteFormValues) => {
    if (!data.workspaceId || !data.projectId) {
      toast.error("Please select both Workspace and Project.");
      return;
    }

    setLoading(true);
    try {
      const session = await getSession();
      if (!session?.user?.token) {
        toast.error("You must be logged in to generate an invite.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Failed to create invite.");
        setLoading(false);
        return;
      }

      setInviteUrl(result?.data?.inviteUrl);
      toast.success("Invite created successfully!");
      reset();
      setSelectedWorkspace("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Close Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Generate Invite Link
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Workspace Select */}
            <div>
              <Label>Workspace</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedWorkspace(value);
                  setValue("workspaceId", value);
                  setValue("projectId", ""); // reset project
                }}
                value={workspaceId || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspacesLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : workspaces?.length ? (
                    workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No Workspaces Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Project Select */}
            <div>
              <Label>Project</Label>
              <Select
                onValueChange={(value) => setValue("projectId", value)}
                value={projectId || ""}
                disabled={!workspaceId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projectsLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : projects?.length ? (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {workspaceId ? "No Projects Found" : "Select Workspace First"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !workspaceId || !projectId}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Invite"
              )}
            </Button>
          </form>

          {/* Invite Link Section */}
          {inviteUrl && (
            <div className="mt-6 border-t pt-4">
              <Label className="text-sm font-medium text-gray-700">
                Invite Link:
              </Label>
              <div className="flex items-center justify-between bg-gray-50 border p-2 rounded-md mt-2">
                <a
                  href={inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm truncate"
                >
                  {inviteUrl}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
