import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function ResourcesPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px',height: '500px' }}>
        <PageHeader 
          title="Resources & Learning Hub" 
          description="Insights, guides, and documentation on ESG compliance and platform capabilities." 
        />
        
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
            
            <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.05em' }}>Whitepaper</span>
              <h3 style={{ fontSize: '1.25rem', margin: '12px 0', color: '#0f172a' }}>Navigating SEBI's BRSR Requirements</h3>
              <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>A comprehensive guide to transitioning your reporting standards to meet the latest Indian regulatory mandates.</p>
              <a href="#" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Download PDF →</a>
            </div>

            <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.05em' }}>Documentation</span>
              <h3 style={{ fontSize: '1.25rem', margin: '12px 0', color: '#0f172a' }}>Platform API & Integration Guide</h3>
              <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>Technical documentation for integrating your existing ERP and HRMS software directly into the NSS-ESG dashboard.</p>
              <a href="#" style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>View Docs →</a>
            </div>

            <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#9333ea', letterSpacing: '0.05em' }}>Webinar</span>
              <h3 style={{ fontSize: '1.25rem', margin: '12px 0', color: '#0f172a' }}>Mastering Scope 3 Emissions</h3>
              <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>Learn how to accurately audit and report supply chain emissions using automated materiality mapping.</p>
              <a href="#" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>Watch Recording →</a>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}