import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px',height: '500px' }}>
        <PageHeader 
          title="About Us" 
          description="Driving sustainable futures through intelligent governance and compliance." 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px', marginTop: '48px', color: '#334155', lineHeight: '1.8' }}>
          
          <div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px' }}>Our Mission</h2>
            <p style={{ marginBottom: '24px' }}>
              We believe that sustainable business is the only future of business. Our mission is to democratize ESG compliance by providing enterprise-grade tools that simplify tracking, automate reporting, and foster genuine maturity in environmental and social governance.
            </p>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px' }}>Backed by Nfilade Security Solutions</h2>
            <p>
              Developed by the core engineering and governance teams at Nfilade Security Solutions, the NSS-ESG Platform merges robust data security protocols with advanced compliance frameworks. We ensure that your most sensitive sustainability data is protected by enterprise security standards from day one.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px' }}>Security First</h3>
              <p>Built with zero-trust architecture to ensure all corporate disclosures and KPIs remain completely confidential until published.</p>
            </div>
            <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px' }}>Regulatory Alignment</h3>
              <p>Constantly updated to reflect the latest mandates in BRSR, CSRD, and global ESG frameworks, keeping you ahead of the compliance curve.</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}