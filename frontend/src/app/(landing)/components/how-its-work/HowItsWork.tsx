import React from "react";

import CardFlip from "@/components/tailark/card-flip";

const HowItsWork = () => {
  return (
    <section className="my-12 px-8">
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white">
          How e2e Works
        </h2>
        <p className="mt-4 text-sm lg:text-base font-normal text-neutral-400">
          Our intelligent four-step orchestration helps you seamlessly discover
          and automate web workflows—ensuring reliability, observability, and
          scalability at scale.
        </p>
      </div>

      {/* Steps */}
      <div className="flex w-full flex-wrap items-center justify-center gap-10 mt-12">
        <CardFlip
          title="1. Discover Target Sites"
          subtitle="Intelligent site mapping"
          description="Automatically discover websites and extract interactive elements. All sessions are isolated and sandboxed for maximum security."
          features={["SPAs", "Forms", "APIs", "Dynamic Content"]}
          buttonText="Start Discovery"
        />

        <CardFlip
          title="2. Build Workflow Logic"
          subtitle="AI-powered orchestration"
          description="Our engine analyzes site structure for interaction patterns, conditional branching, and execution dependencies—providing production-ready automation."
          features={[
            "Visual Designer",
            "Conditional Logic",
            "State Management",
            "Error Handling",
          ]}
          buttonText="Design Workflow"
        />

        <CardFlip
          title="3. Monitor & Optimize"
          subtitle="Real-time observability"
          description="Get comprehensive execution dashboards that surface latency, failures, and optimization opportunities in your automated workflows."
          features={["Metrics", "Traces", "Alerts", "Performance Analytics"]}
          buttonText="View Monitoring"
        />

        <CardFlip
          title="4. Export Configurations"
          subtitle="Share with teams"
          description="Download reusable workflow definitions and execution logs in multiple formats for version control or deployment automation."
          features={["JSON", "YAML", "OpenAPI", "Terraform"]}
          buttonText="Download Config"
        />
      </div>
    </section>
  );
};

export default HowItsWork;
