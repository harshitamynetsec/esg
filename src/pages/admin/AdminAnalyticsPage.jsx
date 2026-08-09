import { Activity, Building2, CreditCard, FileBarChart } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';

const metrics = [
  { label: 'Organization Health', value: 'Active', icon: Building2 },
  { label: 'Billing Coverage', value: 'Tracked', icon: CreditCard },
  { label: 'Report Pipeline', value: 'Ready', icon: FileBarChart },
  { label: 'Security Activity', value: 'Audited', icon: Activity },
];

export default function AdminAnalyticsPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Admin Analytics" description="Operational indicators for platform supervision and service quality." />
      <div className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div className="metric-card" key={metric.label}>
              <Icon size={20} />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
