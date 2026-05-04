// DoodleToolPanel.jsx — Brush controls for the draw tool

import { motion } from 'framer-motion';

const BRUSH_COLORS = [
  '#B83030', '#6B1A1A', '#9C7B5A', '#3A3535',
  '#7BA3A0', '#BBA8CC', '#8DAA8E', '#D4A098',
  '#2A2420', '#FAF6F0', '#C4B49A', '#A8BDD6',
];

export default function DoodleToolPanel({
  brushColor,
  brushSize,
  onColorChange,
  onSizeChange,
  onUndoStroke,
  onClearDoodles,
  isMobile = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex flex-col gap-4"
    >
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        {/* Left Column: Brush Color */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">brush color</p>
            <div className="mb-2 flex flex-wrap gap-1">
              {BRUSH_COLORS.map(c => (
                <button
                  key={c}
                  className={`h-4.5 w-4.5 shrink-0 rounded-full border transition-all duration-200 ${
                    brushColor === c
                      ? 'scale-110 border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)] ring-offset-1 ring-offset-[var(--color-oxblood)]'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{
                    background: c,
                    border: c === '#FAF6F0' ? '1px solid var(--color-border-soft)' : undefined,
                  }}
                  onClick={() => onColorChange(c)}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              value={brushColor}
              onChange={e => onColorChange(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-xl border border-[var(--color-border-soft)] p-0.5"
            />
          </div>
        </div>

        {/* Right Column: Brush Size */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">brush size</p>
              <span className="text-[10px] text-[var(--color-ink-muted)] [font-family:var(--font-hand)]">
                {brushSize}px
              </span>
            </div>
            <div className="flex h-[110px] flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-3">
              {/* Preview dot */}
              <div className="flex items-center justify-center" style={{ height: 40 }}>
                <div style={{
                  width: Math.min(brushSize * 1.2, 40),
                  height: Math.min(brushSize * 1.2, 40),
                  minWidth: 4,
                  minHeight: 4,
                  borderRadius: '50%',
                  background: brushColor,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} />
              </div>
              <input
                type="range"
                min="1"
                max="32"
                step="1"
                value={brushSize}
                onChange={e => onSizeChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-soft)]" />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onUndoStroke}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-[rgba(250,246,240,0.8)] px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-charcoal)] transition-all duration-200 hover:border-[var(--color-sepia)] hover:bg-[var(--color-paper)] [font-family:var(--font-hand)]"
        >
          ↩ undo stroke
        </button>
        <button
          onClick={onClearDoodles}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-sepia)] bg-transparent px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-sepia)] transition-all duration-200 hover:bg-[var(--color-oxblood)] hover:text-[var(--color-cream)] [font-family:var(--font-hand)]"
        >
          clear all
        </button>
      </div>

      <p className="text-center text-[10px] font-medium uppercase tracking-widest text-[var(--color-ink-muted)] opacity-50 [font-family:var(--font-hand)]">
        ✦ draw freely ✦
      </p>
    </motion.div>
  );
}
