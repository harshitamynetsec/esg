import Navbar from '../../components/landing/Navbar/Navbar';
import Hero from '../../components/landing/Hero/Hero';
import TrustedBy from '../../components/landing/TrustedBy/TrustedBy';
import PlatformPreview from '../../components/landing/PlatformPreview/PlatformPreview';
import Capabilities from '../../components/landing/Capabilities/Capabilities';
import Timeline from '../../components/landing/Timeline/Timeline';
import Frameworks from '../../components/landing/Frameworks/Frameworks';
import AIFeatures from '../../components/landing/AIFeatures/AIFeatures';
import Enterprise from '../../components/landing/Enterprise/Enterprise';
import Benefits from '../../components/landing/Benefits/Benefits';
import Testimonials from '../../components/landing/Testimonials/Testimonials';
import CTA from '../../components/landing/CTA/CTA';
import Footer from '../../components/landing/Footer/Footer';
import styles from './LandingPage.module.scss';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <PlatformPreview />
        <Capabilities />
        <Timeline />
        <Frameworks />
        <AIFeatures />
        <Enterprise />
        <Benefits />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
