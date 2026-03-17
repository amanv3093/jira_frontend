"use client";

import React, { useEffect, useState } from "react";
import { Task, TaskStatus, TaskPriority, Member, Project } from "@/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useUpdateTask, useCreateTask, useDeleteTask } from "@/hooks/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  AlertTriangle,
  Clock,
  CircleDot,
  CheckCircle2,
  Circle,
  CircleDashed,
  GripVertical,
  Folder,
  Plus,
  X,
  Loader2,
  UserPlus,
  Check,
  Trash2,
} from "lucide-react";
import AssigneeEditor from "./assignee-editor";

interface TaskKanbanProps {
  data: Task[];
  onPersist?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  projects?: Project[];
  members?: Member[];
}

const STATUS_CONFIG = [
  {
    key: "BACKLOG",
    label: "Backlog",
    icon: CircleDashed,
    color: "text-slate-400",
    accent: "border-t-slate-400",
    dropBg: "bg-slate-50 dark:bg-slate-900/30",
  },
  {
    key: "TODO",
    label: "To Do",
    icon: Circle,
    color: "text-blue-500",
    accent: "border-t-blue-500",
    dropBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    icon: Clock,
    color: "text-amber-500",
    accent: "border-t-amber-500",
    dropBg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    key: "IN_REVIEW",
    label: "In Review",
    icon: CircleDot,
    color: "text-violet-500",
    accent: "border-t-violet-500",
    dropBg: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    key: "DONE",
    label: "Done",
    icon: CheckCircle2,
    color: "text-green-500",
    accent: "border-t-green-500",
    dropBg: "bg-green-50 dark:bg-green-900/20",
  },
];

const PRIORITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  CRITICAL: {
    label: "Critical",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
    dot: "bg-red-500",
  },
  HIGH: {
    label: "High",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
    dot: "bg-orange-500",
  },
  MEDIUM: {
    label: "Medium",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950",
    dot: "bg-yellow-500",
  },
  LOW: {
    label: "Low",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
    dot: "bg-green-500",
  },
};

type Column = {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  accent: string;
  dropBg: string;
  tasks: Task[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isOverdue(dueDate?: string | null, status?: string) {
  if (!dueDate || status === "DONE") return false;
  return new Date(dueDate) < new Date();
}

function formatDueDate(dueDate?: string | null) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays <= 7) return `${diffDays}d left`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function deduplicateAssignees(assignees: any[]) {
  const seen = new Set<string>();
  return assignees.filter((a) => {
    const user = a.member?.user || a.user;
    const key = a.userId || user?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function TaskKanban({
  data,
  onPersist,
  projects,
  members,
}: TaskKanbanProps) {
  const { mutate: updateTask } = useUpdateTask();

  const [columns, setColumns] = useState<Column[]>(
    STATUS_CONFIG.map((s) => ({ ...s, tasks: [] }))
  );

  useEffect(() => {
    const grouped = STATUS_CONFIG.map((status) => ({
      ...status,
      tasks: data.filter((t) => t.status === status.key),
    }));
    setColumns(grouped);
  }, [data]);

  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    sourceList: Task[],
    destList: Task[],
    source: any,
    destination: any
  ) => {
    const sourceClone = Array.from(sourceList);
    const destClone = Array.from(destList);
    const [moved] = sourceClone.splice(source.index, 1);
    destClone.splice(destination.index, 0, moved);
    return { source: sourceClone, destination: destClone, moved };
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColIdx = columns.findIndex(
      (c) => c.key === source.droppableId
    );
    const destColIdx = columns.findIndex(
      (c) => c.key === destination.droppableId
    );
    if (sourceColIdx < 0 || destColIdx < 0) return;

    if (source.droppableId === destination.droppableId) {
      const newTasks = reorder(
        columns[sourceColIdx].tasks,
        source.index,
        destination.index
      );
      const newCols = [...columns];
      newCols[sourceColIdx] = { ...columns[sourceColIdx], tasks: newTasks };
      setColumns(newCols);
      return;
    }

    const {
      source: newSourceTasks,
      destination: newDestTasks,
      moved,
    } = move(
      columns[sourceColIdx].tasks,
      columns[destColIdx].tasks,
      source,
      destination
    );

    const newCols = [...columns];
    newCols[sourceColIdx] = { ...columns[sourceColIdx], tasks: newSourceTasks };
    newCols[destColIdx] = { ...columns[destColIdx], tasks: newDestTasks };

    const movedWithStatus = {
      ...moved,
      status: newCols[destColIdx].key as TaskStatus,
    };
    newCols[destColIdx].tasks[destination.index] = movedWithStatus;
    setColumns(newCols);

    try {
      if (onPersist) {
        await onPersist(moved.id, {
          status: newCols[destColIdx].key as TaskStatus,
        });
      } else {
        updateTask({
          id: moved.id,
          payload: { status: newCols[destColIdx].key },
        });
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      setColumns(columns);
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto py-4 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => {
          const StatusIcon = col.icon;
          return (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[280px] max-w-[320px] rounded-xl border border-border bg-muted/30 flex flex-col border-t-[3px] ${col.accent} transition-colors ${
                    snapshot.isDraggingOver ? col.dropBg : ""
                  }`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${col.color}`} />
                      <h3 className="text-sm font-semibold text-foreground">
                        {col.label}
                      </h3>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        col.tasks.length > 0
                          ? "bg-foreground/10 text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {col.tasks.length}
                    </span>
                  </div>

                  {/* Task cards */}
                  <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-240px)] px-2 pb-2 scrollbar-thin">
                    {col.tasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <CircleDashed className="h-8 w-8 mb-2 opacity-30" />
                        <p className="text-xs">No tasks</p>
                      </div>
                    )}

                    {col.tasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        columnColor={col.color}
                        updateTask={updateTask}
                      />
                    ))}
                    {provided.placeholder}
                  </div>

                  {/* Inline task creation */}
                  <InlineTaskCreate
                    status={col.key as TaskStatus}
                    projects={projects}
                    members={members}
                  />
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
}

/* ─── Task Card Component ─── */

function TaskCard({
  task,
  index,
  columnColor,
  updateTask,
}: {
  task: Task;
  index: number;
  columnColor: string;
  updateTask: any;
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(task.task_name);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTask = useDeleteTask();

  const handleSave = () => {
    if (newName.trim() && newName !== task.task_name) {
      updateTask({ id: task.id, payload: { task_name: newName } });
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setNewName(task.task_name);
      setEditing(false);
    }
  };

  const handlePriorityChange = (newPriority: string) => {
    updateTask({ id: task.id, payload: { priority: newPriority } });
    setPriorityOpen(false);
  };

  const handleDueDateChange = (newDate: string) => {
    updateTask({
      id: task.id,
      payload: { dueDate: new Date(newDate).toISOString() },
    });
    setDueDateOpen(false);
  };

  const priority = task.priority
    ? PRIORITY_CONFIG[task.priority]
    : PRIORITY_CONFIG.MEDIUM;
  const overdue = isOverdue(task.dueDate, task.status);
  const dueDateText = formatDueDate(task.dueDate);
  const rawAssignees = (task as any).assignments ?? [];
  const assignees = deduplicateAssignees(rawAssignees);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          className={`group rounded-lg border bg-background shadow-sm transition-all hover:shadow-md ${
            dragSnapshot.isDragging
              ? "shadow-lg ring-2 ring-primary/20 rotate-[2deg]"
              : ""
          }`}
        >
          <div className="p-3 space-y-2.5">
            {/* Drag handle + task name + delete row */}
            <div className="flex items-start gap-2">
              <div
                {...dragProvided.dragHandleProps}
                className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <textarea
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full text-sm font-medium border border-border rounded-md p-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    rows={2}
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm font-medium text-foreground leading-snug cursor-pointer hover:text-primary transition-colors line-clamp-2"
                    onDoubleClick={() => setEditing(true)}
                    title="Double-click to edit"
                  >
                    {task.task_name}
                  </p>
                )}
              </div>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950"
                  title="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                </button>
              ) : (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      deleteTask.mutate(task.id, {
                        onSuccess: () => setConfirmDelete(false),
                      });
                    }}
                    disabled={deleteTask.isPending}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    {deleteTask.isPending ? "..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="p-0.5 rounded hover:bg-muted"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Project name */}
            {task.project?.name && (
              <div className="flex items-center gap-1.5 ml-6">
                <Folder className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground truncate">
                  {task.project.name}
                </span>
              </div>
            )}

            {/* Priority + Due date row (inline editable) */}
            <div className="flex items-center gap-2 flex-wrap ml-6">
              {/* Inline Priority Editor */}
              <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all ${priority.bg} ${priority.color}`}
                    title="Click to change priority"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                    />
                    {priority.label}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-32 p-1"
                  align="start"
                  sideOffset={4}
                >
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handlePriorityChange(key)}
                      className={`w-full flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-muted transition-colors ${
                        task.priority === key ? "bg-muted font-semibold" : ""
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${config.dot}`}
                      />
                      <span className={config.color}>{config.label}</span>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Inline Due Date Editor */}
              <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all ${
                      overdue
                        ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                    title="Click to change due date"
                  >
                    {overdue ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Calendar className="h-3 w-3" />
                    )}
                    {dueDateText || "Set date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-3"
                  align="start"
                  sideOffset={4}
                >
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Due Date
                    </p>
                    <input
                      type="datetime-local"
                      defaultValue={
                        task.dueDate
                          ? new Date(task.dueDate).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value) {
                          handleDueDateChange(e.target.value);
                        }
                      }}
                      className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Footer: assignees */}
            <div className="flex items-center justify-between ml-6 pt-1 border-t border-border/50">
              <AssigneeEditor
                taskId={task.id}
                assignments={rawAssignees}
              >
                {assignees.length > 0 ? (
                  <div className="flex -space-x-1.5">
                    {assignees.slice(0, 3).map((a: any, i: number) => {
                      const user = a.member?.user || a.user;
                      const name = user?.full_name || "U";
                      return (
                        <Avatar
                          key={a.userId || a.id || i}
                          className="h-6 w-6 border-2 border-background"
                        >
                          {user?.avatarUrl ? (
                            <AvatarImage src={user.avatarUrl} alt={name} />
                          ) : null}
                          <AvatarFallback className="text-[9px] font-semibold bg-muted">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {assignees.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-[9px] font-semibold text-muted-foreground">
                          +{assignees.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <UserPlus className="h-3 w-3" />
                    Assign
                  </span>
                )}
              </AssigneeEditor>

              {task.id && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  #{task.id.slice(-4)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

/* ─── Inline Task Create Component ─── */

function InlineTaskCreate({
  status,
  projects,
  members,
}: {
  status: TaskStatus;
  projects?: Project[];
  members?: Member[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const { mutate: createTask, isPending } = useCreateTask();

  // Auto-select first project
  const autoProjectId = projects?.[0]?.id || "";

  // Deduplicate members by userId
  const uniqueMembers = members
    ? (() => {
        const seen = new Set<string>();
        return members.filter((m) => {
          if (seen.has(m.userId)) return false;
          seen.add(m.userId);
          return true;
        });
      })()
    : [];

  const toggleAssignee = (userId: string) => {
    setAssigneeIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("MEDIUM");
    setDueDate("");
    setAssigneeIds([]);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!taskName.trim() || !autoProjectId) return;

    const payload: any = {
      task_name: taskName.trim(),
      status,
      priority,
      dueDate: dueDate
        ? new Date(dueDate).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      projectId: autoProjectId,
      assignments: assigneeIds.map((id) => ({
        userId: id,
        assignedAt: new Date().toISOString(),
      })),
    };

    createTask(payload, { onSuccess: resetForm });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      resetForm();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 mx-2 mb-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Add task
      </button>
    );
  }

  return (
    <div className="mx-2 mb-2 p-2.5 rounded-lg border border-border bg-background shadow-sm space-y-2">
      <input
        autoFocus
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task name..."
        className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <div className="flex items-center gap-1.5">
        <Select onValueChange={setPriority} value={priority}>
          <SelectTrigger className="h-7 text-[11px] flex-1">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
              <SelectItem key={p} value={p} className="text-xs">
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-7 flex-1 text-[11px] border border-border rounded-md px-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="border border-border rounded-md max-h-28 overflow-y-auto">
        {uniqueMembers.length > 0 ? (
          uniqueMembers.map((m) => {
            const isSelected = assigneeIds.includes(m.userId);
            return (
              <button
                type="button"
                key={m.userId}
                onClick={() => toggleAssignee(m.userId)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs transition-colors ${
                  isSelected ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium overflow-hidden">
                  {m.user?.avatarUrl ? (
                    <img
                      src={m.user.avatarUrl}
                      alt={m.user.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    m.user?.full_name?.charAt(0)?.toUpperCase() || "?"
                  )}
                </div>
                <span className="flex-1 truncate">{m.user?.full_name}</span>
                {isSelected && (
                  <Check className="h-3 w-3 text-primary flex-shrink-0" />
                )}
              </button>
            );
          })
        ) : (
          <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
            No members available
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleSubmit}
          disabled={!taskName.trim() || !autoProjectId || isPending}
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium px-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Add"
          )}
        </button>
        <button
          onClick={() => {
            resetForm();
          }}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
