import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';
import FormField from '../../components/auth/FormField/FormField';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.scss';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate('/app/dashboard');
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

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Logging in' : 'Login'}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          {error ? <p className="error-line">{error}</p> : null}

          <p className={styles.footerText}>
            Don't have an account? <Link to="/sign-up" className={styles.footerLink}>Sign Up</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
