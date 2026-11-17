import type { Metadata } from "next";
import { HardwareStory } from "@/components/hardware/hardware-story";
import { devices, hardwareChapters } from "@/data/hardware";

export const metadata: Metadata = {
  title: "Hardware | Dragonfly",
  description: "Meet Novaa, the pod battery, and Ember, the dry herb vaporizer, from Dragonfly.",
};

export default function HardwarePage() {
  return <HardwareStory devices={devices} chapters={hardwareChapters} />;
}
