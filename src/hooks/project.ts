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
import { projectService } from "@/services/project";
import { toast } from "sonner";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: (data) => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllProject"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to create project";
      toast.error(message);
    },
  });
};

export const useGetAllProject = () => {
  return useQuery({
    queryKey: ["getAllProject"],
    queryFn: async () => {
      const response = await projectService.getAllProject();
      return response.data;
    },
  });
};

export const useGetProjectById = (id: string) => {
  return useQuery({
    queryKey: ["getProjectById", id],
    queryFn: async () => {
      const response = await projectService.getProjectById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetProjectByWorkspaceId = (id?: string) => {
  return useQuery({
    queryKey: ["getProjectByWorkspaceId", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await projectService.getProjectByWorkspaceId(id);
      return response.data;
    },
    enabled: !!id,
    // refetchOnWindowFocus: false,
    // staleTime: 0,
  });
};
