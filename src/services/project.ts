import { fetchHandler, fetchHandlerWithFormData } from "@/lib/api-utils";
import { ApiResponse } from "@/types";


const PROJECT_API = {
  POST: "project",
  GET: "project",
  GET_BY_ID: (id: string) => `project/${id}`,
  GET_BY_WORKSPACE_ID: (id: string) => `project/workspace/${id}`,
} as const;

export const projectService = {
  createProject: (formData: FormData) =>
    fetchHandlerWithFormData<ApiResponse>(PROJECT_API.POST, "POST", formData),
  getAllProject: () => fetchHandler<ApiResponse>(PROJECT_API.GET, "GET"),
  getProjectById: (id: string) =>
    fetchHandler<ApiResponse>(PROJECT_API.GET_BY_ID(id), "GET"),
  getProjectByWorkspaceId: (id: string) =>
    fetchHandler<ApiResponse>(PROJECT_API.GET_BY_WORKSPACE_ID(id), "GET"),
};
