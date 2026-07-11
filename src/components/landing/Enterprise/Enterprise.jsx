import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faUserShield,
  faListCheck,
  faLock,
  faBuildingUser,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Enterprise.module.scss';

/** @type {import('../../../types/landing.types').SecurityFeature[]} */
const SECURITY_FEATURES = [
  { id: 'sso', icon: faKey, title: 'Single Sign-On', description: 'SAML and OIDC SSO with your existing identity provider — Okta, Azure AD, and more.' },
  { id: 'rbac', icon: faUserShield, title: 'Role-Based Access', description: 'Granular permissions down to the field level, by entity, region, or reporting cycle.' },
  { id: 'audit-logs', icon: faListCheck, title: 'Audit Logs', description: 'Immutable, timestamped logs of every data change for assurance and internal audit.' },
  { id: 'encryption', icon: faLock, title: 'Encrypted Storage', description: 'AES-256 encryption at rest and TLS 1.3 in transit across every environment.' },
  { id: 'multi-tenant', icon: faBuildingUser, title: 'Multi-Tenant Architecture', description: 'Isolated environments for holding companies managing multiple subsidiaries.' },
  { id: 'isolation', icon: faShieldHalved, title: 'Company Isolation', description: 'Logical and physical data segregation between business units and legal entities.' },
];

export default function Enterprise() {
  return (
    <section className={styles.enterprise} aria-label="Enterprise-grade security">
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>Enterprise-Grade Security</span>
          <h2 className={styles.title}>Built for how large organizations actually operate</h2>
          <p className={styles.description}>
            Security and governance controls that satisfy CISOs, internal audit, and
            enterprise procurement — not an afterthought bolted onto a startup stack.
          </p>

          <div className={styles.list}>
            {SECURITY_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.id}
                className={styles.listItem}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.listIcon}>
                  <FontAwesomeIcon icon={feature.icon} />
                </span>
                <div>
                  <h3 className={styles.listTitle}>{feature.title}</h3>
                  <p className={styles.listDescription}>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.adminPanel}>
            <div className={styles.adminHeader}>
              <span className={styles.adminTitle}>Access Control</span>
              <span className={styles.adminBadge}>Admin</span>
            </div>

            <div className={styles.adminRow}>
              <span className={styles.adminLabel}>Single Sign-On</span>
              <span className={styles.toggleOn} />
            </div>
            <div className={styles.adminRow}>
              <span className={styles.adminLabel}>Enforce MFA</span>
              <span className={styles.toggleOn} />
            </div>
            <div className={styles.adminRow}>
              <span className={styles.adminLabel}>Audit Log Retention</span>
              <span className={styles.adminValue}>7 years</span>
            </div>

            <div className={styles.roleTable}>
              <div className={styles.roleTableHeader}>
                <span>Role</span>
                <span>Entities</span>
                <span>Access</span>
              </div>
              {[
                { role: 'Sustainability Lead', entities: 'All', access: 'Full' },
                { role: 'Compliance Reviewer', entities: '12 units', access: 'Review' },
                { role: 'Facility Contributor', entities: '1 unit', access: 'Submit' },
              ].map((row) => (
                <div className={styles.roleRow} key={row.role}>
                  <span>{row.role}</span>
                  <span>{row.entities}</span>
                  <span className={styles.roleAccessBadge}>{row.access}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
