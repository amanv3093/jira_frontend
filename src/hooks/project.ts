import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";

import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { projectService } from "@/services/project";
import { toast } from "sonner";
import { Project } from "@/types";


export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await projectService.createProject(formData);
      return response.data;
    },
    onSuccess: (project: Project) => {
      toast.success("Project created successfully");

      queryClient.invalidateQueries({ queryKey: ["getAllProject"] });
      queryClient.invalidateQueries({
        queryKey: ["getWorkspaceById", project.workspaceId],
      });
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

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await projectService.updateProject(id, formData);
      return response.data as Project;
    },
    onSuccess: (project: Project) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getProjectById", project.id] });
      queryClient.invalidateQueries({ queryKey: ["getAllProject"] });
      if (project.workspaceId) {
        queryClient.invalidateQueries({ queryKey: ["getWorkspaceById", project.workspaceId] });
      }
    },
    onError: (error: any) => {
      const message = error?.error || "Failed to update project";
      toast.error(message);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectService.deleteProject(id);
      return response;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllProject"] });
    },
    onError: (error: any) => {
      const message = error?.error || "Failed to delete project";
      toast.error(message);
    },
  });
};

export const useGetProjectByWorkspaceId = (
  id?: string,
  options?: Omit<UseQueryOptions<Project[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["getAllProject", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await projectService.getProjectByWorkspaceId(id);
      return response.data;
    },
    enabled: !!id, 
    ...options,
  });
};