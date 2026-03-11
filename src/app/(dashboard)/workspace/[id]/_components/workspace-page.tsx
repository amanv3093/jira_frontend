"use client";

import { useParams } from "next/navigation";
import { useGetDashboard } from "@/hooks/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Users,
  TrendingUp,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DashboardProject } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  BACKLOG: "#94a3b8",
  TODO: "#60a5fa",
  "IN PROGRESS": "#f59e0b",
  "IN REVIEW": "#a78bfa",
  DONE: "#22c55e",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  BACKLOG: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  TODO: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  IN_PROGRESS:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  IN_REVIEW:
    "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  LOW: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  MEDIUM:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "No date";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const params = useParams();
  const workspaceId = params?.id as string;
  const { data, isLoading, isError } = useGetDashboard(workspaceId);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
          <p className="text-muted-foreground mt-1">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const {
    projectStats,
    projects,
    taskStats,
    taskStatusChart,
    taskPriorityChart,
    recentTasks,
    memberStats,
  } = data;

  const statsCards = [
    {
      label: "Total Projects",
      value: projectStats.total,
      icon: FolderKanban,
      color: "bg-blue-500",
      lightBg: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Completed",
      value: projectStats.completed,
      icon: CheckCircle2,
      color: "bg-green-500",
      lightBg: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "In Progress",
      value: projectStats.inProgress,
      icon: Clock,
      color: "bg-amber-500",
      lightBg: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Pending",
      value: projectStats.pending,
      icon: ListTodo,
      color: "bg-slate-500",
      lightBg: "bg-slate-50 dark:bg-slate-950",
      textColor: "text-slate-600 dark:text-slate-400",
    },
  ];

  const taskOverviewCards = [
    {
      label: "Total Tasks",
      value: taskStats.total,
      icon: ListTodo,
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Completed",
      value: taskStats.completed,
      icon: CheckCircle2,
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Overdue",
      value: taskStats.overdue,
      icon: AlertTriangle,
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "Completion",
      value: `${taskStats.completionPercentage}%`,
      icon: TrendingUp,
      textColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Plan, prioritize, and accomplish your tasks with ease.
        </p>
      </div>

      {/* Project Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.label} className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {card.label}
                  </p>
                  <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.lightBg}`}>
                  <card.icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Cards */}
      {projects && projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Projects</h2>
            <span className="text-xs text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Task Overview Row */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {taskOverviewCards.map((card) => (
              <div
                key={card.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <card.icon className={`h-5 w-5 ${card.textColor}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Progress Bar */}
          {taskStats.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Overall Progress</span>
                <span>{taskStats.completionPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${taskStats.completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Status Bar Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Tasks by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskStats.total > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={taskStatusChart}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                    {taskStatusChart.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No tasks yet" />
            )}
          </CardContent>
        </Card>

        {/* Task Priority Pie Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Tasks by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskStats.total > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={taskPriorityChart.filter((d) => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="priority"
                    stroke="none"
                  >
                    {taskPriorityChart
                      .filter((d) => d.count > 0)
                      .map((entry) => (
                        <Cell
                          key={entry.priority}
                          fill={PRIORITY_COLORS[entry.priority] || "#94a3b8"}
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No tasks yet" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks & Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {task.task_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`text-[10px] px-1.5 py-0 border-0 ${
                            STATUS_BADGE_CLASSES[task.status] || ""
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                        <Badge
                          className={`text-[10px] px-1.5 py-0 border-0 ${
                            PRIORITY_BADGE_CLASSES[task.priority] || ""
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.project.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      {task.assignees.length > 0 && (
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 3).map((a) => (
                            <Avatar
                              key={a.id}
                              className="h-7 w-7 border-2 border-background"
                            >
                              {a.avatarUrl ? (
                                <AvatarImage src={a.avatarUrl} alt={a.name} />
                              ) : null}
                              <AvatarFallback className="text-[10px] font-semibold">
                                {getInitials(a.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                              +{task.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No tasks created yet" />
            )}
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Team Members
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {memberStats.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {memberStats.length > 0 ? (
              <div className="space-y-3">
                {memberStats.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Avatar className="h-9 w-9">
                      {member.avatarUrl ? (
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      ) : null}
                      <AvatarFallback className="text-xs font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium">
                        {member.stats.completedTasks}/{member.stats.totalTasks}
                      </p>
                      <p className="text-[10px] text-muted-foreground">tasks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No team members" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const PROJECT_STATUS_CONFIG = {
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

function ProjectCard({
  project,
  workspaceId,
}: {
  project: DashboardProject;
  workspaceId: string;
}) {
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const { total, completed, completionPercentage, overdue } = project.taskStats;

  return (
    <Link href={`/workspace/${workspaceId}/project/${project.id}`}>
      <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {project.profilePic ? (
                <Image
                  src={project.profilePic}
                  alt={project.name}
                  width={36}
                  height={36}
                  className="rounded-lg object-cover h-9 w-9 shrink-0"
                />
              ) : (
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {project.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            <Badge className={`text-[10px] px-1.5 py-0 border-0 shrink-0 ${statusConfig.className}`}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>
                {completed}/{total} tasks
              </span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Members */}
              {project.members.length > 0 && (
                <div className="flex -space-x-1.5">
                  {project.members.slice(0, 4).map((m) =>
                    m.avatarUrl ? (
                      <Image
                        key={m.id}
                        src={m.avatarUrl}
                        alt={m.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full border-2 border-background object-cover"
                      />
                    ) : (
                      <div
                        key={m.id}
                        className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-semibold border-2 border-background"
                      >
                        {getInitials(m.name)}
                      </div>
                    )
                  )}
                  {project.members.length > 4 && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium border-2 border-background">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Overdue indicator */}
              {overdue > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-red-500 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  {overdue} overdue
                </span>
              )}
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
