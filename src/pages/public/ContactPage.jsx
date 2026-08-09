import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px' }}>
        <PageHeader 
          title="Contact" 
          description="Request ESG-NSS support, implementation guidance, or an enterprise demo." 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', marginTop: '48px' }}>
          
          {/* Contact Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="firstName" style={{ fontWeight: '500', fontSize: '0.875rem' }}>First Name</label>
                  <input type="text" id="firstName" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="lastName" style={{ fontWeight: '500', fontSize: '0.875rem' }}>Last Name</label>
                  <input type="text" id="lastName" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="email" style={{ fontWeight: '500', fontSize: '0.875rem' }}>Work Email</label>
                <input type="email" id="email" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="inquiryType" style={{ fontWeight: '500', fontSize: '0.875rem' }}>How can we help?</label>
                <select id="inquiryType" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option>Request an Enterprise Demo</option>
                  <option>Implementation Guidance</option>
                  <option>ESG-NSS Technical Support</option>
                  <option>Other Inquiry</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="message" style={{ fontWeight: '500', fontSize: '0.875rem' }}>Message</label>
                <textarea id="message" rows="4" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '8px' }}>
                Submit Request
              </button>
            </form>
          </div>

          {/* Contact Information Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '32px 0' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Global Headquarters</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>
                Nfilade Security Solutions<br />
                Enterprise Governance Division<br />
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Direct Inquiries</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>
                <strong>Support:</strong> support@nfilade.com<br />
                <strong>Sales:</strong> enterprise@nfilade.com<br />
              </p>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ marginBottom: '8px', color: '#0f172a' }}>Need immediate assistance?</h4>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '16px' }}>Enterprise clients have access to a dedicated 24/7 support line found in the ESG dashboard.</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}