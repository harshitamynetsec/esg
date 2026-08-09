import { Link } from 'react-router-dom';
import PageHeader from '../../components/platform/PageHeader';

export default function OnboardingCompletePage() {
  return (
    <section className="page-panel">
      <PageHeader title="Dashboard Activation" description="Your ESG workspace is ready for continuous monitoring." />
      <Link className="primary-button" to="/app/dashboard">Open dashboard</Link>
    </section>
  );
}
