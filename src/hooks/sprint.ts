import { sprintService } from "@/services/sprint";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetSprintsByWorkspaceId = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["getSprintsByWorkspaceId", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await sprintService.getSprintsByWorkspaceId(workspaceId);
      return response.data;
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: false,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};

export const useGetSprintsByProjectId = (projectId?: string) => {
  return useQuery({
    queryKey: ["getSprintsByProjectId", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const response = await sprintService.getSprintsByProjectId(projectId);
      return response.data;
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};

export const useGetSprintById = (id?: string) => {
  return useQuery({
    queryKey: ["getSprintById", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await sprintService.getSprintById(id);
      return response.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sprintService.createSprint,
    onSuccess: () => {
      toast.success("Sprint created successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create sprint";
      toast.error(message);
    },
  });
};

export const useUpdateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      return await sprintService.updateSprint(id, payload);
    },
    onSuccess: () => {
      toast.success("Sprint updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintById"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update sprint";
      toast.error(message);
    },
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await sprintService.deleteSprint(id);
    },
    onSuccess: () => {
      toast.success("Sprint deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintById"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete sprint";
      toast.error(message);
    },
  });
};

export const useAddTasksToSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sprintId,
      taskIds,
    }: {
      sprintId: string;
      taskIds: string[];
    }) => {
      return await sprintService.addTasks(sprintId, { taskIds });
    },
    onSuccess: () => {
      toast.success("Tasks added to sprint successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintById"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByProjectId"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add tasks to sprint";
      toast.error(message);
    },
  });
};

export const useRemoveTaskFromSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sprintId,
      taskIds,
    }: {
      sprintId: string;
      taskIds: string[];
    }) => {
      return await sprintService.removeTasks(sprintId, { taskIds });
    },
    onSuccess: () => {
      toast.success("Task removed from sprint successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintById"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByProjectId"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove task from sprint";
      toast.error(message);
    },
  });
};

export const useStartSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await sprintService.startSprint(id);
    },
    onSuccess: () => {
      toast.success("Sprint started successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintById"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to start sprint";
      toast.error(message);
    },
  });
};

export const useCompleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await sprintService.completeSprint(id);
    },
    onSuccess: () => {
      toast.success("Sprint completed successfully");
      queryClient.invalidateQueries({ queryKey: ["getSprintsByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintsByProjectId"] });
      queryClient.invalidateQueries({ queryKey: ["getSprintById"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByWorkspaceId"] });
      queryClient.invalidateQueries({ queryKey: ["getAllTaskByProjectId"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to complete sprint";
      toast.error(message);
    },
  });
};
