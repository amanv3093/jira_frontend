"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Plus,
  Link2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Users,
  FolderKanban,
  LogOut,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateWorkspace } from "@/hooks/workspace";
import { toast } from "sonner";
import { getSession, signOut } from "next-auth/react";

// --- Create Workspace Schema ---
const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  image: z.instanceof(File).optional().nullable(),
});
type WorkSpaceFormData = z.infer<typeof workspaceSchema>;

export default function GetStartedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
      {/* Logout button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/sign-in", redirect: true })}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8 max-w-lg">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-4 shadow-lg">
          <FolderKanban className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Get Started</h1>
        <p className="text-muted-foreground mt-2">
          Create a new workspace or join an existing one to start collaborating
          with your team.
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreateWorkspaceCard
          onSuccess={(workspaceId: string) => {
            router.push(`/workspace/${workspaceId}`);
          }}
        />
        <JoinWorkspaceCard />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Create Workspace Card
// ─────────────────────────────────────────────
function CreateWorkspaceCard({
  onSuccess,
}: {
  onSuccess: (id: string) => void;
}) {
  const createWorkspace = useCreateWorkspace();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkSpaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: "", image: null },
  });

  const onSubmit = (data: WorkSpaceFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("profilePic", data.image);
    }

    createWorkspace.mutate(formData, {
      onSuccess: (workspace: any) => {
        onSuccess(workspace.id);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("image", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950">
          <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Create Workspace</h2>
          <p className="text-xs text-muted-foreground">
            Start fresh with a new team
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
        <div>
          <Label htmlFor="ws-name">Workspace Name</Label>
          <Input
            id="ws-name"
            placeholder="e.g., My Team"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="ws-image">Profile Picture (optional)</Label>
          <Input
            id="ws-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-14 w-14 rounded-full object-cover border border-border"
            />
          )}
        </div>

        <div className="flex-1" />

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={createWorkspace.isPending}
        >
          {createWorkspace.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create Workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// Join Workspace Card
// ─────────────────────────────────────────────
function JoinWorkspaceCard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [joining, setJoining] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<any>(null);

  const verifyInvite = async () => {
    if (!token.trim()) return;
    try {
      setVerifying(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/verify-invite/${token.trim()}`
      );
      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Invalid or expired invite.");
        setIsValid(false);
        return;
      }

      setInviteInfo(result?.data);
      setIsValid(true);
    } catch {
      toast.error("Something went wrong while verifying.");
      setIsValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleJoin = async () => {
    try {
      setJoining(true);
      const session = await getSession();
      if (!session?.user?.token) {
        toast.error("Please log in first.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ token: token.trim() }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        toast.error(result?.error || "Failed to join.");
        return;
      }

      toast.success("Joined successfully!");
      router.push("/workspace");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950">
          <Link2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Join Workspace</h2>
          <p className="text-xs text-muted-foreground">
            Use an invite token from your team
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div>
          <Label>Invite Token</Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Paste your invite token"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setIsValid(false);
                setInviteInfo(null);
              }}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Ask your team admin for an invite token
          </p>
        </div>

        {/* Verified info */}
        {isValid && inviteInfo && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
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
              </p>
            </div>
          </div>
        )}

        <div className="flex-1" />

        {!isValid ? (
          <Button
            className="w-full gap-2"
            onClick={verifyInvite}
            disabled={!token.trim() || verifying}
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
            className="w-full gap-2"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? (
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
  );
}
