import { pillars } from "@/data/home";

export function Pillars() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold sm:text-4xl">What we stand for</h2>
          <p className="max-w-xl text-muted">Our pillars are our values in practice.</p>
        </div>

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar, index) => (
            <li key={pillar.title} className="flex flex-col gap-3 border-t border-foreground pt-4">
              <span className="text-sm font-medium tabular-nums text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold uppercase leading-snug">{pillar.title}</h3>
              <p className="text-sm text-muted">{pillar.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
