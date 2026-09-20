"use client";

// 🚀 FIX: Ambil langsung dari system, JANGAN dari react
import { HeroUIProvider } from "@heroui/system"; 

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}