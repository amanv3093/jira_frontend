import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  actions?: any[];
}

export interface ChatResponse {
  reply: string;
  actions: any[];
}

export const aiService = {
  chat: (message: string, workspaceId: string, history: ChatMessage[]) =>
    fetchHandler<ApiResponse<ChatResponse>>("ai/chat", "POST", {
      message,
      workspaceId,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    }),
};
