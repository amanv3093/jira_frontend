"use client";
import Modal from "@/components/modal/custom-modal";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import TaskCreateModal from "./task-create-modal";
import { useParams } from "next/navigation";
import TaskTable from "./table/table";
import { Task, TaskStatus } from "@/types";

function TaskPage() {
  const params = useParams();
  const projectId = params?.project_id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);
  const tasks: Task[] = [
    {
      id: "1",
      task_name: "Task A",
      status: TaskStatus.BACKLOG,
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
      status: TaskStatus.IN_PROGRESS,
      assignments: [
        { userId: "1", assignedAt: "2025-10-03T12:00:00Z" },
        { userId: "2", assignedAt: "2025-10-03T14:00:00Z" },
      ],

      projectId: "Project Y",
      dueDate: "2025-10-15T12:00:00Z",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <p>Task Page</p>
        <Button>Create</Button>
      </div>
      <TaskTable data={tasks} />
      {/* {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={onClose}>
          <TaskCreateModal onClose={onClose} workspaces={workspaces} />
        </Modal>
      )} */}
    </div>
  );
}

export default TaskPage;
