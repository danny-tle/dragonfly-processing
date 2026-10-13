import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-on-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-2xl font-medium">Dragonfly</p>
          <p className="text-sm opacity-80">
            Utah&apos;s craft cannabis brand, built for the curious and the committed.
          </p>
        </div>

        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/products" className="hover:underline">Products</Link>
          </li>
          <li>
            <Link href="/where-to-buy" className="hover:underline">Where to Buy</Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">About</Link>
          </li>
        </ul>
      </div>

      <div className="border-t border-on-primary/20">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs opacity-70">
          © {new Date().getFullYear()} Dragonfly Cannabis. For use by registered Utah medical
          cannabis patients only.
        </p>
      </div>
    </footer>
  );
}
