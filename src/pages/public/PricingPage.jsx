import React, { useState } from 'react';
import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPrice = 6999;
  const annualMonthlyPrice = 5599; // ~20% discount on annual billing

  return (
    <div className={styles.page} style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-panel" style={{ margin: '40px auto 80px', maxWidth: '1180px', width: '100%', padding: '0 24px', flex: 1 }}>
        <PageHeader 
          title="One Powerful Plan for Complete ESG Governance" 
          description="No hidden tiers, no paywalled features. Get full enterprise-grade ESG intelligence, AI automation, and unlimited team collaboration." 
        />

        {/* Billing Cycle Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '36px', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: !isAnnual ? '600' : '400', color: !isAnnual ? '#0f172a' : '#64748b' }}>
            Monthly Billing
          </span>
          
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              position: 'relative',
              width: '52px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: isAnnual ? '#2563eb' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              padding: '2px'
            }}
          >
            <div 
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                transform: isAnnual ? 'translateX(24px)' : 'translateX(0px)',
                transition: 'transform 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            />
          </button>

          <span style={{ fontSize: '0.95rem', fontWeight: isAnnual ? '600' : '400', color: isAnnual ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Annual Billing
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
              SAVE 20%
            </span>
          </span>
        </div>

        {/* Main Showcase Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '32px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.07)',
            padding: '40px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Left Side: Value Proposition & Core Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px' }}>
                ✦ All-Inclusive Enterprise Access
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.25', marginBottom: '16px' }}>
                Full-suite ESG oversight without enterprise lock-in.
              </h2>
              
              <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
                Deploy compliant carbon accounting, BRSR frameworks, audit trails, and automated disclosures with zero user caps.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Unlimited</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Team & Auditor Seats</div>
                </div>
                <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>BRSR & GRI</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Pre-configured Frameworks</div>
                </div>
                <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>AI Extraction</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Automated Utility Parsing</div>
                </div>
                <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>24/7 SLA</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Priority Engineering Support</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> No setup fees
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> Cancel anytime
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> GST invoice compliant
              </div>
            </div>
          </div>

          {/* Right Side: High-Impact Pricing Card */}
          <div 
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#ffffff',
              borderRadius: '16px',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.3)',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#93c5fd' }}>Standard Plan</span>
                <span style={{ backgroundColor: '#2563eb', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '10px' }}>
                  COMPLETE PLATFORM
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px' }}>
                  ₹{(isAnnual ? annualMonthlyPrice : monthlyPrice).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/month</span>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '28px' }}>
                {isAnnual ? 'Billed annually at ₹67,188/year (Excl. GST)' : 'Billed monthly, pause or cancel anytime'}
              </p>

              <div style={{ height: '1px', backgroundColor: '#334155', marginBottom: '28px' }} />

              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Everything included:
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Full BRSR Core, GRI & GHG Protocol Workflows',
                  'Unlimited Internal & External Collaborators',
                  'Automated Scope 1, Scope 2 & Scope 3 Tracking',
                  'AI Document Ingestion (Utility Bills & Invoices)',
                  'One-Click Export to PDF, XLSX & Stakeholder Portals',
                  'Custom Webhooks & REST API Integrations'
                ].map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.925rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <button 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  backgroundColor: '#2563eb', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                Get Started with Free 14-Day Trial
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '12px' }}>
                Instant activation • No credit card required upfront
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Below to Fill & Ground the Page */}
        <div style={{ marginTop: '64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛡️</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Audit Ready</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
              Immutable audit logs and timestamped verification records for all regulatory filings.
            </p>
          </div>

          <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Fast Onboarding</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
              Import existing spreadsheets or connect direct API feeds in under 15 minutes.
            </p>
          </div>

          <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔒</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Bank-Grade Security</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
              SOC-2 compliant infrastructure, end-to-end encryption, and role-based permissions.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}