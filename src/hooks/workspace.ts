import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { workspaceService } from "@/services/workspace";
import { toast } from "sonner";

export const useGetAllWorkspace = () => {
  return useQuery({
    queryKey: ["getAllWorkspace"],
    queryFn: async () => {
      const response = await workspaceService.getAllWorkspace();
      return response.data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
export const useGetWorkspaceById = (id: string) => {
  return useQuery({
    queryKey: ["getWorkspaceById", id],
    queryFn: async () => {
      const response = await workspaceService.getWorkspaceById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await workspaceService.createWorkspace(formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllWorkspace"] });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to create project";
      toast.error(message);
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await workspaceService.updateWorkspace(id, formData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getWorkspaceById", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["getAllWorkspace"] });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update workspace";
      toast.error(message);
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await workspaceService.deleteWorkspace(id);
      return response;
    },
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllWorkspace"] });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete workspace";
      toast.error(message);
    },
  });
};
