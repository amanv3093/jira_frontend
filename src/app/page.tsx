"use client";
import Loader from "@/app/Loader";
import { useGetAllWorkspace } from "@/hooks/workspace";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const router = useRouter();
  const { data: workspaces, isLoading: workspacesLoading } =
    useGetAllWorkspace();
  useEffect(() => {
    if (!workspacesLoading && workspaces) {
      if (workspaces.length === 0) {
        router.push("/workspace/create", { scroll: false });
      } else {
        const lastId = localStorage.getItem("lastWorkspaceId");
        const targetId =
          lastId && workspaces.some((ws: any) => ws.id === lastId)
            ? lastId
            : workspaces[0].id;
        router.push(`/workspace/${targetId}`, { scroll: false });
      }
    }
  }, [workspacesLoading, workspaces]);
  if (workspacesLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }
}

export default page;
