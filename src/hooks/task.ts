import { taskService } from "@/services/task";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

// export const useGetAllWorkspace = () => {
//   return useQuery({
//     queryKey: ["getAllWorkspace"],
//     queryFn: async () => {
//       const response = await workspaceService.getAllWorkspace();
//       return response.data;
//     },
//     enabled: true,
//     refetchOnWindowFocus: false,
//     staleTime: 0,
//     placeholderData: keepPreviousData,
//   });
// };
// export const useGetWorkspaceById = (id: string) => {
//   return useQuery({
//     queryKey: ["getWorkspaceById", id],
//     queryFn: async () => {
//       const response = await workspaceService.getWorkspaceById(id);
//       return response.data;
//     },
//     enabled: !!id,
//   });
// };

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (data) => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByWorkspaceId"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to create Task";
      toast.error(message);
    },
  });
};
export const useGetTaskByWorkspaceId = (id?: string, filters?: any) => {
  return useQuery({
    queryKey: ["getAllTaskByWorkspaceId", id,filters],
    queryFn: async () => {
      if (!id) return [];
      const response = await taskService.getTaskByWorkspaceId(id,filters);
      return response.data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    placeholderData: keepPreviousData,
    
  });
};

export const useGetTaskByProjectId = (id?: string, filters?: any) => {
  return useQuery({
    queryKey: ["getAllTaskByWorkspaceId", id,filters],
    queryFn: async () => {
      if (!id) return [];
      const response = await taskService.getTaskByProjectId(id,filters);
      return response.data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    placeholderData: keepPreviousData,
    
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      return await taskService.updateTask(id, payload);
    },
    onSuccess: (data) => {
      toast.success("Task updated successfully");
      // Invalidate cached task data so UI refreshes
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByProjectId"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to update Task";
      toast.error(message);
    },
  });
};
