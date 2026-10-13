import Link from "next/link";
import { NavLink } from "./nav-link";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/where-to-buy", label: "Where to Buy" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Placeholder wordmark until Dragonfly sends the SVG lockup */}
        <Link href="/" className="text-2xl font-medium text-primary">
          Dragonfly
        </Link>

        <nav aria-label="Main">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
