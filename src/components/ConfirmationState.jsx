// ConfirmationState.jsx — Post-signup unlock + share prompt (modal overlay)

import { motion, AnimatePresence } from 'framer-motion';

function ModalDoodle({ type, size = 40, color = 'var(--color-sepia)', style }) {
  const s = size;
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.1, ...style }}>
      {type === 'star' && (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 2 L13 9 L20 8 L14 12 L18 19 L12 15 L6 19 L10 12 L4 8 L11 9 Z" />
        </svg>
      )}
      {type === 'heart' && (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 21 C12 21 3 14 3 8 C3 5 5.5 3 8 3 C10 3 11.5 4 12 5.5 C12.5 4 14 3 16 3 C18.5 3 21 5 21 8 C21 14 12 21 12 21 Z" />
        </svg>
      )}
    </div>
  );
}

export default function ConfirmationState({ isOpen, onDownload, onDownloadSvg, onShare, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(42,36,32,0.6)] p-5 backdrop-blur-[8px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-paper)',
              borderRadius: '24px',
              padding: 'clamp(24px, 8vw, 44px) clamp(20px, 6vw, 36px)',
              maxWidth: 440,
              width: 'min(100%, calc(100vw - 32px))',
              boxShadow: '0 25px 60px -12px rgba(42,36,32,0.3)',
              border: '1px solid var(--color-border-soft)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* Decorative Doodles */}
            <ModalDoodle type="star" size={60} style={{ top: -10, right: -10, rotate: '15deg' }} />
            <ModalDoodle type="heart" size={50} style={{ bottom: 20, left: -15, rotate: '-12deg' }} />

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-all duration-200 hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
                aria-label="close"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 3 L13 13 M13 3 L3 13" />
                </svg>
              </button>
            )}

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              style={{ fontSize: 56, marginBottom: 20 }}
            >
              💿
            </motion.div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--color-ink)',
              marginBottom: 12,
              lineHeight: 1.1,
            }}>
              you're in.
            </h2>

            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 18,
              color: 'var(--color-sepia)',
              marginBottom: 32,
              lineHeight: 1.5,
            }}>
              download unlocked. don't forget to<br />
              <span style={{ color: 'var(--color-oxblood)', fontWeight: 600 }}>tag @hernameispiperconnolly</span> ✦
            </p>

            <div className="flex flex-col gap-3">
              {/* PNG Download Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDownload}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#111] px-4 py-4 text-[16px] text-[var(--color-cream)] shadow-xl transition-all duration-300 hover:shadow-2xl"
                style={{ fontFamily: 'var(--font-hand)', letterSpacing: '0.05em' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  download image (PNG)
                </span>
                <div className="absolute inset-0 translate-y-full bg-gradient-to-tr from-[var(--color-piper-red)] to-[var(--color-oxblood)] transition-transform duration-300 group-hover:translate-y-0" />
              </motion.button>

              {/* SVG Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDownloadSvg}
                className="inline-flex w-full items-center justify-center rounded-[20px] border border-[var(--color-oxblood)] bg-white/50 px-4 py-3 text-[14px] font-medium text-[var(--color-oxblood)] transition-all duration-200 hover:bg-[rgba(107,26,26,0.05)] [font-family:var(--font-hand)]"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="m16 12-4 4-4-4"/><path d="M12 8v8"/>
                  </svg>
                  get vector artwork (SVG)
                </span>
              </motion.button>
            </div>

            {/* Share Button (mobile only if supported) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShare}
                className="mb-4 inline-flex w-full items-center justify-center rounded-[20px] border border-[var(--color-border-soft)] bg-white/50 px-4 py-3 text-[16px] font-medium text-[var(--color-ink)] transition-all duration-200 hover:bg-white [font-family:var(--font-hand)]"
              >
                ↗ share with friends
              </motion.button>
            )}

            {/* Social Link */}
            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 14,
              color: 'var(--color-ink-muted)',
              opacity: 0.6,
              lineHeight: 1.5,
              marginTop: 10
            }}>
              can't wait to see what you made 🎶
            </p>

            {/* Branding Watermark */}
            <div style={{
              marginTop: 28,
              paddingTop: 16,
              borderTop: '1px solid var(--color-border-soft)',
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontStyle: 'italic',
              color: 'var(--color-ink-muted)',
              opacity: 0.3,
              letterSpacing: '0.05em',
            }}>
              beautiful life — june 5
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

