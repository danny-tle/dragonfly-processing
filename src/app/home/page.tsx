import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { Pillars } from "@/components/home/pillars";
import { ClosingCta } from "@/components/home/closing-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <Pillars />
      <ClosingCta />
    </>
  );
}
