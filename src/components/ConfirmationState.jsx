// ConfirmationState.jsx — Post-signup unlock + share prompt (modal overlay)

import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmationState({ isOpen, onDownload, onShare, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(42,36,32,0.55)] p-5 backdrop-blur-[6px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-paper)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 32px',
              maxWidth: 420,
              width: '100%',
              boxShadow: 'var(--shadow-deep)',
              border: '1px solid var(--color-border-soft)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* Background doodle accent */}
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              fontSize: 80,
              opacity: 0.04,
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              ✦
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex items-center justify-center rounded-[6px] p-2 text-[var(--color-ink-muted)] transition-all duration-150 hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
                aria-label="close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2 L14 14 M14 2 L2 14" />
                </svg>
              </button>
            )}

            {/* Emoji celebration */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
              style={{ fontSize: 48, marginBottom: 16 }}
            >
              🎵
            </motion.div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--color-ink)',
              marginBottom: 8,
              lineHeight: 1.2,
            }}>
              you're in.
            </h2>

            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 16,
              color: 'var(--color-sepia)',
              marginBottom: 28,
              lineHeight: 1.6,
            }}>
              download unlocked. don't forget to<br />
              <strong style={{ color: 'var(--color-oxblood)' }}>tag @hernameispiperconnolly</strong> ✦
            </p>

            {/* Download */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDownload}
              className="mb-2.5 inline-flex w-full items-center justify-center rounded-[20px] bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-4 py-3.5 text-[17px] font-bold tracking-[0.03em] text-[var(--color-cream)] shadow-[0_6px_24px_rgba(107,26,26,0.35)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(184,48,48,0.45)] [font-family:var(--font-hand)]"
            >
              ↓ download image
            </motion.button>

            {/* Share (mobile) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={onShare}
                className="mb-4 inline-flex w-full items-center justify-center rounded-[20px] border border-[var(--color-oxblood)] bg-transparent px-4 py-3 text-[15px] font-semibold text-[var(--color-oxblood)] transition-all duration-200 hover:bg-[var(--color-oxblood)] hover:text-[var(--color-cream)] [font-family:var(--font-hand)]"
              >
                ↗ share
              </motion.button>
            )}

            {/* Social tag reminder */}
            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 13,
              color: 'var(--color-ink-muted)',
              opacity: 0.7,
              lineHeight: 1.5,
            }}>
              post yours and tag us so piper can see it 🎶
            </p>

            {/* Subtle "beautiful life" watermark */}
            <p style={{
              marginTop: 20,
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              fontStyle: 'italic',
              color: 'var(--color-ink-muted)',
              opacity: 0.4,
              letterSpacing: '0.05em',
            }}>
              beautiful life — june 5
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

