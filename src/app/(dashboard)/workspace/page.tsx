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
        router.push(`/workspace/${workspaces[0].id}`, { scroll: false });
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
