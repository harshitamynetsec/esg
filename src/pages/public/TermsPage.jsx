import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 960, padding: '0 24px' }}>
        <PageHeader
          title="Terms and Conditions"
          description="Legal Agreement and Governance Terms for the NSS-ESG Technology Platform"
        />

        <div style={{ marginTop: '36px', color: '#334155', lineHeight: '1.8', fontSize: '1rem', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          <div style={{ padding: '16px 20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#1e293b', fontSize: '0.925rem' }}>
            <strong>IMPORTANT — PLEASE READ CAREFULLY:</strong> By accessing or using the NSS-ESG Platform, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions in their entirety. If you do not agree, please discontinue use immediately.
          </div>

          <section>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px' }}>1. Introduction & Self-Service Scope</h2>
            <p>These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you") and NSS Technologies Private Limited ("NSS", "we"). These Terms govern your access to the NSS-ESG Platform available at www.nss-esg.com.</p>
            <p style={{ marginTop: '8px' }}>The Platform is a <strong>self-service technology solution</strong> that enables organisations to assess, manage, track, and report their ESG performance. The Platform does not constitute consulting, legal, financial, tax, or regulatory advisory services of any kind.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px' }}>2. Regulatory Disclaimers (SEBI BRSR & Frameworks)</h2>
            <p>While the Platform aligns assessments and reports with multiple ESG frameworks (BRSR, GRI, SASB, TCFD, ISSB, SDGs), <strong>NSS does not guarantee</strong> that Platform outputs will satisfy all requirements of any specific regulatory submission. Framework requirements may change; Users are solely responsible for verifying current regulatory obligations with qualified advisors. SEBI BRSR requirements, in particular, are subject to periodic revision by SEBI.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px' }}>3. Subscription Plans, Billing & Cancellation</h2>
            <p>Access to the Platform is offered under four Subscription Plans:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li><strong>Free Tier:</strong> Limited access to core assessment features subject to usage caps.</li>
              <li><strong>Starter Plan:</strong> Full ESG Assessment, basic reporting, and Learning Hub access.</li>
              <li><strong>Professional Plan:</strong> Complete assessment suite, automated multi-framework reports, and priority support.</li>
              <li><strong>Enterprise Plan:</strong> Custom configurations, API access, and dedicated account management.</li>
            </ul>
            <p style={{ marginTop: '8px' }}>Subscriptions automatically renew at the end of each billing cycle (monthly or annual) unless cancelled prior to the renewal date via account settings. Taxes including GST are billed at prevailing statutory rates.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px' }}>4. Intellectual Property Protections</h2>
            <p>The Platform, including software, algorithms, assessment frameworks, scoring models, report templates, and visual designs, is the exclusive intellectual property of NSS Technologies Private Limited and is protected under the Copyright Act, 1957, and Trade Marks Act, 1999.</p>
            <p style={{ marginTop: '8px' }}>Users retain ownership of their submitted ESG Organisation Data. Users grant NSS a non-exclusive licence to process Organisation Data for providing services and producing anonymised, aggregated industry benchmarks.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px' }}>5. Prohibited Conduct</h2>
            <p>Users must not:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li>Submit false, misleading, or fabricated ESG data to obtain inflated maturity scores.</li>
              <li>Attempt to gain unauthorised access to other accounts or platform infrastructure.</li>
              <li>Scrape, reverse-engineer, decompile, or disassemble any part of the Platform.</li>
              <li>Represent Platform-generated reports as independently assured without obtaining separate 3rd-party verification.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px' }}>6. Governing Law & Dispute Resolution</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the Republic of India. Any dispute arising out of or in connection with these Terms shall be referred to and finally resolved by arbitration in New Delhi, India, in English, under the Arbitration and Conciliation Act, 1996.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}