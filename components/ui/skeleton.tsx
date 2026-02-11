
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