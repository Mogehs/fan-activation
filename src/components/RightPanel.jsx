// RightPanel.jsx — "pretty little extras" right sidebar

import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, Sparkles, MousePointer2 } from 'lucide-react';
import ColorStoryPicker from './ColorStoryPicker';
import SelectedItemPanel from './SelectedItemPanel';
import TextToolPanel from './TextToolPanel';
import DoodleToolPanel from './DoodleToolPanel';

export default function RightPanel({
  activeTool,
  activeStory,
  allStories,
  onStorySelect,
  selectedObject,
  canvasApi,
  canvasRef,
  brushColor,
  brushSize,
  onBrushColorChange,
  onBrushSizeChange,
  activeFont,
  activeColor,
  onFontChange,
  onColorChange,
  cdColor,
  onCdColorChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearAll,
  onSave,
  onClose,
  isMobile = false,
}) {
  const TITLE_MAP = {
    select: 'cd decorator',
    draw: 'draw & paint',
    text: 'lyrics & text',
    stickers: 'stickers',
    colors: 'cd styling',
    erase: 'eraser tool'
  };
  return (
    <div
      className="flex h-full w-full shrink-0 flex-col gap-0 overflow-y-auto bg-[var(--color-paper)]"
    >
      {/* Panel header */}
      {!isMobile && (
        <div className="shrink-0 border-b border-[var(--color-border-soft)] bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-paper-soft)] px-4 pb-4 pt-5">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-oxblood)]" />
            <h3 className="text-[22px] font-normal italic leading-none text-[var(--color-ink)] [font-family:var(--font-display)]">
              {TITLE_MAP[activeTool]}
            </h3>
          </div>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)] opacity-80 [font-family:var(--font-typewriter)]">
            PIPER CONNOLLY ✦ BEAUTIFUL LIFE
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-5 p-4">
        {/* Color story — hidden on mobile to simplify, and hidden when a sticker is selected */}
        {!isMobile && !(selectedObject && selectedObject.type !== 'i-text' && selectedObject.type !== 'text') && (
          <>
            <ColorStoryPicker
              stories={allStories}
              activeStory={activeStory}
              onSelect={onStorySelect}
            />
            <div className="h-px w-full bg-[var(--color-border-soft)]" />
          </>
        )}

        {/* Tool-specific panel */}
        <AnimatePresence mode="wait">
          {activeTool === 'text' && (
            <TextToolPanel
              key="text"
              activeColor={activeColor}
              activeFont={activeFont}
              onAddText={canvasApi?.addText}
              onFontChange={onFontChange}
              onColorChange={onColorChange}
              isMobile={isMobile}
              onClose={onClose}
            />
          )}
          {activeTool === 'draw' && (
            <DoodleToolPanel
              key="draw"
              brushColor={brushColor}
              brushSize={brushSize}
              onColorChange={onBrushColorChange}
              onSizeChange={onBrushSizeChange}
              onUndoStroke={canvasApi?.undoLastStroke}
              onClearDoodles={canvasApi?.clearDoodles}
              isMobile={isMobile}
            />
          )}
          {activeTool === 'colors' && (
            <motion.div key="colors" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">CD SURFACE</p>
                <div className="flex flex-wrap gap-1.5">
                  {['#ffffff', '#f8f1e5', '#e5edf8', '#f8e5eb', '#e6f8e5', '#f3e5f8'].map(c => (
                    <button
                      key={c}
                      className={`h-6 w-6 shrink-0 rounded-full border transition-all duration-200 ${
                        cdColor === c
                          ? 'scale-110 border-[var(--color-oxblood)] ring-2 ring-[var(--color-paper)] ring-offset-1 ring-offset-[var(--color-oxblood)]'
                          : 'border-[var(--color-border-soft)] hover:scale-105'
                      }`}
                      style={{ background: c }}
                      onClick={() => onCdColorChange(c)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">CUSTOM COLOR</p>
                <input
                  type="color"
                  value={cdColor !== 'transparent' ? cdColor : '#ffffff'}
                  onChange={e => onCdColorChange(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-xl border border-[var(--color-border-soft)] p-0.5"
                />
              </div>
            </motion.div>
          )}
          {(activeTool === 'select' || activeTool === 'stickers' || activeTool === 'erase') && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedObject && activeTool !== 'erase' ? (
                <SelectedItemPanel
                  selectedObject={selectedObject}
                  onRemove={canvasApi?.removeSelected}
                  onDuplicate={canvasApi?.duplicateSelected}
                  onBringForward={canvasApi?.bringForward}
                  onSendBackward={canvasApi?.sendBackward}
                  onBringToFront={canvasApi?.bringToFront}
                  onSendToBack={canvasApi?.sendToBack}
                  canvasRef={canvasRef}
                  isMobile={isMobile}
                />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border-soft)] bg-[rgba(248,241,229,0.3)] px-4 py-12 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-oxblood)] shadow-sm">
                    {activeTool === 'erase' ? <Eraser size={22} /> : 
                     activeTool === 'stickers' ? <Sparkles size={22} /> :
                     <MousePointer2 size={22} />}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink)] [font-family:var(--font-typewriter)]">
                    {activeTool === 'erase' ? 'tap item to remove it' : 
                     activeTool === 'stickers' ? 'pick a sticker below' :
                     'select an item on the cd to edit'}
                  </p>
                  <p className="mt-2 text-[10px] italic text-[var(--color-ink-muted)] opacity-70 [font-family:var(--font-typewriter)]">
                    {activeTool === 'select' ? 'you can move, resize, and recolor items' : 'customize your cd design'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && (
          <div className="mt-auto flex flex-col gap-4">
            <div className="h-px w-full bg-[var(--color-border-soft)]" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] [font-family:var(--font-typewriter)]">HISTORY</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] [font-family:var(--font-typewriter)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    undo
                  </button>
                  <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] [font-family:var(--font-typewriter)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    redo
                  </button>
                </div>
              </div>

              {/* Clear/Finish */}
              <div className="flex flex-col justify-end gap-2">
                 <button
                  onClick={onClearAll}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-transparent px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-muted)] transition-all duration-200 hover:bg-[var(--color-oxblood)] hover:text-[var(--color-cream)] [font-family:var(--font-typewriter)]"
                >
                  clear disc
                </button>
              </div>
            </div>

            <button
              onClick={onSave}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-4 text-[13px] font-bold uppercase tracking-widest text-[var(--color-cream)] shadow-lg transition-all duration-200 hover:shadow-xl [font-family:var(--font-typewriter)]"
            >
              save & finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
