import { Link } from 'react-router-dom';
import PageHeader from '../../components/platform/PageHeader';

export default function WelcomePage() {
  return (
    <section className="page-panel">
      <PageHeader title="Guided Onboarding" description="Move from ESG intent to a working performance management system." />
      <div className="card-grid">
        {[
          ['Learning Hub', '/app/onboarding/learning'],
          ['Questionnaire', '/app/onboarding/questionnaire'],
          ['Material Topics', '/app/onboarding/material-topics'],
          ['Goals and KPIs', '/app/onboarding/goals-kpis'],
        ].map(([label, to]) => (
          <Link className="content-card" key={to} to={to}>{label}</Link>
        ))}
      </div>
    </section>
  );
}
