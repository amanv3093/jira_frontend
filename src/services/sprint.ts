import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types";

const SPRINT_API = {
  POST: "sprint",
  GET_BY_PROJECT_ID: (id: string) => `sprint/project/${id}`,
  GET_BY_WORKSPACE_ID: (id: string) => `sprint/workspace/${id}`,
  GET_BY_ID: (id: string) => `sprint/detail/${id}`,
  UPDATE: (id: string) => `sprint/${id}`,
  DELETE: (id: string) => `sprint/${id}`,
  ADD_TASKS: (id: string) => `sprint/${id}/tasks`,
  REMOVE_TASKS: (id: string) => `sprint/${id}/tasks/remove`,
  START: (id: string) => `sprint/${id}/start`,
  COMPLETE: (id: string) => `sprint/${id}/complete`,
} as const;

export const sprintService = {
  createSprint: (payload: any) =>
    fetchHandler<ApiResponse>(SPRINT_API.POST, "POST", payload),
  getSprintsByProjectId: (id: string) =>
    fetchHandler<ApiResponse>(SPRINT_API.GET_BY_PROJECT_ID(id), "GET"),
  getSprintsByWorkspaceId: (id: string) =>
    fetchHandler<ApiResponse>(SPRINT_API.GET_BY_WORKSPACE_ID(id), "GET"),
  getSprintById: (id: string) =>
    fetchHandler<ApiResponse>(SPRINT_API.GET_BY_ID(id), "GET"),
  updateSprint: (id: string, payload: any) =>
    fetchHandler<ApiResponse>(SPRINT_API.UPDATE(id), "PUT", payload),
  deleteSprint: (id: string) =>
    fetchHandler<ApiResponse>(SPRINT_API.DELETE(id), "DELETE"),
  addTasks: (id: string, payload: { taskIds: string[] }) =>
    fetchHandler<ApiResponse>(SPRINT_API.ADD_TASKS(id), "PUT", payload),
  removeTasks: (id: string, payload: { taskIds: string[] }) =>
    fetchHandler<ApiResponse>(SPRINT_API.REMOVE_TASKS(id), "PUT", payload),
  startSprint: (id: string) =>
    fetchHandler<ApiResponse>(SPRINT_API.START(id), "PUT"),
  completeSprint: (id: string) =>
    fetchHandler<ApiResponse>(SPRINT_API.COMPLETE(id), "PUT"),
};
