import React from "react";

import WavyBackground from "./wavy-background";
import { HoverBorderGradient } from "@/components/Global/ui/hover-border-gradient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/tailark/animated-group";
import { TextEffect } from "@/components/tailark/text-effect";

const Hero = () => {
  const transitionVariants = {
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          type: "spring" as const,
          bounce: 0.3,
          duration: 1.5,
        },
      },
    },
  };

  return (
    <WavyBackground className="flex flex-col items-center justify-center min-h-screen">
      <main className="overflow-hidden">
        <section>
          <div className="relative">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <div className="flex justify-center text-center">
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="button"
                      className="bg-black  text-white flex items-center space-x-2 px-4 py-3"
                    >
                      <span>Intelligent Web Automation Platform</span>
                    </HoverBorderGradient>
                  </div>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-4 text-balance text-6xl md:text-7xl lg:mt-10 xl:text-[5.25rem]"
                >
                  Automate Any Web Workflow with AI Intelligence
                </TextEffect>

                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-4 max-w-2xl text-balance text-lg"
                >
                  A revolutionary solution for automated web interactions —
                  discover sites, execute workflows, and orchestrate tasks
                  intelligently with AI.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/signup">
                        <span className="text-nowrap">Get Started</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="#features">
                      <span className="text-nowrap">Explore Features</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </WavyBackground>
  );
};

export default Hero;
