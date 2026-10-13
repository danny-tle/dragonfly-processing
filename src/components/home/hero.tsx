import Link from "next/link";
import { featuredProducts } from "@/data/home";
import { ProductBox } from "@/components/product-box";

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pt-20 pb-24 text-center sm:pt-28 md:px-12">
      <h1 className="max-w-4xl text-5xl font-medium leading-[1.05] text-balance sm:text-7xl">
        To elevate cannabis from commodity to{" "}
        <span className="font-display font-light italic">craft.</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
        Dragonfly is Utah&apos;s craft cannabis brand, built for the curious and the committed.
        Find our products at licensed medical cannabis pharmacies across the state.
      </p>

      <ul className="mt-16 flex w-full flex-wrap items-end justify-center gap-6 sm:gap-10 lg:justify-between lg:gap-0 lg:px-[4%]">
        {featuredProducts.map((product, index) => (
          <li
            key={product.strain}
            className={index % 2 === 1 ? "sm:-translate-y-4" : undefined}
          >
            <ProductBox {...product} />
          </li>
        ))}
      </ul>

      <Link
        href="/where-to-buy"
        className="mt-16 rounded-full border border-primary px-16 py-4 font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
      >
        Where to find
      </Link>
    </section>
  );
}
