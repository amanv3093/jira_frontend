import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const TASK_API = {
  GET: "task",
  GET_BY_ID: (id: string) => `task/${id}`,
  POST: "task",

} as const;

export const taskService = {
  getAllTask: () => fetchHandler<ApiResponse>(TASK_API.GET, "GET"),
  getTaskById: (id:string) => fetchHandler<ApiResponse>(TASK_API.GET_BY_ID(id), "GET"),
  createTask: (payload: any) =>
      fetchHandler<ApiResponse>(TASK_API.POST, "POST", payload),
};
