import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faEnvelope,
  faIndustry,
  faUsers,
  faLocationDot,
  faGlobe,
  faUser,
  faBriefcase,
  faLock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';
import FormField from '../../components/auth/FormField/FormField';
import FormSelect from '../../components/auth/FormSelect/FormSelect';
import { useAuth } from '../../hooks/useAuth';
import styles from './SignUp.module.scss';

const INDUSTRY_OPTIONS = [
  'Manufacturing',
  'Information Technology',
  'Healthcare',
  'Retail',
  'Financial Services',
  'Energy & Utilities',
  'Real Estate',
  'Other',
];

const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-250', '251-1000', '1000+'];

const INITIAL_STATE = {
  companyName: '',
  contactEmail: '',
  industry: '',
  companySize: '',
  state: '',
  country: '',
  fullName: '',
  workEmail: '',
  jobTitle: '',
  password: '',
};

export default function SignUp() {
  const [form, setForm] = useState(INITIAL_STATE);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [firstName, ...rest] = form.fullName.trim().split(/\s+/);
    await register({
      firstName,
      lastName: rest.join(' ') || firstName,
      email: form.workEmail,
      password: form.password,
      title: form.jobTitle,
      organization: {
        name: form.companyName,
        legalName: form.companyName,
        industry: form.industry,
        size: form.companySize,
        contactEmail: form.contactEmail,
        country: form.country,
        address: form.state,
      },
    });
    navigate('/app/onboarding');
  };

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Start your ESG reporting journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIndex}>01</span>
              <h3 className={styles.sectionTitle}>Company Details</h3>
            </div>

            <FormField icon={faBuilding} name="companyName" placeholder="Company Name" value={form.companyName} onChange={update('companyName')} required />
            <FormField icon={faEnvelope} type="email" name="contactEmail" placeholder="Contact Email" value={form.contactEmail} onChange={update('contactEmail')} required />
            <div className={styles.row}>
              <FormSelect icon={faIndustry} name="industry" placeholder="Industry" value={form.industry} onChange={update('industry')} options={INDUSTRY_OPTIONS} required />
              <FormSelect icon={faUsers} name="companySize" placeholder="Company Size" value={form.companySize} onChange={update('companySize')} options={COMPANY_SIZE_OPTIONS} required />
            </div>
            <div className={styles.row}>
              <FormField icon={faLocationDot} name="state" placeholder="State" value={form.state} onChange={update('state')} required />
              <FormField icon={faGlobe} name="country" placeholder="Country" value={form.country} onChange={update('country')} required />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIndex}>02</span>
              <h3 className={styles.sectionTitle}>Admin Details</h3>
            </div>

            <FormField icon={faUser} name="fullName" placeholder="Full Name" value={form.fullName} onChange={update('fullName')} autoComplete="name" required />
            <FormField icon={faEnvelope} type="email" name="workEmail" placeholder="Work Email" value={form.workEmail} onChange={update('workEmail')} autoComplete="email" required />
            <FormField icon={faBriefcase} name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={update('jobTitle')} required />
            <FormField icon={faLock} type="password" name="password" placeholder="Password" value={form.password} onChange={update('password')} autoComplete="new-password" required />
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Creating account' : 'Create Account'}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          {error ? <p className="error-line">{error}</p> : null}

          <p className={styles.footerText}>
            Already have an account? <Link to="/login" className={styles.footerLink}>Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
