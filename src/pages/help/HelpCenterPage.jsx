import PageHeader from '../../components/platform/PageHeader';

export default function HelpCenterPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Help Center" description="Operational guidance for onboarding, KPI tracking, policy evidence, reports, and account administration." />
      <div className="card-grid">
        {['KPI setup', 'Policy approvals', 'Report generation', 'Role permissions'].map((item) => (
          <article className="content-card" key={item}><h3>{item}</h3><p>Review the workflow and required data before submitting changes.</p></article>
        ))}
      </div>
    </section>
  );
}
