import type { FeaturedProduct, StrainType } from "@/data/home";

const tabColor: Record<StrainType, string> = {
  sativa: "bg-sativa text-white",
  indica: "bg-indica text-white",
  hybrid: "bg-hybrid text-ink",
};

// A CSS drawing of the vape pod box from Brand Guidelines 4.7.
// placeholder for images
export function ProductBox({ strain, type, extraction }: FeaturedProduct) {
  return (
    <div
      className="flex aspect-[3/5] w-[8em] flex-col rounded-sm bg-sage p-[0.625em] text-left text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[26px] shadow-[12px_18px_30px_-12px_rgb(33_33_33/0.45)]"
      aria-label={`${strain}, ${type}, ${extraction}`}
      role="img"
    >
      <p className="mt-[0.75em] text-center text-[1.125em] font-medium tracking-normal text-foil">Dragonfly</p>
      <p className="mt-auto text-[0.5em] font-semibold uppercase leading-tight tracking-wider text-linen">
        Cannabis
        <br />
        Vape Pod
      </p>

      <div className="mt-[0.5em] flex bg-white text-ink">
        <div className="flex min-w-0 flex-1 flex-col gap-[0.25em] p-[0.375em]">
          <span className="text-[0.4em] font-semibold uppercase tracking-wider opacity-60">
            Strain
          </span>
          <span className="text-[0.6em] font-bold uppercase leading-none">{strain}</span>
          <span className="mt-1 text-[0.5em] font-semibold uppercase">{extraction}</span>
          <span className="mt-1 text-[0.4em] font-semibold uppercase tracking-wider opacity-60">
            Solventless · 1g
          </span>
        </div>
        <div
          className={`flex w-[0.875em] items-center justify-center ${tabColor[type]}`}
          aria-hidden="true"
        >
          <span className="rotate-90 text-[0.4em] font-bold uppercase tracking-widest">
            {type}
          </span>
        </div>
      </div>
    </div>
  );
}
