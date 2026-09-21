// Guided Tour Steps Configuration for ESG Platform

export const TOUR_STEPS = [
  {
    id: 'welcome',
    target: null, // Modal center step
    title: 'Welcome to NSS ESG Platform! 👋',
    description: 'Welcome to your enterprise sustainability management workspace. Let\'s take a quick 1-minute guided tour to explore key features and help you operate the system effectively.',
    placement: 'center',
  },
  {
    id: 'esg-score',
    target: '#tour-esg-score',
    title: 'Overall ESG Maturity Score 📊',
    description: 'This score (0-100) reflects your company\'s overall sustainability maturity, calculated as a weighted average across Environmental, Social, and Governance pillars from your latest assessment.',
    placement: 'bottom',
  },
  {
    id: 'start-assessment',
    target: '#tour-start-assessment',
    title: 'ESG Assessment Wizard 📝',
    description: 'Click here anytime to start or continue your 71-question ESG assessment. The questions cover BRSR, ZED, and UN SDG frameworks to generate your benchmark.',
    placement: 'right',
  },
  {
    id: 'material-topics',
    target: '#tour-nav-material-topics',
    title: 'Material Topics Selection 🎯',
    description: 'Identify and prioritize the key ESG topics (e.g., Waste Management, Renewable Energy, Decarbonization) that matter most to your business operations.',
    placement: 'right',
  },
  {
    id: 'kpis',
    target: '#tour-nav-kpis',
    title: 'KPI & Metric Tracking 📈',
    description: 'Track quantitative sustainability metrics (Scope 1 & 2 emissions, % renewable energy, LTIFR, waste diverted) against baselines and annual targets.',
    placement: 'right',
  },
  {
    id: 'objectives',
    target: '#tour-nav-objectives',
    title: 'SMART ESG Objectives 🏆',
    description: 'Set and manage SMART organizational goals aligned with UN Sustainable Development Goals (SDGs) and track progress over time.',
    placement: 'right',
  },
  {
    id: 'reports',
    target: '#tour-nav-reports',
    title: 'Audit-Ready Reports & PDF 📄',
    description: 'Generate and download executive-ready ESG PDF disclosure reports, compliance summaries, and stakeholder presentation decks.',
    placement: 'right',
  },
  {
    id: 'restart-tour',
    target: '#tour-restart-btn',
    title: 'Guided Tour Anytime 🧭',
    description: 'Need a refresher? You can restart this guided tour whenever you want by clicking this button in the sidebar footer.',
    placement: 'top',
  },
];
