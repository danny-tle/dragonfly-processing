"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FRAME_ASPECT,
  FRAME_CROP,
  type Device,
  type ExplodedView,
  type HardwareChapter,
} from "@/data/hardware";
import { ExplodedOverlay, PartsPanel, drawExploded } from "./exploded-view";
import { useVideoFrames, type FrameSet } from "./use-video-frames";

// Orbit drawn around the device, in SVG viewBox units.
const ORBIT = { cx: 500, cy: 210, rx: 480, ry: 170 };
/** How long one full auto-rotation takes. */
const SPIN_PERIOD_MS = 6000;
/** Extra turns added by scrolling from the top of the story to the bottom. */
const SCROLL_TURNS = 2;
/** Width of the crossfade between devices, as a fraction of a turn, centred on the back view. */
const SWAP_BLEND = 0.1;
/** Time constant for the fast spin when jumping to a device with the toggle. */
const JUMP_EASE_MS = 180;
/** Time constant for parts separating and coming back together. */
const EXPLODE_EASE_MS = 260;

const pad = (value: number) => String(value).padStart(2, "0");
const mod = (value: number, by: number) => ((value % by) + by) % by;
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (value: number) => value * value * (3 - 2 * value);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Draws one device at `turn` (0–1, 0 = front). Adjacent frames are crossfaded
 * so the rotation stays smooth with only a few dozen frames per revolution.
 */
function drawDevice(context: CanvasRenderingContext2D, set: FrameSet | undefined, turn: number, alpha: number) {
  if (!set || set.count === 0 || alpha <= 0) return;
  const { count, frames } = set;

  const position = turn * count;
  const index = Math.floor(position) % count;
  const blend = position - Math.floor(position);

  // While frames are still decoding, fall back to the closest one we have.
  let base = frames[index];
  for (let distance = 1; distance < count && !base; distance++) {
    base = frames[index - distance] ?? frames[index + distance];
  }
  if (!base) return;
  const next = frames[index] ? frames[(index + 1) % count] : undefined;

  const { width: canvasWidth, height: canvasHeight } = context.canvas;
  const scale = Math.min(canvasWidth / base.width, canvasHeight / base.height);
  const width = base.width * scale;
  const height = base.height * scale;
  const x = (canvasWidth - width) / 2;
  const y = (canvasHeight - height) / 2;

  context.globalAlpha = alpha;
  context.drawImage(base, x, y, width, height);
  if (next && blend > 0) {
    context.globalAlpha = alpha * blend;
    context.drawImage(next, x, y, width, height);
  }
  context.globalAlpha = 1;
}

/**
 * Scroll-driven hardware story. The stage spins on its own and swaps to the
 * next device each time the back of the current one faces the viewer, while
 * the chapters scroll past.
 */
export function HardwareStory({ devices, chapters }: { devices: Device[]; chapters: HardwareChapter[] }) {
  const lastChapter = chapters.length - 1;

  const explodeViews = chapters.flatMap((chapter) => (chapter.explode ? [chapter.explode] : []));

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameBoxRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);

  // Rotation, in turns. The total is the auto-spin plus whatever scrolling adds.
  const spinRef = useRef(0);
  const scrollTurnsRef = useRef(0);
  const spinTargetRef = useRef<number | null>(null);
  const onStageRef = useRef(0);

  // Exploded views: the one the active chapter asks for, the one currently held on stage,
  // the turn the spin is held at, and how far apart it is (0–1).
  const requestedViewRef = useRef<ExplodedView | null>(null);
  const heldViewRef = useRef<ExplodedView | null>(null);
  const lockRef = useRef<number | null>(null);
  // Set once the held device first squares up; from then on it tracks scrolling exactly.
  const squaredRef = useRef(false);
  const explodeRef = useRef(0);
  // Compared by device slug: the chapter data is re-sent from the server on refresh,
  // so the same view can arrive as a new object.
  const apartDeviceRef = useRef<string | null>(null);

  const [active, setActive] = useState(0);
  const [onStage, setOnStage] = useState(0);
  const [apartDevice, setApartDevice] = useState<string | null>(null);

  // Parts picked or pointed at in an exploded view, shared by its hotspots and its parts list.
  type PartRef = { device: string; index: number };
  const [selectedPart, setSelectedPart] = useState<PartRef | null>(null);
  const [hoveredPart, setHoveredPart] = useState<PartRef | null>(null);
  const partIn = (part: PartRef | null, view: ExplodedView) => (part?.device === view.device ? part.index : null);
  const selectPart = (view: ExplodedView, index: number) =>
    setSelectedPart((current) =>
      current?.device === view.device && current.index === index ? null : { device: view.device, index },
    );
  const hoverPart = (view: ExplodedView, index: number | null) =>
    setHoveredPart(index === null ? null : { device: view.device, index });

  useEffect(() => {
    requestedViewRef.current = chapters[active].explode ?? null;
  }, [active, chapters]);

  const { framesRef, loaded } = useVideoFrames(
    devices.map((device) => device.video),
    { crop: FRAME_CROP, maxHeight: 900 },
  );

  const stageDevice = devices[onStage];

  // The site header is sticky, so the stage needs to know how much of the top it covers.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const header = document.querySelector("body > header");
    if (!wrapper || !header) return;
    const observer = new ResizeObserver(() => {
      wrapper.style.setProperty("--header-h", `${header.getBoundingClientRect().height}px`);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Keep the canvas backing store matched to its on-screen size, and keep the frame box
  // (which the exploded-view labels are laid out in) over the area a frame is drawn into.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      const box = frameBoxRef.current;
      if (box) {
        const boxWidth = Math.min(width, height * FRAME_ASPECT);
        const boxHeight = boxWidth / FRAME_ASPECT;
        box.style.left = `${(width - boxWidth) / 2}px`;
        box.style.top = `${(height - boxHeight) / 2}px`;
        box.style.width = `${boxWidth}px`;
        box.style.height = `${boxHeight}px`;
      }
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Spin loop: advances the rotation and redraws the stage every frame.
  useEffect(() => {
    const reduceMotion = prefersReducedMotion();
    const count = devices.length;
    const deviceIndexOf = (view: ExplodedView) => devices.findIndex((device) => device.slug === view.device);
    let frameRequest = 0;
    let last = performance.now();

    const draw = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      const turns = spinRef.current + scrollTurnsRef.current;
      const turn = mod(turns, 1);

      // Device k faces front at k turns, so the swap points sit at the back views (k + 0.5).
      const swapPoint = Math.round(turns + 0.5);
      const fromSwap = turns + 0.5 - swapPoint;
      const incoming = mod(swapPoint, count);
      const outgoing = mod(swapPoint - 1, count);
      const mix = smoothstep(clamp01(fromSwap / SWAP_BLEND + 0.5));

      const sets = framesRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Taken apart: the spin is held on the device's front, so draw its first frame in pieces.
      const held = heldViewRef.current;
      const front = held ? sets[deviceIndexOf(held)]?.frames[0] : undefined;
      if (explodeRef.current > 0 && held && front) {
        drawExploded(context, front, held, explodeRef.current);
      } else {
        if (mix < 1) drawDevice(context, sets[outgoing], turn, 1);
        if (mix > 0) drawDevice(context, sets[incoming], turn, mix);
      }

      const shown = mix >= 0.5 ? incoming : outgoing;
      if (shown !== onStageRef.current) {
        onStageRef.current = shown;
        setOnStage(shown);
      }

      if (markerRef.current) {
        const angle = turn * Math.PI * 2 + Math.PI / 2;
        markerRef.current.setAttribute("cx", String(ORBIT.cx + ORBIT.rx * Math.cos(angle)));
        markerRef.current.setAttribute("cy", String(ORBIT.cy + ORBIT.ry * Math.sin(angle)));
      }
    };

    const ease = (from: number, to: number, elapsed: number, timeConstant: number) => {
      if (reduceMotion || Math.abs(to - from) < 0.002) return to;
      return from + (to - from) * Math.min(1, elapsed / timeConstant);
    };

    const tick = (now: number) => {
      // Queue the next frame first, so one failed frame can't stop the stage for good.
      frameRequest = requestAnimationFrame(tick);
      const elapsed = now - last;
      last = now;

      // Entering an exploded chapter: pick the next turn where that device faces front and hold it.
      const requested = requestedViewRef.current;
      if (requested && lockRef.current === null && deviceIndexOf(requested) >= 0) {
        let frontAt = Math.ceil(spinRef.current + scrollTurnsRef.current - 0.02);
        while (mod(frontAt, count) !== deviceIndexOf(requested)) frontAt++;
        lockRef.current = frontAt;
        heldViewRef.current = requested;
        spinTargetRef.current = null;
      }

      const target = spinTargetRef.current;
      if (lockRef.current !== null) {
        // Held: cancel out scrolling so the device stays square to the viewer.
        // Once square, follow scrolling exactly. Easing every tick would leave trackpad
        // momentum nudging it a hair off square, which reads as "not facing front" and
        // keeps closing the view again.
        const heldTurns = lockRef.current - scrollTurnsRef.current;
        spinRef.current = squaredRef.current ? heldTurns : ease(spinRef.current, heldTurns, elapsed, JUMP_EASE_MS);
        if (spinRef.current === heldTurns) squaredRef.current = true;
        const facingFront = squaredRef.current;

        // Moving straight to a different exploded chapter closes this one first.
        const wanted = requested !== null && requested.device === heldViewRef.current?.device;
        // Same view, possibly re-sent as a new object: draw from the latest copy.
        if (wanted) heldViewRef.current = requested;
        explodeRef.current = ease(explodeRef.current, wanted && facingFront ? 1 : 0, elapsed, EXPLODE_EASE_MS);
        if (!wanted && explodeRef.current === 0) {
          lockRef.current = null;
          heldViewRef.current = null;
          squaredRef.current = false;
        }

        const nowApart = explodeRef.current > 0.95 ? (heldViewRef.current?.device ?? null) : null;
        if (nowApart !== apartDeviceRef.current) {
          apartDeviceRef.current = nowApart;
          setApartDevice(nowApart);
        }
      } else if (target !== null) {
        const remaining = target - spinRef.current;
        if (Math.abs(remaining) < 0.002) {
          spinRef.current = target;
          spinTargetRef.current = null;
        } else {
          spinRef.current += remaining * Math.min(1, elapsed / JUMP_EASE_MS);
        }
      } else if (!reduceMotion) {
        spinRef.current += elapsed / SPIN_PERIOD_MS;
      }

      draw();
    };

    frameRequest = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRequest);
  }, [devices, framesRef]);

  // Scroll position picks the chapter, fills the progress bar and adds extra turn.
  useEffect(() => {
    let frameRequest = 0;

    const update = () => {
      frameRequest = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? clamp01(-rect.top / span) : 0;

      scrollTurnsRef.current = progress * SCROLL_TURNS;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      setActive(Math.round(progress * lastChapter));
    };

    const schedule = () => {
      if (!frameRequest) frameRequest = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frameRequest);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [lastChapter]);

  // Spin forward to the next time `index` faces front.
  const showDevice = (index: number) => {
    if (lockRef.current !== null) return;
    if (index === onStageRef.current && spinTargetRef.current === null) return;
    const turns = spinRef.current + scrollTurnsRef.current;
    let frontAt = Math.ceil(turns + 0.25);
    while (mod(frontAt, devices.length) !== index) frontAt++;
    const target = spinRef.current + (frontAt - turns);

    if (prefersReducedMotion()) spinRef.current = target;
    else spinTargetRef.current = target;
  };

  const scrollToChapter = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const top = rect.top + window.scrollY + (span * index) / lastChapter;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div ref={wrapperRef} className="[--header-h:6rem]">
      <section ref={sectionRef} aria-label="Dragonfly hardware" className="relative">
        {/* Stage: stays pinned while the chapters scroll over it. */}
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-background pt-(--header-h)">
          <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-2 md:px-12">
            <p
              key={stageDevice.slug}
              aria-live="polite"
              className="animate-[fade-in_500ms_ease-out] text-xs font-semibold uppercase tracking-[0.2em] motion-reduce:animate-none"
            >
              <span className="text-primary">{pad(onStage + 1)}</span> {stageDevice.name}
              <span className="hidden text-muted sm:inline"> · {stageDevice.kind}</span>
            </p>

            <div role="group" aria-label="Show a device" className="flex rounded-full border border-border p-1">
              {devices.map((device, index) => (
                <button
                  key={device.slug}
                  type="button"
                  onClick={() => showDevice(index)}
                  aria-pressed={index === onStage}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    index === onStage ? "bg-foreground text-background" : "text-muted hover:text-foreground"
                  }`}
                >
                  {device.name}
                </button>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative mt-2 mb-[42svh] min-h-0 w-full flex-1 md:mb-14 md:w-[56%]"
          >
            <svg
              viewBox="0 0 1000 420"
              className="absolute top-1/2 left-1/2 w-[115%] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-6 overflow-visible text-primary"
            >
              <ellipse
                cx={ORBIT.cx}
                cy={ORBIT.cy}
                rx={ORBIT.rx}
                ry={ORBIT.ry}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.35}
                vectorEffect="non-scaling-stroke"
              />
              <circle ref={markerRef} cx={ORBIT.cx} cy={ORBIT.cy + ORBIT.ry} r={6} fill="currentColor" />
            </svg>

            {/* The turntable footage is shot on near-white, so a slight brightness lift makes the
                backdrop pure white and multiply blends it away into the linen. */}
            <div className="absolute inset-0 mix-blend-multiply brightness-[1.035]">
              {/* eslint-disable-next-line @next/next/no-img-element -- placeholder under the canvas until frames decode */}
              <img
                src={devices[0].poster}
                alt=""
                className={`absolute inset-0 size-full object-contain transition-opacity duration-500 ${
                  loaded > 0 ? "opacity-0" : "opacity-100"
                }`}
              />
              <canvas ref={canvasRef} className="absolute inset-0 size-full" />
            </div>

            <div ref={frameBoxRef} className="absolute">
              {explodeViews.map((view) => (
                <ExplodedOverlay
                  key={view.device}
                  view={view}
                  visible={apartDevice === view.device}
                  selected={partIn(selectedPart, view)}
                  hovered={partIn(hoveredPart, view)}
                  onSelect={(index) => selectPart(view, index)}
                  onHover={(index) => hoverPart(view, index)}
                />
              ))}
            </div>
          </div>

          <nav
            aria-label="Hardware chapters"
            className="absolute top-1/2 left-12 z-10 hidden -translate-y-1/2 md:block"
          >
            <ol className="flex flex-col gap-5">
              {chapters.map((chapter, index) => {
                const isActive = index === active;
                return (
                  <li key={chapter.label}>
                    <button
                      type="button"
                      onClick={() => scrollToChapter(index)}
                      aria-current={isActive ? "step" : undefined}
                      className="group flex cursor-pointer items-center gap-4 py-1 pr-2 text-xs font-semibold uppercase tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span
                        className={`tabular-nums transition-colors duration-300 ${
                          isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
                        }`}
                      >
                        {pad(index + 1)}
                      </span>
                      <span
                        className={`h-px transition-all duration-300 ${
                          isActive ? "w-10 bg-primary" : "w-4 bg-foreground/40 group-hover:w-6"
                        }`}
                      />
                      <span
                        className={`transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60"
                        }`}
                      >
                        {chapter.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-border">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-primary" />
          </div>
        </div>

        {/* Chapters scroll in normal flow over the pinned stage. */}
        <div className="pointer-events-none relative -mt-[100svh]">
          {chapters.map((chapter, index) => {
            const isActive = index === active;
            const Heading = index === 0 ? "h1" : "h2";

            return (
              <article
                key={chapter.label}
                className="flex h-svh items-end px-6 pb-12 md:items-center md:justify-end md:px-12 md:pt-[calc(var(--header-h)+3.5rem)] md:pb-0"
              >
                <div
                  className={`w-full transition duration-700 ease-out motion-reduce:transition-none max-md:bg-linear-to-t max-md:from-background max-md:from-70% max-md:to-transparent max-md:pt-10 md:w-[44%] md:max-w-2xl ${
                    isActive ? "pointer-events-auto translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {pad(index + 1)} / {chapter.label}
                  </p>

                  <Heading className="mt-4 text-4xl leading-[0.95] font-medium tracking-[-0.045em] sm:text-6xl xl:text-8xl">
                    {chapter.title}
                    <span className="block pb-1 font-display font-light italic tracking-[-0.02em] text-foreground/55">
                      {chapter.accent}
                    </span>
                  </Heading>

                  <p className="mt-5 max-w-md text-muted md:mt-6 md:text-lg">{chapter.body}</p>

                  {chapter.explode && (
                    <PartsPanel
                      view={chapter.explode}
                      deviceName={devices.find((device) => device.slug === chapter.explode?.device)?.name ?? ""}
                      selected={partIn(selectedPart, chapter.explode)}
                      onSelect={(partIndex) => chapter.explode && selectPart(chapter.explode, partIndex)}
                      onHover={(partIndex) => chapter.explode && hoverPart(chapter.explode, partIndex)}
                    />
                  )}

                  {chapter.legend && (
                    <ul className="mt-6 max-w-md border-t border-border md:mt-8">
                      {chapter.legend.map((row) => (
                        <li key={row.pod} className="flex items-center gap-4 border-b border-border py-2.5">
                          <span
                            aria-hidden="true"
                            className="h-4 w-8 shrink-0 rounded-full border border-foreground/20"
                            style={{ backgroundColor: row.podColor }}
                          />
                          <span className="min-w-0 flex-1 text-sm font-medium">
                            {row.oil}
                            <span className="sr-only"> ({row.pod.toLowerCase()} pod)</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                            <span
                              aria-hidden="true"
                              className="size-2.5 rounded-full border border-foreground/20 shadow-[0_0_8px_currentColor]"
                              style={{ backgroundColor: row.lightColor, color: row.lightColor }}
                            />
                            {row.light} light
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {chapter.comparison && (
                    <table className="mt-6 w-full max-w-md text-sm md:mt-8">
                      <thead>
                        <tr className="border-b border-border">
                          <td />
                          {devices.map((device, deviceIndex) => (
                            <th
                              key={device.slug}
                              scope="col"
                              className={`py-2 pr-4 text-left text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
                                deviceIndex === onStage ? "text-primary" : "text-muted"
                              }`}
                            >
                              {device.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chapter.comparison.map((row) => (
                          <tr key={row.label} className="border-b border-border">
                            <th
                              scope="row"
                              className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted"
                            >
                              {row.label}
                            </th>
                            {devices.map((device) => (
                              <td key={device.slug} className="py-3 pr-4 font-medium">
                                {row.values[device.slug] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {index === 0 && (
                    <p className="mt-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted md:flex">
                      <span className="h-px w-8 bg-current" />
                      Scroll to explore
                    </p>
                  )}

                  {index === lastChapter && (
                    <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                      <Link
                        href="/where-to-buy"
                        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-opacity hover:opacity-90"
                      >
                        Find a pharmacy
                      </Link>
                      <button
                        type="button"
                        onClick={() => scrollToChapter(0)}
                        className="rounded-full border border-foreground px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                      >
                        Replay
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
