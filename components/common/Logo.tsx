import Link from "next/link";
import Image from "next/image";
import KracadaLogo from "@/app/assets/images/kracada_logo.svg";

interface LogoProps {
  className?: string;
  linkClassName?: string;
  variant?: "default" | "white";
  to?: string;
}

export function Logo({
  className,
  linkClassName,
  variant = "default",
  to = "/",
}: LogoProps) {
  return (
    <Link href={to}>
      <Image
        src={KracadaLogo}
        alt="Kracada Logo"
        width={113}
        height={36}
        priority
        className={className}
      />
    </Link>
  );
}
