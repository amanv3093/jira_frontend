import React from "react";
import type { Metadata } from "next";
import WorkspacePage from "./_components/workspace-page";

export const metadata: Metadata = { title: "Dashboard" };

function page() {
  return (
    <div className="p-4">
      <WorkspacePage />
    </div>
  );
}

export default page;
