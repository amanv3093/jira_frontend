"use client";

import { useGetWorkspaceById } from "@/hooks/workspace";
import { useParams } from "next/navigation";
import React from "react";

function WorkspacePage() {
  const params = useParams();
  const workspaceId = params?.id as string;
  const { data: workspaceData } = useGetWorkspaceById(workspaceId);
  console.log("workspaceData", workspaceData);
  return <div>WorkspacePage</div>;
}

export default WorkspacePage;
