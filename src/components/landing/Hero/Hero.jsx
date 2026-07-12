import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlay, faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import styles from './Hero.module.scss';

const FRAMEWORK_BADGES = ['GRI', 'BRSR', 'SASB', 'CSRD', 'CDP', 'TCFD'];

/** @type {import('../../../types/landing.types').HeroKpiRing[]} */
const KPI_RINGS = [
  { id: 'esg-score', label: 'ESG Score', value: 78, displayValue: '78', color: 'forest' },
  { id: 'compliance', label: 'Compliance', value: 94, displayValue: '94%', color: 'blue' },
];

/** @type {import('../../../types/landing.types').HeroKpiCard[]} */
const KPI_CARDS = [
  { id: 'emissions', label: 'Carbon Emissions', value: '18.4K tCO₂e', delta: '-6.2%', trend: 'down', sparkline: [40, 44, 38, 42, 34, 30, 26] },
  { id: 'material-topics', label: 'Material Topics', value: '32', delta: '+4', trend: 'up', sparkline: [10, 14, 16, 18, 22, 26, 32] },
];

/** @type {import('../../../types/landing.types').RiskCell[]} */
const RISK_CELLS = [
  { topic: 'Water Use', severity: 1 },
  { topic: 'Emissions', severity: 3 },
  { topic: 'Labor', severity: 0 },
  { topic: 'Waste', severity: 2 },
  { topic: 'Governance', severity: 1 },
  { topic: 'Supply Chain', severity: 4 },
  { topic: 'Biodiversity', severity: 1 },
  { topic: 'Ethics', severity: 0 },
];

const ringCircumference = 2 * Math.PI * 42;

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>
            <FontAwesomeIcon icon={faCircleNodes} />
            AI-Powered ESG Intelligence Platform
          </span>

          <h1 className={styles.headline}>
            Enterprise ESG, governed
            <br />
            with the rigor of finance.
          </h1>

          <p className={styles.subtitle}>
            Measure. Manage. Report. Accelerate your sustainability program with
            AI-driven analytics, automated disclosure reporting, KPI tracking, and
            audit-ready compliance controls — built for the enterprise.
          </p>

          <div className={styles.ctaRow}>
            <Link to="/request-demo" className={styles.ctaPrimary}>
              Request Demo
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link to="/sign-up" className={styles.ctaSecondary}>
              <FontAwesomeIcon icon={faPlay} />
              Try ESG Compass
            </Link>
          </div>

          <div className={styles.frameworks} aria-label="Supported reporting frameworks">
            {FRAMEWORK_BADGES.map((code) => (
              <span key={code} className={styles.frameworkBadge}>
                <span className={styles.checkMark}>✓</span>
                {code}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.dashboardWrap}
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={styles.dashboard}
            role="img"
            aria-label="ESG Compass dashboard preview showing ESG score, compliance rate, carbon emissions and risk heatmap"
          >
            <div className={styles.dashboardHeader}>
              <div className={styles.dashboardTitleGroup}>
                <span className={styles.dashboardDot} />
                <span className={styles.dashboardTitle}>Sustainability Cockpit</span>
              </div>
              <span className={styles.dashboardLive}>Live · FY2026 Q2</span>
            </div>

            <div className={styles.ringsRow}>
              {KPI_RINGS.map((ring) => {
                const offset = ringCircumference - (ring.value / 100) * ringCircumference;
                return (
                  <div className={styles.ringCard} key={ring.id}>
                    <svg viewBox="0 0 100 100" className={styles.ringSvg} aria-hidden="true">
                      <circle cx="50" cy="50" r="42" className={styles.ringTrack} />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className={`${styles.ringProgress} ${styles[ring.color]}`}
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={offset}
                      />
                    </svg>
                    <div className={styles.ringLabelGroup}>
                      <span className={styles.ringValue}>{ring.displayValue}</span>
                      <span className={styles.ringLabel}>{ring.label}</span>
                    </div>
                  </div>
                );
              })}

              <div className={styles.kpiStack}>
                {KPI_CARDS.map((card) => (
                  <div className={styles.kpiCard} key={card.id}>
                    <div className={styles.kpiCardTop}>
                      <span className={styles.kpiLabel}>{card.label}</span>
                      <span className={`${styles.kpiDelta} ${styles[card.trend]}`}>{card.delta}</span>
                    </div>
                    <div className={styles.kpiCardBottom}>
                      <span className={styles.kpiValue}>{card.value}</span>
                      <svg viewBox="0 0 60 24" className={styles.sparkline} aria-hidden="true">
                        <polyline
                          points={card.sparkline
                            .map((v, i) => `${(i / (card.sparkline.length - 1)) * 60},${24 - (v / 44) * 24}`)
                            .join(' ')}
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.heatmapSection}>
              <span className={styles.heatmapTitle}>Material Risk Heatmap</span>
              <div className={styles.heatmapGrid}>
                {RISK_CELLS.map((cell) => (
                  <div key={cell.topic} className={`${styles.heatCell} ${styles[`severity${cell.severity}`]}`}>
                    <span>{cell.topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.floatingBadge} aria-hidden="true">
            <span className={styles.floatingBadgeDot} />
            Assurance-ready
          </div>
        </motion.div>
      </div>
    </section>
  );
}
