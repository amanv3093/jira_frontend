import { QueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/index.d";

interface ToastInterface {
  success: (params: { message: string }) => void;
  error: (params: { message: string }) => void;
}

export const handleMutationSuccess = (
  response: ApiResponse,
  toast: ToastInterface,
  queryClient: QueryClient,
  queryKey: string[]
) => {
  if (response.success) {
    toast.success({ message: response.message });
    queryClient.invalidateQueries({ queryKey });
  }
};

export const handleMutationError = (
  error: { message?: string },
  toast: ToastInterface
) => {
  if (error.message) {
    toast.error({ message: error.message });
  }
};
