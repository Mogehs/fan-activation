import { useState } from 'react';
import { motion } from 'framer-motion';
import { FONTS } from '../data/fonts';

const PIPER_COLORS = [
  '#B83030', '#6B1A1A', '#9C7B5A', '#3A3535',
  '#7BA3A0', '#A8BDD6', '#BBA8CC', '#E8DCA0',
  '#8DAA8E', '#D4A098', '#2A2420', '#FAF6F0',
];

export default function TextToolPanel({ activeColor, activeFont, onAddText, onFontChange, onColorChange, isMobile = false, onClose }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim() && isMobile) return;
    onAddText(activeFont, activeColor, text.trim() || 'type here...');
    if (isMobile) {
      setText('');
      onClose?.();
    }
  };

  const ControlLabel = ({ children }) => (
    <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">
      {children}
    </p>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className={`flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}
    >
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        <div className="flex flex-col gap-4">
          {isMobile && (
            <div className="flex flex-col gap-1.5">
              <ControlLabel>write lyrics</ControlLabel>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="type your lyrics..."
                className="h-16 w-full rounded-xl border border-[var(--color-border-soft)] bg-white/50 px-3 py-2 text-[16px] outline-none focus:border-[var(--color-sepia)] [font-family:var(--font-typewriter)]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <ControlLabel>action</ControlLabel>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className="inline-flex h-11 w-full items-center justify-center rounded-[12px] bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-3 text-center text-[12px] font-bold uppercase tracking-widest text-[var(--color-cream)] shadow-md transition-all duration-200 [font-family:var(--font-typewriter)]"
            >
              {isMobile ? '✦ ADD TO CD' : '+ ADD LYRICS'}
            </motion.button>
          </div>

          <div>
            <ControlLabel>text color</ControlLabel>
            {isMobile ? (
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {PIPER_COLORS.map(c => (
                  <button
                    key={c}
                    className={`h-7 w-7 shrink-0 rounded-full border transition-all ${activeColor === c ? 'scale-110 border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)]' : 'border-transparent'}`}
                    style={{ background: c }}
                    onClick={() => onColorChange(c)}
                  />
                ))}
              </div>
            ) : (
              <input
                type="color"
                value={activeColor.startsWith('#') ? activeColor : '#B83030'}
                onChange={e => onColorChange(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-xl border border-[var(--color-border-soft)] p-0.5"
              />
            )}
          </div>
        </div>

        <div>
          <ControlLabel>choose font</ControlLabel>
          <div className={`flex flex-col gap-0.5 overflow-y-auto rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isMobile ? 'h-[100px]' : 'h-[180px]'}`}>
            {FONTS.map(f => (
              <button
                key={f.id}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-[14px] transition-all duration-150 ${
                  activeFont === f.family
                    ? 'border-[var(--color-sepia)] bg-[var(--color-cream)] shadow-sm'
                    : 'border-transparent bg-transparent hover:border-[var(--color-border-soft)] hover:bg-[var(--color-bone)]'
                }`}
                style={{ fontFamily: f.family }}
                onClick={() => onFontChange(f.family)}
              >
                {f.displayLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-muted)] opacity-50 [font-family:var(--font-typewriter)]">
        ✦ tap button to add ✦
      </p>
    </motion.div>
  );
}
