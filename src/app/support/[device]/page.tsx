import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading, TipIcon, temperatureColor } from "@/components/support/parts";
import { getSupportDevice, supportDevices, type SupportResource } from "@/data/support";

// Only the devices listed in the support data have pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return supportDevices.map((device) => ({ device: device.slug }));
}

export async function generateMetadata(props: PageProps<"/support/[device]">): Promise<Metadata> {
  const device = getSupportDevice((await props.params).device);
  if (!device) return {};
  return {
    title: `${device.name} Support | Dragonfly`,
    description: `Manuals, quick tips and FAQs for the Dragonfly ${device.name}.`,
  };
}

export default async function DeviceSupportPage(props: PageProps<"/support/[device]">) {
  const device = getSupportDevice((await props.params).device);
  if (!device) notFound();

  return (
    <div className="pb-28">
      <section className="mx-auto max-w-6xl px-6 pt-10 md:px-12">
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span> Back to manuals
        </Link>

        <div className="mt-6 grid items-center gap-10 md:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Support</p>
            <h1 className="mt-5">
              <Image
                src={device.wordmark.image}
                alt={device.name}
                width={device.wordmark.width}
                height={device.wordmark.height}
                priority
                className="h-10 w-auto max-w-full sm:h-12"
              />
            </h1>
            <p className="mt-5 max-w-lg text-xl leading-snug sm:text-2xl">{device.tagline}</p>
            <p className="mt-4 max-w-md text-muted">
              Have questions about {device.name}? Find guides, quick tips and answers below.
            </p>
            <Link
              href="/hardware"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              See {device.name} up close <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Lifestyle photo from the product banner design, cropped clear of its baked-in text. */}
          <Image
            src={device.hero.image}
            alt={`Dragonfly ${device.name} outdoors`}
            width={device.hero.width}
            height={device.hero.height}
            priority
            sizes="(min-width: 768px) 22rem, 100vw"
            className="w-full rounded-2xl object-cover shadow-[0_24px_48px_-28px_rgb(33_33_33/0.6)] max-md:max-h-[70svh]"
          />
        </div>
      </section>

      <section aria-label="Guides" className="mx-auto mt-14 grid max-w-6xl gap-8 px-6 md:grid-cols-2 md:px-12">
        <ResourceCard resource={device.manual} />
        <ResourceCard resource={device.howTo} />
      </section>

      {device.gallery && (
        <section aria-label={`${device.name} photos`} className="mx-auto mt-8 max-w-6xl px-6 md:px-12">
          {/* Smaller shots in a block beside one large photo, as in the product page design. With three photos the two small ones stack as wide tiles. */}
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2">
            {device.gallery.map((photo, index) => (
              <li
                key={photo.image}
                className={
                  index === 0
                    ? "col-span-2 overflow-hidden rounded-xl md:col-start-3 md:row-span-2 md:row-start-1"
                    : `overflow-hidden rounded-xl ${device.gallery!.length === 3 ? "col-span-2 sm:col-span-1 md:col-span-2" : ""}`
                }
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={index === 0 || device.gallery!.length === 3 ? "(min-width: 768px) 36rem, 100vw" : "(min-width: 768px) 18rem, 50vw"}
                  className="size-full object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-20 px-6 md:px-12">
        <section aria-labelledby="quick-tips">
          <SectionHeading id="quick-tips">Quick tips</SectionHeading>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {device.quickTips.map((tip) => (
              <li key={tip.title} className="rounded-xl border border-border bg-surface p-6">
                <TipIcon icon={tip.icon} />
                <h3 className="mt-4 font-semibold">{tip.title}</h3>
                <p className="mt-2 text-sm text-muted">{tip.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {device.diagram && (
          <section aria-labelledby="know-your-device">
            <SectionHeading id="know-your-device">Know your {device.name}</SectionHeading>
            <figure className="mt-10 flex justify-center sm:justify-start sm:pl-[12%]">
              {/* Drawing on the left; each part's name sits to the right, joined by a leader line. */}
              <div className="relative mr-48 h-[26rem] sm:mr-72 sm:h-[34rem]" style={{ aspectRatio: `${device.diagram.width} / ${device.diagram.height}` }}>
                <Image
                  src={device.diagram.image}
                  alt={`Line drawing of the ${device.name} taken apart`}
                  width={device.diagram.width}
                  height={device.diagram.height}
                  className="size-full"
                />
                <ol>
                  {device.diagram.parts.map((part) => (
                    <li key={part.label}>
                      <span
                        aria-hidden="true"
                        className="absolute h-px bg-primary/60"
                        style={{ top: `${part.y * 100}%`, left: `${part.x * 100}%`, right: "-2.25rem" }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                        style={{ top: `${part.y * 100}%`, left: `${part.x * 100}%` }}
                      />
                      <span
                        className="absolute left-[calc(100%+2.75rem)] w-40 -translate-y-1/2 text-xs leading-snug font-medium sm:w-60 sm:text-sm"
                        style={{ top: `${part.y * 100}%` }}
                      >
                        {part.label}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </figure>
          </section>
        )}

        {device.podDetection && (
          <section aria-labelledby="pod-detection">
            <SectionHeading id="pod-detection">Smart pod detection</SectionHeading>
            <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {device.podDetection.map((row) => (
                <li key={row.light} className="flex flex-col items-center rounded-xl border border-border bg-surface px-4 py-6 text-center">
                  <span
                    aria-hidden="true"
                    className="size-9 rounded-full border border-foreground/20"
                    style={{ backgroundColor: row.color }}
                  />
                  <h3 className="mt-3 font-semibold">{row.light}</h3>
                  <p className="mt-1 text-sm text-muted">{row.pod}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {device.specs && (
          <section aria-labelledby="specifications">
            <SectionHeading id="specifications">Specifications</SectionHeading>
            <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {device.specs.map((spec) => (
                <div key={spec.label} className="flex flex-col-reverse items-center rounded-xl border border-border bg-surface px-4 py-5 text-center">
                  <dt className="mt-1 text-sm text-muted">{spec.label}</dt>
                  <dd className="text-lg font-semibold tabular-nums">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {device.inTheBox && (
          <section aria-labelledby="in-the-box">
            <SectionHeading id="in-the-box">In the box</SectionHeading>
            <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {device.inTheBox.map((item) => (
                <li key={item} className="rounded-xl border border-border bg-surface px-4 py-5 text-center text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {device.temperatureGuide && (
          <section aria-labelledby="temperature-guide">
            <SectionHeading id="temperature-guide">Temperature guide</SectionHeading>
            <p className="mt-6 max-w-2xl text-muted">
              Each compound starts to vaporize at its own temperature. Lower settings favor flavor and terpenes;
              the recommended flower range is 320–430°F.
            </p>
            <div className="mt-8 flex max-w-xl gap-5">
              <span
                aria-hidden="true"
                className="w-2 shrink-0 rounded-full"
                style={{ background: `linear-gradient(to bottom, ${temperatureColor(446)}, ${temperatureColor(372)}, ${temperatureColor(298)})` }}
              />
              <ol className="flex-1 divide-y divide-border">
                {device.temperatureGuide.map((row) => (
                  <li key={row.temp} className="flex items-center gap-4 py-2.5">
                    <span className="w-14 shrink-0 text-sm font-semibold tabular-nums">{row.temp}°F</span>
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: temperatureColor(row.temp) }}
                    />
                    <span className={row.kind === "limit" ? "text-sm text-muted italic" : "text-sm"}>{row.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <section aria-labelledby="faq">
          <SectionHeading id="faq">Frequently asked questions</SectionHeading>
          <div className="mt-6 border-b border-foreground/70">
            {device.faqs.map((faq) => (
              <details key={faq.question} className="group border-t border-foreground/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span aria-hidden="true" className="relative size-3.5 shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/** A manual or how-to guide: a PDF that opens in a new tab, or a video that plays in place. */
function ResourceCard({ resource }: { resource: SupportResource }) {
  if (resource.video) {
    return (
      <figure className="flex flex-col items-center gap-4">
        <video
          controls
          preload="none"
          poster={resource.image}
          className="aspect-[884/466] w-full rounded-xl bg-foreground shadow-[0_18px_40px_-24px_rgb(33_33_33/0.6)]"
        >
          <source src={resource.video} type="video/mp4" />
          Your browser can&apos;t play this video.{" "}
          <a href={resource.video}>Download it instead.</a>
        </video>
        <figcaption className="text-lg font-semibold">{resource.title}</figcaption>
      </figure>
    );
  }

  return (
    <a
      href={resource.href}
      target="_blank"
      rel="noopener"
      className="group flex flex-col items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="flex aspect-[884/466] w-full items-center justify-center overflow-hidden rounded-xl bg-surface p-4">
        <Image
          src={resource.image}
          alt=""
          width={resource.width}
          height={resource.height}
          loading="eager"
          className="max-h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      </span>
      <span className="text-lg font-semibold">
        {resource.title}
        <span className="ml-2 text-sm font-medium text-muted group-hover:text-primary">PDF ↗</span>
      </span>
    </a>
  );
}
