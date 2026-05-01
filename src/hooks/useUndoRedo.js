// useUndoRedo.js — JSON snapshot undo/redo for Fabric canvas

import { useRef, useState, useCallback } from 'react';

const MAX_HISTORY = 30;

export function useUndoRedo(canvasRef) {
  const history = useRef([]);
  const pointer = useRef(-1);
  const isApplying = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateFlags = useCallback(() => {
    setCanUndo(pointer.current > 0);
    setCanRedo(pointer.current < history.current.length - 1);
  }, []);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isApplying.current) return;

    const json = canvas.toJSON(['clipPath', 'id', 'stickerType', 'fontFamily']);

    // Trim forward history on new action
    history.current = history.current.slice(0, pointer.current + 1);
    history.current.push(json);

    if (history.current.length > MAX_HISTORY) {
      history.current.shift();
    }
    pointer.current = history.current.length - 1;
    updateFlags();
  }, [canvasRef, updateFlags]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || pointer.current <= 0) return;

    pointer.current--;
    isApplying.current = true;
    canvas.loadFromJSON(history.current[pointer.current]).then(() => {
      canvas.renderAll();
      isApplying.current = false;
      updateFlags();
    });
  }, [canvasRef, updateFlags]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || pointer.current >= history.current.length - 1) return;

    pointer.current++;
    isApplying.current = true;
    canvas.loadFromJSON(history.current[pointer.current]).then(() => {
      canvas.renderAll();
      isApplying.current = false;
      updateFlags();
    });
  }, [canvasRef, updateFlags]);

  const clear = useCallback(() => {
    history.current = [];
    pointer.current = -1;
    updateFlags();
  }, [updateFlags]);

  return { saveSnapshot, undo, redo, canUndo, canRedo, clear };
}
