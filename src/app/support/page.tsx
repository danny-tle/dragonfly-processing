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
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-28 md:px-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Support</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] sm:text-7xl">Device Manuals</h1>
        <p className="mt-5 text-lg text-muted">Select your device to view guides, quick tips, and FAQs.</p>
      </div>

      {/* Full-bleed photo banners with the name and tagline laid over them, as in the Figma product banners. */}
      <ul className="mt-14 grid gap-4 md:grid-cols-2">
        {supportDevices.map((device) => (
          <li key={device.slug}>
            <Link
              href={`/support/${device.slug}`}
              className="group relative isolate flex aspect-[1280/995] flex-col justify-end overflow-hidden p-6 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:p-8 lg:p-10"
            >
              <Image
                src={device.banner}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              {/* Keeps the white text readable on the lighter Ember photo. */}
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-tr from-black/45 via-black/10 to-transparent" />

              <h2 className="text-5xl font-medium tracking-[-0.04em] sm:text-6xl">{device.name}</h2>
              <p className="mt-3 max-w-[23rem] text-base leading-snug sm:mt-4">{device.tagline}</p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 bg-white px-4 py-2 text-sm font-medium text-foreground sm:mt-7">
                View manuals <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
