"use client";

import { FloatingDockMenu } from "./components/floatingDock/FloatingDock";
import { HeroHeader } from "./components/header/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeroHeader />
      {children}
      {/* <FloatingDockMenu /> */}
    </>
  );
}
