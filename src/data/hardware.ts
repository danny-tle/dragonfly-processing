export type Device = {
  slug: string;
  name: string;
  kind: string;
  /** 360° turntable clip, starting and ending on the front view. */
  video: string;
  /** First frame, cropped to the same box the frames are drawn in. */
  poster: string;
};

export type HardwareComparisonRow = {
  label: string;
  /** Keyed by device slug. */
  values: Record<string, string>;
};

/**
 * A clickable part in the exploded view. `u`/`v` place its hotspot as fractions
 * of the assembled front frame (0,0 top left, 1,1 bottom right). Parts you can't
 * see, like the battery, get a hotspot close to where they sit.
 */
export type Callout = {
  label: string;
  /** Which layer the hotspot rides on: it moves with the mouthpiece, the body, or stays put. */
  part: "cap" | "body" | "free";
  u: number;
  v: number;
  /** Which side of the hotspot its name pops out on. */
  side: "left" | "right";
  detail: string;
  /** Headline number for the detail card, e.g. "0.3 g oven". */
  spec?: string;
  /** Close-up shown in the detail card. */
  image?: string;
};

/**
 * 2.5D exploded view built from the device's front frame. The frame is cut along
 * the mouthpiece seam; the cap lifts, the body drops, and loose parts from the
 * manual fill the gap. All values are fractions of the front frame.
 */
export type ExplodedView = {
  /** Unique per view; one device can have several (e.g. held still, then taken apart). */
  id: string;
  device: string;
  /** Seam to split the frame along, left to right. Without one the device moves as a single piece. */
  seam?: [number, number][];
  capLift: number;
  bodyDrop: number;
  /** How much the whole stack shrinks, and shifts down, to stay in frame once apart. */
  shrink: number;
  shift: number;
  inserts: ExplodedInsert[];
  callouts: Callout[];
};

/**
 * A loose part that floats in the exploded view. `u`/`v` is its centre and
 * `height` its size, as fractions of the front frame.
 */
export type ExplodedInsert = {
  image: string;
  u: number;
  v: number;
  height: number;
  /** Photo close-ups float as discs; line art and cut-outs float as they are. */
  shape?: "disc";
  /** A product render (already cut out) rather than line art, so it keeps its own tones. */
  render?: boolean;
  /** Where the part lives on the device; a dashed line runs back to it. */
  from?: { u: number; v: number; part: Callout["part"] };
};

export type HardwareChapter = {
  /** Short name shown in the side nav, e.g. "Form". */
  label: string;
  /** First line of the headline, set in the sans. */
  title: string;
  /** Second line of the headline, set in the italic display face. */
  accent: string;
  body: string;
  comparison?: HardwareComparisonRow[];
  /** Stops the spin on this device's front and takes it apart while the chapter is on screen. */
  explode?: ExplodedView;
  /** Short feature list under the body copy. */
  features?: { title: string; body: string }[];
  legend?: PodLegendRow[];
};

/** Novaa reads the pod's colour and lights up to match. */
export type PodLegendRow = {
  pod: string;
  /** CSS colour of the pod housing. */
  podColor: string;
  oil: string;
  light: string;
  lightColor: string;
};

/** Source turntable clips are 1920×1644. */
const VIDEO_ASPECT = 1920 / 1644;

/**
 * Part of each video frame to keep, as fractions of the source width.
 * The turntable clips have wide empty margins; the devices never leave the middle 56%.
 */
export const FRAME_CROP = { x: 0.22, width: 0.56 };

/** Width / height of a cropped frame. */
export const FRAME_ASPECT = VIDEO_ASPECT * FRAME_CROP.width;

// The stage spins through these in order, swapping each time the back of the device faces the viewer.
export const devices: Device[] = [
  {
    slug: "novaa",
    name: "Novaa",
    kind: "Pod vaporizer",
    video: "/assets/nova-spin.mp4",
    poster: "/assets/nova-poster.jpg",
  },
  {
    slug: "ember",
    name: "Ember",
    kind: "Dry herb vaporizer",
    video: "/assets/ember-spin.mp4",
    poster: "/assets/ember-poster.jpg",
  },
];

// Holds Ember still, facing front, without taking it apart: a view with nothing moved.
const emberHold: ExplodedView = {
  id: "ember-hold",
  device: "ember",
  capLift: 0,
  bodyDrop: 0,
  shrink: 0,
  shift: 0,
  inserts: [],
  callouts: [],
};

// Novaa content is from the Novaa 3 user manual and how-to card (source-assets/*Novaa*.pdf)
// and the Novaa support page in the "Dragonfly Website" Figma.
// The pod drawing is rendered from the manual's line art.
const novaaInsert: ExplodedView = {
  id: "novaa-insert",
  device: "novaa",
  capLift: 0,
  bodyDrop: 0.22,
  shrink: 0.1,
  shift: -0.08,
  inserts: [{ image: "/assets/novaa-parts/novaa-pod-render.png", u: 0.502, v: 0.2, height: 0.24, render: true }],
  callouts: [
    {
      label: "Auto-draw",
      part: "free",
      u: 0.5,
      v: 0.1,
      side: "right",
      detail: "No buttons. Inhale gently and Novaa switches on by itself.",
    },
    {
      label: "Smart pod detection",
      part: "free",
      u: 0.56,
      v: 0.18,
      side: "right",
      detail: "Novaa reads the pod and sets the ideal temperature for what's inside. The light color tells you which oil it detected. Works with Dragonfly and Betty pods only; 510-thread carts won't fit.",
      image: "/assets/novaa-parts/novaa-pod-render.png",
    },
    {
      label: "Ceramic core heating",
      part: "free",
      u: 0.45,
      v: 0.3,
      side: "left",
      detail: "Even, efficient heat for smoother, cleaner vapor from the first draw to the last.",
    },
    {
      label: "Magnetic cradle",
      part: "body",
      u: 0.45,
      v: 0.2,
      side: "left",
      detail: "A magnetic connection lines the pod up for you, and a short vibration confirms it's seated.",
    },
    {
      label: "Haptic feedback",
      part: "body",
      u: 0.42,
      v: 0.45,
      side: "left",
      detail: "Short vibrations confirm the pod is in, preheat is ready and the temperature has changed.",
    },
    {
      label: "Preheat and clog clear",
      part: "body",
      u: 0.58,
      v: 0.55,
      side: "right",
      spec: "Insert 2× in 3 s",
      detail: "For cold weather or thick oil, insert and remove the pod twice within 3 seconds. The light pulses for about 5 seconds and Novaa vibrates when it's warm. Most clogs clear by blowing through the pod for 1–3 seconds after preheating.",
    },
    {
      label: "Status light and charging",
      part: "body",
      u: 0.509,
      v: 0.832,
      side: "right",
      spec: "USB-C",
      detail: "The light times your draw and shows which pod type was detected. A charge lasts a full day of moderate use; while charging over USB-C, solid white means fully charged.",
    },
  ],
};

// Ember content is from the Ember user manual (source-assets/EmberUserManual.pdf)
// and the Ember support page in the "Dragonfly Website" Figma.
// Seam and points are traced on the first frame of the Ember spin, which shows the button side on the left.
const emberExploded: ExplodedView = {
  id: "ember-apart",
  device: "ember",
  seam: [
    [0.253, 0.331],
    [0.333, 0.292],
    [0.423, 0.265],
    [0.5, 0.257],
    [0.583, 0.263],
    [0.679, 0.286],
    [0.753, 0.327],
  ],
  capLift: 0.24,
  bodyDrop: 0.06,
  shrink: 0.12,
  shift: 0.09,
  inserts: [{ image: "/assets/ember-parts/ember-zirconia-path.png", u: 0.505, v: 0.2, height: 0.17 }],
  callouts: [
    {
      label: "Magnetic mouthpiece",
      part: "cap",
      u: 0.42,
      v: 0.19,
      side: "left",
      detail: "Lifts straight off and snaps back on magnetically, so loading the chamber takes seconds.",
    },
    {
      label: "Zirconia mouthpiece path",
      part: "free",
      u: 0.54,
      v: 0.2,
      side: "right",
      detail: "Vapor travels through a zirconia ceramic path on its way to the mouthpiece.",
      image: "/assets/ember-parts/ember-zirconia-path.png",
    },
    {
      label: "Glazed stainless heating chamber",
      part: "body",
      u: 0.42,
      v: 0.275,
      side: "left",
      spec: "0.3 g oven",
      detail: "Holds about 0.3 g of ground flower. Tamp it gently with the included packing tool; a medium grind works best.",
      image: "/assets/ember-parts/ember-heating-chamber.png",
    },
    {
      label: "Air vents",
      part: "body",
      u: 0.56,
      v: 0.33,
      side: "right",
      detail: "A perforated vent panel sits at the top of the body, just below the mouthpiece.",
    },
    {
      label: "OLED screen",
      part: "body",
      u: 0.25,
      v: 0.48,
      side: "left",
      spec: "298–446 °F",
      detail: "Shows the battery level and your set temperature in real time, and Ember remembers your last setting when you power back on.",
    },
    {
      label: "Control buttons",
      part: "body",
      u: 0.25,
      v: 0.68,
      side: "left",
      detail: "Press ▲ or ▼ five times within 2 seconds to power on or off. Tap to adjust 1° at a time, or hold to scroll. Ember heats up in about 20 seconds and vibrates when it's ready.",
    },
    {
      label: "Battery",
      part: "body",
      u: 0.5,
      v: 0.56,
      side: "right",
      spec: "2000 mAh",
      detail: "A 2000 mAh Li-ion battery, good for 18–20 sessions per charge.",
    },
    {
      label: "USB-C port",
      part: "body",
      u: 0.505,
      v: 0.875,
      side: "right",
      spec: "USB-C",
      detail: "Charges from the base in about 2.5 hours. Use only the included cable.",
      image: "/assets/ember-parts/ember-type-c-port.png",
    },
  ],
};

export const hardwareChapters: HardwareChapter[] = [
  {
    label: "Arrival",
    title: "Two devices.",
    accent: "One standard.",
    body: "Novaa and Ember carry the Dragonfly standard from the flower to your hand. One is made for pods, the other for flower.",
  },
  {
    label: "Form",
    title: "Nothing extra.",
    accent: "Nothing missing.",
    body: "Novaa has no buttons at all: inhale gently and auto-draw does the rest. Ember is rounded and soft-edged, with a premium aluminum alloy body made to rest easily in your palm.",
  },
  {
    label: "Insert",
    title: "Insert",
    accent: "and go.",
    body: "Click a Dragonfly or Betty pod into Novaa's magnetic cradle. It buzzes and lights up to confirm the pod is detected and ready.",
    explode: novaaInsert,
  },
  {
    label: "Smart pod",
    title: "It knows",
    accent: "your pod.",
    body: "Novaa reads the pod and sets the right temperature for what's inside. For thicker oil, insert the pod three times within 3 seconds for Level 2; a red light confirms it.",
    legend: [
      { pod: "Green", podColor: "#b5d36b", oil: "Cured resin / distillate", light: "Green", lightColor: "#9fd36b" },
      { pod: "Blue", podColor: "#6f9fd1", oil: "Live resin / live rosin", light: "Blue", lightColor: "#6f9fd1" },
      { pod: "Yellow", podColor: "#f2d33c", oil: "Live diamonds", light: "Yellow", lightColor: "#f2d33c" },
      { pod: "Black", podColor: "#212121", oil: "2nd generation pod", light: "White", lightColor: "#ffffff" },
    ],
  },
  {
    // Copy from the Ember product page design (Dragonfly Wellness).
    label: "Flower",
    title: "Taste your",
    accent: "flower.",
    body: "Ember is a premium dry herb vaporizer that offers a clean, efficient, and combustion-free way to enjoy cannabis.",
    explode: emberHold,
    features: [
      {
        title: "Pure Cannabis Relief",
        body: "Clean, combustion-free sessions with smooth, flavorful vapor, made for medical cannabis patients.",
      },
      {
        title: "Precision Temperature Control",
        body: "Dial in settings from 298°F to 446°F for personalized relief and terpene activation.",
      },
      {
        title: "Simple & Patient-Friendly",
        body: "Easy to load, easy to use. Haptic feedback and intuitive controls make every session stress-free.",
      },
      {
        title: "Portable & Rechargeable",
        body: "Compact, discreet, and ready for anywhere, with up to 20 sessions per charge over USB-C.",
      },
    ],
  },
  {
    label: "Inside",
    title: "Take Ember",
    accent: "apart.",
    body: "The magnetic mouthpiece lifts straight off. Underneath, a zirconia vapor path sits over a glazed stainless steel heating chamber.",
    explode: emberExploded,
  },
  {
    label: "Specs",
    title: "Pick the one",
    accent: "that fits you.",
    body: "Both come in matte black, carry the Dragonfly mark and charge over USB-C.",
    comparison: [
      { label: "Type", values: { novaa: "Pod vaporizer", ember: "Dry herb vaporizer" } },
      { label: "Activation", values: { novaa: "Auto-draw, no buttons", ember: "5-click power on" } },
      { label: "Heating", values: { novaa: "Ceramic core", ember: "Glazed stainless chamber" } },
      { label: "Temperature", values: { novaa: "Set by pod, 2 levels", ember: "298–446 °F, ~20 s heat-up" } },
      { label: "Feedback", values: { novaa: "Haptic + status light", ember: "OLED screen" } },
      { label: "Battery", values: { novaa: "Full day of use", ember: "2000 mAh, 18–20 sessions" } },
      { label: "Size", values: { novaa: "TBD", ember: "105 × 45 × 24 mm" } },
      { label: "Weight", values: { novaa: "TBD", ember: "115.8 g" } },
    ],
  },
  {
    label: "Resolve",
    title: "The flower",
    accent: "stays the hero.",
    body: "Both devices get out of the way so the flower can do the talking. Find them at licensed medical cannabis pharmacies across Utah.",
  },
];
