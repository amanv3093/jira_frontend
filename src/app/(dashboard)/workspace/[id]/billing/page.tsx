import React from "react";
import type { Metadata } from "next";
import BillingPage from "./_components/billing-page";

export const metadata: Metadata = { title: "Billing" };

export default function Billing() {
  return <BillingPage />;
}
