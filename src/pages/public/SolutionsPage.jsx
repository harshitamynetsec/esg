import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function SolutionsPage() {
  const solutions = [
    {
      title: "Environmental Tracking",
      desc: "Monitor Scope 1, 2, and 3 emissions, track waste management, and assess your carbon footprint in real-time.",
      icon: "🌱"
    },
    {
      title: "Social Impact & Equity",
      desc: "Measure labor practices, community engagement, diversity, and supply chain ethics through standardized KPIs.",
      icon: "🤝"
    },
    {
      title: "Corporate Governance",
      desc: "Audit board diversity, executive compensation, anti-corruption policies, and compliance readiness.",
      icon: "⚖️"
    },
    {
      title: "Automated Reporting",
      desc: "Generate audit-ready reports aligned with BRSR, GRI, SASB, and TCFD frameworks with one click.",
      icon: "📊"
    }
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px' }}>
        <PageHeader 
          title="Platform Solutions" 
          description="Comprehensive ESG tracking, reporting, and maturity assessments designed for modern enterprises." 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginTop: '48px' }}>
          {solutions.map((sol, index) => (
            <div key={index} style={{ padding: '32px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'transform 0.2s', cursor: 'pointer' }} className="solution-card">
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{sol.icon}</div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px' }}>{sol.title}</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>{sol.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}