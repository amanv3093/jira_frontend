"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2} from "lucide-react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

type InviteInfo = {
  workspace?: {
    name: string;
  };
  project?: {
    name: string;
  };
};

export default function JoinPage() {
   const inviteCode = useParams()
  console.log(inviteCode)

  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [manualToken, setManualToken] = useState(inviteCode.code);
  

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");

 

  useEffect(() => {
    if (urlToken) {
      // setTokenSource("link");
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
    <div className="max-w-md mx-auto mt-10 p-4">
      {/* Close button (optional for modal) */}
     

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Join Workspace / Project
          </CardTitle>
        </CardHeader>

        <CardContent>
          {verifying ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) :  isValid ? (
            <div className="space-y-6 text-center">
              <div>
                <p className="text-gray-700">You’ve been invited to join:</p>
                <p className="font-semibold text-lg mt-1">
                  {inviteInfo?.workspace?.name || "Workspace"}{" "}
                  {inviteInfo?.project?.name
                    ? `→ ${inviteInfo.project.name}`
                    : ""}
                </p>
              </div>

              <Button
                 onClick={() => handleJoin(manualToken as string)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Now"
                )}
              </Button>
            </div>
          ) : (
            // Manual token entry UI
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enter Invite Token
                </label>
                <Input
                  placeholder="Paste your invite token here"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="secondary"
                  onClick={() => verifyInvite(manualToken as string)}
                  disabled={!manualToken}
                  className="w-full"
                >
                  Verify Token
                </Button>

                {isValid && (
                  <Button
                    onClick={() => handleJoin(manualToken as string)}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Now"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
