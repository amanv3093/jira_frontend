import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, Project } from "@/types";

const PROJECT_API = {
  POST: "project",
  GET: "project",
  GET_BY_ID: (id: string) => `project/${id}`,
  GET_BY_WORKSPACE_ID: (id: string) => `project/workspace/${id}`,
} as const;

export const projectService = {
  createProject: (payload: FormData) =>
    fetchHandler<ApiResponse<Project>>(PROJECT_API.POST, "POST", payload),
  getAllProject: () => fetchHandler<ApiResponse>(PROJECT_API.GET, "GET"),
  getProjectById: (id: string) =>
    fetchHandler<ApiResponse>(PROJECT_API.GET_BY_ID(id), "GET"),
  getProjectByWorkspaceId: (id: string) =>
    fetchHandler<ApiResponse>(PROJECT_API.GET_BY_WORKSPACE_ID(id), "GET"),
};
