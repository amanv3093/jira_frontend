// src/app/(dashboard)/workspace/[id]/project/[project_id]/_component/table/action.tsx
"use client";

import { Task, Member, TaskStatus, TaskPriority } from "@/types";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  SquareArrowOutUpRight,
  Trash,
  UserPlus,
  Check,
  Loader2,
  X,
  Calendar,
  Flag,
  CircleDot,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetMemberByWorkspaceId } from "@/hooks/member";
import { useUpdateTask, useDeleteTask } from "@/hooks/task";
import Modal from "@/components/modal/custom-modal";
import { Badge } from "@/components/ui/badge";

interface TaskActionsProps {
  task: Task;
}

const STATUS_LABELS: Record<string, string> = {
  BACKLOG: "Backlog",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const TaskAction: React.FC<TaskActionsProps> = ({ task }) => {
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(task.task_name);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority || TaskPriority.MEDIUM);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );

  const params = useParams();
  const router = useRouter();
  const workspaceId = params?.id as string;
  const { data: rawMembers = [] } = useGetMemberByWorkspaceId(workspaceId);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Deduplicate members by userId
  const members = rawMembers.filter(
    (m, i, arr) => arr.findIndex((x) => x.userId === m.userId) === i
  );

  // Deduplicate assignee IDs
  const currentAssigneeIds = [
    ...new Set(
      (task.assignments || []).map(
        (a) => a.userId ?? (a as any).member?.userId
      )
    ),
  ];

  const seen = new Set<string>();
  const assigneeNames = (task.assignments || [])
    .filter((a: any) => {
      const uid = a.userId ?? a.member?.userId;
      if (!uid || seen.has(uid)) return false;
      seen.add(uid);
      return true;
    })
    .map((a: any) => a.member?.user?.full_name || "Unknown")
    .join(", ");

  const toggleAssignee = (userId: string) => {
    const isAssigned = currentAssigneeIds.includes(userId);
    let newAssignments: { userId: string; assignedAt?: string }[];

    if (isAssigned) {
      newAssignments = currentAssigneeIds
        .filter((id) => id !== userId)
        .map((id) => ({ userId: id }));
    } else {
      newAssignments = [
        ...currentAssigneeIds.map((id) => ({ userId: id })),
        { userId, assignedAt: new Date().toISOString() },
      ];
    }

    updateTask.mutate(
      { id: task.id, payload: { assignments: newAssignments } },
      { onSuccess: () => setIsAssigneeModalOpen(false) }
    );
  };

  const handleEdit = () => {
    setEditName(task.task_name);
    setEditStatus(task.status);
    setEditPriority(task.priority || TaskPriority.MEDIUM);
    setEditDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
    );
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    const payload: any = {};
    if (editName !== task.task_name) payload.task_name = editName;
    if (editStatus !== task.status) payload.status = editStatus;
    if (editPriority !== task.priority) payload.priority = editPriority;
    if (editDueDate) {
      const newDate = new Date(editDueDate).toISOString();
      if (newDate !== task.dueDate) payload.dueDate = newDate;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditModalOpen(false);
      return;
    }

    updateTask.mutate(
      { id: task.id, payload },
      { onSuccess: () => setIsEditModalOpen(false) }
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  const handleOpenProject = () => {
    router.push(`/workspace/${workspaceId}/project/${task.projectId}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewModalOpen(true)}>
            <Eye className="text-green-500" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="text-blue-500" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAssigneeModalOpen(true)}>
            <UserPlus className="text-violet-500" />
            Edit Assignee
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenProject}>
            <SquareArrowOutUpRight className="text-orange-500" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-500"
          >
            <Trash className="text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Modal */}
      {isViewModalOpen && (
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Task Name</p>
                <p className="text-sm font-medium">{task.task_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className="gap-1">
                    <CircleDot className="h-3 w-3" />
                    {STATUS_LABELS[task.status] || task.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <Badge variant="outline" className="gap-1">
                    <Flag className="h-3 w-3" />
                    {PRIORITY_LABELS[task.priority || "MEDIUM"] || task.priority}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Project</p>
                  <p className="text-sm flex items-center gap-1">
                    <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                    {task.project?.name || "Unknown"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Assignees</p>
                {assigneeNames ? (
                  <p className="text-sm">{assigneeNames}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No assignees</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Task</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-task-name">Task Name</Label>
                <Input
                  id="edit-task-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(val) => setEditStatus(val as TaskStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={editPriority}
                    onValueChange={(val) => setEditPriority(val as TaskPriority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Due Date</Label>
                <Input
                  type="datetime-local"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleEditSubmit}
                disabled={updateTask.isPending || !editName.trim()}
              >
                {updateTask.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Delete Task</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {task.task_name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteTask.isPending}
              >
                {deleteTask.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assignee Modal */}
      {isAssigneeModalOpen && (
        <Modal
          isOpen={isAssigneeModalOpen}
          onClose={() => setIsAssigneeModalOpen(false)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Assignees</h2>
              <button
                onClick={() => setIsAssigneeModalOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Select members to assign to{" "}
              <span className="font-medium text-foreground">
                {task.task_name}
              </span>
            </p>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {members.map((member: Member) => {
                const isAssigned = currentAssigneeIds.includes(member.userId);
                return (
                  <button
                    key={member.userId}
                    onClick={() => toggleAssignee(member.userId)}
                    disabled={updateTask.isPending}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                      isAssigned
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium overflow-hidden">
                      {member.user?.avatarUrl ? (
                        <img
                          src={member.user.avatarUrl}
                          alt={member.user.full_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        member.user?.full_name?.charAt(0)?.toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.user?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.user?.email}
                      </p>
                    </div>
                    {isAssigned && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })}
              {members.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No members in this workspace
                </p>
              )}
            </div>
            {updateTask.isPending && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default TaskAction;
