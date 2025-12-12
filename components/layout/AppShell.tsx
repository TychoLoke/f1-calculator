import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar, type Breadcrumb } from './Topbar';

interface AppShellProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, breadcrumbs = [], actions, children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-[#0b1220] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(91,139,255,0.08), transparent 26%), radial-gradient(circle at 80% 0%, rgba(255,95,109,0.08), transparent 22%), radial-gradient(circle at 80% 60%, rgba(91,139,255,0.06), transparent 30%)',
        }}
      />

      <Sidebar />

      <div className="relative flex min-h-screen flex-col lg:ml-72">
        <Topbar title={title} breadcrumbs={breadcrumbs} actions={actions} />
        <main className="flex-1 px-4 pb-12 pt-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
