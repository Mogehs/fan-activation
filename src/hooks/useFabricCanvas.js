// useFabricCanvas.js — Core Fabric.js canvas initialization and management

import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';

/**
 * Initializes a Fabric canvas with a circular clip mask matching the CD.
 * Returns refs and helpers for interacting with the canvas.
 */
export function useFabricCanvas({
  canvasElRef,
  containerRef,
  onObjectSelected,
  onSelectionCleared,
  onCanvasModified,
  onCanvasClick,
  activeTool,
  activeColor,
  brushSize,
  cdColor,
}) {
  const canvasRef = useRef(null);
  const clipCircleRef = useRef(null);
  const cdBaseLayerRef = useRef(null);
  const cdColorLayerRef = useRef(null);

  const activeToolRef = useRef(activeTool);

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  // ---------- INIT ----------
  useEffect(() => {
    if (!canvasElRef.current) return;

    const size = getContainerSize(containerRef?.current);

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: size,
      height: size,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      allowTouchScrolling: false,
    });

    canvasRef.current = canvas;

    // Circular clip path = CD boundary
    const radius = size / 2 - 2;
    const clipCircle = new fabric.Circle({
      radius,
      left: size / 2 - radius,
      top:  size / 2 - radius,
      absolutePositioned: true,
    });
    clipCircleRef.current = clipCircle;
    canvas.clipPath = clipCircle;

    // Internal background layers have been moved to the DOM (CDCanvas.jsx)
    // We only need the clipPath for drawing bounds.

    // ---------- EVENTS ----------
    canvas.on('object:modified',  () => onCanvasModified?.());
    canvas.on('object:added',     (e) => {
      // Don't trigger modified for internal layers
      if (e.target?.name?.startsWith('cd-')) return;
      onCanvasModified?.();
    });
    canvas.on('object:removed',   () => onCanvasModified?.());

    canvas.on('selection:created', (e) => {
      if (activeToolRef.current === 'erase' && e.selected?.[0]) {
        if (e.selected[0].name?.startsWith('cd-')) return;
        canvas.remove(e.selected[0]);
        canvas.discardActiveObject();
        canvas.renderAll();
        onCanvasModified?.();
        return;
      }
      onObjectSelected?.(e.selected?.[0] || null);
    });
    canvas.on('selection:updated', (e) => {
      if (activeToolRef.current === 'erase' && e.selected?.[0]) {
        if (e.selected[0].name?.startsWith('cd-')) return;
        canvas.remove(e.selected[0]);
        canvas.discardActiveObject();
        canvas.renderAll();
        onCanvasModified?.();
        return;
      }
      onObjectSelected?.(e.selected?.[0] || null);
    });
    canvas.on('mouse:down', (e) => {
      if (activeToolRef.current === 'erase' && e.target) {
        if (e.target.name?.startsWith('cd-')) return;
        canvas.remove(e.target);
        canvas.discardActiveObject();
        canvas.renderAll();
        onCanvasModified?.();
      } else if (activeToolRef.current !== 'draw') {
        // Only trigger click if not drawing or erasing an object
        onCanvasClick?.(e.pointer);
      }
    });
    canvas.on('selection:cleared', () => {
      onSelectionCleared?.();
    });

    // ---------- RESIZE ----------
    const ro = new ResizeObserver(() => {
      const newSize = getContainerSize(containerRef?.current);
      resizeCanvas(canvas, clipCircleRef.current, newSize);
    });
    if (containerRef?.current) ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      canvas.dispose();
      canvasRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- COLOR SYNC ----------
  // Color sync is now handled by the DOM component (CDBase)

  // ---------- TOOL SWITCHING ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activeTool === 'draw') {
      canvas.isDrawingMode = true;
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.color = activeColor || '#B83030';
      canvas.freeDrawingBrush.width = brushSize || 4;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [activeTool, activeColor, brushSize]);

  // ---------- HELPERS ----------
  const addObject = useCallback((obj) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  }, []);

  const removeSelected = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && !active.name?.startsWith('cd-')) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, []);

  const duplicateSelected = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.name?.startsWith('cd-')) return;
    active.clone().then((cloned) => {
      cloned.set({ left: (cloned.left || 0) + 16, top: (cloned.top || 0) + 16 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      canvas.fire('object:modified');
    }).catch(err => console.error('Clone failed:', err));
  }, []);

  const bringForward = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && !active.name?.startsWith('cd-')) { canvas.bringObjectForward(active); canvas.renderAll(); canvas.fire('object:modified'); }
  }, []);

  const sendBackward = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && !active.name?.startsWith('cd-')) { 
      // Don't send behind internal layers
      const idx = canvas.getObjects().indexOf(active);
      if (idx > 2) { // 0 is color, 1 is image, or vice versa
        canvas.sendObjectBackwards(active); 
        canvas.renderAll(); 
        canvas.fire('object:modified'); 
      }
    }
  }, []);

  const bringToFront = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && !active.name?.startsWith('cd-')) { canvas.bringObjectToFront(active); canvas.renderAll(); canvas.fire('object:modified'); }
  }, []);

  const sendToBack = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && !active.name?.startsWith('cd-')) { 
      canvas.sendObjectToBack(active); 
      // Ensure background layers are still at the very bottom
      if (cdBaseLayerRef.current) canvas.sendObjectToBack(cdBaseLayerRef.current);
      if (cdColorLayerRef.current) canvas.sendObjectToBack(cdColorLayerRef.current);
      canvas.renderAll(); 
      canvas.fire('object:modified'); 
    }
  }, []);

  const clearDoodles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paths = canvas.getObjects('path');
    paths.forEach(p => canvas.remove(p));
    canvas.renderAll();
  }, []);

  const clearAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach(obj => {
      if (!obj.name?.startsWith('cd-')) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
  }, []);

  const undoLastStroke = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paths = canvas.getObjects('path');
    if (paths.length > 0) {
      canvas.remove(paths[paths.length - 1]);
      canvas.renderAll();
    }
  }, []);

  const updateBrush = useCallback((color, size) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;
    if (color) canvas.freeDrawingBrush.color = color;
    if (size)  canvas.freeDrawingBrush.width = size;
  }, []);

  const deselectAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
  }, []);

  const toJSON = useCallback(() => {
    return canvasRef.current?.toJSON(['clipPath', 'id', 'stickerType', 'fontFamily', 'name', 'selectable', 'hasControls']);
  }, []);

  const loadFromJSON = useCallback((json) => {
    const canvas = canvasRef.current;
    if (!canvas || !json) return Promise.resolve();
    // Use a flag or just assume the batch load is fine.
    // The loadFromJSON in v6 is a promise.
    return canvas.loadFromJSON(json).then(() => {
      canvas.renderAll();
      // We don't necessarily need to trigger onCanvasModified here 
      // if it's already triggered by the individual objects, 
      // but we DO want to ensure the parent knows we are done.
    });
  }, []);

  return {
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
  };
}

// ============================================================
// HELPERS
// ============================================================

function getContainerSize(container) {
  if (!container) return 400;
  const s = Math.min(container.clientWidth, container.clientHeight, 560);
  return Math.max(s, 200);
}

function resizeCanvas(canvas, clipCircle, newSize) {
  if (!canvas) return;
  canvas.setWidth(newSize);
  canvas.setHeight(newSize);

  const radius = newSize / 2 - 2;

  if (clipCircle) {
    clipCircle.set({ radius, left: newSize / 2 - radius, top: newSize / 2 - radius });
    canvas.clipPath = clipCircle;
  }

  canvas.renderAll();
}
