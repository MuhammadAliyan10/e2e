import { Suspense } from "react";
import { Metadata } from "next";
import { DashboardHeader } from "../components/(dashboard)/DashboardHeader";
import { StatsGrid } from "../components/(dashboard)/stats/StatGrid";
import { ChartsSection } from "../components/(dashboard)/charts/ChartSection";
import { ActivitySection } from "../components/(dashboard)/ActivitySection";
import { DashboardSkeleton } from "../components/(dashboard)/DashboardSkeleton";

export const metadata: Metadata = {
  title: "Dashboard ",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  return (
    <>
      <DashboardHeader />
      <StatsGrid />
      <ChartsSection />
      <ActivitySection />
    </>
  );
}
