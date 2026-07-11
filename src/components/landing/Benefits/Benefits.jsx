import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import styles from './Benefits.module.scss';

/** @type {import('../../../types/landing.types').BenefitStat[]} */
const STATS = [
  { id: 'reports', value: 500, suffix: '+', label: 'Reports Generated', caption: 'Across GRI, BRSR, CSRD, SASB, CDP, and TCFD' },
  { id: 'accuracy', value: 98, suffix: '%', label: 'Compliance Accuracy', caption: 'Validated against framework-specific rule sets' },
  { id: 'speed', value: 70, suffix: '%', label: 'Faster Reporting', caption: 'Reduction in average disclosure cycle time' },
  { id: 'topics', value: 94, suffix: '+', label: 'Material Topics', caption: 'Tracked across industries and jurisdictions' },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref} className={styles.statValue}>
      {display}
      {suffix}
    </span>
  );
}

export default function Benefits() {
  return (
    <section className={styles.benefits} aria-label="Customer benefits">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Customer Outcomes</span>
          <h2 className={styles.title}>Measurable results, not marketing claims</h2>
        </div>

        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              className={styles.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statCaption}>{stat.caption}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
