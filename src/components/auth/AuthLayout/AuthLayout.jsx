import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './AuthLayout.module.scss';

const FRAMEWORK_BADGES = ['GRI', 'BRSR', 'SASB', 'CSRD', 'CDP', 'TCFD'];
const ringCircumference = 2 * Math.PI * 42;
const ringValue = 94;

export default function AuthLayout({ children }) {
  const offset = ringCircumference - (ringValue / 100) * ringCircumference;

  return (
    <div className={styles.layout}>
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark}>
              <FontAwesomeIcon icon={faLeaf} />
            </span>
            <span className={styles.brandName}>ESG Compass</span>
          </Link>

          <div className={styles.panelBody}>
            <span className={styles.eyebrow}>AI-Powered ESG Intelligence Platform</span>
            <h1 className={styles.headline}>
              Enterprise ESG, governed with the rigor of finance.
            </h1>
            <p className={styles.subtitle}>
              One system of record for assessments, materiality, KPIs, and
              audit-ready disclosure reporting.
            </p>

            <div className={styles.statCard}>
              <svg viewBox="0 0 100 100" className={styles.ringSvg} aria-hidden="true">
                <circle cx="50" cy="50" r="42" className={styles.ringTrack} />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={styles.ringProgress}
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div>
                <span className={styles.statValue}>94%</span>
                <span className={styles.statLabel}>Average compliance accuracy</span>
              </div>
            </div>

            <div className={styles.frameworks}>
              {FRAMEWORK_BADGES.map((code) => (
                <span key={code} className={styles.frameworkBadge}>
                  <span className={styles.checkMark}>✓</span>
                  {code}
                </span>
              ))}
            </div>
          </div>

          <span className={styles.compliance}>SOC 2 Type II · ISO 27001 · GDPR Ready</span>
        </div>
      </div>

      <div className={styles.formSide}>
        <Link to="/" className={styles.backLink}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to site
        </Link>

        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
