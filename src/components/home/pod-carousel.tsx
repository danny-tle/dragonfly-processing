"use client";

import { useEffect, useState } from "react";
import type { FeaturedProduct } from "@/data/home";
import { ProductBox } from "@/components/product-box";

const STEP_MS = 2000;
const VISIBLE_RADIUS = 2; // pods at offsets -2…+2 are shown

// Distance between pod `index` and the active pod.
// 0 = centered, negative = to the left, positive = to the right.
function getOffset(index: number, active: number, count: number): number {
  const half = Math.floor(count / 2);
  return ((index - active + half + count) % count) - half;
}

export function PodCarousel({ products }: { products: FeaturedProduct[] }) {
  // Two copies of the lineup: only the middle 5 slots are visible, so a pod can
  // wrap from one end to the other while it's hidden off to the side.
  const slots = [...products, ...products];
  const count = slots.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A fresh timeout after every change keeps the rhythm even, including after a click.
    const id = setTimeout(() => setActive((a) => (a + 1) % count), STEP_MS);
    return () => clearTimeout(id);
  }, [active, paused, count]);

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Featured vape pods"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full overflow-hidden py-14 [--step:9.5rem] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:[--step:12rem] lg:[--step:15rem] xl:[--step:19rem]"
    >
      <div className="invisible flex justify-center" aria-hidden="true">
        <ProductBox {...products[0]} />
      </div>

      {slots.map((product, index) => {
        const offset = getOffset(index, active, count);
        const previous = getOffset(index, (active - 1 + count) % count, count);
        // Only ever true for a hidden pod, so the jump happens out of sight.
        const wrapping = Math.abs(offset - previous) > 1;
        const isCenter = offset === 0;
        const hidden = Math.abs(offset) > VISIBLE_RADIUS;

        return (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${product.strain}`}
            aria-current={isCenter ? "true" : undefined}
            aria-hidden={hidden || undefined}
            tabIndex={hidden ? -1 : undefined}
            className="absolute top-1/2 left-1/2 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            style={{
              transform: `translate(-50%, -50%) translateX(calc(var(--step) * ${offset})) scale(${isCenter ? 1.2 : 0.85})`,
              transition: wrapping ? "none" : "transform 700ms, opacity 700ms",
              opacity: hidden ? 0 : Math.abs(offset) === VISIBLE_RADIUS ? 0.55 : 1,
              pointerEvents: hidden ? "none" : undefined,
              zIndex: 10 - Math.abs(offset),
            }}
          >
            <ProductBox {...product} />
          </button>
        );
      })}
    </div>
  );
}
