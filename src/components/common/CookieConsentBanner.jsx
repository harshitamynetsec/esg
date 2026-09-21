import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'nss_cookie_consent_v1';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (consentData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consentData, timestamp: new Date().toISOString() }));
    setIsVisible(false);
    setShowManageModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, functional: true, analytics: true, marketing: true });
  };

  const handleRejectNonEssential = () => {
    saveConsent({ necessary: true, functional: false, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Bottom Cookie Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          maxWidth: 920,
          margin: '0 auto',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '18px 24px',
          borderRadius: 14,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 9990,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
        role="dialog"
        aria-label="Cookie consent banner"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: '1 1 340px' }}>
          <Cookie size={24} style={{ color: '#2dd4bf', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              We value your privacy (DPDPA & GDPR Compliant)
            </h4>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              We use cookies to enhance navigation, analyze site traffic, and support compliance reporting. You can accept all cookies, reject non-essential cookies, or manage your preferences anytime. Read our{' '}
              <Link to="/legal/privacy-policy" style={{ color: '#5eead4', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowManageModal(true)}
            style={{ padding: '8px 14px', fontSize: '0.825rem' }}
          >
            Manage Preferences
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={handleRejectNonEssential}
            style={{ padding: '8px 14px', fontSize: '0.825rem' }}
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={handleAcceptAll}
            style={{ padding: '8px 16px', fontSize: '0.825rem' }}
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showManageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              padding: 24,
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} style={{ color: '#2dd4bf' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Cookie Preferences</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 24px' }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Strictly Necessary</strong>
                  <small style={{ color: '#94a3b8' }}>Required for authentication and DPDPA security.</small>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, background: '#134e4a', color: '#5eead4', fontWeight: 600 }}>Always Active</span>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Functional Cookies</strong>
                  <small style={{ color: '#94a3b8' }}>Remembers Guided Tour and UI preferences.</small>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences((p) => ({ ...p, functional: e.target.checked }))}
                />
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Analytics Cookies</strong>
                  <small style={{ color: '#94a3b8' }}>Helps us measure feature usage anonymously.</small>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                />
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Marketing Cookies</strong>
                  <small style={{ color: '#94a3b8' }}>Used for tailored product notifications.</small>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences((p) => ({ ...p, marketing: e.target.checked }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="secondary-button" onClick={() => setShowManageModal(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleSavePreferences}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
