// EmailGateModal.jsx — Email/phone capture modal before download

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContact } from '../utils/submitContact';

export default function EmailGateModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail]   = useState('');
  const [phone, setPhone]   = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('please check the box to join the bestie club ✦');
      return;
    }

    setLoading(true);
    const result = await submitContact({ email, phone });
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(42,36,32,0.55)] p-5 backdrop-blur-[6px]" onClick={onClose}>
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
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex items-center justify-center rounded-[6px] p-2 text-[var(--color-ink-muted)] transition-all duration-150 hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
              aria-label="close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2 L14 14 M14 2 L2 14" />
              </svg>
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                style={{ fontSize: 32, marginBottom: 12 }}
              >
                🎶
              </motion.div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--color-ink)',
                lineHeight: 1.2,
                marginBottom: 8,
              }}>
                get your download
              </h2>
              <p style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 15,
                color: 'var(--color-sepia)',
                lineHeight: 1.5,
              }}>
                + piper updates + a surprise ✦
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label
                  htmlFor="gate-email"
                  style={{ display: 'block', fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink-muted)', marginBottom: 6 }}
                >
                  email address *
                </label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-[12px] border border-[var(--color-border-soft)] bg-[var(--color-paper)] px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-all duration-200 placeholder:text-[var(--color-ink-muted)] placeholder:opacity-70 focus:border-[var(--color-sepia)] focus:shadow-[0_0_0_4px_rgba(156,123,90,0.12)]"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="gate-phone"
                  style={{ display: 'block', fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink-muted)', marginBottom: 6 }}
                >
                  phone number
                  <span style={{ opacity: 0.6, marginLeft: 4 }}>(optional)</span>
                </label>
                <input
                  id="gate-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (000) 000-0000"
                  className="w-full rounded-[12px] border border-[var(--color-border-soft)] bg-[var(--color-paper)] px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-all duration-200 placeholder:text-[var(--color-ink-muted)] placeholder:opacity-70 focus:border-[var(--color-sepia)] focus:shadow-[0_0_0_4px_rgba(156,123,90,0.12)]"
                  autoComplete="tel"
                />
              </div>

              {/* Consent */}
              <label style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                cursor: 'pointer',
                padding: '8px 0',
              }}>
                <input
                  type="checkbox"
                  id="gate-agree"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 2, accentColor: 'var(--color-oxblood)', cursor: 'pointer', flexShrink: 0, width: 16, height: 16 }}
                />
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: 12, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
                  yes — sign me up for Piper's updates & the Bestie Club.
                  I agree to receive email updates. If I've provided my phone
                  number, I consent to receive SMS messages (message & data rates
                  may apply). I can unsubscribe anytime.
                </span>
              </label>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: 13,
                      color: 'var(--color-piper-red)',
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className="inline-flex w-full items-center justify-center rounded-[20px] bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-4 py-3.5 text-[17px] font-bold tracking-[0.03em] text-[var(--color-cream)] shadow-[0_6px_24px_rgba(107,26,26,0.35)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(184,48,48,0.45)] [font-family:var(--font-hand)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'joining the bestie club...' : 'join the bestie club ✦'}
              </motion.button>
            </form>

            {/* Fine print */}
            <p style={{
              marginTop: 14,
              fontFamily: 'var(--font-hand)',
              fontSize: 10,
              color: 'var(--color-ink-muted)',
              textAlign: 'center',
              opacity: 0.5,
              lineHeight: 1.5,
            }}>
              we respect your privacy. your download unlocks immediately after joining.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
