// src/app/(dashboard)/workspace/[id]/project/[project_id]/_component/table/action.tsx
"use client";

import { Task, Member } from "@/types";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetMemberByWorkspaceId } from "@/hooks/member";
import { useUpdateTask } from "@/hooks/task";
import Modal from "@/components/modal/custom-modal";

interface TaskActionsProps {
  task: Task;
}

const TaskAction: React.FC<TaskActionsProps> = ({ task }) => {
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const params = useParams();
  const workspaceId = params?.id as string;
  const { data: members = [] } = useGetMemberByWorkspaceId(workspaceId);
  const updateTask = useUpdateTask();

  const currentAssigneeIds = (task.assignments || []).map(
    (a) => a.userId ?? (a as any).member?.userId
  );

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log("View", task.id)}>
            <Eye className="text-green-500"/>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Edit", task.id)}>
            <Pencil className="text-blue-500"/>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAssigneeModalOpen(true)}>
            <UserPlus className="text-violet-500"/>
            Edit Assignee
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Open project", task.projectId)}
          >
            <SquareArrowOutUpRight className="text-orange-500"/>
            Open Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => console.log("Delete", task.id)}
            className="text-red-500"
          >
            <Trash  className="text-red-500"/>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
