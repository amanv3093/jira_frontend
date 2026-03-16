"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Camera,
  Save,
  Trash2,
  Users,
  Shield,
  ChevronDown,
  AlertTriangle,
  MoreVertical,
  Crown,
  UserMinus,
  Loader2,
} from "lucide-react";
import { useGetWorkspaceById, useUpdateWorkspace, useDeleteWorkspace } from "@/hooks/workspace";
import { useGetMemberByWorkspaceId, useRemoveMember, useUpdateMemberRole } from "@/hooks/member";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Loader from "@/app/Loader";
import { Member, MemberRole } from "@/types";

const ROLE_BADGE: Record<string, string> = {
  OWNER: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  CONTRIBUTOR: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  VIEWER: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params?.id as string;

  const { data: workspace, isLoading } = useGetWorkspaceById(workspaceId);
  const { data: members, isLoading: membersLoading } = useGetMemberByWorkspaceId(workspaceId);
  const { data: session } = useSession();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name || "");
    }
  }, [workspace]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveGeneral = () => {
    const formData = new FormData();
    if (name.trim()) formData.append("name", name.trim());
    if (selectedFile) formData.append("profilePic", selectedFile);

    updateWorkspace.mutate({ id: workspaceId, formData });
  };

  const handleDeleteWorkspace = () => {
    if (deleteConfirm !== workspace?.name) return;
    deleteWorkspace.mutate(workspaceId, {
      onSuccess: () => {
        router.push("/workspace");
      },
    });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember.mutate({ workspaceId, memberId });
  };

  const handleRoleChange = (memberId: string, role: string) => {
    updateMemberRole.mutate({ workspaceId, memberId, role });
  };

  // Check if current logged-in user is the workspace owner or has admin/manager role
  const currentUserId = (session?.user as any)?.id;
  const currentUserRole = (session?.user as any)?.role;
  const currentUserIsOwner = currentUserId
    ? workspace?.ownerId === currentUserId
    : false;
  const canManageMembers = currentUserIsOwner || currentUserRole === "ADMIN" || currentUserRole === "MANAGER";

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  const avatarSrc = previewUrl || workspace?.profilePic;
  const hasChanges =
    name.trim() !== (workspace?.name || "") || selectedFile !== null;

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workspace preferences
          </p>
        </div>
      </div>

      {/* General Settings */}
      <Card className="border shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">General</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-20 w-20 border-2 border-muted">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt={workspace?.name} />
                  ) : null}
                  <AvatarFallback className="text-lg font-bold bg-muted">
                    {getInitials(workspace?.name || "W")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-[11px] text-muted-foreground">
                Click to upload
              </span>
            </div>

            {/* Name field */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter workspace name"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Workspace ID
                </label>
                <Input
                  value={workspaceId}
                  readOnly
                  className="h-10 bg-muted/50 text-muted-foreground font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveGeneral}
              disabled={!hasChanges || updateWorkspace.isPending}
              className="gap-2"
              size="sm"
            >
              {updateWorkspace.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Management */}
      <Card className="border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Members</h2>
              <Badge variant="secondary" className="text-xs">
                {members?.length ?? 0}
              </Badge>
            </div>
          </div>

          {membersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(members ?? []).map((m: Member) => {
                const isOwnerMember = m.role === "OWNER";
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 shrink-0">
                        {m.user?.avatarUrl ? (
                          <AvatarImage
                            src={m.user.avatarUrl}
                            alt={m.user.full_name}
                          />
                        ) : null}
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(m.user?.full_name ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {m.user?.full_name}
                          </p>
                          {isOwnerMember && (
                            <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {m.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Role dropdown (only if current user is owner/admin/manager and this member is not owner) */}
                      {canManageMembers && !isOwnerMember ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1 min-w-[110px] justify-between"
                            >
                              <Badge
                                className={`text-[10px] px-1.5 py-0 border-0 font-medium ${
                                  ROLE_BADGE[m.role] ?? ROLE_BADGE.VIEWER
                                }`}
                              >
                                {m.role}
                              </Badge>
                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(m.id, "CONTRIBUTOR")}
                              className="text-xs"
                            >
                              <Shield className="h-3.5 w-3.5 mr-2 text-blue-500" />
                              Contributor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(m.id, "VIEWER")}
                              className="text-xs"
                            >
                              <Shield className="h-3.5 w-3.5 mr-2 text-slate-400" />
                              Viewer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border-0 font-medium ${
                            ROLE_BADGE[m.role] ?? ROLE_BADGE.VIEWER
                          }`}
                        >
                          {m.role}
                        </Badge>
                      )}

                      {/* Remove button (only if owner/admin/manager and not self) */}
                      {canManageMembers && !isOwnerMember && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(m.id)}
                              className="text-red-600 text-xs"
                            >
                              <UserMinus className="h-3.5 w-3.5 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {currentUserIsOwner && (
        <Card className="border border-red-200 dark:border-red-900 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h2 className="text-base font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Deleting a workspace is permanent and cannot be undone. All
              projects, tasks, and members will be removed.
            </p>

            {!showDeleteDialog ? (
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 gap-2"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Workspace
              </Button>
            ) : (
              <div className="space-y-3 rounded-lg border border-red-200 dark:border-red-900 p-4 bg-red-50/50 dark:bg-red-950/30">
                <p className="text-sm font-medium">
                  Type{" "}
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {workspace?.name}
                  </span>{" "}
                  to confirm deletion
                </p>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={workspace?.name}
                  className="h-9 border-red-200 dark:border-red-800"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setDeleteConfirm("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={
                      deleteConfirm !== workspace?.name ||
                      deleteWorkspace.isPending
                    }
                    onClick={handleDeleteWorkspace}
                    className="gap-2"
                  >
                    {deleteWorkspace.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete Permanently
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
