"use client";
import Modal from "@/components/modal/custom-modal";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import TaskCreateModal from "./task-create-modal";
import { useParams } from "next/navigation";
import TaskTable from "./table/table";
import { useGetTaskByWorkspaceId } from "@/hooks/task";
import Loader from "@/app/Loader";
import { useGetWorkspaceById } from "@/hooks/workspace";
import TaskFilters from "./task-filter";
import { useForm, FormProvider } from "react-hook-form";
import { Eye, Plus, Search, LayoutList, Kanban } from "lucide-react";
import TaskKanban from "./task-kanban";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

function TaskPage() {
  const params = useParams();
  const workspaceId = params?.id as string;
  const [viewMode, setViewMode] = useState("kanban");
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    project: [] as string[],
    assignee: [] as string[],
    search: "",
  });

  const { data: task, isLoading: taskLoading } = useGetTaskByWorkspaceId(
    workspaceId,
    filters
  );

  const { data: workspaceData, isLoading: workspaceLoading } =
    useGetWorkspaceById(workspaceId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);

  const methods = useForm({
    defaultValues: {
      status: [],
      assignees: [],
      projects: [],
      dueDate: [undefined, undefined],
    },
  });

  if (taskLoading || workspaceLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  // const filteredTasks = task?.filter((t: any) => {
  //   const matchStatus = filters.status.length
  //     ? filters.status.includes(t.status)
  //     : true;
  //   const matchPriority = filters.priority.length
  //     ? filters.priority.includes(t.priority)
  //     : true;
  //   const matchProject = filters.project.length
  //     ? filters.project.includes(t.project)
  //     : true;
  //   const matchAssignee = filters.assignee.length
  //     ? filters.assignee.includes(t.assignee)
  //     : true;
  //   const matchSearch = filters.search
  //     ? t.title.toLowerCase().includes(filters.search.toLowerCase())
  //     : true;
  //   return (
  //     matchStatus &&
  //     matchPriority &&
  //     matchProject &&
  //     matchAssignee &&
  //     matchSearch
  //   );
  // });
  console.log("filters", filters);
  return (
    <div>
      <div className="flex justify-between items-center">
        <p>Task Page</p>
        {/* <Button onClick={() => setIsModalOpen(true)}>Create</Button> */}
      </div>
      <div className="flex justify-between items-center">
        <FormProvider {...methods}>
          <div>
            <FormProvider {...methods}>
              <TaskFilters
                onFilterChange={setFilters}
                project={workspaceData?.projects}
                members={workspaceData?.members}
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
            members={workspaceData?.members}
            project={workspaceData?.projects}
          />
        </Modal>
      )}
    </div>
  );
}

export default TaskPage;
