// StickerTray.jsx — Horizontal scrollable sticker library

import { motion } from 'framer-motion';
import { STICKERS } from '../data/stickers';

function StickerPreview({ sticker, color = '#B83030' }) {
  return (
    <img src={sticker.src} alt={sticker.name} className="w-[48px] h-[48px] object-contain drop-shadow-md" />
  );
}

export default function StickerTray({ onAddSticker, activeColor, activeSticker }) {
  return (
    <div className="bg-transparent">
      {/* Tray header */}
      <div className="flex items-center justify-between px-3 pt-1.5 pb-1">
        <p className="text-[11px] italic text-[var(--color-ink-muted)] [font-family:var(--font-display)]">
          pretty little extras
        </p>
        <p className="text-[9px] text-[var(--color-ink-muted)] opacity-60 [font-family:var(--font-hand)]">
          tap to add ›
        </p>
      </div>

      {/* Scrollable sticker row */}
      <div className="flex snap-x gap-2.5 overflow-x-auto px-3 py-2 [scrollbar-width:thin] [scroll-snap-type:x_mandatory]">
        {STICKERS.map((sticker, i) => (
          <motion.button
            key={sticker.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileTap={{ scale: 0.94 }}
            className={`relative flex h-[72px] w-[72px] min-w-[72px] shrink-0 snap-start flex-col items-center justify-center gap-0.5 rounded-[12px] border px-[6px] py-1.5 text-center text-[10px] font-semibold [font-family:var(--font-hand)] transition-all duration-200 ${activeSticker === sticker.id
              ? 'border-[var(--color-oxblood)] bg-gradient-to-br from-[var(--color-piper-red)] to-[var(--color-oxblood)] text-[var(--color-cream)]'
              : 'border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] text-[var(--color-charcoal)] hover:border-[var(--color-sepia)] hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]'
              }`}
            onClick={() => onAddSticker(sticker.id)}
            title={sticker.name}
            aria-label={`Add ${sticker.name} sticker`}
          >
            <StickerPreview
              sticker={sticker}
              color={activeSticker === sticker.id ? '#F5EFE6' : (activeColor || '#B83030')}
            />
            <span>{sticker.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
