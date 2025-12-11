import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import { projectService } from "@/services/project";
import { toast } from "sonner";
import { Member, Project } from "@/types";
import { memberService } from "@/services/member";


export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await projectService.createProject(formData);
      return response.data!;
    },
    onSuccess: (project: Project) => {
    //   toast.success("Project created successfully");
    //   queryClient.invalidateQueries({ queryKey: ["getAllProject"] });

    //   queryClient.invalidateQueries({
    //     queryKey: ["getWorkspaceById", project.workspaceId],
    //   });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to invite";
      toast.error(message);
    },
  });
};


export const useGetMemberByWorkspaceId = (
  id?: string,
  options?: Omit<UseQueryOptions<Member[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["getMember", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await memberService.getMemberByWorkspaceId(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false, 
    ...options,
  });
};