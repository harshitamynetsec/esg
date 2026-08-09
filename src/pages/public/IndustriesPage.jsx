import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function IndustriesPage() {
  const industries = [
    {
      name: "Manufacturing",
      focus: "Supply Chain & Emissions",
      desc: "Track raw material sourcing, waste diversion rates, and factory floor safety metrics. Integrate IoT sensors for real-time Scope 1 emissions tracking."
    },
    {
      name: "Financial Services",
      focus: "Governance & Data Security",
      desc: "Ensure transparent board reporting, track portfolio carbon footprints, and maintain rigid compliance with data privacy regulations."
    },
    {
      name: "Healthcare",
      focus: "Social Impact & Waste",
      desc: "Monitor medical waste disposal compliance, clinical trial diversity, and employee wellness metrics across multiple hospital networks."
    },
    {
      name: "Technology",
      focus: "Energy & Equity",
      desc: "Calculate data center energy consumption, e-waste recycling rates, and track DEI (Diversity, Equity, and Inclusion) KPIs globally."
    }
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px',height: '500px' }}>
        <PageHeader 
          title="Industries We Serve" 
          description="Tailored ESG strategies and framework mappings for specialized sectors." 
        />
        
        <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {industries.map((ind, index) => (
            <div key={index} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff', alignItems: 'center' }}>
              <div style={{ flex: '1 1 250px' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '8px' }}>{ind.name}</h3>
                <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#e2e8f0', borderRadius: '16px', fontSize: '0.875rem', fontWeight: '500', color: '#475569' }}>
                  Key Focus: {ind.focus}
                </span>
              </div>
              <div style={{ flex: '2 1 400px' }}>
                <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  {ind.desc}
                </p>
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <button style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #0f172a', color: '#0f172a', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}