"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQs() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "globe",
      question: "What site types does e2e support?",
      answer:
        "e2e supports SPAs, dynamic forms, and REST endpoints with payloads up to 10 MB per request. We are continuously expanding protocol support based on user feedback.",
    },
    {
      id: "item-2",
      icon: "shield-check",
      question: "Is my workflow data secure when executed?",
      answer:
        "Yes. All workflow sessions are encrypted in transit (TLS 1.3) and at rest (AES-256). We never share your data with third parties, and workflows can be deleted anytime from your dashboard.",
    },
    {
      id: "item-3",
      icon: "line-chart",
      question: "What exactly does an automation workflow include?",
      answer:
        "Each workflow checks for interaction patterns, execution state, conditional branching, and performance benchmarks. You&lsquo;ll receive a detailed trace with visual insights and recommendations to optimize your automation.",
    },
    {
      id: "item-4",
      icon: "database",
      question: "Can e2e integrate with my existing deployment pipeline?",
      answer:
        "Yes. You can use our REST API or SDKs to programmatically define workflows, trigger executions, and fetch results. This makes e2e easy to integrate into CI/CD workflows and orchestration platforms.",
    },
    {
      id: "item-5",
      icon: "credit-card",
      question: "How does billing work?",
      answer:
        "e2e offers a free trial with limited executions. Paid plans are billed monthly or annually, with pricing based on the number of workflows and execution volume. You can upgrade, downgrade, or cancel anytime directly from your account settings.",
    },
    {
      id: "item-6",
      icon: "lock",
      question: "Is e2e compliant with SOC2 and other security standards?",
      answer:
        "Yes. e2e is SOC2 and ISO27001 compliant. We ensure all execution logs are privacy-preserving, and workflows orchestrated with our platform are safe for enterprise use cases.",
    },
  ];

  return (
    <section className="bg-muted dark:bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Left Column */}
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4">
                Can&lsquo;t find what you&lsquo;re looking for? Reach out to our{" "}
                <Link
                  href="/contact"
                  className="text-primary font-medium hover:underline"
                >
                  support team
                </Link>{" "}
                — we&lsquo;re here to help.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base font-medium">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
