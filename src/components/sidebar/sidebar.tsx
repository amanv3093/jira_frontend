import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Plus,
  FolderKanban,
  Hash,
} from "lucide-react";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { getWorkspaceLinks } from "@/constants/sidelinks";
import { useGetAllWorkspace } from "@/hooks/workspace";
import { useRouter } from "next/navigation";
import WorkspaceSelector from "@/app/(dashboard)/workspace/_components/workspace-selector";
import Modal from "../modal/custom-modal";
import { useGetProjectByWorkspaceId } from "@/hooks/project";
import ProjectCreateForm from "@/app/(dashboard)/workspace/[id]/project/_components/project-create";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const workspaceIdFromUrl = pathname?.split("/")[2] || null;

  const { data: workspaces, isLoading: workspacesLoading } =
    useGetAllWorkspace();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    workspaceIdFromUrl
  );

  const [navOpened, setNavOpened] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);

  useEffect(() => {
    if (workspaceIdFromUrl && workspaceIdFromUrl !== selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaceIdFromUrl);
      localStorage.setItem("lastWorkspaceId", workspaceIdFromUrl);
    }
  }, [workspaceIdFromUrl]);

  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectByWorkspaceId(selectedWorkspaceId ?? "");

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign-in", redirect: true });
  };

  // Loading skeleton
  if (workspacesLoading || !workspaces || projectsLoading) {
    return (
      <aside
        className={cn(
          "fixed left-0 right-0 top-0 z-50 w-full border-r border-border/60 bg-sidebar md:bottom-0 md:right-auto md:h-svh transition-[width] duration-200 ease-out",
          isCollapsed ? "md:w-[52px]" : "md:w-[260px]",
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="px-3 py-4">
            <div className="h-8 w-full rounded-md bg-muted/60 animate-pulse" />
          </div>
          <div className="px-3 pb-3">
            <div className="h-9 w-full rounded-md bg-muted/60 animate-pulse" />
          </div>
          <div className="flex-1 px-3 space-y-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-full rounded-md bg-muted/60 animate-pulse"
              />
            ))}
          </div>
          <div className="px-3 pb-3 space-y-1.5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
              <div className="h-5 w-5 rounded bg-muted/60 animate-pulse" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-full rounded-md bg-muted/60 animate-pulse"
              />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const navigationLinks = selectedWorkspaceId
    ? getWorkspaceLinks(selectedWorkspaceId)
    : [];

  return (
    <aside
      className={cn(
        "fixed left-0 right-0 top-0 z-50 w-full border-r border-border/60 bg-background transition-[width] duration-200 ease-out md:bottom-0 md:right-auto md:h-svh",
        isCollapsed ? "md:w-[52px]" : "md:w-[260px]",
        className
      )}
    >
      {/* Mobile overlay */}
      <div
        onClick={() => setNavOpened(false)}
        className={cn(
          "absolute inset-0 w-full bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          navOpened ? "h-svh opacity-100" : "pointer-events-none h-0 opacity-0"
        )}
      />

      <div
        className={cn(
          "flex h-full flex-col overflow-hidden",
          navOpened ? "h-svh" : ""
        )}
      >
        {/* Header - Logo & Mobile Toggle */}
        <div className="flex h-14 shrink-0 items-center justify-between px-3 md:px-3">
          <Link
            prefetch={false}
            href="/"
            className="flex items-center gap-2 overflow-hidden"
          >
            <img
              src="/logo.png"
              alt="Jira"
              className={cn(
                "object-contain transition-all duration-200",
                isCollapsed ? "h-8 w-8" : "h-9"
              )}
            />
          </Link>

          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Workspace Selector */}
        {!isCollapsed && (
          <div className="shrink-0 px-3 pb-2">
            <WorkspaceSelector
              workspaces={workspaces || []}
              currentWorkspaceId={selectedWorkspaceId}
              onSelect={(id) => {
                setSelectedWorkspaceId(id);
                localStorage.setItem("lastWorkspaceId", id);
                router.push(`/workspace/${id}`);
              }}
            />
          </div>
        )}

        {/* Navigation */}
        <Nav
          id="sidebar-menu"
          className={cn(
            "shrink-0",
            navOpened ? "max-h-full" : "max-h-0 py-0 md:max-h-full md:py-0"
          )}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={navigationLinks}
        />

        {/* Projects Section */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            navOpened ? "max-h-full" : "max-h-0 md:max-h-full",
            isCollapsed ? "px-1.5" : "px-3"
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center justify-between py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Projects
              </span>
              <button
                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
                onClick={() => setIsModalOpen(true)}
                title="Create project"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center py-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={() => setIsModalOpen(true)}
                title="Create project"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          <ul className="space-y-0.5 pb-2">
            {projects.length > 0 ? (
              projects.map((project: any) => {
                const projectUrl = `/workspace/${workspaceIdFromUrl}/project/${project.id}`;
                const isActive = pathname === projectUrl;

                return (
                  <li key={project.id}>
                    <Link
                      href={projectUrl}
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                        isCollapsed && "justify-center px-0",
                        isActive
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                      title={isCollapsed ? project.name : undefined}
                    >
                      {project?.profilePic ? (
                        <Image
                          src={project.profilePic}
                          alt={project.name || "Project"}
                          width={18}
                          height={18}
                          className="rounded h-[18px] w-[18px] object-cover shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-[10px] font-semibold",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {project.name?.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      {!isCollapsed && (
                        <span className="truncate">{project.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })
            ) : (
              !isCollapsed && (
                <li className="px-2 py-3 text-center text-xs text-muted-foreground/60">
                  No projects yet
                </li>
              )
            )}
          </ul>
        </div>

        {/* Project Create Modal */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={onClose}>
            <ProjectCreateForm onClose={onClose} workspaces={workspaces} />
          </Modal>
        )}

        {/* Bottom section - Logout */}
        <div
          className={cn(
            "shrink-0 border-t border-border/60 p-2",
            isCollapsed && "flex justify-center"
          )}
        >
          <button
            onClick={() => setShowLogoutPopup(true)}
            className={cn(
              "flex items-center rounded-md text-sm text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive",
              isCollapsed
                ? "h-8 w-8 justify-center"
                : "h-8 w-full gap-2.5 px-2"
            )}
            title="Logout"
          >
            <LogOut size={16} />
            {!isCollapsed && <span className="text-[13px]">Logout</span>}
          </button>
        </div>

        {/* Logout Confirmation */}
        {showLogoutPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-[360px] rounded-xl border border-border bg-background p-5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
              <h3 className="text-base font-semibold">Log out</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Are you sure you want to log out of your account?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="h-8 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="h-8 rounded-lg bg-destructive px-3 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        {!showLogoutPopup && (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={cn(
              "absolute -right-3 top-1/2 z-50 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all duration-200 hover:bg-accent hover:shadow md:flex",
              "opacity-0 group-hover:opacity-100"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={14}
              className={cn(
                "text-muted-foreground transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
