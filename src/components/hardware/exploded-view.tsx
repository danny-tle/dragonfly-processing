import type { Callout, ExplodedView } from "@/data/hardware";

/**
 * Where a point of the assembled front frame ends up once the stack is `amount`
 * of the way apart, as fractions of the frame box.
 */
function place(view: ExplodedView, u: number, v: number, amount: number) {
  const scale = 1 - view.shrink * amount;
  return {
    x: 0.5 + (u - 0.5) * scale,
    y: 0.5 + (v + view.shift * amount - 0.5) * scale,
    scale,
  };
}

function layerOffset(view: ExplodedView, part: Callout["part"], amount: number) {
  if (part === "cap") return -view.capLift * amount;
  if (part === "body") return view.bodyDrop * amount;
  return 0;
}

let scratchCanvas: HTMLCanvasElement | null = null;

function getScratch(width: number, height: number) {
  scratchCanvas ??= document.createElement("canvas");
  if (scratchCanvas.width !== width) scratchCanvas.width = width;
  if (scratchCanvas.height !== height) scratchCanvas.height = height;
  return scratchCanvas;
}

/**
 * Draws the device's front frame cut along its seam: the cap lifts and the body
 * drops by `amount` (0 = assembled, 1 = fully apart).
 */
export function drawExploded(
  context: CanvasRenderingContext2D,
  frame: ImageBitmap,
  view: ExplodedView,
  amount: number,
) {
  const { width: canvasWidth, height: canvasHeight } = context.canvas;
  const fit = Math.min(canvasWidth / frame.width, canvasHeight / frame.height);
  const width = frame.width * fit;
  const height = frame.height * fit;
  const left = (canvasWidth - width) / 2;
  const top = (canvasHeight - height) / 2;

  const toCanvas = (u: number, v: number) => {
    const point = place(view, u, v, amount);
    return [left + point.x * width, top + point.y * height] as const;
  };
  const { scale } = place(view, 0, 0, amount);

  const seam = view.seam;
  if (!seam) {
    // Nothing to split: the whole device moves with the body.
    const [x, y] = toCanvas(0, layerOffset(view, "body", amount));
    context.drawImage(frame, x, y, width * scale, height * scale);
    return;
  }

  // Each piece is drawn onto a scratch canvas and trimmed with a filled path rather
  // than clip(), which isn't antialiased in every browser and leaves stair-stepped edges.
  const scratch = getScratch(canvasWidth, canvasHeight);
  const scratchContext = scratch.getContext("2d");
  if (!scratchContext) return;

  const drawLayer = (offset: number, side: "above" | "below") => {
    const edge = side === "above" ? -0.5 : 1.5;
    const points = seam.map(([u, v]) => toCanvas(u, v + offset));

    // Seam as a smooth curve through the traced points, extended flat past the
    // device's edges, then closed off above or below it.
    const path = new Path2D();
    path.moveTo(...toCanvas(-0.5, seam[0][1] + offset));
    path.lineTo(...points[0]);
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[Math.max(i - 1, 0)];
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const [x3, y3] = points[Math.min(i + 2, points.length - 1)];
      // Catmull-Rom segment expressed as a cubic Bézier.
      path.bezierCurveTo(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2);
    }
    path.lineTo(...toCanvas(1.5, seam[seam.length - 1][1] + offset));
    path.lineTo(...toCanvas(1.5, edge + offset));
    path.lineTo(...toCanvas(-0.5, edge + offset));
    path.closePath();

    const [x, y] = toCanvas(0, offset);
    scratchContext.globalCompositeOperation = "source-over";
    scratchContext.clearRect(0, 0, canvasWidth, canvasHeight);
    scratchContext.drawImage(frame, x, y, width * scale, height * scale);
    scratchContext.globalCompositeOperation = "destination-in";
    scratchContext.fill(path);
    context.drawImage(scratch, 0, 0);
  };

  drawLayer(layerOffset(view, "body", amount), "below");
  drawLayer(layerOffset(view, "cap", amount), "above");
}

const percent = (value: number) => `${value * 100}%`;
export const partNumber = (index: number) => String(index + 1).padStart(2, "0");

type ExplodedOverlayProps = {
  view: ExplodedView;
  visible: boolean;
  /** Index of the part whose details are open. */
  selected: number | null;
  /** Index of the part being pointed at, here or in the parts list. */
  hovered: number | null;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
};

/**
 * Loose parts and clickable hotspots for the fully exploded view. Laid out in the
 * frame box, so it lines up with what drawExploded paints.
 *
 * The hotspots are a pointer shortcut; the parts list in the chapter copy is the
 * keyboard and screen reader route to the same details, so this layer is hidden from both.
 */
export function ExplodedOverlay({ view, visible, selected, hovered, onSelect, onHover }: ExplodedOverlayProps) {
  const fade = `transition duration-500 ease-out motion-reduce:transition-none ${
    visible ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* Dashed lines from each floating part back to where it lives on the device. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={`absolute inset-0 size-full overflow-visible text-primary ${fade}`}
      >
        {view.inserts.map((insert) => {
          if (!insert.from) return null;
          const start = place(view, insert.u, insert.v, 1);
          const end = place(view, insert.from.u, insert.from.v + layerOffset(view, insert.from.part, 1), 1);
          return (
            <g key={insert.image}>
              <line
                x1={start.x * 100}
                y1={start.y * 100}
                x2={end.x * 100}
                y2={end.y * 100}
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={end.x * 100} cy={end.y * 100} r={0.6} fill="currentColor" />
            </g>
          );
        })}
      </svg>

      {view.inserts.map((insert, insertIndex) => {
        const point = place(view, insert.u, insert.v, 1);
        const partIndex = view.callouts.findIndex((callout) => callout.image === insert.image);
        const isSelected = partIndex >= 0 && selected === partIndex;
        const isDisc = insert.shape === "disc";

        return (
          <button
            key={insert.image}
            type="button"
            tabIndex={-1}
            disabled={partIndex < 0}
            onClick={() => onSelect(partIndex)}
            onPointerEnter={() => partIndex >= 0 && onHover(partIndex)}
            onPointerLeave={() => onHover(null)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition duration-500 ease-out enabled:cursor-pointer motion-reduce:transition-none ${
              visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
            }`}
            style={{
              left: percent(point.x),
              top: percent(point.y),
              height: percent(insert.height * point.scale),
              aspectRatio: isDisc ? "1" : undefined,
              transitionDelay: visible ? `${150 + insertIndex * 120}ms` : "0ms",
            }}
          >
            {/* Loose parts drift gently, out of step with each other. */}
            <span
              className="block h-full animate-[float_4s_ease-in-out_infinite] motion-reduce:animate-none"
              style={{ animationDelay: `${insertIndex * -1.3}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- part cut from the manual, positioned by hand */}
              <img
                src={insert.image}
                alt=""
                className={`h-full w-auto max-w-none ${
                  isDisc
                    ? `aspect-square rounded-full object-cover shadow-[0_12px_24px_-10px_rgb(33_33_33/0.6)] ring-1 transition-shadow ${
                        isSelected ? "ring-4 ring-primary/40" : "ring-foreground/10"
                      }`
                    : insert.render
                      ? ""
                      : "brightness-75"
                }`}
              />
            </span>
          </button>
        );
      })}

      {view.callouts.map((callout, index) => {
        const point = place(view, callout.u, callout.v + layerOffset(view, callout.part, 1), 1);
        const isSelected = selected === index;
        const showName = isSelected || hovered === index;
        const onLeft = callout.side === "left";

        return (
          <div key={callout.label} className={fade} style={{ transitionDelay: visible ? `${index * 60}ms` : "0ms" }}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(index)}
              onPointerEnter={() => onHover(index)}
              onPointerLeave={() => onHover(null)}
              className="group absolute grid size-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center"
              style={{ left: percent(point.x), top: percent(point.y), zIndex: showName ? 2 : 1 }}
            >
              {/* Pulse invites a click until something has been opened. */}
              {selected === null && (
                <span className="absolute size-3 animate-ping rounded-full bg-primary/40 motion-reduce:hidden" />
              )}
              <span
                className={`relative grid place-items-center rounded-full border border-primary transition-all duration-200 ${
                  isSelected
                    ? "size-5 bg-primary ring-4 ring-primary/20"
                    : "size-3.5 bg-background group-hover:size-5 group-hover:ring-4 group-hover:ring-primary/15"
                }`}
              >
                <span
                  className={`rounded-full transition-colors ${isSelected ? "size-1.5 bg-background" : "size-1.5 bg-primary"}`}
                />
              </span>
            </button>

            <span
              className={`pointer-events-none absolute -translate-y-1/2 rounded-full bg-foreground px-3 py-1.5 text-[0.625rem] font-semibold whitespace-nowrap uppercase tracking-[0.18em] text-background shadow-sm transition duration-200 ${
                showName ? "opacity-100" : "opacity-0"
              }`}
              style={{
                top: percent(point.y),
                zIndex: 3,
                ...(onLeft
                  ? { right: `calc(${percent(1 - point.x)} + 1.125rem)` }
                  : { left: `calc(${percent(point.x)} + 1.125rem)` }),
              }}
            >
              <span className="mr-2 text-background/60 tabular-nums">{partNumber(index)}</span>
              {callout.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type PartsPanelProps = {
  view: ExplodedView;
  deviceName: string;
  selected: number | null;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
};

/** Numbered parts list plus the details of the selected part. Mirrors the hotspots on the stage. */
export function PartsPanel({ view, deviceName, selected, onSelect, onHover }: PartsPanelProps) {
  const part = selected === null ? null : view.callouts[selected];

  return (
    <div className="mt-5 max-w-md md:mt-6">
      <ol className="grid grid-cols-2 gap-x-5 border-t border-border">
        {view.callouts.map((callout, index) => (
          <li key={callout.label} className="border-b border-border">
            <button
              type="button"
              aria-pressed={selected === index}
              onClick={() => onSelect(index)}
              onPointerEnter={() => onHover(index)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(index)}
              onBlur={() => onHover(null)}
              className={`flex w-full cursor-pointer items-baseline gap-2 py-2 text-left text-[0.6875rem] font-semibold uppercase leading-snug tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                selected === index ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <span className="text-primary tabular-nums">{partNumber(index)}</span>
              {callout.label}
            </button>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-4 min-h-24">
        {part ? (
          <div key={selected} className="flex animate-[fade-in_300ms_ease-out] gap-4 motion-reduce:animate-none">
            {part.image && (
              // eslint-disable-next-line @next/next/no-img-element -- close-up cut from the manual
              <img
                src={part.image}
                alt=""
                className="size-16 shrink-0 rounded-xl border border-border bg-surface object-contain p-1.5"
              />
            )}
            <div>
              <p className="flex flex-wrap items-baseline gap-x-3 font-semibold">
                {part.label}
                {part.spec && (
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{part.spec}</span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{part.detail}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Tap a point on {deviceName} or pick a part above to see what it does.
          </p>
        )}
      </div>
    </div>
  );
}
