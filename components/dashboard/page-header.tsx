import * as React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@/components/navigation/breadcrumb';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-purple-200/80 font-medium">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
