import React, { useEffect, useState } from "react";
import { ChevronLeft, Menu, X, LogOut, Plus } from "lucide-react";
import { Layout } from "./custom/layout";
import { Button } from "./custom/button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { SideLink, getNavigationLinks } from "@/constants/sidelinks";
import { useGetAllWorkspace } from "@/hooks/workspace";
import { useRouter } from "next/navigation";
import WorkspaceSelector from "@/app/(dashboard)/workspace/_components/workspace-selector";
interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProjectData {
  data: {
    is_wing: boolean;
    [key: string]: string | number | boolean;
  };
}

function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const router = useRouter();
  const [navOpened, setNavOpened] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const pathname = usePathname();

  const { data: workspaces, isLoading } = useGetAllWorkspace();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/sign-in",
      redirect: true,
    });
  };

  useEffect(() => {
    if (!isLoading && workspaces) {
      const workspaceArray = workspaces.data;
      if (!workspaceArray || workspaceArray.length === 0) {
        router.replace("/workspace/create");
      } else {
        router.replace(`/workspace/${workspaceArray[0].id}`);
      }
    }
  }, [workspaces, isLoading, router]);

  if (isLoading || !workspaces) return null;

  const navigationLinks = getNavigationLinks(false, null);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${
          isCollapsed ? "md:w-14" : "md:w-64"
        }`,
        className
      )}
    >
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? "h-svh" : ""}>
        <Layout.Header
          sticky
          className="z-50 flex items-center justify-between px-4 py-3 shadow-sm md:px-4 h-16"
        >
          <div className="flex items-center gap-2">
            <Link prefetch={false} href="/" className="flex items-center">
              <Image
                src={isCollapsed ? "/logo.png" : "/logo.png"}
                alt="Logo"
                width={isCollapsed ? 50 : 150}
                height={isCollapsed ? 50 : 100}
                className={
                  isCollapsed ? "w-6 h-6" : "h-12 w-auto object-contain"
                }
              />
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <X /> : <Menu />}
          </Button>
        </Layout.Header>

        <div className="p-4 border-b border-border">
          <WorkspaceSelector
            workspaces={workspaces?.data || []}
            onSelect={(id) => router.push(`/workspace/${id}`)}
          />
        </div>

        <Nav
          id="sidebar-menu"
          className={cn(
            "z-40 h-full flex-1 overflow-x-hidden",
            navOpened ? "max-h-full" : "max-h-0 py-0 md:max-h-full md:py-2"
          )}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={navigationLinks}
        />

        <div
          className={cn(
            "z-40 h-full flex-1 overflow-auto p-4 border-t mt-2 border-border",
            navOpened ? "max-h-full" : "max-h-0 py-0 md:max-h-full md:py-2"
          )}
        >
          <div className="flex items-center justify-between">
            <h1>Projects</h1>
            <div className="bg-gray-100 rounded-md p-1 cursor-pointer">
              <Plus size={14} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        {/* <div
          className={cn(
            "border-t border-border p-4",
            isCollapsed ? "flex justify-center" : ""
          )}
        >
          <Button
            onClick={() => setShowLogoutPopup(true)}
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 hover:bg-primary/15 hover:text-primary",
              isCollapsed
                ? "h-11 w-11 rounded-lg p-0"
                : "h-11 justify-start gap-3 rounded-lg px-4"
            )}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </Button>
        </div> */}

        {showLogoutPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-md w-96">
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
              <p className="mt-2 text-sm">Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutPopup(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="rounded-lg bg-primary"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {!showLogoutPopup && (
          <Button
            onClick={() => setIsCollapsed((prev) => !prev)}
            size="icon"
            variant="outline"
            className="absolute -right-5 bottom-4 z-50 hidden  md:inline-flex hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        )}
      </Layout>
    </aside>
  );
}

export default Sidebar;
