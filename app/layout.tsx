import type { Metadata } from 'next';
import './globals.css';
import { getCurrentUser } from '@/backend/auth/session';
import { Navbar } from '@/components/navigation/navbar';

import { ThemeProvider } from '@/components/theme/theme-provider';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Selam Kids - Night Zookeeper Creative Learning & Writing Adventure',
  description:
    'Inspiring children aged 6-12+ to build magical animals, write wondrous stories, and level up literacy through gamified quests.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('selam-kids-theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#070314] font-sans antialiased text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <Navbar user={user} />
          <main className="flex-1 flex flex-col pb-16 lg:pb-0">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
