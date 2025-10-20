"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowsTab } from "./tabs/WorkflowsTab";
import { CredentialsTab } from "./tabs/CredentialsTab";
import { ExecutionsTab } from "./tabs/ExecutionsTab";

interface OverviewTabsProps {
  userName: string;
}

export function OverviewTabs({ userName }: OverviewTabsProps) {
  const [activeTab, setActiveTab] = useState("workflows");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex h-full flex-col px-4"
    >
      <TabsList className="mb-8 h-auto w-full justify-start gap-6 border-b border-border/50 bg-transparent p-0">
        <TabsTrigger
          value="workflows"
          className="relative rounded-none border-b-2 border-transparent pb-3 pt-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          Workflows
        </TabsTrigger>
        <TabsTrigger
          value="credentials"
          className="relative rounded-none border-b-2 border-transparent pb-3 pt-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          Credentials
        </TabsTrigger>
        <TabsTrigger
          value="executions"
          className="relative rounded-none border-b-2 border-transparent pb-3 pt-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          Executions
        </TabsTrigger>
        {/* <TabsTrigger
          value="data-tables"
          className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent pb-3 pt-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          Data tables
          <Badge
            variant="secondary"
            className="bg-muted/50 text-xs font-normal text-muted-foreground"
          >
            Beta
          </Badge>
        </TabsTrigger> */}
      </TabsList>

      <TabsContent value="workflows" className="flex-1">
        <WorkflowsTab userName={userName} />
      </TabsContent>
      <TabsContent value="credentials" className="flex-1">
        <CredentialsTab />
      </TabsContent>
      <TabsContent value="executions" className="flex-1">
        <ExecutionsTab />
      </TabsContent>
      {/* <TabsContent value="data-tables" className="flex-1">
        <DataTablesTab />
      </TabsContent> */}
    </Tabs>
  );
}
