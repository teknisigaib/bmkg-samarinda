import type { Metadata } from "next";
import AirQualityView from "@/components/component-iklim/kualitas-udara/AirQualityView";

export const metadata: Metadata = {
  title: "Kualitas Udara | BMKG APT Pranoto Samarinda",
  description: "Monitoring Kualitas Udara (PM2.5) Kota Samarinda secara real-time.",
};

export default function AirQualityPage() {
  return <AirQualityView />;
}