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
  const [textContent, setTextContent] = useState('');

  const isText = selectedObject?.type === 'i-text' || selectedObject?.type === 'text';

  const getTypeLabel = () => {
    if (isText) return 'text';
    if (selectedObject?.type === 'path') return 'drawing';
    return 'sticker';
  };

  // Sync controls with selected object
  useEffect(() => {
    if (!selectedObject) return;
    setScale(Math.round((selectedObject.scaleX || 1) * 100) / 100);
    setRotation(Math.round(selectedObject.angle || 0));
    setColor(selectedObject.fill || selectedObject.stroke || '#B83030');
    if (isText) {
      setFontFamily(selectedObject.fontFamily || '');
      setTextContent(selectedObject.text || '');
    }
  }, [selectedObject, isText]);

  const applyText = (val) => {
    if (!selectedObject || !canvasRef?.current || !isText) return;
    selectedObject.set({ text: val });
    canvasRef.current.renderAll();
    canvasRef.current.fire('object:modified');
    setTextContent(val);
  };

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
      if (selectedObject.isEditing) {
        selectedObject.setSelectionStyles({ fill: val });
      }
    } else {
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
    selectedObject.set({ fontFamily: fontName });
    if (selectedObject.isEditing) {
      selectedObject.setSelectionStyles({ fontFamily: fontName });
    }
    canvasRef.current.renderAll();
    canvasRef.current.fire('object:modified');
  };

  const ControlLabel = ({ children }) => (
    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">
      {children}
    </p>
  );

  if (!selectedObject) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 p-3">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontStyle: 'italic', color: 'var(--color-sepia)' }}>
            editing {getTypeLabel()}
          </p>
          <button onClick={onRemove} className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-piper-red)] [font-family:var(--font-typewriter)]">
            remove
          </button>
        </div>

        {/* 2-Row Horizontal Scroll Container */}
        <div className="grid grid-flow-col grid-rows-2 gap-x-4 gap-y-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Card 1: Transformation (Size & Rotate) */}
          <div className="row-span-2 flex w-[210px] flex-col justify-between rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-3 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <ControlLabel>size</ControlLabel>
                <span className="text-[10px] font-bold text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">{Math.round(scale * 100)}%</span>
              </div>
              <input type="range" min="0.2" max="3" step="0.05" value={scale} onChange={e => applyScale(e.target.value)} className="w-full touch-none" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <ControlLabel>rotate</ControlLabel>
                <span className="text-[10px] font-bold text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">{rotation}°</span>
              </div>
              <input type="range" min="-180" max="180" step="1" value={rotation} onChange={e => applyRotation(e.target.value)} className="w-full touch-none" />
            </div>
          </div>

          {/* Card 2: Color (Text only) or Actions (Sticker) */}
          {isText ? (
            <div className="row-span-2 flex w-[240px] flex-col gap-2 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-3 shadow-sm">
              <ControlLabel>text color</ControlLabel>
              <div className="flex flex-wrap gap-2 overflow-y-auto pr-1" style={{ maxHeight: '80px' }}>
                {PIPER_COLORS.map(c => (
                  <button
                    key={c}
                    className={`h-7 w-7 shrink-0 rounded-full border transition-all ${color === c ? 'scale-110 border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)]' : 'border-transparent'}`}
                    style={{ background: c }}
                    onClick={() => applyColor(c)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="row-span-2 flex w-[160px] flex-col gap-2 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-3 shadow-sm">
              <ControlLabel>actions</ControlLabel>
              <button onClick={onDuplicate} className="flex h-11 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] [font-family:var(--font-typewriter)]">duplicate</button>
              <button onClick={onRemove} className="flex h-11 items-center justify-center rounded-lg border border-[var(--color-piper-red)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-piper-red)] [font-family:var(--font-typewriter)]">delete</button>
            </div>
          )}

          {/* Card 3: Layering */}
          <div className="row-span-2 flex w-[190px] flex-col gap-2 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-3 shadow-sm">
            <ControlLabel>layering</ControlLabel>
            <div className="grid grid-cols-2 gap-1.5 h-full">
              {[
                { label: 'fwd', action: onBringForward },
                { label: 'bwd', action: onSendBackward },
                { label: 'front', action: onBringToFront },
                { label: 'back', action: onSendToBack },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} className="flex items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)] [font-family:var(--font-typewriter)]">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Font (Text only) */}
          {isText && (
            <div className="row-span-2 flex w-[240px] flex-col gap-2 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-3 shadow-sm">
              <ControlLabel>font</ControlLabel>
              <div className="flex flex-col gap-1 overflow-y-auto pr-1" style={{ maxHeight: '100px' }}>
                {FONTS.map(f => {
                  const cleanName = f.family.split(',')[0].replace(/['"]/g, '').trim();
                  const isActive = fontFamily === cleanName || selectedObject.fontFamily === cleanName;
                  return (
                    <button
                      key={f.id}
                      className={`rounded-lg border px-2.5 py-2 text-left text-[13px] transition-all ${isActive ? 'border-[var(--color-sepia)] bg-[var(--color-cream)]' : 'border-transparent bg-white/50'}`}
                      style={{ fontFamily: f.family }}
                      onClick={() => applyFont(f.family)}
                    >
                      {f.displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop / Default Layout
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-paper)] p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', color: 'var(--color-sepia)' }}>
            editing {getTypeLabel()}
          </p>
          <button onClick={onRemove} className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-piper-red)] [font-family:var(--font-typewriter)] hover:underline">
            remove
          </button>
        </div>

        <div className={`grid ${!isText ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
          <div className="flex flex-col gap-6">
            {/* Size */}
            <div>
              <div className="flex items-center justify-between">
                <ControlLabel>size</ControlLabel>
                <span className="text-[11px] font-bold text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">{Math.round(scale * 100)}%</span>
              </div>
              <input type="range" min="0.2" max="4" step="0.05" value={scale} onChange={e => applyScale(e.target.value)} className="w-full touch-none" />
            </div>

            {/* Rotation */}
            <div>
              <div className="flex items-center justify-between">
                <ControlLabel>rotate</ControlLabel>
                <span className="text-[11px] font-bold text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">{rotation}°</span>
              </div>
              <input type="range" min="-180" max="180" step="1" value={rotation} onChange={e => applyRotation(e.target.value)} className="w-full touch-none" />
            </div>

            {/* Color */}
            {isText && (
              <div>
                <ControlLabel>text color</ControlLabel>
                <div className="mb-3 flex flex-wrap gap-2">
                  {PIPER_COLORS.map(c => (
                    <button
                      key={c}
                      className={`h-7 w-7 rounded-full border transition-all ${color === c ? 'scale-110 border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)]' : 'border-transparent'}`}
                      style={{ background: c }}
                      onClick={() => applyColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {isText && (
            <div className="flex flex-col gap-4">
              <ControlLabel>font family</ControlLabel>
              <div className="flex h-[200px] flex-col gap-1 overflow-y-auto rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper-soft)] p-2">
                {FONTS.map(f => {
                  const cleanName = f.family.split(',')[0].replace(/['"]/g, '').trim();
                  const isActive = fontFamily === cleanName || selectedObject.fontFamily === cleanName;
                  return (
                    <button
                      key={f.id}
                      className={`rounded-lg border px-3 py-2 text-left text-[14px] transition-all ${isActive ? 'border-[var(--color-sepia)] bg-[var(--color-cream)]' : 'border-transparent hover:bg-[var(--color-bone)]'}`}
                      style={{ fontFamily: f.family }}
                      onClick={() => applyFont(f.family)}
                    >
                      {f.displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-[var(--color-border-soft)]" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <ControlLabel>layering</ControlLabel>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'fwd', action: onBringForward },
                { label: 'bwd', action: onSendBackward },
                { label: 'front', action: onBringToFront },
                { label: 'back', action: onSendToBack },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} className="h-11 rounded-lg border border-[var(--color-border-soft)] bg-white text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:bg-[var(--color-paper-soft)] [font-family:var(--font-typewriter)]">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-2">
            <ControlLabel>actions</ControlLabel>
            <button onClick={onDuplicate} className="h-11 rounded-lg border border-[var(--color-border-soft)] bg-white text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] [font-family:var(--font-typewriter)]">duplicate item</button>
            <button onClick={onRemove} className="h-11 rounded-lg border border-[var(--color-piper-red)] text-[11px] font-bold uppercase tracking-widest text-[var(--color-piper-red)] [font-family:var(--font-typewriter)]">delete item</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
