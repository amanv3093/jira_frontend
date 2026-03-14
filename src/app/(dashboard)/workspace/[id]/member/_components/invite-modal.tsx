"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { AlertCircle, Trash2, Mail, X, Loader2, Plus } from "lucide-react";
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

export default function InvitePage({ onClose }: InviteProp) {
  const [rows, setRows] = useState<InviteRow[]>([
    { id: 1, email: "", role: "member" },
  ]);

  const { id } = useParams();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addRow() {
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
      if (message.includes("Member limit reached") || message.includes("member limit")) {
        toast.error("Member limit reached. Please upgrade your workspace plan in Settings.");
      } else {
        toast.error(message);
      }
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Invite People</h2>
          <p className="text-sm text-muted-foreground">
            Members will have access to all projects in this workspace
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Email rows */}
      <div className="space-y-3">
        <Label>Invite with Email</Label>

        {rows.map((row) => (
          <div key={row.id} className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <Input
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
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {row.error}
                </p>
              )}
            </div>

            <Select
              value={row.role}
              onValueChange={(value) => updateRow(row.id, "role", value)}
            >
              <SelectTrigger className="w-[110px] shrink-0">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>

            <Button
              disabled={rows.length === 1}
              variant="ghost"
              size="icon"
              onClick={() => removeRow(row.id)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 dark:text-blue-400 px-0 hover:bg-transparent hover:text-blue-700 dark:hover:text-blue-300"
          onClick={addRow}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add another
        </Button>

        <Button
          className="w-full"
          onClick={handleInvite}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Invites
            </>
          )}
        </Button>
      </div>

      {/* Link section */}
      <div className="space-y-2 pt-2 border-t border-border">
        <Label>Invite with Link</Label>
        <div className="flex gap-2">
          <Input value={inviteUrl || ""} disabled className="flex-1" />
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!inviteUrl}
            className="shrink-0"
          >
            Copy Link
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Anyone with this link can join the workspace
        </p>
      </div>
    </div>
  );
}
