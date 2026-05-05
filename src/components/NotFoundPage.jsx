import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-[var(--color-background)] p-6 overflow-hidden relative">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-white/40 blur-[80px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 relative"
        >
          <span className="text-[120px] md:text-[160px] leading-none font-light italic text-[var(--color-ink)] opacity-10 [font-family:var(--font-display)]">
            404
          </span>
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40px] md:text-[56px] leading-none font-light italic text-[var(--color-ink)] whitespace-nowrap [font-family:var(--font-display)]">
            not found
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[14px] md:text-[16px] text-[var(--color-ink)] font-bold tracking-[0.2em] uppercase mb-12 [font-family:var(--font-typewriter)]"
        >
          this side of the cd is empty.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full border border-[var(--color-oxblood)] bg-transparent px-10 text-[13px] font-bold uppercase tracking-widest text-[var(--color-oxblood)] transition-colors hover:bg-[var(--color-oxblood)] hover:text-[var(--color-cream)] [font-family:var(--font-typewriter)]"
        >
          <span>return to start</span>
        </motion.button>
      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-ink-muted)] opacity-50 font-bold [font-family:var(--font-typewriter)]">
          piper connolly ✦ beautiful life
        </p>
      </div>
    </div>
  );
}
