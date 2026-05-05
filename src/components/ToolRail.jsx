// ToolRail.jsx — Left vertical tool rail with professional Lucide icons

import { motion } from 'framer-motion';
import {
  Pointer,
  Pencil,
  Eraser,
  Type,
  Sparkles,
  Palette,
} from 'lucide-react';

const TOOLS = [
  {
    id: 'select',
    label: 'Select',
    icon: Pointer,
  },
  {
    id: 'draw',
    label: 'Draw',
    icon: Pencil,
  },
  {
    id: 'text',
    label: 'Text',
    icon: Type,
  },
  {
    id: 'stickers',
    label: 'Stickers',
    icon: Sparkles,
  },
  {
    id: 'colors',
    label: 'Colors',
    icon: Palette,
  },
];

export default function ToolRail({ activeTool, onToolChange, mobile = false }) {
  const railClass = mobile
    ? 'z-[2] flex w-full shrink-0 flex-row items-center gap-1.5 overflow-x-auto bg-[var(--color-paper)] px-2 py-2'
    : 'z-[2] flex h-full w-[72px] shrink-0 flex-col items-center gap-[2px] bg-[var(--color-paper)] px-1 py-3';

  const toolsWrapClass = mobile
    ? 'flex w-full flex-row items-center gap-1'
    : 'flex w-full flex-col items-center gap-2';

  return (
    <div className={railClass}>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className={toolsWrapClass}
      >
        {TOOLS.map((tool, i) => {
          const IconComponent = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex flex-col items-center justify-center rounded-[12px] border transition-all duration-200 ${
                mobile ? 'h-10 w-10 shrink-0' : 'w-full py-2.5'
              } ${
                isActive
                  ? 'border-[var(--color-oxblood)] bg-gradient-to-br from-[var(--color-piper-red)] to-[var(--color-oxblood)] text-[var(--color-cream)] shadow-md'
                  : 'border-transparent bg-transparent text-[var(--color-charcoal)] hover:border-[var(--color-sepia)] hover:bg-[rgba(232,221,208,0.6)] hover:text-[var(--color-ink)]'
              }`}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
              aria-label={tool.label}
              aria-pressed={isActive}
            >
              <IconComponent size={mobile ? 18 : 20} strokeWidth={1.25} />
              {!mobile && (
                <span className="mt-1 text-[10px] font-medium uppercase tracking-wider opacity-90 [font-family:var(--font-hand)]">
                  {tool.id}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Divider */}
      {!mobile && <div className="my-3 h-px w-[80%] bg-[var(--color-border-soft)]" />}

    </div>
  );
}
