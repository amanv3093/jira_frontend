"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Trash2, Mail, X } from "lucide-react";
import { useGetProjectByWorkspaceId } from "@/hooks/project";
import { useParams } from "next/navigation";
import { getSession } from "next-auth/react";

type InviteRow = {
  id: number;
  email: string;
  role: string;
  error?: string;
};

interface InviteProp {
  onClose: () => void;
}
type Project = {
  id?: string;
  name?: string;
};


export default function InvitePage({ onClose }: InviteProp) {
  const [rows, setRows] = useState<InviteRow[]>([
    { id: 1, email: "", role: "member" },
  ]);

  const { id } = useParams();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string>("");

  const { data: projects, isLoading: projectsLoading } =
    useGetProjectByWorkspaceId(id as string);

  function addRow() {
    if (!projectId) {
      toast.error("Select a project first.");
      return;
    }
    setRows([...rows, { id: Date.now(), email: "", role: "member" }]);
  }

  function removeRow(id: number) {
    if (rows.length === 1) return;
    setRows(rows.filter((row) => row.id !== id));
  }

  function updateRow(id: number, field: keyof InviteRow, value: string) {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value, error: undefined } : row
      )
    );
  }

  async function handleInvite() {
    if (!projectId) {
      toast.error("Please select a project.");
      return;
    }

    let hasError = false;
    const updated = rows.map((row) => {
      if (!row.email.includes("@")) {
        hasError = true;
        return { ...row, error: "Enter a valid email" };
      }
      return row;
    });

    setRows(updated);
    if (hasError) return;

    try {
      setLoading(true);
      const session = await getSession();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({
            projectId,
            workspaceId: id,
            invites: rows.map((r) => ({
              email: r.email,
              role: r.role,
            })),
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Invites sent!");
      setRows([{ id: 1, email: "", role: "member" }]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error sending invite";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Copied to clipboard!");
  }

  return (
    <Card className="w-full max-w-xl p-4 border-none shadow-none ">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      <CardHeader className="p-0 mb-3">
        <CardTitle>Invite People to Project</CardTitle>
        <CardDescription>Select project to invite members</CardDescription>
      </CardHeader>

      {/* Project Selector */}
      <div className="space-y-2 mb-4">
        <Label>Select Project</Label>
        <Select
          value={projectId}
          onValueChange={(value) => setProjectId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent>
            {!projectsLoading &&
              projects?.map((project: any) => (
                <SelectItem key={project.id} value={project?.id}>
                  {project.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <CardContent className="space-y-6 p-0">
        {/* Email rows */}
        <div>
          <Label>Invite with Email</Label>
          {!projectId && (
            <p className="text-xs text-red-600 mt-1">
              Select a project before adding emails
            </p>
          )}

          <div className="space-y-3 mt-2">
            {rows.map((row) => (
              <div key={row.id} className="flex gap-2 items-start">
                <div className="w-full">
                  <Input
                    disabled={!projectId}
                    placeholder="email@address.com"
                    value={row.email}
                    onChange={(e) => updateRow(row.id, "email", e.target.value)}
                    className={
                      row.error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {row.error && (
                    <p className="text-sm text-red-600 flex gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {row.error}
                    </p>
                  )}
                </div>

                <Select
                  disabled={!projectId}
                  value={row.role}
                  onValueChange={(value) => updateRow(row.id, "role", value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  disabled={rows.length === 1 || !projectId}
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}

            <Button
              variant="link"
              className="p-0 text-blue-600 mt-1"
              onClick={addRow}
              disabled={!projectId}
            >
              + Add email
            </Button>

            <Button
              className="w-full"
              onClick={handleInvite}
              disabled={!projectId || loading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Invites
            </Button>
          </div>
        </div>

        {/* Link section */}
        <div className="space-y-2">
          <Label>Invite with Link</Label>
          <div className="flex gap-2">
            <Input value={inviteUrl || ""} disabled />
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={!inviteUrl}
            >
              Copy Link
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Anyone with this link can join the project
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
