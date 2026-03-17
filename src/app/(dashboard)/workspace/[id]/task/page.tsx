import React from "react";
import type { Metadata } from "next";
import TaskPage from "./_components/task-page";

export const metadata: Metadata = { title: "Tasks" };

function page() {
  return (
    <div className="p-4">
      <TaskPage />
    </div>
  );
}

export default page;
