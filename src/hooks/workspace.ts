import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";

import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
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
    mutationFn: workspaceService.createWorkspace,
    onSuccess: (data) => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllWorkspace2"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to create project";
      toast.error(message);
    },
  });
};
