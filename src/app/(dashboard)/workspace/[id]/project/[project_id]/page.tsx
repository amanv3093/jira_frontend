import React from "react";
import type { Metadata } from "next";
import ProjectPage from "./_component/project-page";

export const metadata: Metadata = { title: "Project" };

function page() {
  return (
    <div className="p-4">
      <ProjectPage />
    </div>
  );
}

export default page;
