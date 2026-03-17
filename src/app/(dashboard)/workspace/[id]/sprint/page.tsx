import React from "react";
import type { Metadata } from "next";
import SprintPage from "./_components/sprint-page";

export const metadata: Metadata = { title: "Sprints" };

function page() {
  return (
    <div className="p-4">
      <SprintPage />
    </div>
  );
}

export default page;
