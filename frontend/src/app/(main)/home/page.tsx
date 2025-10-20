import { Metadata } from "next";

import { currentUser } from "@clerk/nextjs/server";
import { OverviewHeader } from "./components/overview/OverviewHeader";
import { OverviewTabs } from "./components/overview/OverviewTabs";

export const metadata: Metadata = {
  title: "Home ",
  description:
    "All the workflows, credentials and data tables you have access to",
};

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "there";

  return (
    <div className="flex h-full flex-col">
      <OverviewHeader />
      <OverviewTabs userName={firstName} />
    </div>
  );
}
