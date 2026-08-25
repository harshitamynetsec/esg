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

  const displayName = user?.fullName || `${user?.firstName || 'ESG'} ${user?.lastName || 'User'}`;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ES';

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
        <div className="platform-sidebar-footer">
          <div className="platform-user">
            <span className="platform-user-avatar">{initials}</span>
            <div className="platform-user-info">
              <strong>{displayName}</strong>
              <small>{user?.organization?.name || 'Organization Workspace'}</small>
            </div>
          </div>
          <button className="platform-signout" type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main className="platform-main">
        <Outlet />
      </main>
    </div>
  );
}
