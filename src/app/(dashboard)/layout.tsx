"use client";

import Sidebar from "@/components/sidebar/sidebar";
import useIsCollapsed from "@/components/sidebar/use-is-collapsed";

import { useGetAllWorkspace } from "@/hooks/workspace";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loader from "../Loader";
import Header from "./header/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); // current URL
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();

  const { data: workspaces, isLoading: workspacesLoading } = useGetAllWorkspace();

  useEffect(() => {
    if (!workspacesLoading && workspaces) {
      // No workspaces → redirect to create
      if (workspaces.length === 0) {
        if (pathname !== "/workspace/create") {
          router.replace("/workspace/create");
        }
      } else {
        // At least one workspace exists
        const firstWorkspacePath = `/workspace/${workspaces[0].id}`;
        // Redirect only if not already on a workspace page
        if (!pathname.startsWith("/workspace/")) {
          router.replace(firstWorkspacePath);
        }
      }
    }
  }, [workspacesLoading, workspaces, pathname, router]);

  if (workspacesLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? "md:ml-14" : "md:ml-64"
        } h-full`}
      >
        <Header />
        {children}
      </main>
    </div>
  );
}
