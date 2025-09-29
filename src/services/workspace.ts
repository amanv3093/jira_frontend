import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const WORKSPACE_API = {
  GET: "workspace",
  GET_BY_ID: (id: string) => `workspace/${id}`,
  POST: "workspace",

} as const;

export const workspaceService = {
  getAllWorkspace: () => fetchHandler<ApiResponse>(WORKSPACE_API.GET, "GET"),
  getWorkspaceById: (id:string) => fetchHandler<ApiResponse>(WORKSPACE_API.GET_BY_ID(id), "GET"),
  createWorkspace: (payload: any) =>
      fetchHandler<ApiResponse>(WORKSPACE_API.POST, "POST", payload),
};
