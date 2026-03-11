"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  X,
  Link2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

interface JoinPageProps {
  onClose?: () => void;
}

export default function JoinPage({ onClose }: JoinPageProps) {
  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [tokenSource, setTokenSource] = useState<"link" | "manual" | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");

  useEffect(() => {
    if (urlToken) {
      setTokenSource("link");
      verifyInvite(urlToken);
    }
  }, [urlToken]);

  const verifyInvite = async (token: string) => {
    try {
      setVerifying(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/verify-invite/${token}`
      );
      const result = await response.json();

      if (!response.ok) {
        setIsValid(false);
        toast.error(result?.error || "Invalid or expired invite.");
        return;
      }

      setInviteInfo(result?.data);
      setIsValid(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while verifying invite.");
      setIsValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleJoin = async (token: string) => {
    if (!token) {
      toast.error("No token found. Please enter a valid one.");
      return;
    }
    setLoading(true);

    try {
      const session = await getSession();
      if (!session?.user?.token) {
        toast.error("Please log in before joining the workspace.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast.error(result?.error || "Failed to join workspace/project.");
        setLoading(false);
        return;
      }

      toast.success("Joined successfully!");
      router.push("/workspace");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
            <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Join Workspace
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter an invite token to join a team
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {verifying ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="p-3 rounded-full bg-muted">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Verifying your invite...
          </p>
        </div>
      ) : tokenSource === "link" && isValid ? (
        <div className="space-y-5">
          {/* Verified invite card */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Invite verified</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                You&apos;ve been invited to join
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900">
                  <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="font-semibold text-sm">
                  {inviteInfo?.workspace?.name || "Workspace"}
                  {inviteInfo?.project?.name && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      / {inviteInfo.project.name}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleJoin(urlToken!)}
            disabled={loading}
            className="w-full h-10 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Now
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      ) : (
        /* Manual token entry */
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Invite Token</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Paste your invite token here"
                value={manualToken}
                onChange={(e) => {
                  setManualToken(e.target.value);
                  setIsValid(false);
                }}
                className="pl-9 h-10"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Ask your team admin for an invite token or link
            </p>
          </div>

          {/* Verified state after manual token check */}
          {isValid && inviteInfo && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Token verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900">
                  <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="font-semibold text-sm">
                  {inviteInfo?.workspace?.name || "Workspace"}
                  {inviteInfo?.project?.name && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      / {inviteInfo.project.name}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!isValid ? (
              <Button
                onClick={() => verifyInvite(manualToken)}
                disabled={!manualToken.trim() || verifying}
                className="w-full h-10 gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Verify Token
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => handleJoin(manualToken)}
                disabled={loading}
                className="w-full h-10 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
