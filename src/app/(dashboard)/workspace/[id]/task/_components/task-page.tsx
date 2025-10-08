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
import { Search } from "lucide-react";

function TaskPage() {
  const params = useParams();
  const workspaceId = params?.id as string;
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
        <Button onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>
      <div className="">
        
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
        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedProjects([]);
              setSelectedUsers([]);
              setSelectedStatuses([]);
              setSelectedPriorities([]);
            }}
          >
            Clear
          </Button>
        </div> */}
      </div>
      <TaskTable data={task} />

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
