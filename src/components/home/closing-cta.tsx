import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col items-start gap-8 rounded-2xl bg-surface p-10 sm:flex-row sm:items-end sm:justify-between sm:p-14">
        <p className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          We take the plant seriously so you can take it personally.
        </p>
        <Link
          href="/where-to-buy"
          className="shrink-0 rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
        >
          Where to buy
        </Link>
      </div>
    </section>
  );
}
