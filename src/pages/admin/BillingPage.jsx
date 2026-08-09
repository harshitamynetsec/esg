import ResourcePage from '../../components/platform/ResourcePage';

export default function BillingPage() {
  return (
    <ResourcePage
      title="Billing"
      description="Review and maintain billing subscriptions until invoice and payment provider integrations are enabled."
      resource="subscriptions"
      defaults={{
        plan: 'starter',
        status: 'trialing',
        seats: 5,
        amount: 0,
        currentPeriodStart: '2026-07-01',
        currentPeriodEnd: '2026-08-01',
      }}
      columns={[
        { key: 'plan', label: 'Plan' },
        { key: 'status', label: 'Status' },
        { key: 'seats', label: 'Seats' },
        { key: 'amount', label: 'Amount' },
        { key: 'currentPeriodEnd', label: 'Renews' },
      ]}
      fields={[
        { name: 'plan', label: 'Plan', type: 'select', options: ['free', 'starter', 'growth', 'enterprise'] },
        { name: 'status', label: 'Status', type: 'select', options: ['trialing', 'active', 'past_due', 'cancelled', 'expired'] },
        { name: 'seats', label: 'Seats', type: 'number', min: 1 },
        { name: 'amount', label: 'Amount', type: 'number', min: 0 },
        { name: 'currentPeriodStart', label: 'Period start', type: 'date' },
        { name: 'currentPeriodEnd', label: 'Period end', type: 'date' },
      ]}
    />
  );
}
