// TextToolPanel.jsx — Controls for adding and styling text

import { motion } from 'framer-motion';
import { FONTS } from '../data/fonts';

export default function TextToolPanel({ activeColor, activeFont, onAddText, onFontChange, onColorChange, isMobile = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex flex-col gap-4"
    >
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        {/* Left Column: Actions & Color */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">action</p>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAddText(activeFont, activeColor)}
              className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-3 text-center text-[12px] font-medium leading-tight tracking-[0.03em] text-[var(--color-cream)] shadow-[0_6px_24px_rgba(107,26,26,0.35)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(184,48,48,0.45)] [font-family:var(--font-hand)]"
            >
              + ADD LYRICS
            </motion.button>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">text color</p>
            <input
              type="color"
              value={activeColor.startsWith('#') ? activeColor : '#B83030'}
              onChange={e => onColorChange(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-xl border border-[var(--color-border-soft)] p-0.5"
            />
          </div>
        </div>

        {/* Right Column: Fonts */}
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">choose font</p>
          <div className="flex h-[180px] flex-col gap-0.5 overflow-y-auto rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {FONTS.map(f => (
              <button
                key={f.id}
                className={`rounded-lg border px-2.5 py-2 text-left text-[14px] transition-all duration-150 ${
                  activeFont === f.family
                    ? 'border-[var(--color-sepia)] bg-[var(--color-cream)] shadow-sm'
                    : 'border-transparent bg-transparent hover:border-[var(--color-border-soft)] hover:bg-[var(--color-bone)]'
                }`}
                style={{ fontFamily: f.family }}
                onClick={() => onFontChange(f.family)}
                title={f.label}
              >
                {f.displayLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-medium uppercase tracking-widest text-[var(--color-ink-muted)] opacity-50 [font-family:var(--font-hand)]">
        ✦ tap button to add ✦
      </p>
    </motion.div>
  );
}
