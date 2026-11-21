// Device support pages. Copy is transcribed from the "Dragonfly Website" Figma
// (Device Manuals, Novaa and Ember support pages). The All-In-One (Brand Zero)
// page in that file is not built yet.

export type QuickTipIcon = "charge" | "inhale" | "alert" | "power" | "clock";

export type SupportResource = {
  title: string;
  /** Preview shown on the card, with its pixel size. */
  image: string;
  width: number;
  height: number;
  /** A PDF to open, or a video to play in place. */
  href?: string;
  video?: string;
};

export type SupportDevice = {
  slug: string;
  brand: string;
  name: string;
  /** One line for the device card on the manuals index. */
  summary: string;
  /** Turntable poster, also used by the hardware page. */
  image: string;
  /** Headline line under the device name, from the product banner design. */
  tagline: string;
  /** Tall lifestyle photo beside the title (night canyon for Novaa, mountains for Ember). */
  /** Brand wordmark used as the page title. */
  wordmark: { image: string; width: number; height: number };
  hero: { image: string; width: number; height: number };
  /** Wide banner photo for the manuals index, with its baked-in text removed. */
  banner: string;
  manual: SupportResource;
  howTo: SupportResource;
  quickTips: { icon: QuickTipIcon; title: string; body: string }[];
  /**
   * Labelled line drawing of the device taken apart. Each part's `x`/`y` is where its
   * leader line starts, as fractions of the drawing.
   */
  /** One large photo, then two or four smaller ones beside it. */
  gallery?: { image: string; width: number; height: number; alt: string }[];
  diagram?: { image: string; width: number; height: number; parts: { label: string; x: number; y: number }[] };
  podDetection?: { light: string; color: string; pod: string }[];
  specs?: { value: string; label: string }[];
  inTheBox?: string[];
  temperatureGuide?: { temp: number; label: string; kind: "limit" | "compound" }[];
  faqs: { question: string; answer: string }[];
};

export const supportDevices: SupportDevice[] = [
  {
    slug: "novaa",
    brand: "Dragonfly",
    name: "Novaa",
    summary: "Pod-based vaporizer with Smart Pod Detection.",
    image: "/assets/nova-poster.jpg",
    tagline: "A Vape Battery System with Smart Pod Detection™",
    wordmark: { image: "/brand/novaa-wordmark.svg", width: 1868, height: 223 },
    hero: { image: "/support/novaa-night-sky.jpg", width: 534, height: 801 },
    gallery: [
      { image: "/support/novaa-box.jpg", width: 1200, height: 1463, alt: "Novaa vape battery system box" },
      { image: "/support/novaa-pod-super-boof.jpg", width: 1200, height: 732, alt: "Dragonfly Super Boof live rosin pod box, compatible with Novaa 3" },
      { image: "/support/novaa-pod-wasatch-frost.jpg", width: 1200, height: 732, alt: "Dragonfly Wasatch Frost live rosin pod box, compatible with Novaa 3" },
    ],
    banner: "/support/novaa-banner.jpg",
    manual: {
      title: "Novaa User Manual",
      image: "/support/novaa-manual.jpg",
      width: 1200,
      height: 668,
      href: "/manuals/novaa-user-manual.pdf",
    },
    howTo: {
      title: "How To Use Novaa",
      image: "/support/novaa-how-to.jpg",
      width: 1423,
      height: 749,
      href: "/manuals/novaa-how-to-use.pdf",
    },
    quickTips: [
      {
        icon: "charge",
        title: "Charge First",
        body: "Fully charge via USB-C before first use. Solid white LED means you're at 100%.",
      },
      {
        icon: "inhale",
        title: "Just Inhale",
        body: "No buttons needed. Insert your pod, wait for the vibration, and draw gently to activate.",
      },
      {
        icon: "alert",
        title: "Clogged?",
        body: "Insert & remove the pod 2× to preheat, then blow gently through the pod for 1–3 seconds.",
      },
    ],
    podDetection: [
      { light: "Green Light", color: "#b5d36b", pod: "Cured Resin / Distillate" },
      { light: "Blue Light", color: "#6f9fd1", pod: "Live Resin / Live Rosin" },
      { light: "Yellow Light", color: "#f2d33c", pod: "Live Diamonds" },
      { light: "White Light", color: "#ffffff", pod: "2nd Generation Pod" },
    ],
    faqs: [
      {
        question: "How do I use the Novaa for the first time?",
        answer:
          "Charge your Novaa fully using the included USB-C cable before first use. Once charged, simply insert any Dragonfly or Betty pod into the top of the device. You'll feel a short vibration and the LED will illuminate, confirming the pod is detected and ready. Inhale gently to activate — no buttons required.",
      },
      {
        question: "What do the different LED colors mean?",
        answer:
          "The Novaa uses Smart POD Detection to automatically identify your pod type and set the ideal temperature. A green light indicates a Cured Resin or Distillate pod, blue means Live Resin or Live Rosin, yellow signals Live Diamonds, and white indicates a 2nd Generation pod. A red flash after a triple-insert confirms you've switched to the higher temperature setting.",
      },
      {
        question: "How do I activate Preheat Mode?",
        answer:
          "For thicker oils or cold weather, quickly insert and remove the pod twice within 3 seconds. The status light will pulse for about 5 seconds, and the device will vibrate when preheat is complete. This warms the oil to improve airflow and vapor production.",
      },
      {
        question: "How do I increase the temperature?",
        answer:
          "The Novaa defaults to Level 1 (standard temperature) to maximize flavor and terpene retention. If you prefer stronger vapor, quickly insert and remove the pod 3 times within 3 seconds. A red light confirms the temperature increase. To return to Level 1, repeat the triple-insert process.",
      },
      {
        question: "What's the difference between Level 1 and Level 2 temperature?",
        answer:
          "Level 1 is the default setting, optimized for flavor and terpene preservation — ideal for live resin and rosin pods. Level 2 runs at a higher temperature for thicker vapor production, which some patients prefer for distillate pods or when looking for stronger effects. Most patients find Level 1 delivers the best overall experience.",
      },
      {
        question: "My Novaa feels clogged — what should I do?",
        answer:
          "Activate Preheat Mode by inserting and removing the pod twice. Once the device vibrates, try blowing gently through the pod for 1–3 seconds to clear the airpath. This loosens thick oil that may have settled in the mouthpiece. If the issue persists, ensure you're storing your pods upright and at room temperature.",
      },
      {
        question: "How long does the Novaa battery last?",
        answer:
          "Battery life varies depending on draw length and frequency, but you can expect a full day of moderate use on a single charge. When the LED dims or the device stops producing vapor, connect the USB-C cable. A solid white light means the battery is fully charged and ready to go.",
      },
      {
        question: "Can I use any vape pod with the Novaa?",
        answer:
          "The Novaa is designed exclusively for Dragonfly and Betty pods. These pods are engineered to work with the Novaa's Smart POD Detection system, which automatically adjusts temperature based on the oil type. Third-party cartridges or 510-thread carts are not compatible.",
      },
      {
        question: "How do I clean my Novaa?",
        answer:
          "Wipe the pod connection area periodically with a cotton swab dipped in 90%+ isopropyl alcohol to remove any oil residue that may interfere with the connection. Allow the area to dry completely before reinserting a pod. Do not submerge the device in water or use liquid cleaners on the electronics. If you notice reduced airflow, try the Preheat/Clog Remover function before cleaning.",
      },
      {
        question: "Is the Novaa covered by a warranty?",
        answer:
          "Yes. If you experience any issues with your Novaa device, please visit dragonflyprocessing.com/m or contact your local Dragonfly Wellness pharmacy for assistance. Keep your original receipt as proof of purchase.",
      },
    ],
  },
  {
    slug: "ember",
    brand: "Dragonfly",
    name: "Ember",
    summary: "Dry herb vaporizer with precision temp controls.",
    image: "/assets/ember-poster.jpg",
    tagline: "A Flower Vaporizer with precision temp controls up to 446°F – Taste the difference.",
    wordmark: { image: "/brand/ember-wordmark.svg", width: 1071, height: 253 },
    hero: { image: "/support/ember-mountains.jpg", width: 640, height: 790 },
    banner: "/support/ember-banner.jpg",
    gallery: [
      { image: "/support/ember-selenite.jpg", width: 1434, height: 1749, alt: "Ember beside its box and a selenite tower" },
      { image: "/support/ember-box-photo.jpg", width: 1068, height: 1302, alt: "Ember flower vaporizer box" },
      { image: "/support/ember-mouthpiece.jpg", width: 712, height: 872, alt: "Hand holding the Ember mouthpiece end" },
      { image: "/support/ember-chamber.jpg", width: 712, height: 872, alt: "Ember with the magnetic mouthpiece lifted off the heating chamber" },
      { image: "/support/ember-flower.jpg", width: 712, height: 872, alt: "Cannabis flower" },
    ],
    manual: {
      title: "Ember User Manual",
      image: "/support/ember-manual.jpg",
      width: 1060,
      height: 520,
      href: "/manuals/ember-user-manual.pdf",
    },
    howTo: {
      title: "Watch: How To Use Ember",
      image: "/support/ember-how-to-poster.jpg",
      width: 884,
      height: 466,
      video: "/manuals/ember-how-to-use.mp4",
    },
    quickTips: [
      {
        icon: "charge",
        title: "Charge First",
        body: "Charge for 2.5 hours via USB-C before first use. The OLED battery icon shows a full charge when complete.",
      },
      {
        icon: "power",
        title: "5-Click On/Off",
        body: "Press ▲ or ▼ five times rapidly within 2 seconds to power on or off. The device vibrates to confirm.",
      },
      {
        icon: "clock",
        title: "20-Second Heat",
        body: "The Ember reaches your target temperature in about 20 seconds. A vibration and heat icon confirm it's ready.",
      },
    ],
    // Line drawing from the Ember product page design (Dragonfly Wellness); labels from the user manual.
    diagram: {
      image: "/support/ember-lineart.png",
      width: 410,
      height: 1551,
      parts: [
        { label: "Magnetic Mouthpiece", x: 0.93, y: 0.1 },
        { label: "Zirconia Mouthpiece Path", x: 0.6, y: 0.27 },
        { label: "Glazed Stainless Heating Chamber", x: 0.66, y: 0.455 },
        { label: "Air Vents", x: 0.42, y: 0.52 },
        { label: "OLED Screen", x: 0.9, y: 0.645 },
        { label: "Control Buttons", x: 0.9, y: 0.815 },
        { label: "Type-C Port", x: 0.5, y: 0.985 },
      ],
    },
    specs: [
      { value: "2000mAh", label: "Li-Ion Battery" },
      { value: "298–446°F", label: "Temperature Range" },
      { value: "18–20", label: "Sessions Per Charge" },
      { value: "0.3g", label: "Oven Capacity" },
      { value: "115.8g", label: "Weight" },
      { value: "105mm", label: "Height (45×24mm)" },
    ],
    inTheBox: [
      "Dragonfly Ember",
      "USB-C Cable",
      "Cleaning Brush",
      "Packing Tool",
      "3× SS Screen (Chamber)",
      "2× SS Screen (Mouthpiece)",
      "Quick Guide",
      "Temperature Guide",
    ],
    // From the temperature guide card in the Ember user manual.
    temperatureGuide: [
      { temp: 446, label: "Maximum battery temp", kind: "limit" },
      { temp: 430, label: "Flower maximum temp", kind: "limit" },
      { temp: 388, label: "Linalool · Humulene", kind: "compound" },
      { temp: 365, label: "Terpinolene · CBN", kind: "compound" },
      { temp: 349, label: "Limonene", kind: "compound" },
      { temp: 345, label: "Ocimene", kind: "compound" },
      { temp: 333, label: "Beta-Myrcene", kind: "compound" },
      { temp: 329, label: "Beta-Pinene · CBD", kind: "compound" },
      { temp: 320, label: "Camphene · Flower minimum temp", kind: "compound" },
      { temp: 313, label: "Pinene", kind: "compound" },
      { temp: 307, label: "Bisabolol", kind: "compound" },
      { temp: 298, label: "Minimum battery temp", kind: "limit" },
    ],
    faqs: [
      {
        question: "How do I use the Ember for the first time?",
        answer:
          "Charge the Ember fully via USB-C for approximately 2.5 hours before first use. The OLED display will show a full battery icon when charging is complete. Remove the magnetic mouthpiece, load ground herb into the glazed stainless heating chamber using the included packing tool, and replace the mouthpiece. Press ▲ or ▼ five times rapidly within 2 seconds to power on — the device will vibrate briefly to confirm. Set your desired temperature, and the Ember will reach it in about 20 seconds. A vibration and heat icon on the display let you know it's ready to use.",
      },
      {
        question: "How do I adjust the temperature?",
        answer:
          "The Ember supports precise temperature control between 298°F and 446°F. Briefly tap ▲ or ▼ to adjust in 1-degree increments, or hold the button to scroll the temperature quickly. The OLED screen displays your current setting in real time. The device also features a memory function — it remembers your last temperature setting when you power it back on.",
      },
      {
        question: "What temperature should I use?",
        answer:
          "It depends on what experience you're looking for. Lower temperatures (298–340°F) prioritize flavor and terpene preservation — great for patients who want smooth, aromatic sessions. Mid-range (340–385°F) offers a balanced experience with good vapor and flavor. Higher temps (385–430°F) produce thicker vapor and stronger effects. The recommended flower range is 320–430°F. See the Temperature Guide section above for specific terpene activation points.",
      },
      {
        question: "How do I charge the Ember?",
        answer:
          "Connect the included USB-C cable to the port at the bottom of the device. The 2000mAh battery charges fully in approximately 2.5 hours. When powered on during charging, the OLED display shows the battery fill status. When powered off, only the battery icon is visible. Do not use the device while charging, and avoid leaving the charger plugged in overnight. Only use the provided cable — incompatible chargers may carry a different voltage and could be a fire hazard.",
      },
      {
        question: "How many sessions can I get per charge?",
        answer:
          "The Ember delivers approximately 18–20 sessions per full charge, depending on your temperature setting and session length. Higher temperatures draw more power. When the battery is low, charge with the included USB-C cable.",
      },
      {
        question: "How do I clean the Ember?",
        answer:
          "After each session, remove the magnetic mouthpiece and use the included cleaning brush to sweep spent material from the chamber while it's still warm. For deeper cleaning, use a cotton swab dipped in 90%+ isopropyl alcohol to wipe down the inside of the chamber, the zirconia mouthpiece path, and the stainless steel screens. Allow everything to dry completely before reassembling. Replace the SS screens periodically — 3 chamber screens and 2 mouthpiece screens are included in the box.",
      },
      {
        question: "Does the Ember remember my last temperature?",
        answer:
          "Yes. The Ember has a smart memory function that saves your last-used temperature. When you power the device back on, it will display and heat to the same setting you used previously — no need to re-dial your preference each session.",
      },
      {
        question: "How much herb does the chamber hold?",
        answer:
          "The glazed stainless heating chamber holds approximately 0.3g of ground herb. Use the included packing tool to gently tamp the material — pack it firmly but not too tight, as airflow is important for even vaporization. A medium grind works best.",
      },
      {
        question: "Are there any important safety warnings?",
        answer:
          "The heating chamber gets hot during use — handle with care and allow it to cool before cleaning or touching directly. Do not attempt to repair, modify, or disassemble the device. Do not use the Ember while it's charging. Do not leave it unattended while powered on. Keep away from children — the device contains small parts that present a choking hazard. Only use the provided USB-C charger. This device is intended for adult use only.",
      },
      {
        question: "Is the Ember covered by a warranty?",
        answer:
          "Yes. If you experience any issues with your Ember, please visit dragonflyprocessing.com/m or contact your local Dragonfly Wellness pharmacy for assistance. Keep your original receipt as proof of purchase. Note that attempting to repair or modify the device will void the limited warranty.",
      },
    ],
  },
];

export function getSupportDevice(slug: string) {
  return supportDevices.find((device) => device.slug === slug);
}
