import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.scss';

/** @type {import('../../../types/landing.types').FooterLinkGroup[]} */
const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Solutions', href: '/solutions' },
      { label: 'Industries', href: '/industries' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Frameworks', href: '/frameworks' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Resources', href: '/resources' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal & Compliance',
    links: [
      { label: 'Privacy Policy (DPDPA)', href: '/legal/privacy-policy' },
      { label: 'Terms and Conditions', href: '/legal/terms-and-conditions' },
      { label: 'Framework Disclaimers', href: '/terms' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandMark}>
                <FontAwesomeIcon icon={faLeaf} />
              </span>
              <span className={styles.brandName}>ESG Compass</span>
            </Link>
            <p className={styles.brandTagline}>
              AI-powered ESG intelligence for enterprise sustainability, compliance,
              and reporting teams.
            </p>
            <div className={styles.social}>
              <a href="https://linkedin.com" aria-label="LinkedIn" className={styles.socialLink}>
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://twitter.com" aria-label="X (Twitter)" className={styles.socialLink}>
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className={styles.socialLink}>
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div className={styles.linkCol} key={group.title}>
              <h3 className={styles.linkColTitle}>{group.title}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className={styles.link}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.newsletterCol}>
            <h3 className={styles.linkColTitle}>Stay informed</h3>
            <p className={styles.newsletterCopy}>
              Regulatory updates and product news, roughly once a month.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                aria-label="Email address"
              />
              <button type="submit" className={styles.newsletterButton} aria-label="Subscribe">
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </form>
            {submitted && <span className={styles.newsletterConfirm}>You're subscribed.</span>}
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>© {new Date().getFullYear()} ESG Compass, Inc. All rights reserved.</span>
          <span className={styles.compliance}>SOC 2 Type II · ISO 27001 · GDPR Ready</span>
        </div>
      </div>
    </footer>
  );
}
