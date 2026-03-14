import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "@/services/user";
import { User } from "@/types";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["getUserProfile"],
    queryFn: async () => {
      const response = await userService.getProfile();
      return response.data as User;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await userService.updateProfile(formData);
      return response;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });
    },
    onError: (error: any) => {
      const message = error?.error || error?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await userService.changePassword(data);
      return response;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      const message = error?.error || error?.message || "Failed to change password";
      toast.error(message);
    },
  });
};
