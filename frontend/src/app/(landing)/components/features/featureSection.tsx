import { cn } from "@/lib/utils";
import {
  Globe,
  Workflow,
  Bot,
  PlayCircle,
  Layers,
  Zap,
  Code,
  Network,
} from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      title: "Intelligent Site Discovery",
      description:
        "Automatically discover websites and extract interactive elements with support for SPAs and dynamic content.",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Advanced Workflow Engine",
      description:
        "Sophisticated AI orchestration handles multi-step workflows and manages execution state across distributed systems.",
      icon: <Workflow className="w-5 h-5" />,
    },
    {
      title: "Context-Aware Execution",
      description:
        "Deep understanding of site context and interaction history enables adaptive automation across web applications.",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      title: "Real-time Orchestration",
      description:
        "Execute complex automation sequences with intelligent retry logic completed within 60 seconds.",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "Interactive Flow Designer",
      description:
        "Design automation logic using visual node graphs, sequence builders, and conditional branching.",
      icon: <Bot className="w-5 h-5" />,
    },
    {
      title: "Reliability Monitoring",
      description:
        "Track execution accuracy and success rates while maintaining performance across workflow iterations.",
      icon: <Network className="w-5 h-5" />,
    },
    {
      title: "Comprehensive Logging",
      description:
        "Generate execution reports with JSON logs containing step-by-step technical execution details.",
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: "Workflow Templates",
      description:
        "Export reusable workflows, execution logs, and site schemas for collaborative automation.",
      icon: <PlayCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="py-20" id="features">
      <div className="px-8">
        <h4 className="text-2xl lg:text-4xl lg:leading-tight max-w-4xl mx-auto text-center tracking-tight font-semibold text-white">
          Enterprise Web Automation Platform
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-center font-normal text-neutral-400">
          Production-ready infrastructure for intelligent web orchestration,
          workflow execution, and automation reliability.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-8 relative group/feature border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l border-neutral-800",
        index < 4 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-900/50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-8 text-primary">{icon}</div>
      <div className="text-lg font-semibold mb-2 relative z-10 px-8">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-400 max-w-xs relative z-10 px-8 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
