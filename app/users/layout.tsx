import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/backend/auth/session';
import { Sidebar, SidebarItem } from '@/components/navigation/sidebar';
import {
  Compass,
  BookOpen,
  Heart,
  Users,
  BarChart3,
  GraduationCap,
  FolderOpen,
  Settings,
  User,
  PenTool,
} from 'lucide-react';
import { ROLES } from '@/backend/constants/roles';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Define sidebar navigation items based on user role
  let sidebarTitle: string | undefined = 'My Portal';
  let sidebarSubtitle: string | undefined = user.fullName;
  let navItems: SidebarItem[] = [];

  if (user.role === ROLES.KID) {
    sidebarTitle = undefined;
    sidebarSubtitle = undefined;
    navItems = [
      { label: 'Night Zoo Magazine', href: '/users/kids', icon: <BookOpen className="h-4 w-4 text-amber-400" /> },
      { label: 'Profile', href: '/users/kids/profile', icon: <User className="h-4 w-4 text-cyan-400" /> },
    ];
  } else if (user.role === ROLES.FAMILY) {
    sidebarTitle = 'Family Hub';
    navItems = [
      { label: 'Dashboard', href: '/users/families', icon: <Compass className="h-4 w-4 text-cyan-500" /> },
      { label: 'My Children', href: '/users/families?tab=children', icon: <Heart className="h-4 w-4 text-pink-500" /> },
      { label: 'Reading Reports', href: '/users/families?tab=reports', icon: <BarChart3 className="h-4 w-4 text-emerald-500" /> },
      { label: 'Family Plan', href: '/users/families/settings', icon: <Users className="h-4 w-4 text-indigo-500" /> },
      { label: 'Account Settings', href: '/users/settings', icon: <Settings className="h-4 w-4" /> },
    ];
  } else if (user.role === ROLES.TEACHER) {
    sidebarTitle = 'Classroom HQ';
    navItems = [
      { label: 'Dashboard', href: '/users/teachers', icon: <Compass className="h-4 w-4" /> },
      { label: 'My Students', href: '/users/teachers?tab=students', icon: <Users className="h-4 w-4" /> },
      { label: 'Assignments', href: '/users/teachers?tab=assignments', icon: <FolderOpen className="h-4 w-4" /> },
      { label: 'Curriculum & Rubrics', href: '/users/teachers?tab=curriculum', icon: <BookOpen className="h-4 w-4" /> },
      { label: 'Teacher Profile', href: '/users/teachers/profile', icon: <User className="h-4 w-4" /> },
      { label: 'Settings', href: '/users/settings', icon: <Settings className="h-4 w-4" /> },
    ];
  } else {
    sidebarTitle = 'User Experience';
    navItems = [
      { label: 'Overview', href: '/users', icon: <Compass className="h-4 w-4" /> },
      { label: 'Kids Area', href: '/users/kids', icon: <BookOpen className="h-4 w-4" /> },
      { label: 'Families Area', href: '/users/families', icon: <Heart className="h-4 w-4" /> },
      { label: 'Teachers Area', href: '/users/teachers', icon: <GraduationCap className="h-4 w-4" /> },
      { label: 'Settings', href: '/users/settings', icon: <Settings className="h-4 w-4" /> },
    ];
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <Sidebar
        title={sidebarTitle}
        subtitle={sidebarSubtitle}
        items={navItems}
      />
      <div className="flex-1 p-6 md:p-8 bg-slate-50/60 dark:bg-[#070314]/90 overflow-y-auto transition-colors">{children}</div>
    </div>
  );
}

async function requireAuthUser() {
  return getCurrentUser();
}
