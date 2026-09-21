import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Building2,
  Compass,
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
import { TourProvider, useTour } from '../contexts/TourContext';
import GuidedTourEngine from '../components/tour/GuidedTourEngine';
import '../styles/platform.css';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: Gauge, tourId: 'tour-nav-dashboard' },
  { to: '/app/kpis', label: 'KPIs', icon: BarChart3, tourId: 'tour-nav-kpis' },
  { to: '/app/objectives', label: 'Objectives', icon: Target, tourId: 'tour-nav-objectives' },
  { to: '/app/material-topics', label: 'Material Topics', icon: Flag, tourId: 'tour-nav-material-topics' },
  { to: '/app/policies', label: 'Policies', icon: ShieldCheck, tourId: 'tour-nav-policies' },
  { to: '/app/reports', label: 'Reports', icon: FileBarChart, tourId: 'tour-nav-reports' },
  { to: '/app/learning', label: 'Learning', icon: BookOpen, tourId: 'tour-nav-learning' },
  { to: '/app/team', label: 'Team', icon: Users, tourId: 'tour-nav-team' },
  { to: '/app/settings', label: 'Settings', icon: Settings, tourId: 'tour-nav-settings' },
  { to: '/app/admin/overview', label: 'Admin', icon: Building2, tourId: 'tour-nav-admin' },
];

function AppLayoutContent() {
  const { user, logout } = useAuth();
  const { startTour } = useTour();
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
              <NavLink
                key={item.to}
                id={item.tourId}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="platform-sidebar-footer">
          {/* Re-trigger Guided Tour Button */}
          <button
            id="tour-restart-btn"
            className="tour-restart-sidebar-btn"
            type="button"
            onClick={startTour}
            title="Take Guided Tour"
          >
            <Compass size={16} />
            <span>Guided Tour</span>
          </button>

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
      <GuidedTourEngine />
    </div>
  );
}

export default function AppLayout() {
  return (
    <TourProvider>
      <AppLayoutContent />
    </TourProvider>
  );
}

