"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  // TODO(human): decide when this link counts as "active"
  const isActive = false;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-primary underline underline-offset-8" : "text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
