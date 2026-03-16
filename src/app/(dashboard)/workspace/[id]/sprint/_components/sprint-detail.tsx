"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal/custom-modal";
import {
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { Task, TaskStatus, TaskPriority, Sprint } from "@/types";
import {
  useGetSprintById,
  useAddTasksToSprint,
  useRemoveTaskFromSprint,
} from "@/hooks/sprint";
import { useGetTaskByProjectId } from "@/hooks/task";
import Loader from "@/app/Loader";

interface SprintDetailProps {
  sprintId: string;
  projectId: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <Circle size={14} className="text-muted-foreground" />,
  [TaskStatus.TODO]: <Circle size={14} className="text-blue-500" />,
  [TaskStatus.IN_PROGRESS]: <Clock size={14} className="text-yellow-500" />,
  [TaskStatus.IN_REVIEW]: (
    <AlertCircle size={14} className="text-purple-500" />
  ),
  [TaskStatus.DONE]: <CheckCircle2 size={14} className="text-green-500" />,
};

const priorityClasses: Record<string, string> = {
  [TaskPriority.LOW]:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  [TaskPriority.MEDIUM]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  [TaskPriority.HIGH]:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  [TaskPriority.CRITICAL]:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function SprintDetail({ sprintId, projectId }: SprintDetailProps) {
  const [isAddTasksModalOpen, setIsAddTasksModalOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sprintData, isLoading: sprintLoading } =
    useGetSprintById(sprintId);
  const { data: projectTasks, isLoading: tasksLoading } =
    useGetTaskByProjectId(projectId);

  const addTasks = useAddTasksToSprint();
  const removeTask = useRemoveTaskFromSprint();

  const sprint: Sprint | null = sprintData || null;
  const sprintTasks: Task[] = sprint?.tasks || [];

  // Filter tasks that are not already in a sprint (available to add)
  const availableTasks = useMemo(() => {
    const allTasks: Task[] = projectTasks || [];
    const sprintTaskIds = new Set(sprintTasks.map((t) => t.id));
    const filtered = allTasks.filter((t) => !sprintTaskIds.has(t.id));
    if (!searchQuery) return filtered;
    return filtered.filter((t) =>
      t.task_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projectTasks, sprintTasks, searchQuery]);

  const handleAddTasks = () => {
    if (selectedTaskIds.length === 0) return;
    addTasks.mutate(
      { sprintId, taskIds: selectedTaskIds },
      {
        onSuccess: () => {
          setSelectedTaskIds([]);
          setIsAddTasksModalOpen(false);
          setSearchQuery("");
        },
      }
    );
  };

  const handleRemoveTask = (taskId: string) => {
    removeTask.mutate({ sprintId, taskIds: [taskId] });
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  if (sprintLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size={30} />
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Sprint not found.
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Sprint Tasks Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          Tasks ({sprintTasks.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => {
            setIsAddTasksModalOpen(true);
            setSelectedTaskIds([]);
            setSearchQuery("");
          }}
        >
          <Plus size={12} className="mr-1" />
          Add Tasks
        </Button>
      </div>

      {/* Sprint description */}
      {sprint.description && (
        <p className="text-xs text-muted-foreground mb-3">
          {sprint.description}
        </p>
      )}

      {/* Task List */}
      {sprintTasks.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No tasks in this sprint. Add tasks to get started.
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Task
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Priority
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Assignee
                </th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sprintTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-2">
                    <span className="font-medium">{task.task_name}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {statusIcons[task.status] || (
                        <Circle size={14} className="text-muted-foreground" />
                      )}
                      <span className="text-xs">
                        {task.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {task.priority && (
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                          priorityClasses[task.priority] || ""
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {task.assignments && task.assignments.length > 0
                      ? task.assignments
                          .map((a) => a.userId)
                          .join(", ")
                      : "Unassigned"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveTask(task.id)}
                      disabled={removeTask.isPending}
                    >
                      <X size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Tasks Modal */}
      {isAddTasksModalOpen && (
        <Modal
          isOpen={isAddTasksModalOpen}
          onClose={() => {
            setIsAddTasksModalOpen(false);
            setSelectedTaskIds([]);
            setSearchQuery("");
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Tasks to Sprint</h2>
              <button
                onClick={() => {
                  setIsAddTasksModalOpen(false);
                  setSelectedTaskIds([]);
                  setSearchQuery("");
                }}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Task Selection List */}
            <div className="max-h-[300px] overflow-y-auto border border-border rounded-md">
              {tasksLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Loader size={24} />
                </div>
              ) : availableTasks.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No available tasks to add.
                </div>
              ) : (
                availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedTaskIds.includes(task.id) ? "bg-muted/70" : ""
                    }`}
                    onClick={() => toggleTaskSelection(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleTaskSelection(task.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-border cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.task_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {task.status.replace(/_/g, " ")}
                        </span>
                        {task.priority && (
                          <span
                            className={`inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium ${
                              priorityClasses[task.priority] || ""
                            }`}
                          >
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Selected count and submit */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedTaskIds.length} task
                {selectedTaskIds.length !== 1 ? "s" : ""} selected
              </span>
              <Button
                onClick={handleAddTasks}
                disabled={selectedTaskIds.length === 0 || addTasks.isPending}
                size="sm"
              >
                {addTasks.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={14} className="mr-1" />
                    Add Selected Tasks
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SprintDetail;
