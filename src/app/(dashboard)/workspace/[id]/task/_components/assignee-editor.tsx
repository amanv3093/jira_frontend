"use client";

import { Member } from "@/types";
import { Check, Loader2, UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetMemberByWorkspaceId } from "@/hooks/member";
import { useUpdateTask } from "@/hooks/task";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface AssigneeEditorProps {
  taskId: string;
  assignments: any[];
  children: React.ReactNode;
}

export default function AssigneeEditor({
  taskId,
  assignments,
  children,
}: AssigneeEditorProps) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const workspaceId = params?.id as string;
  const { data: rawMembers = [] } = useGetMemberByWorkspaceId(workspaceId);
  const updateTask = useUpdateTask();

  // Deduplicate members by userId
  const members = rawMembers.filter(
    (m, i, arr) => arr.findIndex((x) => x.userId === m.userId) === i
  );

  // Deduplicate assignee IDs
  const currentAssigneeIds = [
    ...new Set(
      (assignments || []).map((a: any) => a.userId ?? a.member?.userId)
    ),
  ];

  const toggleAssignee = (userId: string) => {
    const isAssigned = currentAssigneeIds.includes(userId);
    let newAssignments: { userId: string; assignedAt?: string }[];

    if (isAssigned) {
      newAssignments = currentAssigneeIds
        .filter((id: string) => id !== userId)
        .map((id: string) => ({ userId: id }));
    } else {
      newAssignments = [
        ...currentAssigneeIds.map((id: string) => ({ userId: id })),
        { userId, assignedAt: new Date().toISOString() },
      ];
    }

    updateTask.mutate(
      { id: taskId, payload: { assignments: newAssignments } },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 cursor-pointer hover:bg-muted rounded-md px-1.5 py-1 -mx-1.5 -my-1 transition-colors w-full text-left">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <p className="text-xs font-medium text-muted-foreground px-2 pb-2">
          Assign members
        </p>
        <div className="space-y-0.5 max-h-52 overflow-y-auto">
          {members.map((member: Member) => {
            const isAssigned = currentAssigneeIds.includes(member.userId);
            const name = member.user?.full_name || "Unknown";
            return (
              <button
                key={member.userId}
                onClick={() => toggleAssignee(member.userId)}
                disabled={updateTask.isPending}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors text-sm ${
                  isAssigned
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
              >
                <Avatar className="h-6 w-6">
                  {member.user?.avatarUrl ? (
                    <AvatarImage src={member.user.avatarUrl} alt={name} />
                  ) : null}
                  <AvatarFallback className="text-[10px] font-medium bg-muted">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate">{name}</span>
                {isAssigned && (
                  <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
          {members.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">
              No members found
            </p>
          )}
        </div>
        {updateTask.isPending && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2 border-t mt-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating...
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
