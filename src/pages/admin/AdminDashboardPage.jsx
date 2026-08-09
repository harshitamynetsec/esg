import { Link } from 'react-router-dom';
import { Activity, Building2, CreditCard, FileBarChart, Shield, Users } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';

const adminCards = [
  { label: 'Users', value: 'Manage access', to: '/app/admin/users', icon: Users },
  { label: 'Roles', value: 'RBAC controls', to: '/app/admin/roles', icon: Shield },
  { label: 'Companies', value: 'Organizations', to: '/app/admin/companies', icon: Building2 },
  { label: 'Subscriptions', value: 'Plans and seats', to: '/app/admin/subscriptions', icon: CreditCard },
  { label: 'Reports', value: 'Generated output', to: '/app/admin/reports', icon: FileBarChart },
  { label: 'Audit Logs', value: 'Security trail', to: '/app/admin/audit-logs', icon: Activity },
];

export default function AdminDashboardPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Admin Overview" description="Platform administration for companies, users, subscriptions, support, audit, and report oversight." />
      <div className="card-grid">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link className="content-card admin-card-link" key={card.to} to={card.to}>
              <Icon size={22} />
              <h3>{card.label}</h3>
              <p>{card.value}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
