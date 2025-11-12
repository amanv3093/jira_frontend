import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types";

const TASK_API = {
  GET: "task",
  GET_BY_ID: (id: string) => `task/${id}`,
  POST: "task",
  GET_BY_WORKSPACE_ID: (id: string) => `task/workspace/${id}`,
  GET_BY_PROJECT_ID: (id: string) => `task/project/${id}`,
  EDIT_TASK: (id: string) => `task/${id}`,
} as const;

export const taskService = {
  getAllTask: () => fetchHandler<ApiResponse>(TASK_API.GET, "GET"),
  getTaskById: (id: string) =>
    fetchHandler<ApiResponse>(TASK_API.GET_BY_ID(id), "GET"),
  createTask: (payload: any) =>
    fetchHandler<ApiResponse>(TASK_API.POST, "POST", payload),
  updateTask: (id: string, payload: any) =>
  fetchHandler<ApiResponse>(TASK_API.EDIT_TASK(id), "PUT", payload),

  getTaskByWorkspaceId: (id: string, filters?: Record<string, any>) => {
    let url = TASK_API.GET_BY_WORKSPACE_ID(id);
    if (filters && Object.keys(filters).length > 0) {
      const params = new URLSearchParams();

      if (filters.status?.length)
        params.append("status", filters.status.join(","));
      if (filters.priority?.length)
        params.append("priority", filters.priority.join(","));
      if (filters.project?.length)
        params.append("project", filters.project.join(","));
      if (filters.assignee?.length)
        params.append("assignee", filters.assignee.join(","));
      if (filters.search) params.append("search", filters.search);

      url += `?${params.toString()}`;
    }

    return fetchHandler<ApiResponse>(url, "GET");
  },
   getTaskByProjectId: (id: string, filters?: Record<string, any>) => {
    let url = TASK_API.GET_BY_PROJECT_ID(id);
    if (filters && Object.keys(filters).length > 0) {
      const params = new URLSearchParams();

      if (filters.status?.length)
        params.append("status", filters.status.join(","));
      if (filters.priority?.length)
        params.append("priority", filters.priority.join(","));
      if (filters.project?.length)
        params.append("project", filters.project.join(","));
      if (filters.assignee?.length)
        params.append("assignee", filters.assignee.join(","));
      if (filters.search) params.append("search", filters.search);

      url += `?${params.toString()}`;
    }

    return fetchHandler<ApiResponse>(url, "GET");
  },
};
