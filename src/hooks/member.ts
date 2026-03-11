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

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, memberId }: { workspaceId: string; memberId: string }) => {
      const response = await memberService.removeMember(workspaceId, memberId);
      return response;
    },
    onSuccess: (_data, variables) => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["getMember", variables.workspaceId] });
    },
    onError: (error: any) => {
      const message = error?.error || "Failed to remove member";
      toast.error(message);
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      memberId,
      role,
    }: {
      workspaceId: string;
      memberId: string;
      role: string;
    }) => {
      const response = await memberService.updateMemberRole(workspaceId, memberId, role);
      return response;
    },
    onSuccess: (_data, variables) => {
      toast.success("Member role updated");
      queryClient.invalidateQueries({ queryKey: ["getMember", variables.workspaceId] });
    },
    onError: (error: any) => {
      const message = error?.error || "Failed to update role";
      toast.error(message);
    },
  });
};