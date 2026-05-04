// SelectedItemPanel.jsx — Controls for currently selected Fabric object

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FONTS } from '../data/fonts';

const PIPER_COLORS = [
  '#B83030', '#6B1A1A', '#9C7B5A', '#3A3535',
  '#7BA3A0', '#A8BDD6', '#BBA8CC', '#E8DCA0',
  '#8DAA8E', '#D4A098', '#2A2420', '#FAF6F0',
];

export default function SelectedItemPanel({
  selectedObject,
  onRemove,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  canvasRef,
  isMobile = false,
}) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState('#B83030');
  const [fontFamily, setFontFamily] = useState('');

  const isText = selectedObject?.type === 'i-text' || selectedObject?.type === 'text';

  // Sync controls with selected object
  useEffect(() => {
    if (!selectedObject) return;
    setScale(Math.round((selectedObject.scaleX || 1) * 100) / 100);
    setRotation(Math.round(selectedObject.angle || 0));
    setColor(selectedObject.fill || selectedObject.stroke || '#B83030');
    if (isText) setFontFamily(selectedObject.fontFamily || '');
  }, [selectedObject, isText]);

  const applyScale = (val) => {
    if (!selectedObject || !canvasRef?.current) return;
    const s = parseFloat(val);
    selectedObject.set({ scaleX: s, scaleY: s });
    canvasRef.current.renderAll();
    canvasRef.current.fire('object:modified');
    setScale(s);
  };

  const applyRotation = (val) => {
    if (!selectedObject || !canvasRef?.current) return;
    const r = parseFloat(val);
    selectedObject.set({ angle: r });
    canvasRef.current.renderAll();
    canvasRef.current.fire('object:modified');
    setRotation(r);
  };

  const applyColor = (val) => {
    if (!selectedObject || !canvasRef?.current) return;
    setColor(val);
    if (isText) {
      selectedObject.set({ fill: val });
      // If we're in editing mode, also apply to selection
      if (selectedObject.isEditing) {
        selectedObject.setSelectionStyles({ fill: val });
      }
    } else {
      // Traverse group children
      const objs = selectedObject._objects || [selectedObject];
      objs.forEach(o => {
        if (o.fill && o.fill !== 'none') o.set({ fill: val });
        if (o.stroke && o.stroke !== 'none') o.set({ stroke: val });
      });
    }
    canvasRef.current.renderAll();
    canvasRef.current.fire('object:modified');
  };

  const applyFont = (family) => {
    if (!selectedObject || !canvasRef?.current || !isText) return;
    const fontName = family.split(',')[0].replace(/['"]/g, '').trim();
    setFontFamily(family);
    
    // Apply to the whole object
    selectedObject.set({ fontFamily: fontName });
    
    // If we're in editing mode, also apply to the current selection/whole text
    if (selectedObject.isEditing) {
      selectedObject.setSelectionStyles({ fontFamily: fontName });
    }
    
    canvasRef.current.renderAll();
    canvasRef.current.fire('object:modified');
  };

  return (
    <AnimatePresence>
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className={`flex flex-col gap-2.5 rounded-[10px] border border-[var(--color-border-soft)] bg-[var(--color-paper)] ${isMobile ? 'p-2' : 'p-3'}`}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontStyle: 'italic', color: 'var(--color-sepia)', marginBottom: 4 }}>
            {isText ? 'text selected' : 'sticker selected'}
          </p>

          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            {/* Left Column: Transformation & Color */}
            <div className="flex flex-col gap-4">
              {/* Size */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">size</p>
                  <span className="text-[10px] text-[var(--color-ink-muted)] [font-family:var(--font-hand)]">
                    {Math.round(scale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4"
                  step="0.05"
                  value={scale}
                  onChange={e => applyScale(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Rotation */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">rotate</p>
                  <span className="text-[10px] text-[var(--color-ink-muted)] [font-family:var(--font-hand)]">
                    {rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={e => applyRotation(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Color Selection */}
              <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">object color</p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {PIPER_COLORS.map(c => (
                    <button
                      key={c}
                      className={`h-5 w-5 shrink-0 rounded-full border transition-all duration-200 ${
                        color === c
                          ? 'scale-110 border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)] ring-offset-1 ring-offset-[var(--color-oxblood)]'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ background: c, border: c === '#FAF6F0' ? '1px solid var(--color-border-soft)' : undefined }}
                      onClick={() => applyColor(c)}
                      title={c}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={color.startsWith('#') ? color : '#B83030'}
                  onChange={e => applyColor(e.target.value)}
                  className="h-8 w-full cursor-pointer rounded-lg border border-[var(--color-border-soft)] p-0.5"
                />
              </div>
            </div>

            {/* Right Column: Fonts & Layers */}
            <div className="flex flex-col gap-4">
              {/* Font picker (text only) */}
              {isText ? (
                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">font family</p>
                  <div className="flex h-[140px] flex-col gap-0.5 overflow-y-auto rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {FONTS.map(f => {
                      const cleanName = f.family.split(',')[0].replace(/['"]/g, '').trim();
                      const isActive = fontFamily === cleanName || selectedObject.fontFamily === cleanName;
                      return (
                        <button
                          key={f.id}
                          className={`rounded-lg border px-2 py-1 text-left text-[13px] transition-all duration-150 ${
                            isActive
                              ? 'border-[var(--color-sepia)] bg-[var(--color-cream)] shadow-sm'
                              : 'border-transparent bg-transparent hover:border-[var(--color-border-soft)] hover:bg-[var(--color-bone)]'
                          }`}
                          style={{ fontFamily: f.family }}
                          onClick={() => applyFont(f.family)}
                        >
                          {f.displayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border-soft)] p-4 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-ink-muted)] opacity-50 [font-family:var(--font-hand)]">
                    sticker<br/>selected
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-[var(--color-border-soft)]" />

          {/* Bottom Area: Layers & Actions */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            {/* Layer controls */}
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">layering</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: '↑ fwd', action: onBringForward },
                  { label: '↓ bwd', action: onSendBackward },
                  { label: '⇑ front', action: onBringToFront },
                  { label: '⇓ back', action: onSendToBack },
                ].map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-[rgba(250,246,240,0.8)] px-1 py-1.5 text-[9px] font-medium uppercase tracking-wider text-[var(--color-charcoal)] transition-all duration-200 hover:border-[var(--color-sepia)] hover:bg-[var(--color-paper)] [font-family:var(--font-hand)]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-end gap-1.5">
              <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">actions</p>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={onDuplicate}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-[rgba(250,246,240,0.8)] px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-charcoal)] transition-all duration-200 hover:border-[var(--color-sepia)] hover:bg-[var(--color-paper)] [font-family:var(--font-hand)]"
                >
                  duplicate
                </button>
                <button
                  onClick={onRemove}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--color-piper-red)] bg-transparent px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-piper-red)] transition-all duration-200 hover:bg-[var(--color-oxblood)] hover:text-[var(--color-cream)] [font-family:var(--font-hand)]"
                >
                  delete item
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
