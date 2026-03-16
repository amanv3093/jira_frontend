"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useGetWorkspaceById } from "@/hooks/workspace";
import {
  useSubscriptionStatus,
  useCreateCheckout,
  useCreatePortalSession,
} from "@/hooks/subscription";
import { subscriptionService } from "@/services/subscription";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Loader from "@/app/Loader";

export default function BillingPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params?.id as string;

  const { data: workspace, isLoading } = useGetWorkspaceById(workspaceId);
  const { data: session } = useSession();
  const { data: billing, isLoading: billingLoading } =
    useSubscriptionStatus(workspaceId);
  const createCheckout = useCreateCheckout();
  const createPortal = useCreatePortalSession();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const currentUserId = (session?.user as any)?.id;
  const currentUserIsOwner = currentUserId
    ? workspace?.ownerId === currentUserId
    : false;

  // Verify checkout session after Stripe redirect
  useEffect(() => {
    const billingStatus = searchParams.get("billing");
    const sessionId = searchParams.get("session_id");

    if (billingStatus === "success" && sessionId) {
      subscriptionService
        .verifyCheckoutSession(sessionId)
        .then(() => {
          toast.success("Workspace upgraded to Pro!");
          queryClient.invalidateQueries({
            queryKey: ["subscriptionStatus", workspaceId],
          });
          router.replace(`/workspace/${workspaceId}/billing`);
        })
        .catch(() => {
          toast.error("Failed to verify payment. Please refresh.");
        });
    }
  }, [searchParams, workspaceId, queryClient, router]);

  if (isLoading || billingLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  if (!currentUserIsOwner) {
    return (
      <div className="p-6 max-w-[900px] mx-auto">
        <Card className="border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3 py-12">
            <ShieldAlert className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Only the workspace owner can manage billing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plan & Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workspace subscription and billing
          </p>
        </div>
      </div>

      {billing && (
        <Card className="border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Current Plan</h2>
              </div>
              <Badge
                className={
                  billing.plan === "PRO"
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0"
                }
              >
                {billing.plan === "PRO" ? "Pro" : "Free"}
              </Badge>
            </div>

            {/* Usage bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">
                  {billing.currentMembers} /{" "}
                  {billing.plan === "PRO" ? "Unlimited" : billing.maxMembers}
                </span>
              </div>
              {billing.plan !== "PRO" && (
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      billing.currentMembers / billing.maxMembers >= 0.8
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    } ${
                      billing.currentMembers >= billing.maxMembers
                        ? "!bg-red-500"
                        : ""
                    }`}
                    style={{
                      width: `${Math.min(
                        (billing.currentMembers / billing.maxMembers) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {billing.plan === "PRO" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Pro plan active - unlimited members</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => createPortal.mutate(workspaceId)}
                  disabled={createPortal.isPending}
                >
                  {createPortal.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border border-dashed border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Upgrade to Pro
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add unlimited members to your workspace. Free plan allows up
                    to {billing.maxMembers} members.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  onClick={() => createCheckout.mutate(workspaceId)}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Upgrade Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
