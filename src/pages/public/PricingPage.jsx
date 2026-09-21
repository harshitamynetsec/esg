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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.96rem', fontWeight: !isAnnual ? '700' : '500', color: !isAnnual ? '#0f172a' : '#64748b' }}>
            Monthly
          </span>

          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing cycle"
            style={{
              position: 'relative',
              width: '62px',
              height: '32px',
              borderRadius: '9999px',
              background: isAnnual ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#dfe7f5',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: isAnnual ? '0 8px 16px rgba(37, 99, 235, 0.28)' : 'inset 0 0 0 1px rgba(148, 163, 184, 0.3)',
              padding: '3px'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                transform: isAnnual ? 'translateX(30px)' : 'translateX(0px)',
                transition: 'transform 0.25s ease',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.2)'
              }}
            />
          </button>

          <span style={{ fontSize: '0.96rem', fontWeight: isAnnual ? '700' : '500', color: isAnnual ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Yearly
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.72rem', fontWeight: '800', padding: '4px 8px', borderRadius: '999px' }}>
              20% OFF
            </span>
          </span>
        </div>

        {/* Commercial Billing Consent Checkpoint */}
        <div style={{ maxWidth: 640, margin: '0 auto 28px', padding: '12px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: '#334155' }}>
          <input
            type="checkbox"
            id="billingConsent"
            checked={agreedToBilling}
            onChange={(e) => setAgreedToBilling(e.target.checked)}
            style={{ marginTop: 3, cursor: 'pointer' }}
          />
          <label htmlFor="billingConsent" style={{ cursor: 'pointer', lineHeight: 1.45 }}>
            I agree to the{' '}
            <a href="/legal/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>
              Terms and Conditions
            </a>{' '}
            governing subscription renewals, cancellations, and usage limits.
          </label>
        </div>

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
                  padding: '28px 24px',
                  border: isActive ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid #e2e8f0',
                  boxShadow: isActive ? '0 26px 55px -25px rgba(15, 23, 42, 0.55)' : '0 14px 34px -24px rgba(15, 23, 42, 0.18)',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.25s ease'
                }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '18px', right: '18px', background: '#dbeafe', color: '#1d4ed8', padding: '6px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: '18px', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? '#93c5fd' : '#64748b' }}>
                  {plan.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.06em' }}>
                    ${plan.price}
                  </span>
                  <span style={{ fontSize: '1rem', color: isActive ? '#cbd5e1' : '#64748b', fontWeight: '600' }}>
                    {plan.suffix}
                  </span>
                </div>

                <p style={{ margin: '0 0 22px', color: isActive ? '#cbd5e1' : '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {plan.note}
                </p>

                <div style={{ marginBottom: '26px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Unlimited ESG dashboards and team access',
                    'AI-powered reporting and document analysis',
                    'Framework tracking for BRSR, GRI, and CSRD',
                    'Priority support and onboarding guidance',
                  ].map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                      <span style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: isActive ? 'rgba(96, 165, 250, 0.18)' : '#ecfdf5', color: isActive ? '#7dd3fc' : '#15803d', fontWeight: '800' }}>
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
                    padding: '15px 18px',
                    background: !agreedToBilling ? '#94a3b8' : (isActive ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#eff6ff'),
                    color: !agreedToBilling ? '#ffffff' : (isActive ? '#ffffff' : '#1d4ed8'),
                    fontWeight: '800',
                    cursor: !agreedToBilling ? 'not-allowed' : 'pointer',
                    boxShadow: (isActive && agreedToBilling) ? '0 16px 24px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {isActive ? 'Choose yearly plan' : 'Choose monthly plan'}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '34px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08))', border: '1px solid rgba(96, 165, 250, 0.28)', borderRadius: '20px', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2563eb' }}>
              Special launch offer
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>
              Nov tak early bird offer: 20% off
            </div>
          </div>

          <button
            type="button"
            style={{
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '12px 18px',
              fontWeight: '700',
              cursor: 'pointer'
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