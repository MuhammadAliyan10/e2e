import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function SidebarLogo({ className }: LogoProps) {
  return (
    <Image
      className={className}
      src="/logo.png"
      alt="Logo"
      width={22}
      height={22}
    />
  );
}
