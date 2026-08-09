import { NavLink, Outlet } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Building2,
  CreditCard,
  FileBarChart,
  HelpCircle,
  MailQuestion,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import PageHeader from '../components/platform/PageHeader';

const adminLinks = [
  { to: '/app/admin/overview', label: 'Overview', icon: BarChart3 },
  { to: '/app/admin/users', label: 'Users', icon: Users },
  { to: '/app/admin/roles', label: 'Roles', icon: Shield },
  { to: '/app/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/app/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/app/admin/billing', label: 'Billing', icon: CreditCard },
  { to: '/app/admin/reports', label: 'Reports', icon: FileBarChart },
  { to: '/app/admin/analytics', label: 'Analytics', icon: Activity },
  { to: '/app/admin/audit-logs', label: 'Audit Logs', icon: Activity },
  { to: '/app/admin/contact-queries', label: 'Contact Queries', icon: MailQuestion },
  { to: '/app/admin/demo-requests', label: 'Demo Requests', icon: HelpCircle },
  { to: '/app/admin/support', label: 'Support', icon: HelpCircle },
  { to: '/app/admin/settings', label: 'Configuration', icon: Settings },
];

export default function AdminLayout() {
  return (
    <section className="admin-shell">
      <PageHeader
        title="Platform Admin"
        description="Manage organizations, users, billing, reporting, support, audit activity, and platform configuration."
      />
      <div className="admin-workspace">
        <aside className="admin-subnav">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'admin-tab active' : 'admin-tab')}>
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
