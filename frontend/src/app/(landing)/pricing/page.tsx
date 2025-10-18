"use client";
import React from "react";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { CheckIcon, Cpu, Sparkles, XIcon } from "lucide-react";
import Link from "next/link";
import { TextHoverEffect } from "@/components/Global/text/text-hover-effect";
import { Button } from "@/components/ui/button";

const page = () => {
  const tableData = [
    {
      feature: "Basic Synthetic Datasets",
      free: true,
      pro: true,
      startup: true,
    },
    {
      feature: "Monthly Downloads",
      free: "100",
      pro: "1,000",
      startup: "Unlimited",
    },
    {
      feature: "Data Visualization Types",
      free: "3",
      pro: "10+",
      startup: "All Types",
    },
    {
      feature: "Export Formats",
      free: "CSV",
      pro: "CSV, JSON, Parquet",
      startup: "All Formats",
    },
    { feature: "AI Model Access", free: false, pro: true, startup: true },
    {
      feature: "Video Calls",
      free: "-",
      pro: "12 sessions",
      startup: "Unlimited",
    },
    {
      feature: "Support Response Time",
      free: "-",
      pro: "24 hours",
      startup: "Priority",
    },
    {
      feature: "Security & Compliance",
      free: "-",
      pro: "Standard",
      startup: "Enterprise-Grade",
    },
  ];

  return (
    <section className="bg-[#090A0B]  pb-2">
      <TextHoverEffect text="PRICING" />
      <div className="flex flex-wrap items-center justify-center flex-col md:flex-row gap-8 -mt-20">
        {/* Hobby Plan */}
        <CardContainer className="inter-var">
          <CardBody className="relative group/card hover:shadow-2xl hover:shadow-neutral-500/[0.1] bg-black border-white/[0.2] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-xl font-bold text-white">
              Hobby
              <h2 className="text-6xl">$0</h2>
            </CardItem>
            <CardItem
              translateZ="60"
              className="text-sm max-w-sm mt-2 text-neutral-300"
            >
              Perfect for individuals exploring synthetic data visualization and
              basic auditing capabilities.
              <ul className="my-4 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> Basic
                  synthetic datasets
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> 100 monthly
                  downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> Standard data
                  visualization
                </li>
              </ul>
            </CardItem>
            <div className="flex justify-between items-center mt-8">
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl text-xs font-normal text-white"
              >
                <Link href={"/signup"}>Try now →</Link>
              </CardItem>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                <Link href={"/signup"}>Get Started Now</Link>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>

        {/* Pro Plan */}
        <CardContainer className="inter-var">
          <CardBody className="relative group/card hover:shadow-neutral-500/[0.1] bg-black border-[#E2CBFF] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-xl font-bold text-white">
              Pro Plan
              <h2 className="text-6xl">$29</h2>
            </CardItem>
            <CardItem
              translateZ="60"
              className="text-sm max-w-sm mt-2 text-neutral-300"
            >
              Ideal for professionals needing advanced data visualization,
              detailed auditing, and multiple export formats.
              <ul className="my-4 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> Advanced
                  synthetic datasets
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> 1,000 monthly
                  downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> 10+
                  visualization types
                </li>
              </ul>
            </CardItem>
            <div className="flex justify-between items-center mt-8">
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl text-xs font-normal text-white"
              >
                <Link href={"/signup"}>Try now →</Link>
              </CardItem>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                <Link href={"/signup"}>Get Started Now</Link>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>

        {/* Unlimited Plan */}
        <CardContainer className="inter-var">
          <CardBody className="relative group/card hover:shadow-2xl hover:shadow-neutral-500/[0.1] bg-black border-white/[0.2] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-xl font-bold text-white">
              Unlimited
              <h2 className="text-6xl">$99</h2>
            </CardItem>
            <CardItem
              translateZ="60"
              className="text-sm max-w-sm mt-2 text-neutral-300"
            >
              Enterprise-grade solution with unlimited access, custom datasets,
              premium support, and full API integration.
              <ul className="my-4 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> Custom
                  synthetic datasets
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> Unlimited
                  downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" /> Full API
                  access
                </li>
              </ul>
            </CardItem>
            <div className="flex justify-between items-center mt-8">
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl text-xs font-normal text-white"
              >
                <Link href={"/signup"}>Try now →</Link>
              </CardItem>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                <Link href={"/signup"}>Get Started Now</Link>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>

      {/* Comparison Table */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="w-full overflow-auto lg:overflow-visible">
            <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full dark:[--color-muted:var(--color-zinc-900)]">
              <thead className="bg-background sticky top-0">
                <tr className="*:py-4 *:text-left *:font-medium">
                  <th className="lg:w-2/5"></th>
                  <th className="space-y-3">
                    <span className="block">Free</span>

                    <Button asChild variant="outline" size="sm">
                      <Link href="#">Get Started</Link>
                    </Button>
                  </th>
                  <th className="bg-muted rounded-t-(--radius) space-y-3 px-4">
                    <span className="block">Pro</span>
                    <Button asChild size="sm">
                      <Link href="#">Get Started</Link>
                    </Button>
                  </th>
                  <th className="space-y-3">
                    <span className="block">Startup</span>
                    <Button asChild variant="outline" size="sm">
                      <Link href="#">Get Started</Link>
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="text-caption text-sm">
                <tr className="*:py-3">
                  <td className="flex items-center gap-2 font-medium">
                    <Cpu className="size-4" />
                    <span>Features</span>
                  </td>
                  <td></td>
                  <td className="bg-muted border-none px-4"></td>
                  <td></td>
                </tr>
                {tableData.slice(-4).map((row, index) => (
                  <tr key={index} className="*:border-b *:py-3">
                    <td className="text-muted-foreground">{row.feature}</td>
                    <td>
                      {row.free === true ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="bg-muted border-none px-4">
                      <div className="-mb-3 border-b py-3">
                        {row.pro === true ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          row.pro
                        )}
                      </div>
                    </td>
                    <td>
                      {row.startup === true ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        row.startup
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="*:pb-3 *:pt-8">
                  <td className="flex items-center gap-2 font-medium">
                    <Sparkles className="size-4" />
                    <span>AI Models</span>
                  </td>
                  <td></td>
                  <td className="bg-muted border-none px-4"></td>
                  <td></td>
                </tr>
                {tableData.map((row, index) => (
                  <tr key={index} className="*:border-b *:py-3">
                    <td className="text-muted-foreground">{row.feature}</td>
                    <td>
                      {row.free === true ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="bg-muted border-none px-4">
                      <div className="-mb-3 border-b py-3">
                        {row.pro === true ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          row.pro
                        )}
                      </div>
                    </td>
                    <td>
                      {row.startup === true ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        row.startup
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="*:py-6">
                  <td></td>
                  <td></td>
                  <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  );
};

export default page;
