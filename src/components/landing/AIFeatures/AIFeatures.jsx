import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCircleCheck,
  faLightbulb,
  faTriangleExclamation,
  faMagnifyingGlassChart,
  faCommentDots,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';
import styles from './AIFeatures.module.scss';

/** @type {import('../../../types/landing.types').AIFeatureCard[]} */
const AI_FEATURES = [
  { id: 'report-gen', icon: faFileCircleCheck, title: 'AI Report Generation', description: 'Draft full disclosure reports from structured data in minutes, not weeks.', metric: '10x faster drafting' },
  { id: 'recommendations', icon: faLightbulb, title: 'AI Recommendations', description: 'Prioritized actions ranked by emissions impact and implementation cost.', metric: '32 active recommendations' },
  { id: 'risk-prediction', icon: faTriangleExclamation, title: 'Risk Prediction', description: 'Forecast compliance and reputational risk before regulators or investors do.', metric: '94% model accuracy' },
  { id: 'gap-analysis', icon: faMagnifyingGlassChart, title: 'Gap Analysis', description: 'Continuously benchmark your disclosures against framework requirements.', metric: '6 frameworks scanned' },
  { id: 'questionnaire-assistant', icon: faCommentDots, title: 'Questionnaire Assistant', description: 'Auto-complete supplier and stakeholder questionnaires with cited sources.', metric: '80% auto-completion' },
  { id: 'carbon-insights', icon: faLeaf, title: 'Carbon Insights', description: 'Trace emissions to source activities across scope 1, 2, and 3 categories.', metric: '18.4K tCO₂e tracked' },
];

export default function AIFeatures() {
  return (
    <section className={styles.aiFeatures} aria-label="AI capabilities">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Artificial Intelligence</span>
          <h2 className={styles.title}>AI built for regulated disclosure, not demos</h2>
          <p className={styles.description}>
            Every model output is explainable and traceable to source data —
            because compliance teams need evidence, not black boxes.
          </p>
        </div>

        <div className={styles.grid}>
          {AI_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              className={styles.card}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.cardBorderGlow} aria-hidden="true" />
              <span className={styles.cardIcon}>
                <FontAwesomeIcon icon={feature.icon} />
              </span>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              {feature.metric && <span className={styles.cardMetric}>{feature.metric}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
