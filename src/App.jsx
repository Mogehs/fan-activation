import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import JewelCase from './components/JewelCase';
import DecoratorLayout from './components/DecoratorLayout';
import PrivacyPage from './components/PrivacyPage';
import Footer from './components/Footer';

const STAGES = {
  HERO:      'hero',
  CASE:      'case',
  DECORATOR: 'decorator',
};

function MainFlow() {
  const [stage, setStage] = useState(STAGES.HERO);
  const [caseOpen, setCaseOpen] = useState(false);
  const location = useLocation();

  // Reset stage when returning to home if needed, but here we just start at HERO
  // The user wants it to appear every time they visit.

  const handleOpenCase = () => {
    setCaseOpen(true);
    setStage(STAGES.CASE);
    setTimeout(() => {
      setStage(STAGES.DECORATOR);
    }, 2400); // Matches the new GSAP opening + fade-out sequence duration
  };

  const handleHeroCTA = () => {
    setStage(STAGES.CASE);
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === STAGES.HERO && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%' }}
            >
              <HeroSection onOpenCase={handleHeroCTA} />
            </motion.div>
          )}

          {stage === STAGES.CASE && (
            <motion.div
              key="case"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%' }}
            >
              <JewelCase onOpen={handleOpenCase} isOpen={caseOpen} />
            </motion.div>
          )}

          {stage === STAGES.DECORATOR && (
            <motion.div
              key="decorator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%' }}
            >
              <DecoratorLayout />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* Hide footer on mobile in decorator stage to save space */}
      {!(window.innerWidth < 768 && stage === STAGES.DECORATOR) && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100dvh', background: 'var(--color-background)' }}>
        <Routes>
          <Route path="/" element={<MainFlow />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </div>
    </Router>
  );
}
