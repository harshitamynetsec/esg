import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faLeaf } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';

/** @type {import('../../../types/landing.types').NavLink[]} */
const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/resources' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollThreshold = useRef(24);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold.current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="ESG Compass home">
          <span className={styles.brandMark}>
            <FontAwesomeIcon icon={faLeaf} />
          </span>
          <span className={styles.brandName}>ESG Compass</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/login" className={styles.signIn}>Sign In</Link>
          <Link to="/sign-up" className={styles.ctaSecondary}>Try ESG Compass</Link>
          <Link to="/request-demo" className={styles.ctaPrimary}>Request Demo</Link>
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileActions}>
            <Link to="/login" className={styles.signIn}>Sign In</Link>
            <Link to="/sign-up" className={styles.ctaSecondary}>Try ESG Compass</Link>
            <Link to="/request-demo" className={styles.ctaPrimary}>Request Demo</Link>
          </div>
        </div>
      )}
    </header>
  );
}
