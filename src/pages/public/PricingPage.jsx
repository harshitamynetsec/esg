import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px',height: '500px' }}>
        <PageHeader 
          title="Pricing" 
          description="Starter, Growth, and Enterprise plans for teams scaling ESG governance." 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '48px' }}>
          {/* Starter Plan */}
          <div className="pricing-card" style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Starter</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Essential tools for small teams initiating ESG tracking.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>$499<span style={{ fontSize: '1rem', color: '#64748b' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>✓ Basic ESG Reporting</li>
              <li>✓ Up to 5 Team Members</li>
              <li>✓ Standard Support</li>
            </ul>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Get Started
            </button>
          </div>

          {/* Growth Plan */}
          <div className="pricing-card" style={{ padding: '32px', border: '2px solid #2563eb', borderRadius: '8px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563eb', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.875rem' }}>
              Most Popular
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Growth</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Advanced analytics for growing organizations.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>$999<span style={{ fontSize: '1rem', color: '#64748b' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>✓ Advanced ESG Frameworks</li>
              <li>✓ AI Feature Access</li>
              <li>✓ Up to 25 Team Members</li>
              <li>✓ Priority Support</li>
            </ul>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="pricing-card" style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Enterprise</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Custom deployment for large-scale governance operations.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Custom</div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>✓ Unlimited Team Members</li>
              <li>✓ Dedicated Implementation Guidance</li>
              <li>✓ Custom Integrations & APIs</li>
              <li>✓ 24/7 SLA Support</li>
            </ul>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Contact Sales
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}