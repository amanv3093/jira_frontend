"use client";

import { ChevronsUpDown, Check, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import WorkspaceCreateModal from "./workspace-create-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/modal/custom-modal";

interface Workspace {
  id: string;
  name: string;
  profilePic: string | null;
}

interface Props {
  workspaces: Workspace[];
  currentWorkspaceId?: string | null;
  onSelect: (workspaceId: string) => void;
}

const WorkspaceSelector = ({ workspaces, currentWorkspaceId, onSelect }: Props) => {
  const [selected, setSelected] = useState(currentWorkspaceId || workspaces?.[0]?.id || "");

  // Sync with URL when workspace changes externally
  useEffect(() => {
    if (currentWorkspaceId && currentWorkspaceId !== selected) {
      setSelected(currentWorkspaceId);
    }
  }, [currentWorkspaceId]);
  const current = workspaces.find((ws) => ws.id === selected);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSwitchWorkspace = (wsId: string) => {
    setSelected(wsId);
    onSelect(wsId);
    setIsSwitchModalOpen(false);
  };

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </h1>
        <button
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Workspace trigger button */}
      <button
        className="group w-full flex items-center gap-3 rounded-lg border border-border bg-background p-2.5 transition-all hover:bg-accent/50 hover:shadow-sm"
        onClick={() => setIsSwitchModalOpen(true)}
      >
        {current?.profilePic ? (
          <Image
            src={current.profilePic}
            alt={current.name}
            width={32}
            height={32}
            className="rounded-md object-cover h-8 w-8 shrink-0"
          />
        ) : (
          <div className="h-8 w-8 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {current?.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <span className="flex-1 truncate text-left text-sm font-medium">
          {current?.name}
        </span>

        <ChevronsUpDown
          size={16}
          className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
        />
      </button>

      {/* Switch Workspace Dialog */}
      <Dialog open={isSwitchModalOpen} onOpenChange={setIsSwitchModalOpen}>
        <DialogContent className="sm:max-w-[420px] gap-0 p-0 z-[200] max-h-[85vh] overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4">
            <DialogTitle>Switch Workspace</DialogTitle>
            <DialogDescription>
              Select a workspace to switch to
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="px-5 pb-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search workspaces..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Workspace list */}
          <ScrollArea className="max-h-[320px]">
            <div className="px-3 pb-4 space-y-1">
              {filteredWorkspaces.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No workspaces found
                </p>
              ) : (
                filteredWorkspaces.map((ws) => {
                  const isCurrent = selected === ws.id;

                  return (
                    <button
                      key={ws.id}
                      className={`group/item w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                        isCurrent
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-accent border border-transparent"
                      }`}
                      onClick={() => handleSwitchWorkspace(ws.id)}
                    >
                      {/* Avatar */}
                      {ws.profilePic ? (
                        <Image
                          src={ws.profilePic}
                          alt={ws.name}
                          width={36}
                          height={36}
                          className="rounded-md object-cover h-9 w-9 shrink-0"
                        />
                      ) : (
                        <div className="h-9 w-9 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {ws.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Name + badge */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {ws.name}
                        </p>
                      </div>

                      {/* Active indicator */}
                      {isCurrent ? (
                        <Badge
                          variant="default"
                          className="shrink-0 text-[10px] px-1.5 py-0"
                        >
                          Active
                        </Badge>
                      ) : (
                        <span className="shrink-0 text-xs text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity">
                          Switch
                        </span>
                      )}

                      {/* Checkmark */}
                      {isCurrent && (
                        <Check
                          size={16}
                          className="shrink-0 text-primary"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Create Workspace Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        >
          <WorkspaceCreateModal onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default WorkspaceSelector;
