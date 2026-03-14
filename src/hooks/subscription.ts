import { useMutation, useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscription";
import { toast } from "sonner";

export interface SubscriptionStatus {
  plan: string;
  maxMembers: number;
  currentMembers: number;
  hasSubscription: boolean;
}

export const useSubscriptionStatus = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["subscriptionStatus", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const response = await subscriptionService.getSubscriptionStatus(workspaceId);
      return response.data as SubscriptionStatus;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await subscriptionService.createCheckoutSession(workspaceId);
      return response.data as { url: string };
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      const message = error?.error || "Failed to create checkout session";
      toast.error(message);
    },
  });
};

export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await subscriptionService.createPortalSession(workspaceId);
      return response.data as { url: string };
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      const message = error?.error || "Failed to open billing portal";
      toast.error(message);
    },
  });
};
