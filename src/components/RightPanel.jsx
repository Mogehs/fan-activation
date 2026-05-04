// RightPanel.jsx — "pretty little extras" right sidebar

import { motion, AnimatePresence } from 'framer-motion';
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
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-sepia)] opacity-80 [font-family:var(--font-hand)]">
            PIPER CONNOLLY ✦ BEAUTIFUL LIFE
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-5 p-4">
        {/* Color story — hidden on mobile to simplify */}
        {!isMobile && (
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
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">CD SURFACE</p>
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
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">CUSTOM COLOR</p>
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
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border-soft)] px-4 py-10 text-center">
                  <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--color-ink-muted)] opacity-50 [font-family:var(--font-hand)]">
                    {activeTool === 'erase' ? 'tap item to erase' : 
                     activeTool === 'stickers' ? 'pick a sticker below' :
                     'select an item to edit'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto flex flex-col gap-4">
          <div className="h-px w-full bg-[var(--color-border-soft)]" />
          
          <div className="grid grid-cols-2 gap-4">
            {!isMobile && (
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">HISTORY</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white px-2 text-[10px] font-medium uppercase tracking-widest text-[var(--color-charcoal)] transition-all duration-200 hover:border-[var(--color-sepia)] hover:bg-[var(--color-paper)] [font-family:var(--font-hand)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    undo
                  </button>
                  <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-border-soft)] bg-white px-2 text-[10px] font-medium uppercase tracking-widest text-[var(--color-charcoal)] transition-all duration-200 hover:border-[var(--color-sepia)] hover:bg-[var(--color-paper)] [font-family:var(--font-hand)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    redo
                  </button>
                </div>
              </div>
            )}

            {/* Clear/Finish */}
            <div className={`flex flex-col justify-end gap-2 ${isMobile ? 'col-span-2' : ''}`}>
               <button
                onClick={onClearAll}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--color-sepia)] bg-transparent px-3 text-[10px] font-medium uppercase tracking-widest text-[var(--color-sepia)] transition-all duration-200 hover:bg-[var(--color-oxblood)] hover:text-[var(--color-cream)] [font-family:var(--font-hand)]"
              >
                clear disc
              </button>
            </div>
          </div>

          <button
            onClick={onSave}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-4 text-[13px] font-medium uppercase tracking-widest text-[var(--color-cream)] shadow-lg transition-all duration-200 hover:shadow-xl [font-family:var(--font-hand)]"
          >
            save & finish
          </button>
        </div>
      </div>
    </div>
  );
}
