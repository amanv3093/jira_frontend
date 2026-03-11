import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { DashboardData } from "@/types";

export const useGetDashboard = (workspaceId?: string) => {
  return useQuery<DashboardData>({
    queryKey: ["getDashboard", workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const response = await dashboardService.getDashboardByWorkspaceId(workspaceId);
      return response.data as DashboardData;
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2,
  });
};
