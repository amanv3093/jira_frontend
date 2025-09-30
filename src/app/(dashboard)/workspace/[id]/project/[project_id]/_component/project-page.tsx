"use client";
import { Button } from "@/components/ui/button";
import { useGetProjectById } from "@/hooks/project";
import { useParams } from "next/navigation";
import React from "react";
import TaskStatsCards from "./task-stats-card";
import Loader from "@/app/Loader";

function ProjectPage() {
  const params = useParams();
  const projectId = params?.project_id as string;
  const { data: project, isLoading } = useGetProjectById(projectId);
  console.log(project);
  //#1868db
   if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader  size={40}/>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <p>{project?.name}</p>
        <Button>Edit</Button>
      </div>
      <TaskStatsCards />
    </div>
  );
}

export default ProjectPage;
