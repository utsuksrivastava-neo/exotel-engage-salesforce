import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Rocket,
  Activity,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/execute', icon: Rocket, label: 'Execute Journey' },
  { to: '/monitor', icon: Activity, label: 'Live Monitor' },
];

const breadcrumbMap: Record<string, string[]> = {
  '/': ['Dashboard'],
  '/execute': ['Execute', 'Setup'],
  '/execute/source': ['Execute', 'Source Config'],
  '/execute/summary': ['Execute', 'Intelligence Summary'],
  '/monitor': ['Monitor', 'Live Dashboard'],
};

export default function Layout() {
  const location = useLocation();
  const crumbs = breadcrumbMap[location.pathname] || ['Dashboard'];

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      <aside className="w-[260px] bg-surface-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-surface-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight">CRM Orchestrator</h1>
              <p className="text-[11px] text-surface-400 font-medium">Journey Execution Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-300'
                    : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-surface-700">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-all"
          >
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </NavLink>
          <div className="mt-4 px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-[11px] font-bold">
                US
              </div>
              <div>
                <p className="text-[12px] font-medium text-surface-200">Utsuk S.</p>
                <p className="text-[10px] text-surface-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-surface-200 flex items-center px-6 shrink-0">
          <div className="flex items-center gap-1.5 text-[13px]">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-surface-400" />}
                <span className={i === crumbs.length - 1 ? 'text-surface-900 font-medium' : 'text-surface-400'}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
