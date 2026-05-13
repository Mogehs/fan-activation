// DecoratorLayout.jsx — 3-panel decorator workspace

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CDCanvas from './CDCanvas';
import ToolRail from './ToolRail';
import RightPanel from './RightPanel';
import StickerTray from './StickerTray';
import ConfirmationState from './ConfirmationState';
import EmailGateModal from './EmailGateModal';
import { COLOR_STORIES } from '../data/colorStories';
import { useColorStory } from '../hooks/useColorStory';
import { FONTS } from '../data/fonts';
import { sharePng, downloadPng } from '../utils/exportCanvas';
import { Mail, Sliders, Download, Share2, Plus, X } from 'lucide-react';

export default function DecoratorLayout() {
  const [activeTool, setActiveTool] = useState('draw');
  const [selectedObj, setSelectedObj] = useState(null);
  const [brushColor, setBrushColor] = useState('#B83030');
  const [brushSize, setBrushSize] = useState(4);
  const [activeFont, setActiveFont] = useState(FONTS[0].family);
  const [activeColor, setActiveColor] = useState('#B83030');
  const [cdBaseColor, setCdBaseColor] = useState('#ffffff');
  const [activeSticker, setActiveSticker] = useState(null);
  const [undoState, setUndoState] = useState({ canUndo: false, canRedo: false });
  const [undoFns, setUndoFns] = useState({ undo: () => { }, redo: () => { } });
  const [showModal, setShowModal] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pendingPng, setPendingPng] = useState(null);
  const [pendingSvg, setPendingSvg] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // 'save' | 'share' | null
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const [canvasApi, setCanvasApi] = useState(null);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const canvasRef = useRef(null);
  const hasLoadedRef = useRef(false);

  const { activeStory, setStory, allStories } = useColorStory();

  // ---------- PERSISTENCE LOGIC ----------

  // Save everything to localStorage
  const saveToLocalStorage = useCallback(() => {
    // CRITICAL: Do not save until we are CERTAIN we have finished the initial load attempt
    if (!canvasApi || !hasLoadedRef.current) return;

    try {
      const state = {
        canvasJSON: canvasApi.toJSON(),
        cdBaseColor,
        activeStory,
        activeColor,
        timestamp: Date.now()
      };
      localStorage.setItem('piper_connolly_cd_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state to localStorage", e);
    }
  }, [canvasApi, cdBaseColor, activeStory, activeColor]);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(async (api) => {
    const saved = localStorage.getItem('piper_connolly_cd_state');
    if (!saved) {
      hasLoadedRef.current = true;
      return;
    }
    try {
      const state = JSON.parse(saved);
      if (state.cdBaseColor) setCdBaseColor(state.cdBaseColor);
      if (state.activeStory) setStory(state.activeStory);
      if (state.activeColor) setActiveColor(state.activeColor);

      if (state.canvasJSON && api) {
        // Wait for objects to be fully loaded into Fabric
        await api.loadFromJSON(state.canvasJSON);
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    } finally {
      // Mark as loaded ONLY after everything is finished
      // This prevents the saveToLocalStorage from overwriting with empty data during init
      setTimeout(() => {
        hasLoadedRef.current = true;
      }, 100);
    }
  }, [setStory]);

  // When canvas is ready, store its API and LOAD saved state
  const handleCanvasReady = useCallback(async (api) => {
    setCanvasApi(api);
    canvasRef.current = api.canvasRef;
    await loadFromLocalStorage(api);
  }, [loadFromLocalStorage]);

  // Auto-save on modification
  const handleUndoRedoChange = useCallback(({ canUndo, canRedo, undo, redo }) => {
    setUndoState({ canUndo, canRedo });
    setUndoFns({ undo, redo });
    // This is triggered on every modification
    if (hasLoadedRef.current) {
      saveToLocalStorage();
    }
  }, [saveToLocalStorage]);

  useEffect(() => {
    if (hasLoadedRef.current) {
      saveToLocalStorage();
    }
  }, [cdBaseColor, activeStory, activeColor, saveToLocalStorage]);

  // Story select — does NOT wipe canvas
  const handleStorySelect = useCallback((storyId) => {
    const story = COLOR_STORIES.find(s => s.id === storyId);
    setStory(storyId);
    setActiveColor(story?.primary || '#B83030');
    setBrushColor(story?.primary || '#B83030');
  }, [setStory]);

  const handleAddSticker = useCallback((stickerId) => {
    canvasApi?.addSticker?.(stickerId, activeColor);
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
    const png = await canvasApi.exportPng?.();
    const svg = await canvasApi.exportSvg?.();
    setPendingPng(png);
    setPendingSvg(svg);
    setPendingAction('save');
    if (!unlocked) {
      setShowModal(true);
    } else {
      if (png) downloadPng(png);
    }
  }, [canvasApi, unlocked]);

  // Share flow (gated like save)
  const handleShareDisc = useCallback(async () => {
    if (!canvasApi) return;
    const png = await canvasApi.exportPng?.();
    const svg = await canvasApi.exportSvg?.();
    
    setPendingAction('share');
    
    if (!unlocked) {
      setPendingPng(png);
      setPendingSvg(svg);
      setShowModal(true);
    } else {
      // Direct share, don't set pendingPng so confirmation modal doesn't show
      if (png) {
        sharePng(png);
        setPendingPng(null);
        setPendingAction(null);
      }
    }
  }, [canvasApi, unlocked]);

  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    setUnlocked(true);
    
    // If it was a share action, trigger share immediately and bypass confirmation modal
    if (pendingAction === 'share' && pendingPng) {
      sharePng(pendingPng);
      setPendingPng(null);
      setPendingAction(null);
    }
    // Note: for 'save', we leave pendingPng as is, which triggers the ConfirmationState modal
  }, [pendingAction, pendingPng]);

  const handleDownload = useCallback(() => {
    if (pendingPng) downloadPng(pendingPng);
  }, [pendingPng]);

  const handleShare = useCallback(() => {
    if (pendingPng) sharePng(pendingPng);
  }, [pendingPng]);

  const handleToolChange = useCallback((tool) => {
    setActiveTool(tool);
    if (tool !== 'draw') {
      canvasApi?.canvasRef?.current && (canvasApi.canvasRef.current.isDrawingMode = false);
    }
    if (tool !== 'stickers') {
      setActiveSticker(null);
    }
    // Auto-open settings on mobile for specific tools (except select)
    if (isMobile && (tool === 'text' || tool === 'draw' || tool === 'colors')) {
      setShowMobileSettings(true);
    }
  }, [canvasApi, isMobile]);

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
        height: isMobile ? '100dvh' : '100%',
        background: 'var(--color-background)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Main 3-panel area */}
      <div className={`flex min-h-0 ${isMobile ? 'flex-col flex-1' : 'flex-[3] p-2'} gap-2 overflow-hidden`}>
        {/* Left tool rail */}
        {!isMobile && (
          <div className="h-full self-stretch shrink-0 overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-paper)] rounded-2xl shadow-sm">
            <ToolRail activeTool={activeTool} onToolChange={handleToolChange} mobile={false} />
          </div>
        )}

        {/* Center canvas area */}
        <div className={`relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden border-[var(--color-border-soft)] bg-[var(--color-paper)] ${isMobile ? 'border-b rounded-none min-h-[45vh]' : 'border p-[clamp(12px,2vw,20px)] rounded-2xl shadow-sm'}`} style={{
          flex: 1,
          minWidth: 0,
        }}>
          <CDCanvas
            activeTool={activeTool}
            activeColor={activeTool === 'draw' ? brushColor : activeColor}
            activeFont={activeFont}
            activeSticker={activeSticker}
            brushSize={brushSize}
            cdColor={cdBaseColor}
            onObjectSelected={(obj) => {
              setSelectedObj(obj);
              setActiveTool('select');
              if (isMobile) {
                setShowMobileSettings(true);
              }
            }}
            onSelectionCleared={() => setSelectedObj(null)}
            onCanvasReady={handleCanvasReady}
            onUndoRedoChange={handleUndoRedoChange}
            isMobile={isMobile}
          />

          {/* Mobile Action Buttons */}
          {isMobile && (
            <div className="absolute bottom-4 right-4 z-[10] flex flex-col gap-3">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-xl transition-all ${showActionsMenu ? 'rotate-0' : 'rotate-0'}`}
              >
                {showActionsMenu ? <X size={20} strokeWidth={2.5} /> : <Plus size={24} strokeWidth={2.5} />}
              </button>
              <button
                onClick={() => setShowMobileSettings(!showMobileSettings)}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-oxblood)] text-white shadow-xl transition-all ${showMobileSettings ? 'rotate-90' : 'rotate-0'}`}
              >
                {showMobileSettings ? <X size={20} strokeWidth={2.5} /> : <Sliders size={20} strokeWidth={2.5} />}
              </button>
            </div>
          )}

          {/* Mobile Back Button */}
          {isMobile && (
            <button
              onClick={() => window.location.reload()} // Quick way to return to hero in this simple stage-based app
              className="absolute top-4 left-4 z-[10] flex h-10 px-3 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[var(--color-border-soft)] text-[var(--color-ink)] text-[10px] font-medium uppercase tracking-widest [font-family:var(--font-hand)]"
            >
              ← Home
            </button>
          )}

          {/* Mobile Floating Undo/Redo — Bottom Left (Symmetrical with Right side buttons) */}
          {isMobile && (
            <div className="absolute bottom-4 left-4 z-[10] flex flex-col gap-3">
              <button
                onClick={undoFns.undo}
                disabled={!undoState.canUndo}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl border border-[var(--color-border-soft)] disabled:opacity-30 disabled:grayscale transition-all active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
              </button>
              <button
                onClick={undoFns.redo}
                disabled={!undoState.canRedo}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl border border-[var(--color-border-soft)] disabled:opacity-30 disabled:grayscale transition-all active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" /></svg>
              </button>
            </div>
          )}
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
      {!isMobile && (
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
          <div className="flex w-[320px] shrink-0 flex-col justify-center gap-2.5 border border-[var(--color-border-soft)] bg-[var(--color-paper)] p-3 rounded-2xl shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-sepia)] bg-[var(--color-paper-soft)] px-3 text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink)] transition-all [font-family:var(--font-hand)]"
                >
                  <Mail size={14} /> SUBSCRIBE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveDisc}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--color-oxblood)] to-[var(--color-piper-red)] px-3 text-[10px] font-medium uppercase tracking-wider text-white shadow-md transition-all [font-family:var(--font-hand)]"
                >
                  <Download size={14} /> SAVE PNG
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleShareDisc}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border-soft)] bg-white px-3 text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink)] transition-all [font-family:var(--font-hand)]"
              >
                <Share2 size={14} /> SHARE WITH FRIENDS
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticker Tray (Only when tool is stickers) */}
      {isMobile && activeTool === 'stickers' && !showMobileSettings && (
        <div className="relative z-[10] h-auto shrink-0 border-t border-[var(--color-border-soft)] bg-[var(--color-paper)]">
          <StickerTray
            onAddSticker={handleAddSticker}
            activeColor={activeColor}
            activeSticker={activeSticker}
          />
        </div>
      )}

      {/* Mobile Bottom Settings Panel */}
      <AnimatePresence>
        {isMobile && showMobileSettings && (
          <>
            {/* Backdrop for mobile settings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSettings(false)}
              className="fixed inset-0 z-[40] bg-transparent"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[50] flex h-fit max-h-[80vh] flex-col rounded-t-[32px] border-t border-[var(--color-border-soft)] bg-[var(--color-paper)] shadow-[0_-12px_40px_rgba(0,0,0,0.1)]"
            >
              {/* Drag Handle / Close Bar */}
              <div className="relative flex w-full shrink-0 justify-center py-4" onClick={() => setShowMobileSettings(false)}>
                <div className="h-1.5 w-12 rounded-full bg-[var(--color-border-soft)]" />

                {/* Explicit Close Button for Mobile */}
                <button
                  onClick={() => setShowMobileSettings(false)}
                  className="absolute right-6 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-paper-soft)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pb-4">
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
                  onClose={() => setShowMobileSettings(false)}
                  isMobile={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Action Menu Overlay */}
      <AnimatePresence>
        {isMobile && showActionsMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActionsMenu(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              className="fixed bottom-36 right-4 z-[70] flex flex-col gap-3 items-end"
            >
              <button
                onClick={() => { setShowModal(true); setShowActionsMenu(false); }}
                className="flex h-12 items-center gap-3 rounded-full bg-white px-5 text-[12px] font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-xl [font-family:var(--font-typewriter)]"
              >
                <Mail size={18} /> Subscribe
              </button>
              <button
                onClick={() => { handleSaveDisc(); setShowActionsMenu(false); }}
                className="flex h-12 items-center gap-3 rounded-full bg-[var(--color-oxblood)] px-5 text-[12px] font-bold uppercase tracking-widest text-white shadow-xl [font-family:var(--font-typewriter)]"
              >
                <Download size={18} /> Save PNG
              </button>
              <button
                onClick={() => { handleShareDisc(); setShowActionsMenu(false); }}
                className="flex h-12 items-center gap-3 rounded-full bg-white px-5 text-[12px] font-medium uppercase tracking-widest text-[var(--color-ink)] shadow-xl [font-family:var(--font-hand)]"
              >
                ✦ Share
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile tool rail (bottom) */}
      {isMobile && (
        <div className="relative z-[20] shrink-0 border-t border-[var(--color-border-soft)] bg-[var(--color-paper)]">
          <ToolRail activeTool={activeTool} onToolChange={handleToolChange} mobile={true} />
        </div>
      )}

      {/* Email gate modal */}
      <EmailGateModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          // If they close the modal without succeeding, clear pending files to be safe
          setPendingPng(null);
          setPendingSvg(null);
        }}
        onSuccess={handleModalSuccess}
      />

      {/* Confirmation / download modal */}
      <ConfirmationState
        isOpen={unlocked && !!pendingPng}
        onClose={() => { setPendingPng(null); setPendingSvg(null); }}
        onDownload={handleDownload}
        onShare={handleShare}
      />
    </motion.div>
  );
}
