// DecoratorLayout.jsx — 3-panel decorator workspace

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import CDCanvas from './CDCanvas';
import ToolRail from './ToolRail';
import RightPanel from './RightPanel';
import StickerTray from './StickerTray';
import ConfirmationState from './ConfirmationState';
import EmailGateModal from './EmailGateModal';
import { COLOR_STORIES } from '../data/colorStories';
import { useColorStory } from '../hooks/useColorStory';
import { FONTS } from '../data/fonts';
import { shareOrDownload } from '../utils/exportCanvas';

export default function DecoratorLayout() {
  const [activeTool,  setActiveTool]  = useState('select');
  const [selectedObj, setSelectedObj] = useState(null);
  const [brushColor,  setBrushColor]  = useState('#B83030');
  const [brushSize,   setBrushSize]   = useState(4);
  const [activeFont,  setActiveFont]  = useState(FONTS[0].family);
  const [activeColor, setActiveColor] = useState('#B83030');
  const [cdBaseColor, setCdBaseColor] = useState('#ffffff');
  const [activeSticker, setActiveSticker] = useState(null);
  const [undoState,   setUndoState]   = useState({ canUndo: false, canRedo: false });
  const [undoFns,     setUndoFns]     = useState({ undo: () => {}, redo: () => {} });
  const [showModal,   setShowModal]   = useState(false);
  const [unlocked,    setUnlocked]    = useState(false);
  const [pendingPng,  setPendingPng]  = useState(null);
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 768);

  const [canvasApi, setCanvasApi] = useState(null);
  const canvasRef    = useRef(null);

  const { activeStory, setStory, allStories } = useColorStory();

  // When canvas is ready, store its API
  const handleCanvasReady = useCallback((api) => {
    setCanvasApi(api);
    canvasRef.current = api.canvasRef;
  }, []);

  const handleUndoRedoChange = useCallback(({ canUndo, canRedo, undo, redo }) => {
    setUndoState({ canUndo, canRedo });
    setUndoFns({ undo, redo });
  }, []);

  // Story select — does NOT wipe canvas
  const handleStorySelect = useCallback((storyId) => {
    const story = COLOR_STORIES.find(s => s.id === storyId);
    setStory(storyId);
    setActiveColor(story?.primary || '#B83030');
    setBrushColor(story?.primary || '#B83030');
  }, [setStory]);

  const handleAddSticker = useCallback((stickerId) => {
    // Immediately add the sticker to the center of the canvas
    canvasApi?.addSticker?.(stickerId, activeColor);
    // Switch to select tool so the user can easily move the newly added sticker
    setActiveTool('select');
    setActiveSticker(null);
  }, [activeColor, canvasApi]);

  const handleAddText = useCallback((font, color) => {
    canvasApi?.addText(font || activeFont, color || activeColor);
    setActiveTool('select');
  }, [activeFont, activeColor, canvasApi]);

  // Save / download flow
  const handleSaveDisc = useCallback(async () => {
    if (!canvasApi) return;
    canvasApi.deselectAll?.();
    const png = await canvasApi.exportPng?.();
    setPendingPng(png);
    if (!unlocked) {
      setShowModal(true);
    } else {
      if (png) shareOrDownload(png);
    }
  }, [unlocked, canvasApi]);

  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    setUnlocked(true);
  }, []);

  const handleDownload = useCallback(() => {
    if (pendingPng) shareOrDownload(pendingPng);
  }, [pendingPng]);

  const handleToolChange = useCallback((tool) => {
    setActiveTool(tool);
    if (tool !== 'draw') {
      canvasApi?.canvasRef?.current && (canvasApi.canvasRef.current.isDrawingMode = false);
    }
    if (tool !== 'stickers') {
      setActiveSticker(null);
    }
  }, [canvasApi]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: 'var(--color-background)',
        overflow: 'hidden',
      }}
    >
      {/* Main 3-panel area */}
      <div className="flex min-h-0 flex-[3] gap-2 overflow-hidden p-2">
        {/* Left tool rail */}
        {!isMobile && (
          <div className="h-full self-stretch shrink-0 overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-paper)] rounded-2xl shadow-sm">
            <ToolRail activeTool={activeTool} onToolChange={handleToolChange} mobile={false} />
          </div>
        )}

        {/* Center canvas area */}
        <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-paper)] p-[clamp(12px,2vw,20px)] rounded-2xl shadow-sm" style={{
          flex: 1,
          minWidth: 0,
        }}>
            <CDCanvas
              activeTool={activeTool}
              activeColor={activeTool === 'draw' ? brushColor : activeColor}
              activeSticker={activeSticker}
              brushSize={brushSize}
              cdColor={cdBaseColor}
              onObjectSelected={setSelectedObj}
              onSelectionCleared={() => setSelectedObj(null)}
              onCanvasReady={handleCanvasReady}
              onUndoRedoChange={handleUndoRedoChange}
            />
        </div>

        {/* Right panel — desktop only */}
        {!isMobile && (
          <div className="h-full min-w-[380px] self-stretch shrink-0 overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-paper)] rounded-2xl shadow-sm" style={{ width: 'min(480px, 40vw)' }}>
            <RightPanel
              activeTool={activeTool}
              activeStory={activeStory}
              allStories={allStories}
              onStorySelect={handleStorySelect}
              selectedObject={selectedObj}
              canvasApi={canvasApi}
              canvasRef={canvasApi?.canvasRef}
              brushColor={brushColor}
              brushSize={brushSize}
              onBrushColorChange={(c) => { setBrushColor(c); canvasApi?.updateBrush(c, brushSize); }}
              onBrushSizeChange={(s) => { setBrushSize(s); canvasApi?.updateBrush(brushColor, s); }}
              activeFont={activeFont}
              activeColor={activeColor}
              onFontChange={setActiveFont}
              onColorChange={setActiveColor}
              cdColor={cdBaseColor}
              onCdColorChange={setCdBaseColor}
              canUndo={undoState.canUndo}
              canRedo={undoState.canRedo}
              onUndo={undoFns.undo}
              onRedo={undoFns.redo}
              onClearAll={() => { canvasApi?.clearAll?.(); }}
              onSave={handleSaveDisc}
            />
          </div>
        )}
      </div>

      {/* Bottom area: Pretty Little Extras & Global Actions */}
      <div className="flex flex-1 min-h-0 gap-2 overflow-hidden px-2 pb-2">
        {/* Sticker tray card */}
        <div className="flex-1 overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-paper)] rounded-2xl shadow-sm">
          <StickerTray
            onAddSticker={handleAddSticker}
            activeColor={activeColor}
            activeSticker={activeSticker}
          />
        </div>

        {/* Global Actions card */}
        {!isMobile && (
          <div className="flex w-[320px] shrink-0 flex-col justify-center gap-2.5 border border-[var(--color-border-soft)] bg-[var(--color-paper)] p-3 rounded-2xl shadow-sm">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-charcoal)] [font-family:var(--font-hand)]">GLOBAL ACTIONS</p>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-sepia)] bg-[var(--color-paper-soft)] px-3 text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink)] transition-all [font-family:var(--font-hand)]"
                >
                  ✉ SUBSCRIBE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveDisc}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-3 text-[10px] font-medium uppercase tracking-wider text-white shadow-md transition-all [font-family:var(--font-hand)]"
                >
                  ↓ SAVE PNG
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={async () => {
                   if (canvasApi) {
                     const png = await canvasApi.exportPng?.();
                     if (png) shareOrDownload(png);
                   }
                }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border-soft)] bg-white px-3 text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink)] transition-all [font-family:var(--font-hand)]"
              >
                ✦ SHARE WITH FRIENDS
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile tool rail (bottom) */}
      {isMobile && (
        <div className="shrink-0 border-t border-[var(--color-border-soft)] bg-[var(--color-paper)]">
          <ToolRail activeTool={activeTool} onToolChange={handleToolChange} mobile={true} />
        </div>
      )}

      {/* Email gate modal */}
      <EmailGateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Confirmation / download modal */}
      <ConfirmationState
        isOpen={unlocked && !!pendingPng}
        onClose={() => setPendingPng(null)}
        onDownload={handleDownload}
        onShare={handleDownload}
      />
    </motion.div>
  );
}
