import React from "react";
import type { Metadata } from "next";
import MemberPage from "./_components/member-page";

export const metadata: Metadata = { title: "Members" };

function page() {
  return (
    <div className="p-4">
      <MemberPage />
    </div>
  );
}

export default page;
