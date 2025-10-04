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
// import { Task, TaskStatus } from "@/types";

function TaskPage() {
  const params = useParams();
  const workspaceId = params?.id as string;
  const { data: task, isLoading: taskLoading } = useGetTaskByWorkspaceId(workspaceId);
  const { data: workspaceData , isLoading:workspaceLoading} = useGetWorkspaceById(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);
  const tasks = [
    {
      id: "1",
      task_name: "Task A",
      status: "BACKLOG",
      assignments: [
        { userId: "1", assignedAt: "2025-10-03T12:00:00Z" },
        { userId: "2", assignedAt: "2025-10-03T14:00:00Z" },
      ],
      projectId: "Project X",
      dueDate: "2025-10-10T12:00:00Z",
    },
    {
      id: "2",
      task_name: "Task B",
      status: "IN_PROGRESS",
      assignments: [
        { userId: "1", assignedAt: "2025-10-03T12:00:00Z" },
        { userId: "2", assignedAt: "2025-10-03T14:00:00Z" },
      ],

      projectId: "Project Y",
      dueDate: "2025-10-15T12:00:00Z",
    },
  ];
  if (taskLoading || workspaceLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }
  console.log("task",task)
  return (
    <div>
      <div className="flex justify-between items-center">
        <p>Task Page</p>
        <Button onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>
      <TaskTable data={task} />
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={onClose}>
          <TaskCreateModal onClose={onClose} members={workspaceData?.members} project={workspaceData?.projects}/>
        </Modal>
      )}
    </div>
  );
}

export default TaskPage;
