import Link from "next/link";
import { categories } from "@/data/home";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold sm:text-4xl">Our products</h2>
        <p className="max-w-xl text-muted">
          We offer the right things, not everything. Each format exists to honor the cultivar it
          came from.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/products#${category.slug}`}
              className="group flex h-full flex-col rounded-2xl bg-surface p-6 transition-colors hover:bg-primary hover:text-on-primary"
            >
              {/* photo placeholders */}
              <div className="aspect-[4/3] rounded-xl bg-border" aria-hidden="true" />
              <h3 className="mt-6 text-xl font-semibold">{category.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted transition-colors group-hover:text-on-primary/80">
                {category.description}
              </p>
              <span className="mt-6 text-sm font-medium underline underline-offset-4">
                Explore
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
