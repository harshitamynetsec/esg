import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';
import FormField from '../../components/auth/FormField/FormField';
import { authApi } from '../../services/api';
import styles from './Login.module.scss';

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing invitation token link.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordPattern.test(form.password)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.setPassword({
        token,
        password: form.password,
      });

      const { user, tokens } = response.data || {};
      if (tokens?.accessToken) {
        localStorage.setItem('esg_access_token', tokens.accessToken);
        if (tokens.refreshToken) localStorage.setItem('esg_refresh_token', tokens.refreshToken);
        if (user) localStorage.setItem('esg_user', JSON.stringify(user));
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(tokens?.accessToken ? '/app/dashboard' : '/login');
      }, 2000);
    } catch (err) {
      setError(err.displayMessage || err.message || 'Failed to set password. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Set Up Your Password</h2>
          <p className={styles.subtitle}>Create a password to activate your account</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <FontAwesomeIcon icon={faCheckCircle} size="3x" style={{ color: '#0f766e', marginBottom: 16 }} />
            <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>Password Configured!</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>Redirecting you to the workspace...</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {!token ? (
              <p className="error-line" style={{ marginBottom: 16 }}>
                Invitation token missing in URL link. Please check your invitation email.
              </p>
            ) : null}

            <FormField
              icon={faLock}
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
              required
            />

            <FormField
              icon={faLock}
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              autoComplete="new-password"
              required
            />

            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 12px' }}>
              Must contain 8+ characters, uppercase, lowercase, number, and special symbol.
            </p>

            <button type="submit" className={styles.submit} disabled={loading || !token}>
              {loading ? 'Activating Account...' : 'Set Password & Activate'}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

            {error ? <p className="error-line">{error}</p> : null}

            <p className={styles.footerText}>
              Already activated? <Link to="/login" className={styles.footerLink}>Login</Link>
            </p>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
