import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Testimonials.module.scss';

/** @type {import('../../../types/landing.types').Testimonial[]} */
const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'ESG Compass cut our CSRD preparation time from four months to under five weeks, and our auditors trust the data lineage.',
    name: 'Priya Ramachandran',
    title: 'VP, Sustainability',
    company: 'Veltrix Manufacturing',
    initials: 'PR',
  },
  {
    id: 't2',
    quote: 'The materiality workflow finally gave our board a defensible, evidence-based view of what actually matters to stakeholders.',
    name: 'Daniel Okafor',
    title: 'Chief Compliance Officer',
    company: 'Solborne Capital',
    initials: 'DO',
  },
  {
    id: 't3',
    quote: 'We manage twelve subsidiaries on one platform now, with clean isolation between entities and a single consolidated report.',
    name: 'Marta Lindqvist',
    title: 'Group ESG Director',
    company: 'Meridian Health Group',
    initials: 'ML',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (dir) => {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];

  return (
    <section className={styles.testimonials} aria-label="Customer testimonials">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>What Our Customers Say</span>

        <div className={styles.slider}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(-1)}
            aria-label="Previous testimonial"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className={styles.cardWrap}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className={styles.card}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <FontAwesomeIcon icon={faQuoteLeft} className={styles.quoteIcon} />
                <p className={styles.quote}>{current.quote}</p>
                <div className={styles.person}>
                  <span className={styles.avatar}>{current.initials}</span>
                  <div>
                    <span className={styles.name}>{current.name}</span>
                    <span className={styles.role}>{current.title}, {current.company}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(1)}
            aria-label="Next testimonial"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className={styles.dots}>
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
