import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { demoRequestApi } from '../../services/api';
import './RequestDemoPage.css';

const FRAMEWORK_OPTIONS = ['GRI', 'BRSR', 'SASB', 'CSRD', 'CDP', 'TCFD', 'Not sure yet'];
const COMPANY_SIZE_OPTIONS = ['1–50 employees', '51–200 employees', '201–1,000 employees', '1,000+ employees'];

const emptyForm = {
  fullName: '',
  workEmail: '',
  company: '',
  jobTitle: '',
  companySize: '',
  region: '',
  frameworks: [],
  notes: '',
};

export default function RequestDemoPage() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const toggleFramework = (framework) => (event) => {
    setForm((current) => ({
      ...current,
      frameworks: event.target.checked
        ? [...current.frameworks, framework]
        : current.frameworks.filter((item) => item !== framework),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await demoRequestApi.submit(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="demo-page">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <header className="demo-header">
        <Link className="demo-wordmark" to="/">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C7 4 4 8 4 13c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9 0-5-3-9-8-11Z" stroke="#1f6f54" strokeWidth="1.6" fill="#e4efe9" />
            <path d="M8.5 12.2l2.4 2.6 4.6-5.4" stroke="#1f6f54" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ESG Compass
        </Link>
        <Link className="demo-header-link" to="/">← Back to home</Link>
      </header>

      <div className="demo-layout">
        <section className="demo-pitch-panel">
          <div className="demo-pitch-head">
            <span className="demo-eyebrow">Request a demo</span>
            <h1>See governance-grade ESG reporting, before your next audit.</h1>
            <p className="demo-pitch-sub">
              One walkthrough of assessments, materiality mapping, KPI tracking, and disclosure
              reporting — scoped to the frameworks your business actually reports against.
            </p>
          </div>

          <div className="demo-framework-row">
            {FRAMEWORK_OPTIONS.filter((item) => item !== 'Not sure yet').map((item) => (
              <span key={item} className="demo-framework-pill">{item}</span>
            ))}
            <span className="demo-framework-pill">SDGs</span>
          </div>

          <div className="demo-covers">
            <span className="demo-covers-title">What the call covers</span>
            <ol>
              <li><span className="demo-num">01</span><span>A 30-minute walkthrough scoped to your entities, frameworks, and reporting calendar</span></li>
              <li><span className="demo-num">02</span><span>A live look at materiality mapping, KPI tracking, and AI-drafted disclosures</span></li>
              <li><span className="demo-num">03</span><span>Direct answers on SSO, audit logs, and data residency for your security team</span></li>
            </ol>
          </div>

          <p className="demo-outcomes">
            <strong>Built for regulated reporting.</strong> Every disclosure maps to a single data
            model, so your team enters each metric once and reuses it across GRI, BRSR, SASB, CSRD,
            CDP, and TCFD.
          </p>
        </section>

        <section className="demo-form-panel">
          {submitted ? (
            <div className="demo-form-card demo-success-card">
              <div className="demo-success-icon"><Check size={20} /></div>
              <h2>Request received</h2>
              <p>Someone from our team will reach out within one business day to schedule your walkthrough. Check your inbox for a confirmation shortly.</p>
              <div className="demo-success-actions">
                <Link className="demo-home-btn" to="/">Back to home</Link>
                <button type="button" className="demo-reset-btn" onClick={handleReset}>Submit another request</button>
              </div>
            </div>
          ) : (
            <div className="demo-form-card">
              <h2>Talk to our team</h2>
              <p className="demo-form-intro">
                Tell us a bit about your organization and we&apos;ll pair you with someone who knows your
                reporting frameworks.
              </p>

              <form className="demo-form" onSubmit={handleSubmit}>
                <div className="demo-field-row">
                  <div className="demo-field">
                    <label htmlFor="fullName">Full name</label>
                    <input type="text" id="fullName" placeholder="Jordan Alvarez" required value={form.fullName} onChange={updateField('fullName')} />
                  </div>
                  <div className="demo-field">
                    <label htmlFor="workEmail">Work email</label>
                    <input type="email" id="workEmail" placeholder="jordan@company.com" required value={form.workEmail} onChange={updateField('workEmail')} />
                  </div>
                </div>

                <div className="demo-field-row">
                  <div className="demo-field">
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" placeholder="Company name" required value={form.company} onChange={updateField('company')} />
                  </div>
                  <div className="demo-field">
                    <label htmlFor="jobTitle">Job title</label>
                    <input type="text" id="jobTitle" placeholder="Sustainability Lead" value={form.jobTitle} onChange={updateField('jobTitle')} />
                  </div>
                </div>

                <div className="demo-field-row">
                  <div className="demo-field">
                    <label htmlFor="companySize">Company size</label>
                    <select id="companySize" value={form.companySize} onChange={updateField('companySize')}>
                      <option value="">Select one</option>
                      {COMPANY_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </div>
                  <div className="demo-field">
                    <label htmlFor="region">Country / region</label>
                    <input type="text" id="region" placeholder="e.g. India" value={form.region} onChange={updateField('region')} />
                  </div>
                </div>

                <fieldset className="demo-fieldset">
                  <label>Frameworks you report against <span className="demo-optional">(optional)</span></label>
                  <div className="demo-chip-group">
                    {FRAMEWORK_OPTIONS.map((framework) => (
                      <label key={framework} className="demo-chip">
                        <input
                          type="checkbox"
                          checked={form.frameworks.includes(framework)}
                          onChange={toggleFramework(framework)}
                        />
                        <span>{framework}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="demo-field">
                  <label htmlFor="notes">What should the demo focus on? <span className="demo-optional">(optional)</span></label>
                  <textarea id="notes" placeholder="Materiality mapping, CSRD readiness, supplier questionnaires…" value={form.notes} onChange={updateField('notes')} />
                </div>

                {error ? <p className="demo-error-line">{error}</p> : null}

                <button type="submit" className="demo-submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Request Demo'}
                </button>
                <p className="demo-fine-print">By submitting, you agree to be contacted about ESG Compass. No spam, unsubscribe anytime.</p>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
