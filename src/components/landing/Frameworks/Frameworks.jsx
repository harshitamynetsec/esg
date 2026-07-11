import { motion } from 'framer-motion';
import styles from './Frameworks.module.scss';

/** @type {import('../../../types/landing.types').FrameworkCard[]} */
const FRAMEWORKS = [
  { id: 'brsr', code: 'BRSR', name: 'Business Responsibility & Sustainability Reporting', description: 'Mandatory disclosure framework for top-listed Indian companies under SEBI.', status: 'supported', region: 'India' },
  { id: 'gri', code: 'GRI', name: 'Global Reporting Initiative', description: 'The most widely adopted standard for sustainability impact reporting.', status: 'supported', region: 'Global' },
  { id: 'sasb', code: 'SASB', name: 'Sustainability Accounting Standards Board', description: 'Industry-specific, financially material ESG disclosure standards.', status: 'supported', region: 'Global' },
  { id: 'csrd', code: 'CSRD', name: 'Corporate Sustainability Reporting Directive', description: 'EU-mandated double-materiality disclosure for in-scope companies.', status: 'supported', region: 'European Union' },
  { id: 'tcfd', code: 'TCFD', name: 'Task Force on Climate-related Financial Disclosures', description: 'Climate risk governance, strategy, and scenario disclosure recommendations.', status: 'supported', region: 'Global' },
  { id: 'cdp', code: 'CDP', name: 'Carbon Disclosure Project', description: 'Investor-facing climate, water, and forests disclosure system.', status: 'supported', region: 'Global' },
  { id: 'sdgs', code: 'SDGs', name: 'UN Sustainable Development Goals', description: 'Map ESG initiatives to the 17 UN Sustainable Development Goals.', status: 'supported', region: 'Global' },
];

const STATUS_LABEL = {
  supported: 'Supported',
  'in-progress': 'In Progress',
  roadmap: 'On Roadmap',
};

export default function Frameworks() {
  return (
    <section className={styles.frameworks} aria-label="Supported ESG reporting frameworks">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Supported Frameworks</span>
          <h2 className={styles.title}>Report once, comply everywhere</h2>
          <p className={styles.description}>
            A single data model maps to every major disclosure standard, so your team
            never re-enters the same metric twice.
          </p>
        </div>

        <div className={styles.grid}>
          {FRAMEWORKS.map((fw, i) => (
            <motion.div
              key={fw.id}
              className={styles.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardLogo}>{fw.code}</span>
                <span className={`${styles.statusBadge} ${styles[fw.status]}`}>
                  {STATUS_LABEL[fw.status]}
                </span>
              </div>
              <h3 className={styles.cardName}>{fw.name}</h3>
              <p className={styles.cardDescription}>{fw.description}</p>
              <span className={styles.cardRegion}>{fw.region}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
