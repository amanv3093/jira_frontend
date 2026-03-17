import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService, ChatMessage } from "@/services/ai";
import { toast } from "sonner";

export const useAIChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      workspaceId,
      history,
    }: {
      message: string;
      workspaceId: string;
      history: ChatMessage[];
    }) => {
      const response = await aiService.chat(message, workspaceId, history);
      return response.data as { reply: string; actions: any[] };
    },
    onSuccess: (data) => {
      if (data?.actions?.length) {
        // Invalidate relevant queries when AI performs actions
        queryClient.invalidateQueries({ queryKey: ["getAllTaskByWorkspaceId"] });
        queryClient.invalidateQueries({ queryKey: ["getAllTaskByProjectId"] });
        queryClient.invalidateQueries({ queryKey: ["getWorkspaceById"] });
        queryClient.invalidateQueries({ queryKey: ["getDashboard"] });
        queryClient.invalidateQueries({ queryKey: ["getMember"] });
      }
    },
    onError: (error: any) => {
      const message = error?.error || "AI assistant is unavailable";
      toast.error(message);
    },
  });
};
