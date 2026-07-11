import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faClipboardCheck,
  faDiagramProject,
  faBullseye,
  faGaugeHigh,
  faFileCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Timeline.module.scss';

/** @type {import('../../../types/landing.types').TimelineStep[]} */
const STEPS = [
  {
    id: 'setup',
    index: '01',
    title: 'Company Setup',
    summary: 'Map your entities, facilities, and reporting boundaries.',
    detail: 'Import your organizational structure once and reuse it across every framework and reporting period, with role-based ownership assigned per business unit.',
    icon: faBuilding,
  },
  {
    id: 'assessment',
    index: '02',
    title: 'Assessment',
    summary: 'Collect ESG data through guided, validated workflows.',
    detail: 'Automated data requests route to the right stakeholders, with evidence uploads, unit conversion, and anomaly checks built into every field.',
    icon: faClipboardCheck,
  },
  {
    id: 'materiality',
    index: '03',
    title: 'Materiality Analysis',
    summary: 'Rank topics by financial and impact materiality.',
    detail: 'Stakeholder surveys feed a live double-materiality matrix, satisfying CSRD and GRI 3 requirements without spreadsheets.',
    icon: faDiagramProject,
  },
  {
    id: 'objectives',
    index: '04',
    title: 'Objectives',
    summary: 'Set science-based targets tied to material topics.',
    detail: 'Translate material topics into measurable, time-bound objectives with accountable owners and baseline tracking.',
    icon: faBullseye,
  },
  {
    id: 'kpis',
    index: '05',
    title: 'KPIs',
    summary: 'Track performance against targets in real time.',
    detail: 'Dashboards update as new data lands, with variance alerts when a KPI drifts off its target trajectory.',
    icon: faGaugeHigh,
  },
  {
    id: 'reports',
    index: '06',
    title: 'Generate ESG Reports',
    summary: 'Publish audit-ready disclosures in a single click.',
    detail: 'Map once to GRI, BRSR, SASB, CSRD, CDP, and TCFD, then export assurance-ready reports with full data lineage.',
    icon: faFileCircleCheck,
  },
];

export default function Timeline() {
  const [activeId, setActiveId] = useState(STEPS[0].id);

  return (
    <section className={styles.timeline} aria-label="How ESG Compass works">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>How It Works</span>
          <h2 className={styles.title}>From setup to disclosure, in six governed steps</h2>
        </div>

        <div className={styles.track}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              className={`${styles.step} ${activeId === step.id ? styles.active : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setActiveId(step.id)}
              onFocus={() => setActiveId(step.id)}
              tabIndex={0}
              role="button"
              aria-expanded={activeId === step.id}
            >
              <div className={styles.stepMarker}>
                <span className={styles.stepIndex}>{step.index}</span>
                <span className={styles.stepIcon}>
                  <FontAwesomeIcon icon={step.icon} />
                </span>
              </div>

              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepSummary}>{step.summary}</p>
                <motion.p
                  className={styles.stepDetail}
                  initial={false}
                  animate={{
                    height: activeId === step.id ? 'auto' : 0,
                    opacity: activeId === step.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step.detail}
                </motion.p>
              </div>

              {i < STEPS.length - 1 && <span className={styles.connector} aria-hidden="true" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
