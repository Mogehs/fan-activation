// EmailGateModal.jsx — Premium email/phone capture modal before download

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContact } from '../utils/submitContact';

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
      {type === 'swirl' && (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 12 C12 12 18 10 18 6 C18 3 15 2 13 3 C11 4 10 7 11 9 C12 11 15 13 17 12 C19 11 19 8 17 7" />
        </svg>
      )}
    </div>
  );
}

export default function EmailGateModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail]   = useState('');
  const [phone, setPhone]   = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('please join the bestie club to continue ✦');
      return;
    }

    setLoading(true);
    const result = await submitContact({ email, phone });
    setLoading(false);

    if (result.success) {
      setShowSuccess(true);
      // Let user see the success message for 2 seconds
      setTimeout(() => {
        onSuccess();
        setShowSuccess(false); // Reset for next time
      }, 2200);
    } else {
      setError(result.message || 'something went wrong. please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(42,36,32,0.6)] p-5 backdrop-blur-[8px]" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-paper)',
              borderRadius: '24px',
              padding: 'clamp(32px, 8vw, 44px) clamp(20px, 6vw, 36px)',
              maxWidth: 440,
              width: 'min(100%, calc(100vw - 32px))',
              boxShadow: '0 25px 60px -12px rgba(42,36,32,0.3)',
              border: '1px solid var(--color-border-soft)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Doodles */}
            <ModalDoodle type="star" size={60} style={{ top: -15, left: -15, rotate: '-15deg' }} />
            <ModalDoodle type="heart" size={50} style={{ bottom: -10, right: 20, rotate: '12deg' }} />
            <ModalDoodle type="swirl" size={80} style={{ top: '40%', right: -30, opacity: 0.05 }} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-all duration-200 hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
              aria-label="close"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 3 L13 13 M13 3 L3 13" />
              </svg>
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '13px',
                  color: 'var(--color-sepia)',
                  letterSpacing: '0.3em',
                  textTransform: 'lowercase',
                  marginBottom: 12,
                }}
              >
                piper connolly
              </motion.div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 7vw, 32px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--color-ink)',
                lineHeight: 1.1,
                marginBottom: 10,
              }}>
                get your download
              </h2>
              <p style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 16,
                color: 'var(--color-sepia)',
                lineHeight: 1.4,
              }}>
                + piper updates + a surprise ✦
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 1 }}>
              <div>
                <label
                  htmlFor="gate-email"
                  style={{ display: 'block', fontFamily: 'var(--font-hand)', fontSize: 14, color: 'var(--color-ink-muted)', marginBottom: 8, marginLeft: 4 }}
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
                  className="w-full rounded-[16px] border border-[var(--color-border-soft)] bg-white/50 px-5 py-4 text-[16px] text-[var(--color-ink)] outline-none transition-all duration-250 placeholder:text-[var(--color-ink-muted)] placeholder:opacity-50 focus:border-[var(--color-sepia)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(156,123,90,0.1)]"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="gate-phone"
                  style={{ display: 'block', fontFamily: 'var(--font-hand)', fontSize: 14, color: 'var(--color-ink-muted)', marginBottom: 8, marginLeft: 4 }}
                >
                  phone number
                  <span style={{ opacity: 0.5, marginLeft: 6, fontSize: 12 }}>(optional)</span>
                </label>
                <input
                  id="gate-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (000) 000-0000"
                  className="w-full rounded-[16px] border border-[var(--color-border-soft)] bg-white/50 px-5 py-4 text-[16px] text-[var(--color-ink)] outline-none transition-all duration-250 placeholder:text-[var(--color-ink-muted)] placeholder:opacity-50 focus:border-[var(--color-sepia)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(156,123,90,0.1)]"
                  autoComplete="tel"
                />
              </div>

              {/* Consent */}
              <label style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                cursor: 'pointer',
                padding: '4px 4px',
              }}>
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    id="gate-agree"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[var(--color-border-soft)] bg-white transition-all checked:bg-[var(--color-oxblood)]"
                  />
                  <svg className="pointer-events-none absolute left-1 top-1 hidden h-3 w-3 text-white peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
                  yes — sign me up for the <span style={{ color: 'var(--color-oxblood)', fontWeight: 600 }}>Bestie Club</span>.
                  I agree to receive email/SMS updates and to Laylo's{' '}
                  <a href="https://laylo.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-oxblood)]">Terms</a> and{' '}
                  <a href="https://laylo.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-oxblood)]">Privacy Policy</a>.
                  <span className="block mt-1 opacity-50 text-[11px]">I can unsubscribe anytime. data rates may apply.</span>
                </span>
              </label>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: 14,
                      color: 'var(--color-piper-red)',
                      textAlign: 'center',
                      backgroundColor: 'rgba(184,48,48,0.05)',
                      padding: '8px',
                      borderRadius: '8px',
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
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#111] px-4 py-4 text-[18px] text-[var(--color-cream)] shadow-xl transition-all duration-300 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
                style={{ fontFamily: 'var(--font-hand)', letterSpacing: '0.05em' }}
              >
                <span className="relative z-10">
                  {loading ? 'joining...' : 'join the bestie club ✦'}
                </span>
                <div className="absolute inset-0 translate-y-full bg-gradient-to-tr from-[var(--color-oxblood)] to-[var(--color-piper-red)] transition-transform duration-300 group-hover:translate-y-0" />
              </motion.button>
            </form>

            {/* Success View */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 20,
                    background: 'var(--color-paper)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'var(--color-oxblood)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 24,
                      color: 'white',
                    }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 32,
                    fontStyle: 'italic',
                    color: 'var(--color-ink)',
                    marginBottom: 12,
                  }}>
                    you're in! ✦
                  </h2>
                  <p style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: 18,
                    color: 'var(--color-sepia)',
                    lineHeight: 1.4,
                  }}>
                    welcome to the bestie club.<br/>preparing your download...
                  </p>
                  
                  {/* Small celebratory particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          y: (Math.random() - 0.5) * 200,
                          x: (Math.random() - 0.5) * 200,
                          rotate: Math.random() * 360
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          color: i % 2 === 0 ? 'var(--color-oxblood)' : 'var(--color-sepia)',
                        }}
                      >
                        ✦
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fine print */}
            <p style={{
              marginTop: 24,
              fontFamily: 'var(--font-hand)',
              fontSize: 11,
              color: 'var(--color-ink-muted)',
              textAlign: 'center',
              opacity: 0.4,
              lineHeight: 1.5,
            }}>
              we respect your privacy. download unlocks instantly.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
