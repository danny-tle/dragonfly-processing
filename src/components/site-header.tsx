import Link from "next/link";
import { NavLink } from "./nav-link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/where-to-buy", label: "Where to Buy" },
];

export function SiteHeader() {
  return (

    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 px-6 py-6 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 md:px-12">
        <nav aria-label="Main" className="order-2 md:order-none">
          <ul className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Placeholder until assets are granted */}
        <Link href="/" className="order-1 text-3xl font-medium text-primary md:order-none">
          Dragonfly
        </Link>

        <div className="hidden justify-end md:flex">
          <Link
            href="/where-to-buy"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90"
          >
            Find a pharmacy
          </Link>
        </div>
      </div>
    </header>
  );
}
