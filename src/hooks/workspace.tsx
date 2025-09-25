import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";

import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { workspaceService } from "@/services/workspace/workspace";
// import { AddAgentPayload } from "@/types/index.d";

export const useGetAllWorkspace = () => {
  return useQuery({
    queryKey: ["getAllWorkspace"],
    queryFn: workspaceService.getAllWorkspace,
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

// export const useAddAgent = () => {
//   const queryClient = useQueryClient();
//   const toast = useCustomToast();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: number; data: AddAgentPayload }) =>
//       agentService.selectAgent(id, data),
//     onSuccess: (response) =>
//       handleMutationSuccess(response, toast, queryClient, ["agents"]),
//     onError: (error) => handleMutationError(error, toast),
//   });
// };
