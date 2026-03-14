import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types";

const SUBSCRIPTION_API = {
  CHECKOUT: "subscription/checkout",
  VERIFY_SESSION: "subscription/verify-session",
  STATUS: (workspaceId: string) => `subscription/status/${workspaceId}`,
  PORTAL: "subscription/portal",
} as const;

export const subscriptionService = {
  createCheckoutSession: (workspaceId: string) =>
    fetchHandler<ApiResponse>(SUBSCRIPTION_API.CHECKOUT, "POST", { workspaceId }),
  verifyCheckoutSession: (sessionId: string) =>
    fetchHandler<ApiResponse>(SUBSCRIPTION_API.VERIFY_SESSION, "POST", { sessionId }),
  getSubscriptionStatus: (workspaceId: string) =>
    fetchHandler<ApiResponse>(SUBSCRIPTION_API.STATUS(workspaceId), "GET"),
  createPortalSession: (workspaceId: string) =>
    fetchHandler<ApiResponse>(SUBSCRIPTION_API.PORTAL, "POST", { workspaceId }),
};
