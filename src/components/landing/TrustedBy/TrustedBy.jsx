import styles from './TrustedBy.module.scss';

/** @type {import('../../../types/landing.types').TrustedByLogo[]} */
const LOGOS = [
  { id: 'sme', name: 'Northbridge Industrial', sector: 'SMEs' },
  { id: 'mfg', name: 'Veltrix Manufacturing', sector: 'Manufacturing' },
  { id: 'it', name: 'Cordant Systems', sector: 'IT & Software' },
  { id: 'health', name: 'Meridian Health Group', sector: 'Healthcare' },
  { id: 'retail', name: 'Almeric Retail', sector: 'Retail' },
  { id: 'fin', name: 'Solborne Capital', sector: 'Financial Services' },
];

export default function TrustedBy() {
  const track = [...LOGOS, ...LOGOS];

  return (
    <section className={styles.trustedBy} aria-label="Trusted by industry leaders">
      <div className={styles.inner}>
        <span className={styles.label}>Trusted by compliance and sustainability teams across</span>
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {track.map((logo, i) => (
              <div className={styles.logoItem} key={`${logo.id}-${i}`}>
                <span className={styles.logoMark} aria-hidden="true">{logo.name.charAt(0)}</span>
                <span className={styles.logoText}>
                  <span className={styles.logoName}>{logo.name}</span>
                  <span className={styles.logoSector}>{logo.sector}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
