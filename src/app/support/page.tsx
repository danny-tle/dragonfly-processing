import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supportDevices } from "@/data/support";

export const metadata: Metadata = {
  title: "Device Manuals | Dragonfly",
  description: "Guides, quick tips and FAQs for Dragonfly devices.",
};

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-28 text-center md:px-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Support</p>
      <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] sm:text-7xl">Device Manuals</h1>
      <p className="mt-5 text-lg text-muted">Select your device to view guides, quick tips, and FAQs.</p>

      <ul className="mx-auto mt-14 grid max-w-3xl gap-6 text-left sm:grid-cols-2">
        {supportDevices.map((device) => (
          <li key={device.slug}>
            <Link
              href={`/support/${device.slug}`}
              className="group flex h-full flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface pb-8 text-center transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(33_33_33/0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span className="block aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={device.hero.image}
                  alt=""
                  width={device.hero.width}
                  height={device.hero.height}
                  sizes="(min-width: 640px) 24rem, 100vw"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </span>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{device.brand}</p>
              <h2 className="mt-1 text-2xl font-semibold">{device.name}</h2>
              <p className="mt-2 max-w-60 text-sm text-muted">{device.summary}</p>
              <span
                aria-hidden="true"
                className="mt-5 grid size-9 place-items-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
