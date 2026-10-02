import { redirect } from 'next/navigation';
import { requireSuperadmin } from '@/backend/auth/guards';
import { Sidebar, SidebarItem } from '@/components/navigation/sidebar';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  KeyRound,
  Sliders,
  Server,
  Database,
  ScrollText,
  Settings,
  Lock,
} from 'lucide-react';

import { UnauthorizedError } from '@/backend/errors/auth-error';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireSuperadmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      redirect('/auth/login?redirectTo=/superadmin');
    }
    redirect('/admin');
  }

  const navItems: SidebarItem[] = [
    { label: 'System Overview', href: '/superadmin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Manage Admins', href: '/superadmin/admins', icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'Global Users', href: '/superadmin/users', icon: <Users className="h-4 w-4" /> },
    { label: 'Role Matrices', href: '/superadmin/roles', icon: <KeyRound className="h-4 w-4" /> },
    { label: 'Permissions', href: '/superadmin/permissions', icon: <Sliders className="h-4 w-4" /> },
    { label: 'System Health', href: '/superadmin/system', icon: <Server className="h-4 w-4" /> },
    { label: 'Database & RLS', href: '/superadmin/database', icon: <Database className="h-4 w-4" /> },
    { label: 'Full Audit Trail', href: '/superadmin/audit-logs', icon: <ScrollText className="h-4 w-4" /> },
    { label: 'System Settings', href: '/superadmin/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <Sidebar
        title="Superadmin Command"
        subtitle="Tier 4 Root Security"
        items={navItems}
        footer={
          <div className="space-y-3">
            <div className="space-y-2 rounded-xl bg-purple-950/50 p-3 border border-purple-800/40 text-purple-200">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Lock className="h-3.5 w-3.5 text-purple-400" />
                <span>Root Access Active</span>
              </div>
              <div className="text-[10px] text-purple-300">
                Audit level: <strong className="text-white">Continuous Monitored</strong>
              </div>
            </div>
            <div className="pt-1">
              <ThemeToggle variant="segmented" className="w-full justify-center text-xs" />
            </div>
          </div>
        }
      />
      <div className="flex-1 p-6 md:p-8 bg-slate-50/70 dark:bg-[#070314]/90 overflow-y-auto transition-colors">{children}</div>
    </div>
  );
}
