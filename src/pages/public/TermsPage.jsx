import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 900, padding: '0 24px' }}>
        <PageHeader 
          title="Terms and Conditions" 
          description="NSS-ESG Platform Technology Solution Agreement." 
        />
        
        <div style={{ marginTop: '48px', color: '#334155', lineHeight: '1.8', fontSize: '1rem', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>1. Introduction and Scope</h2>
            <p>These Terms constitute a legally binding agreement between you and NSS Technologies Private Limited, a company with its registered office in Gurugram, Haryana, India[cite: 4]. The Platform is a self-service technology solution that enables organisations to assess, manage, track, and report their Environmental, Social, and Governance (ESG) performance[cite: 4]. The Platform does not constitute consulting, legal, financial, or advisory services of any kind[cite: 4].</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>2. Eligibility and Account Registration</h2>
            <p>The Platform is available to organisations, businesses, and authorised representatives of legal entities[cite: 4]. By registering, you represent and warrant that:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li>You are at least 18 years of age[cite: 4].</li>
              <li>You have the authority to bind your organisation to these Terms[cite: 4].</li>
              <li>Your use of the Platform complies with all applicable laws and regulations[cite: 4].</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>3. Platform Services and Limitations</h2>
            <p>The NSS-ESG Platform provides the following self-service capabilities[cite: 4]:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li>ESG Maturity Assessment across Environmental, Social, and Governance dimensions using a 5-Level Framework[cite: 4].</li>
              <li>Materiality topic identification and stakeholder mapping across 50+ ESG topics[cite: 4].</li>
              <li>Automated ESG Report generation aligned with BRSR, GRI, SASB, TCFD, ISSB, and SDGs[cite: 4].</li>
            </ul>
            <p style={{ marginTop: '12px' }}>NSS does not warrant that use of the Platform or its outputs will ensure compliance with any regulatory requirement, including SEBI BRSR or CSRD[cite: 4].</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>4. Intellectual Property and User Data</h2>
            <p>The Platform, including all software, algorithms, content, and methodologies, is the exclusive intellectual property of NSS Technologies Private Limited[cite: 4]. Users are granted a limited, non-exclusive, non-transferable, revocable licence for internal organisational purposes[cite: 4]. You retain ownership of all Organisation Data and ESG information you submit to the Platform[cite: 4].</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>5. User Obligations and Prohibited Conduct</h2>
            <p>Users must use the Platform only for lawful purposes and provide accurate, truthful data in all assessments[cite: 4]. You must not:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li>Submit false, misleading, or fabricated ESG data to obtain inflated maturity scores[cite: 4].</li>
              <li>Attempt to gain unauthorised access to other user accounts or infrastructure[cite: 4].</li>
              <li>Use automated bots or scraping tools to extract Platform content or data[cite: 4].</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>6. Governing Law and Dispute Resolution</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of India[cite: 4]. Disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Gurugram, India[cite: 4].</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}