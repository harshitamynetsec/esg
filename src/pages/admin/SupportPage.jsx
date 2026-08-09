import PageHeader from '../../components/platform/PageHeader';

const supportQueues = ['Implementation support', 'Billing support', 'Technical incidents', 'Report assistance'];

export default function SupportPage() {
  return (
    <section className="page-panel">
      <PageHeader title="Support" description="Monitor support queues and coordinate admin follow-up across customer workspaces." />
      <div className="card-grid">
        {supportQueues.map((queue) => (
          <article className="content-card" key={queue}>
            <h3>{queue}</h3>
            <p>Queue ready for assignment, triage, and customer communication.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
