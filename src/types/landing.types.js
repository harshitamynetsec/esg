// ============================================================
// Shared JSDoc typedefs for the ESG Compass marketing site.
// Plain JavaScript — these exist purely as editor/IDE hints,
// they are not enforced at build time.
// ============================================================

/**
 * @typedef {Object} NavLink
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {'supported' | 'in-progress' | 'roadmap'} FrameworkStatus
 */

/**
 * @typedef {Object} HeroKpiRing
 * @property {string} id
 * @property {string} label
 * @property {number} value - 0-100
 * @property {string} displayValue
 * @property {'forest' | 'blue' | 'amber'} color
 */

/**
 * @typedef {Object} HeroKpiCard
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {string} delta
 * @property {'up' | 'down' | 'flat'} trend
 * @property {number[]} sparkline
 */

/**
 * @typedef {Object} RiskCell
 * @property {string} topic
 * @property {0|1|2|3|4} severity
 */

/**
 * @typedef {Object} PlatformHighlight
 * @property {string} id
 * @property {string} icon
 * @property {string} title
 * @property {string} description
 * @property {'top-left'|'top-right'|'bottom-left'|'bottom-right'|'center-left'|'center-right'} position
 */

/**
 * @typedef {Object} Capability
 * @property {string} id
 * @property {string} icon
 * @property {string} title
 * @property {string} description
 * @property {string} href
 */

/**
 * @typedef {Object} TimelineStep
 * @property {string} id
 * @property {string} index
 * @property {string} title
 * @property {string} summary
 * @property {string} detail
 * @property {string} icon
 */

/**
 * @typedef {Object} FrameworkCard
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} description
 * @property {FrameworkStatus} status
 * @property {string} region
 */

/**
 * @typedef {Object} AIFeatureCard
 * @property {string} id
 * @property {string} icon
 * @property {string} title
 * @property {string} description
 * @property {string} [metric]
 */

/**
 * @typedef {Object} SecurityFeature
 * @property {string} id
 * @property {string} icon
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} BenefitStat
 * @property {string} id
 * @property {number} value
 * @property {string} suffix
 * @property {string} label
 * @property {string} caption
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} quote
 * @property {string} name
 * @property {string} title
 * @property {string} company
 * @property {string} initials
 */

export {};
