import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardCheck,
  faDiagramProject,
  faBullseye,
  faFileShield,
  faChartLine,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Capabilities.module.scss';

/** @type {import('../../../types/landing.types').Capability[]} */
const CAPABILITIES = [
  {
    id: 'assessments',
    icon: faClipboardCheck,
    title: 'ESG Assessments',
    description: 'Structured data collection across entities, facilities, and business units with built-in validation and evidence trails.',
    href: '/solutions/assessments',
  },
  {
    id: 'material-topics',
    icon: faDiagramProject,
    title: 'Material Topics',
    description: 'Run stakeholder-weighted materiality analysis aligned to double-materiality requirements under CSRD.',
    href: '/solutions/materiality',
  },
  {
    id: 'goals-kpis',
    icon: faBullseye,
    title: 'Goals & KPIs',
    description: 'Set science-based targets and track progress in real time with automated variance alerts.',
    href: '/solutions/kpis',
  },
  {
    id: 'compliance-reporting',
    icon: faFileShield,
    title: 'Compliance Reporting',
    description: 'Generate audit-ready disclosures for BRSR, GRI, SASB, CSRD, CDP, and TCFD from a single data model.',
    href: '/solutions/reporting',
  },
  {
    id: 'analytics-dashboard',
    icon: faChartLine,
    title: 'Analytics Dashboard',
    description: 'Executive-grade dashboards that translate raw ESG data into board-ready insight.',
    href: '/solutions/analytics',
  },
  {
    id: 'ai-recommendations',
    icon: faWandMagicSparkles,
    title: 'AI Recommendations',
    description: 'Surface emission reduction opportunities and compliance gaps before they become findings.',
    href: '/solutions/ai',
  },
];

export default function Capabilities() {
  return (
    <section className={styles.capabilities} aria-label="Platform capabilities">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Capabilities</span>
          <h2 className={styles.title}>Every ESG workflow, one connected platform</h2>
        </div>

        <div className={styles.grid}>
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.cardIcon}>
                <FontAwesomeIcon icon={cap.icon} />
              </span>
              <h3 className={styles.cardTitle}>{cap.title}</h3>
              <p className={styles.cardDescription}>{cap.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
