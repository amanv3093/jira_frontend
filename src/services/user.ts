import { fetchHandler, fetchHandlerWithFormData } from "@/lib/api-utils";
import { ApiResponse } from "@/types";

const USER_API = {
  GET_PROFILE: "user/profile",
  UPDATE_PROFILE: "user/profile",
  CHANGE_PASSWORD: "user/change-password",
} as const;

export const userService = {
  getProfile: () =>
    fetchHandler<ApiResponse>(USER_API.GET_PROFILE, "GET"),
  updateProfile: (formData: FormData) =>
    fetchHandlerWithFormData<ApiResponse>(USER_API.UPDATE_PROFILE, "PUT", formData),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchHandler<ApiResponse>(USER_API.CHANGE_PASSWORD, "PUT", data),
};
