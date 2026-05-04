// CDCanvas.jsx — Fabric.js canvas with circular CD clip mask

import { useRef, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { STICKERS } from '../data/stickers';
import { FONTS } from '../data/fonts';
import { exportCanvasAsPng } from '../utils/exportCanvas';

export default function CDCanvas({
  activeTool,
  activeColor,
  activeSticker,
  brushSize,
  cdColor,
  onObjectSelected,
  onSelectionCleared,
  onCanvasReady,
  onUndoRedoChange,
}) {
  const containerRef = useRef(null);
  const canvasElRef  = useRef(null);

  const handleModified = useCallback(() => {
    saveSnapshot();
  }, []); // will be filled after hook init

  const {
    canvasRef,
    addObject,
    removeSelected,
    duplicateSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    clearDoodles,
    clearAll,
    undoLastStroke,
    updateBrush,
    deselectAll,
    toJSON,
    loadFromJSON,
  } = useFabricCanvas({
    canvasElRef,
    containerRef,
    onObjectSelected,
    onSelectionCleared,
    onCanvasModified: () => { saveSnapshotRef.current?.(); },
    onCanvasClick: (pointer) => {
      if (activeTool === 'stickers' && activeSticker) {
        addSticker(activeSticker, activeColor, pointer);
      }
    },
    activeTool,
    activeColor,
    brushSize,
    cdColor,
  });

  const { saveSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(canvasRef);
  const saveSnapshotRef = useRef(saveSnapshot);
  useEffect(() => { saveSnapshotRef.current = saveSnapshot; }, [saveSnapshot]);

  // Notify parent of undo/redo availability
  useEffect(() => {
    onUndoRedoChange?.({ canUndo, canRedo, undo, redo });
  }, [canUndo, canRedo, undo, redo, onUndoRedoChange]);

  // Expose canvas API to parent
  useEffect(() => {
    if (canvasRef.current) {
      saveSnapshot();
    }
    onCanvasReady?.({
      canvasRef,
      addSticker,
      addText,
      removeSelected,
      duplicateSelected,
      bringForward,
      sendBackward,
      bringToFront,
      sendToBack,
      clearDoodles,
      clearAll,
      undoLastStroke,
      updateBrush,
      deselectAll,
      toJSON,
      loadFromJSON,
      exportPng: () => exportCanvasAsPng(canvasRef.current, cdColor),
      exportSvg: () => canvasRef.current?.toSVG({
        viewBox: { x: 0, y: 0, width: canvasRef.current.width, height: canvasRef.current.height }
      }),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef.current]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if ((e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        removeSelected();
        saveSnapshot();
      }
      if (e.key === 'Escape') {
        deselectAll();
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canvasRef, removeSelected, deselectAll, undo, redo, saveSnapshot]);

  // ---------- ADD STICKER ----------
  const addSticker = useCallback((stickerId, color, pointer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sticker = STICKERS.find(s => s.id === stickerId);
    if (!sticker) return;

    const centerX = pointer ? pointer.x : canvas.width / 2;
    const centerY = pointer ? pointer.y : canvas.height / 2;

    fabric.FabricImage.fromURL(sticker.src, { crossOrigin: 'anonymous' }).then((img) => {
      if (!img) return;
      const targetSize = 150; // Increased size for the CD placement
      const imgWidth = img.width || targetSize;
      const imgHeight = img.height || targetSize;
      const scale = targetSize / Math.max(imgWidth, imgHeight);
      
      const isMobile = window.innerWidth < 768;
      img.set({
        left: centerX - (imgWidth * scale) / 2 + (Math.random() - 0.5) * 20,
        top:  centerY - (imgHeight * scale) / 2 + (Math.random() - 0.5) * 20,
        scaleX: scale,
        scaleY: scale,
        cornerSize: isMobile ? 24 : 8,
        transparentCorners: false,
        cornerColor: '#6B1A1A',
        borderColor: '#6B1A1A',
        borderScaleFactor: isMobile ? 2.5 : 1.5,
      });
      img.setControlVisible('ml', false);
      img.setControlVisible('mr', false);
      img.setControlVisible('mt', false);
      img.setControlVisible('mb', false);
      img.stickerType = stickerId;
      
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      saveSnapshot();
    }).catch(err => console.error("Error loading sticker:", err));
  }, [canvasRef, saveSnapshot]);

  // ---------- ADD TEXT ----------
  const addText = useCallback((fontFamily, color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const font = FONTS.find(f => f.family === fontFamily) || FONTS[0];

    const isMobile = window.innerWidth < 768;
    const text = new fabric.IText('type here...', {
      left: canvas.width / 2,
      top:  canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: font.family.split(',')[0].replace(/['"]/g, '').trim(),
      fontSize: 28,
      fill: color || '#B83030',
      cornerSize: isMobile ? 24 : 10,
      transparentCorners: false,
      cornerColor: '#6B1A1A',
      borderColor: '#6B1A1A',
      borderScaleFactor: isMobile ? 3 : 2,
      cursorColor: '#6B1A1A',
      padding: isMobile ? 12 : 5,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.selectAll();
    text.enterEditing();
    canvas.renderAll();
    saveSnapshot();
  }, [canvasRef, saveSnapshot]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        maxWidth: window.innerWidth < 768 ? '90vw' : 'min(400px, calc(100vh - 240px))',
        maxHeight: window.innerWidth < 768 ? '90vw' : 'min(400px, calc(100vh - 240px))',
        margin: '0 auto',
      }}
    >
      {/* Background DOM layers */}
      <CDBase color={cdColor} />
      
      {/* Holographic overlay */}
      <div className="cd-holo" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />

      {/* Fabric canvas */}
      <canvas
        ref={canvasElRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          cursor: (activeTool === 'draw' || activeTool === 'erase') ? 'crosshair' : 'default',
          zIndex: 2,
        }}
      />

      {/* Top Hole */}
      <CDHole />
    </div>
  );
}

// ---------- CD VISUAL LAYERS ----------

function CDBase({ color }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        boxShadow: '0 12px 34px rgba(0,0,0,0.18), 0 3px 10px rgba(0,0,0,0.10)',
        overflow: 'hidden',
      }}
    >
      <img src="/cd.png" alt="CD Base" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      
      {/* Custom Color Overlay */}
      {color && color !== '#ffffff' && color !== 'transparent' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          mixBlendMode: 'multiply',
          opacity: 0.85,
        }} />
      )}
    </div>
  );
}

function CDHole() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '7.4%',
        height: '7.4%',
        minWidth: 18,
        minHeight: 18,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 34%, #2a2624 0%, #171311 58%, #0f0c0b 100%)',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.12), 0 0 0 4px rgba(155,170,188,0.12)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}

// ---------- SVG BUILDER ----------

function buildStickerSVG(sticker, color) {
  const vb = sticker.viewBox || '0 0 48 48';
  const pathsMarkup = sticker.paths.map(p => {
    const fillAttr = p.fill === true
      ? `fill="${color}"`
      : p.fill === false || p.fill === 'none'
        ? 'fill="none"'
        : p.isCenter
          ? `fill="${p.fill}"`
          : `fill="${p.fill || 'none'}"`;

    const strokeAttr = p.stroke
      ? `stroke="${color}" stroke-width="${p.strokeWidth || 2}" stroke-linecap="${p.strokeLinecap || 'round'}" stroke-linejoin="round"`
      : '';

    const opacityAttr = p.opacity != null ? `opacity="${p.opacity}"` : '';

    return `<path d="${p.d}" ${fillAttr} ${strokeAttr} ${opacityAttr} />`;
  }).join('\n');

  const textMarkup = sticker.text
    ? `<text
        x="${sticker.text.x}"
        y="${sticker.text.y}"
        font-size="${sticker.text.fontSize}"
        font-family="${sticker.text.fontFamily}"
        font-style="${sticker.text.fontStyle || 'normal'}"
        text-anchor="${sticker.text.textAnchor || 'middle'}"
        dominant-baseline="${sticker.text.dominantBaseline || 'middle'}"
        fill="${color}"
      >${sticker.text.content}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
    ${pathsMarkup}
    ${textMarkup}
  </svg>`;
}
