import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './CTA.module.scss';

export default function CTA() {
  return (
    <section className={styles.cta} aria-label="Get started">
      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Get Started</span>
          <h2 className={styles.title}>Ready to simplify ESG reporting?</h2>
          <p className={styles.subtitle}>
            See how ESG Compass consolidates assessments, materiality, KPIs, and
            disclosure reporting into a single system your board can trust.
          </p>

          <div className={styles.ctaRow}>
            <Link to="/request-demo" className={styles.primaryButton}>
              <FontAwesomeIcon icon={faCalendarCheck} />
              Book Demo
            </Link>
            <Link to="/try" className={styles.secondaryButton}>
              Start Free Assessment
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
