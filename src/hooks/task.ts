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
      queryClient.invalidateQueries({ queryKey: ["getAllTask"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to create Task";
      toast.error(message);
    },
  });
};
