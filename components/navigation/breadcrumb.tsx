import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-purple-300/70 mb-6">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-purple-400/60 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-slate-800 dark:text-purple-100 truncate">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-slate-800 dark:hover:text-white transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
