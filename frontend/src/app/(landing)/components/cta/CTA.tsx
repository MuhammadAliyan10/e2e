import React from "react";
import { Vortex } from "./vortex";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="w-full mx-auto h-[32rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 text-center w-full h-full"
      >
        {/* Heading */}
        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
          Accelerate Your Automation
        </h2>

        {/* Subtext */}
        <p className="text-white/80 text-base md:text-xl lg:text-2xl max-w-2xl mt-6">
          Join enterprise teams who have already revolutionized their operations
          with our intelligent orchestration platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          {/* Primary Button */}
          <button
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm md:text-base
                       transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-primary  focus:ring-offset-2 focus:ring-offset-black"
          >
            <Link href={"/signup"}> Get Started</Link>
          </button>

          {/* Secondary Button */}
          <button
            className="px-6 py-3 rounded-xl border border-white/30 text-white font-medium text-sm md:text-base
                       transition-all duration-300 hover:bg-white/10 hover:border-white/60
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            Learn More
          </button>
        </div>
      </Vortex>
    </section>
  );
};

export default CTA;
