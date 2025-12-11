import { fetchHandler, fetchHandlerWithFormData } from "@/lib/api-utils";
import { ApiResponse } from "@/types";


const WORKSPACE_API = {
  GET: "workspace",
  GET_BY_ID: (id: string) => `workspace/${id}`,
  POST: "workspace",
} as const;

export const workspaceService = {
  getAllWorkspace: () => fetchHandler<ApiResponse>(WORKSPACE_API.GET, "GET"),
  getWorkspaceById: (id: string) =>
    fetchHandler<ApiResponse>(WORKSPACE_API.GET_BY_ID(id), "GET"),
  createWorkspace: (formData: FormData) =>
    fetchHandlerWithFormData<ApiResponse>(WORKSPACE_API.POST, "POST", formData),

};
