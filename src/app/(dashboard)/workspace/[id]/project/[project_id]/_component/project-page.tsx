"use client";
import { Button } from "@/components/ui/button";
import { useGetProjectById } from "@/hooks/project";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import TaskStatsCards from "./task-stats-card";
import Loader from "@/app/Loader";
import ProjectFilters from "./project-filter";
import { FormProvider, useForm } from "react-hook-form";
import { useGetWorkspaceById } from "@/hooks/workspace";
import { useGetTaskByProjectId, useGetTaskByWorkspaceId } from "@/hooks/task";
import ProjectTable from "./table/table";
import TaskFilters from "../../../task/_components/task-filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Kanban, LayoutList, Plus } from "lucide-react";
import TaskKanban from "../../../task/_components/task-kanban";
import TaskTable from "../../../task/_components/table/table";
import Modal from "@/components/modal/custom-modal";
import TaskCreateModal from "../../../task/_components/task-create-modal";

function ProjectPage() {
  const params = useParams();
  const projectId = params?.project_id as string;
  const { data: project, isLoading } = useGetProjectById(projectId);
  console.log(project);
   const [viewMode, setViewMode] = useState("kanban");
    const [isModalOpen, setIsModalOpen] = useState(false);
     const onClose = () => setIsModalOpen(false);

  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    project: [] as string[],
    assignee: [] as string[],
    search: "",
  });
  const workspaceId = params?.id as string;
  const { data: task, isLoading: taskLoading } = useGetTaskByProjectId(
    projectId,
    filters
  );

 

  const methods = useForm({
    defaultValues: {
      status: [],
      assignees: [],
      projects: [],
      dueDate: [undefined, undefined],
    },
  });
  //#1868db
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
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
     

        <div className="flex justify-between items-center">
        <FormProvider {...methods}>
          <div>
            <FormProvider {...methods}>
              <TaskFilters
                onFilterChange={setFilters}
                members={project?.members}
              />
            </FormProvider>
          </div>
        </FormProvider>
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="!py-1 !h-[30px] !rounded-none font-normal flex items-center gap-2 min-w-[100px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {viewMode === "table" ? (
                  <>
                    <LayoutList size={16} /> Table
                  </>
                ) : (
                  <>
                    <Kanban size={16} /> Kanban
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={4}
              className="bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50 w-[var(--radix-dropdown-menu-trigger-width)]"
            >
              <DropdownMenuItem
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded text-sm hover:bg-gray-100 outline-none focus:outline-none focus:ring-0 border-none ${
                  viewMode === "table" ? "bg-blue-100 text-info" : ""
                }`}
              >
                <LayoutList size={14} /> Table
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded text-sm hover:bg-gray-100 outline-none focus:outline-none focus:ring-0 border-none ${
                  viewMode === "kanban" ? "bg-blue-100 text-info" : ""
                }`}
              >
                <Kanban size={16} /> Kanban
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className={`!py-1 !h-[30px] !rounded-none font-normal flex items-center gap-1 order-gray-300 text-black`}
          >
            <Plus />
            Create
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <TaskKanban data={task || []} />
      ) : (
        <TaskTable data={task || []} />
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={onClose}>
          <TaskCreateModal
            onClose={onClose}
            members={project.members}
            projectAutoSelect={project}
          />
        </Modal>
      )}
    </div>
  );
}

export default ProjectPage;
