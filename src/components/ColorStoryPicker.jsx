// ColorStoryPicker.jsx — 12 Piper-coded color story swatches

import { motion } from 'framer-motion';

export default function ColorStoryPicker({ stories, activeStory, onSelect }) {
  return (
    <div>
      <p className="mb-2.5 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">color story</p>
      <div className="flex flex-wrap gap-2">
        {stories.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(story.id)}
            title={story.name}
            aria-label={story.name}
            className={`h-8 w-8 shrink-0 rounded-full border-2 transition-all duration-200 ${
              activeStory.id === story.id
                ? 'scale-[1.2] border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)] ring-offset-2 ring-offset-[var(--color-oxblood)]'
                : 'border-transparent'
            }`}
            style={{
              background: story.swatchColor,
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs italic text-[var(--color-ink-muted)] [font-family:var(--font-hand)]">
        {activeStory.name}
      </p>
    </div>
  );
}
