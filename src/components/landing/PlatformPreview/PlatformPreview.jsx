import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faClipboardList,
  faDiagramProject,
  faFileLines,
  faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
import styles from './PlatformPreview.module.scss';

/** @type {import('../../../types/landing.types').PlatformHighlight[]} */
const HIGHLIGHTS = [
  { id: 'ai-insights', icon: faWandMagicSparkles, title: 'AI Insights', description: 'Anomaly detection across scope 1–3 data streams', position: 'top-left' },
  { id: 'questionnaire', icon: faClipboardList, title: 'Questionnaire', description: 'Auto-populated disclosure questionnaires', position: 'top-right' },
  { id: 'materiality', icon: faDiagramProject, title: 'Materiality Matrix', description: 'Stakeholder-weighted topic prioritization', position: 'bottom-left' },
  { id: 'reports', icon: faFileLines, title: 'Reports', description: 'One-click BRSR, CSRD & GRI disclosures', position: 'center-right' },
  { id: 'kpis', icon: faGaugeHigh, title: 'KPIs', description: 'Real-time tracking against science-based targets', position: 'bottom-right' },
];

export default function PlatformPreview() {
  return (
    <section className={styles.platform} aria-label="Platform overview">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Platform Overview</span>
          <h2 className={styles.title}>One system of record for the entire ESG lifecycle</h2>
          <p className={styles.description}>
            From data collection to assured disclosure, ESG Compass consolidates every
            workflow your sustainability, finance, and compliance teams depend on.
          </p>
        </div>

        <div className={styles.screenshotWrap}>
          <div className={styles.screenshot}>
            <div className={styles.screenshotChrome}>
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
              <span className={styles.chromeUrl}>app.esgcompass.io/dashboard</span>
            </div>
            <div className={styles.screenshotBody}>
              <div className={styles.screenshotSidebar}>
                <div className={styles.sidebarLogo} />
                {['Overview', 'Assessments', 'Materiality', 'KPIs', 'Reports', 'Settings'].map((item, i) => (
                  <div key={item} className={`${styles.sidebarItem} ${i === 0 ? styles.active : ''}`}>
                    <span />
                    {item}
                  </div>
                ))}
              </div>
              <div className={styles.screenshotMain}>
                <div className={styles.mainRow}>
                  <div className={styles.mainCard} />
                  <div className={styles.mainCard} />
                  <div className={styles.mainCard} />
                </div>
                <div className={styles.mainChart}>
                  <svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points="0,90 50,80 100,84 150,60 200,64 250,40 300,46 350,22 400,28" className={styles.chartLineForest} />
                    <polyline points="0,100 50,96 100,98 150,88 200,90 250,78 300,80 350,68 400,70" className={styles.chartLineBlue} />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.id}
              className={`${styles.highlightCard} ${styles[h.position]}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <span className={styles.highlightIcon}>
                <FontAwesomeIcon icon={h.icon} />
              </span>
              <div>
                <h3 className={styles.highlightTitle}>{h.title}</h3>
                <p className={styles.highlightDescription}>{h.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
