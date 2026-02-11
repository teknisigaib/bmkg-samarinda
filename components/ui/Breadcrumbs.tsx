import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {/* Home Link */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-blue-600">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}