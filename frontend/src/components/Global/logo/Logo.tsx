import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <Image src="/logo.png" alt="Logo" width={32} height={32} />
      <span className="text-lg font-bold">e2e</span>
    </div>
  );
};

export default Logo;
