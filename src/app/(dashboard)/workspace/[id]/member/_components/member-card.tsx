"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  UserPlus,
  Link2,
  Search,
  Users,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import Modal from "@/components/modal/custom-modal";
import InvitePage from "./invite-modal";
import { useGetMemberByWorkspaceId, useRemoveMember } from "@/hooks/member";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/app/Loader";
import JoinPage from "./join-modal";
import { Member } from "@/types";

const ROLE_BADGE: Record<string, string> = {
  OWNER: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  CONTRIBUTOR:
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  VIEWER:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MemberCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalJoinOpen, setIsModalJoinOpen] = useState(false);
  const [search, setSearch] = useState("");

  const params = useParams();
  const workspaceId = params?.id as string;
  const { data: members, isLoading } = useGetMemberByWorkspaceId(workspaceId);
  const { data: session } = useSession();
  const removeMember = useRemoveMember();

  const currentUserRole = (session?.user as any)?.role;
  const currentUserId = (session?.user as any)?.id;
  const canManageMembers = currentUserRole === "ADMIN" || currentUserRole === "MANAGER" ||
    members?.some((m: Member) => m.userId === currentUserId && m.role === "OWNER");

  const filtered = useMemo(() => {
    if (!members) return [];
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m: Member) =>
        m.user?.full_name?.toLowerCase().includes(q) ||
        m.user?.email?.toLowerCase().includes(q) ||
        m.role?.toLowerCase().includes(q)
    );
  }, [members, search]);

  const totalTasks = useMemo(
    () =>
      (members ?? []).reduce(
        (sum: number, m: Member) => sum + (m.stats?.totalTasks ?? 0),
        0
      ),
    [members]
  );
  const completedTasks = useMemo(
    () =>
      (members ?? []).reduce(
        (sum: number, m: Member) => sum + (m.stats?.completedTasks ?? 0),
        0
      ),
    [members]
  );

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your workspace team and invitations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalJoinOpen(true)}
          >
            <Link2 className="h-4 w-4 mr-1.5" />
            Join
          </Button>
          {canManageMembers && (
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              Invite
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          icon={Users}
          label="Total Members"
          value={members?.length ?? 0}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-50 dark:bg-blue-950"
        />
        <SummaryCard
          icon={ClipboardList}
          label="Total Tasks"
          value={totalTasks}
          color="text-violet-600 dark:text-violet-400"
          bg="bg-violet-50 dark:bg-violet-950"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks}
          color="text-green-600 dark:text-green-400"
          bg="bg-green-50 dark:bg-green-950"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Overdue"
          value={(members ?? []).reduce(
            (sum: number, m: Member) => sum + (m.stats?.overdueTasks ?? 0),
            0
          )}
          color="text-red-600 dark:text-red-400"
          bg="bg-red-50 dark:bg-red-950"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Member Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Users className="h-10 w-10 mb-3" />
          <p className="text-sm">
            {search ? "No members match your search" : "No members yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m: Member) => {
            const completion =
              m.stats?.totalTasks > 0
                ? Math.round(
                    (m.stats.completedTasks / m.stats.totalTasks) * 100
                  )
                : 0;

            return (
              <Card
                key={m.id}
                className="group border shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0">
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
                        <p className="text-sm font-semibold truncate">
                          {m.user?.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {m.user?.email}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Assign task</DropdownMenuItem>
                        <DropdownMenuItem>View tasks</DropdownMenuItem>
                        {canManageMembers && m.role !== "OWNER" && m.userId !== currentUserId && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => removeMember.mutate({ workspaceId, memberId: m.id })}
                          >
                            Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Role badge */}
                  <Badge
                    className={`text-[10px] px-2 py-0 border-0 font-medium ${
                      ROLE_BADGE[m.role] ?? ROLE_BADGE.VIEWER
                    }`}
                  >
                    {m.role}
                  </Badge>

                  {/* Progress bar */}
                  {m.stats?.totalTasks > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>
                          {m.stats.completedTasks}/{m.stats.totalTasks} tasks
                        </span>
                        <span>{completion}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <StatCell label="Tasks" value={m.stats?.totalTasks ?? 0} />
                    <StatCell
                      label="Done"
                      value={m.stats?.completedTasks ?? 0}
                      valueClass="text-green-600 dark:text-green-400"
                    />
                    <StatCell
                      label="Overdue"
                      value={m.stats?.overdueTasks ?? 0}
                      valueClass={
                        (m.stats?.overdueTasks ?? 0) > 0
                          ? "text-red-500"
                          : undefined
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <InvitePage onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
      {isModalJoinOpen && (
        <Modal
          isOpen={isModalJoinOpen}
          onClose={() => setIsModalJoinOpen(false)}
        >
          <JoinPage onClose={() => setIsModalJoinOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCell({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="text-center rounded-md bg-muted/50 py-1.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-bold ${valueClass ?? ""}`}>{value}</p>
    </div>
  );
}
