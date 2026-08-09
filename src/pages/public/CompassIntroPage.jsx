import { Link } from 'react-router-dom';
import PageHeader from '../../components/platform/PageHeader';
import '../../styles/platform.css';
import Navbar from '../../components/landing/Navbar/Navbar';
import Footer from '../../components/landing/Footer/Footer';
import styles from './LandingPage.module.scss';

export default function CompassIntroPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className="page-panel" style={{ margin: '48px auto', maxWidth: 1200, padding: '0 24px', height: '500px' }}>
        <PageHeader 
          title="Sustainability Compass" 
          description="Assess ESG maturity across environmental, social, and governance practices." 
        />
        <Link className="primary-button" to="/compass/questionnaire">Start assessment</Link>
      </main>
      <Footer />
    </div>
  );
}
