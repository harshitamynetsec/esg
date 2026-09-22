import React, { useState } from 'react';
import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import PageHeader from '../../components/platform/PageHeader';
import styles from './LandingPage.module.scss';
import '../../styles/platform.css';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [agreedToBilling, setAgreedToBilling] = useState(false);

  const plans = [
    {
      name: 'Monthly',
      price: 25,
      suffix: '/month',
      note: 'Best for individuals and lightweight teams',
      badge: null,
    },
    {
      name: 'Yearly',
      price: 250,
      suffix: '/year',
      note: 'Save with the annual plan and lock in the best value',
      badge: 'Best value',
    },
  ];

  const activePlan = plans[isAnnual ? 1 : 0];

  return (
    <div className={styles.page} style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #f5f7fb 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="page-panel" style={{ margin: '40px auto 80px', maxWidth: '1180px', width: '100%', padding: '0 24px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '999px', color: '#166534', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Early bird offer
          </div>
          <PageHeader
            title="Pricing"
            description="Simple, transparent pricing built for teams that want smarter ESG operations without hidden costs."
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '36px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1rem', fontWeight: !isAnnual ? '700' : '500', color: !isAnnual ? '#0f172a' : '#64748b', cursor: 'pointer' }} onClick={() => setIsAnnual(false)}>
            Monthly
          </span>

          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing cycle"
            style={{
              position: 'relative',
              width: '64px',
              height: '34px',
              borderRadius: '9999px',
              background: isAnnual ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isAnnual ? '0 8px 16px rgba(37, 99, 235, 0.28)' : 'inset 0 2px 4px rgba(0,0,0,0.1)',
              padding: '4px'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                transform: isAnnual ? 'translateX(30px)' : 'translateX(0px)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
              }}
            />
          </button>

          <span style={{ fontSize: '1rem', fontWeight: isAnnual ? '700' : '500', color: isAnnual ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsAnnual(true)}>
            Yearly
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
              20% OFF
            </span>
          </span>
        </div>

        {/* Commercial Billing Consent Checkpoint */}
        <div style={{ maxWidth: 640, margin: '0 auto 32px', padding: '14px 18px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.875rem', color: '#334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <input
            type="checkbox"
            id="billingConsent"
            checked={agreedToBilling}
            onChange={(e) => setAgreedToBilling(e.target.checked)}
            style={{ marginTop: 3, cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <label htmlFor="billingConsent" style={{ cursor: 'pointer', lineHeight: 1.5 }}>
            I agree to the{' '}
            <a href="/legal/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Terms and Conditions
            </a>{' '}
            governing subscription renewals, cancellations, and usage limits.
          </label>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px', alignItems: 'stretch' }}>
          {plans.map((plan) => {
            const isActive = plan.name === activePlan.name;

            return (
              <div
                key={plan.name}
                style={{
                  background: isActive ? 'linear-gradient(180deg, #0f172a 0%, #111827 100%)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#0f172a',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  border: isActive ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid #e2e8f0',
                  boxShadow: isActive ? '0 26px 55px -25px rgba(15, 23, 42, 0.65)' : '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'all 0.3s ease'
                }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#dbeafe', color: '#1d4ed8', padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: '18px', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? '#93c5fd' : '#64748b' }}>
                  {plan.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.04em' }}>
                    ${plan.price}
                  </span>
                  <span style={{ fontSize: '1.1rem', color: isActive ? '#cbd5e1' : '#64748b', fontWeight: '600' }}>
                    {plan.suffix}
                  </span>
                </div>

                <p style={{ margin: '0 0 28px', color: isActive ? '#cbd5e1' : '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {plan.note}
                </p>

                <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    'Unlimited ESG dashboards and team access',
                    'AI-powered reporting and document analysis',
                    'Framework tracking for BRSR, GRI, and CSRD',
                    'Priority support and onboarding guidance',
                  ].map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                      <span style={{ width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: isActive ? 'rgba(96, 165, 250, 0.18)' : '#ecfdf5', color: isActive ? '#7dd3fc' : '#15803d', fontWeight: '800', fontSize: '0.8rem' }}>
                        ✓
                      </span>
                      <span style={{ color: isActive ? '#e2e8f0' : '#334155' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!agreedToBilling}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    background: !agreedToBilling ? '#cbd5e1' : (isActive ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#eff6ff'),
                    color: !agreedToBilling ? '#ffffff' : (isActive ? '#ffffff' : '#1d4ed8'),
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: !agreedToBilling ? 'not-allowed' : 'pointer',
                    boxShadow: (isActive && agreedToBilling) ? '0 12px 20px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.2s ease',
                    marginTop: 'auto'
                  }}
                >
                  Choose {plan.name.toLowerCase()} plan
                </button>
              </div>
            );
          })}
        </div>

        {/* Promo Banner */}
        <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08))', border: '1px solid rgba(96, 165, 250, 0.28)', borderRadius: '20px', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2563eb' }}>
              Special launch offer
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginTop: '8px' }}>
              Early bird offer until November: 20% off
            </div>
          </div>

          <button
            type="button"
            style={{
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '14px 24px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Book a demo
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}