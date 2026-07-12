import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';
import FormField from '../../components/auth/FormField/FormField';
import styles from './Login.module.scss';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to your login API / auth provider here.
  };

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Login to continue your ESG journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField
            icon={faEnvelope}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={update('email')}
            autoComplete="email"
            required
          />
          <FormField
            icon={faLock}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            autoComplete="current-password"
            required
          />

          <div className={styles.optionsRow}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.submit}>
            Login
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <p className={styles.footerText}>
            Don't have an account? <Link to="/sign-up" className={styles.footerLink}>Sign Up</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
