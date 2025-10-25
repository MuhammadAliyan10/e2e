import React from "react";

import WavyBackground from "./wavy-background";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { ContainerScroll } from "@/components/Global/ContainerScroll";

const Hero = () => {
  return (
    <>
      <WavyBackground className="flex flex-col items-center justify-center min-h-[200vh]">
        <section className="h-screen w-full rounded-md!overflow-visible relative flex flex-col items-center  antialiased pb-[10rem]">
          <div className="absolute inset-0  h-full w-full items-center px-5 py-24 "></div>
          <div className="flex flex-col mt-[-140px] md:mt-[-50px]">
            <ContainerScroll
              titleComponent={
                <div className="flex items-center flex-col z-100">
                  <Button
                    size={"lg"}
                    className="p-8 mb-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                  >
                    <Link
                      href="/register"
                      className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black"
                    >
                      Start For Free Today
                    </Link>
                  </Button>
                  <h1 className="text-5xl md:text-8xl  bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-sans font-bold">
                    Manage your web tasks with automation
                  </h1>
                </div>
              }
            >
              <Image
                src={`/Home.png`}
                alt="hero"
                height={720}
                width={1400}
                className="mx-auto rounded-2xl object-cover h-full object-fit z-20"
                draggable={false}
              />
            </ContainerScroll>
          </div>
        </section>
      </WavyBackground>
    </>
  );
};

export default Hero;
