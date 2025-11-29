//import { cn } from "@/lib/utils"; // Pastikan kamu punya utility cn (atau hapus cn dan pakai template literal biasa)

// Jika tidak punya lib/utils untuk cn, pakai kode di bawah ini:
function cn(...classes: (string | undefined | null | false)[]) {
   return classes.filter(Boolean).join(" ");
 }

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/80 ${className}`}
      {...props}
    />
  );
}