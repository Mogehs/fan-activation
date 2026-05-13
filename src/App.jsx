import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import JewelCase from './components/JewelCase';
import DecoratorLayout from './components/DecoratorLayout';
import PrivacyPage from './components/PrivacyPage';
import NotFoundPage from './components/NotFoundPage';
import Footer from './components/Footer';

const STAGES = {
  HERO: 'hero',
  CASE: 'case',
  DECORATOR: 'decorator',
};

function MainFlow() {
  const [stage, setStage] = useState(STAGES.HERO);
  const [caseOpen, setCaseOpen] = useState(false);
  const location = useLocation();

  const handleOpenCase = () => {
    setCaseOpen(true);
    setStage(STAGES.CASE);
    setTimeout(() => {
      setStage(STAGES.DECORATOR);
    }, 2400);
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

function BackgroundAudio() {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      if (!muted) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [muted]);

  return (
    <div className="fixed bottom-2 right-5 md:bottom-6 md:right-6 z-[200] flex items-center gap-3">
      <audio
        ref={audioRef}
        src="/audio-file.mp4"
        loop
        preload="auto"
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMuted(!muted)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-white/90 text-[var(--color-ink)] shadow-xl backdrop-blur-md transition-all hover:bg-white"
        title={muted ? "Unmute Music" : "Mute Music"}
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100dvh', background: 'var(--color-background)' }}>
        <BackgroundAudio />
        <Routes>
          <Route path="/" element={<MainFlow />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}
