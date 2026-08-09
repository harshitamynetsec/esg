import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 900, padding: '0 24px' }}>
        <PageHeader 
          title="Privacy Policy" 
          description="Data Protection & Privacy Notice for the NSS-ESG Platform." 
        />
        
        <div style={{ marginTop: '48px', color: '#334155', lineHeight: '1.8', fontSize: '1rem', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>1. Introduction</h2>
            <p>This Privacy Policy explains how NSS Technologies Private Limited collects, uses, stores, and protects your personal data in compliance with India's Digital Personal Data Protection Act, 2023 (DPDPA)[cite: 5]. NSS acts as the Data Fiduciary under the DPDPA[cite: 5].</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>2. Data We Collect</h2>
            <p>When you register and utilise our platform, we collect specific data categories:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li><strong>Identity and Contact Data:</strong> Full name, designation, business email address, company details, and business registration identifiers[cite: 5].</li>
              <li><strong>Assessment and ESG Data:</strong> Responses to the ESG Maturity Assessment questionnaire encompassing over 70 questions, materiality topic selections, and KPI data[cite: 5].</li>
              <li><strong>Technical Data:</strong> IP address, browser type, operating system, and access logs[cite: 5].</li>
              <li><strong>Communications Data:</strong> The content of your communications, email correspondence, and support ticket data[cite: 5].</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>3. How We Use and Share Your Data</h2>
            <p>We process your data for lawful purposes including account registration, delivering ESG assessments, and processing subscription payments[cite: 5]. NSS does not sell, rent, or trade your personal data to third parties for commercial purposes[cite: 5]. We may share your data with trusted third-party service providers, such as cloud infrastructure and payment gateway providers, subject to strict data protection obligations[cite: 5].</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>4. Data Retention</h2>
            <p>We retain your personal data only as long as necessary. Specific retention periods include:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li><strong>Account and identity data:</strong> Retained for the duration of the active account plus 3 years after account closure[cite: 5].</li>
              <li><strong>ESG assessment and report data:</strong> Retained for the duration of the active account plus 2 years after account closure[cite: 5].</li>
              <li><strong>Payment and transaction records:</strong> Retained for 7 years as required by Indian financial regulations[cite: 5].</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>5. Your Rights and Security</h2>
            <p>Under the Digital Personal Data Protection Act, 2023, you hold several rights regarding your data:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li>The right to access, correct, or erase your personal data[cite: 5].</li>
              <li>The right to withdraw consent and the right to grievance redressal[cite: 5].</li>
              <li>The right to nominate an individual to exercise data rights in the event of your death or incapacity[cite: 5].</li>
            </ul>
            <p style={{ marginTop: '12px' }}>To protect your data, NSS implements industry-standard measures including end-to-end encryption (TLS/SSL) for data in transit and AES-256 encryption for data at rest[cite: 5]. Furthermore, ESG assessment data submitted to the platform is never shared with third parties without explicit written consent from the account administrator[cite: 5].</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}