import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types";

const DASHBOARD_API = {
  GET_BY_WORKSPACE_ID: (id: string) => `dashboard/${id}`,
} as const;

export const dashboardService = {
  getDashboardByWorkspaceId: (id: string) =>
    fetchHandler<ApiResponse>(DASHBOARD_API.GET_BY_WORKSPACE_ID(id), "GET"),
};
