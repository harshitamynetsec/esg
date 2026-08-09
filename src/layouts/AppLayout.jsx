import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Building2,
  FileBarChart,
  Flag,
  Gauge,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/platform.css';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/app/kpis', label: 'KPIs', icon: BarChart3 },
  { to: '/app/objectives', label: 'Objectives', icon: Target },
  { to: '/app/material-topics', label: 'Material Topics', icon: Flag },
  { to: '/app/policies', label: 'Policies', icon: ShieldCheck },
  { to: '/app/reports', label: 'Reports', icon: FileBarChart },
  { to: '/app/learning', label: 'Learning', icon: BookOpen },
  { to: '/app/team', label: 'Team', icon: Users },
  { to: '/app/settings', label: 'Settings', icon: Settings },
  { to: '/app/admin/overview', label: 'Admin', icon: Building2 },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="platform-shell">
      <aside className="platform-sidebar">
        <div className="platform-brand">
          <span>ESG</span>
          <strong>NSS</strong>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="platform-main">
        <header className="platform-topbar">
          <div>
            <p>{user?.organization?.name || 'Organization Workspace'}</p>
            <h1>{user?.fullName || `${user?.firstName || 'ESG'} ${user?.lastName || 'User'}`}</h1>
          </div>
          <button className="icon-text-button" type="button" onClick={handleLogout}>
            <LogOut size={18} />
            Sign out
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
