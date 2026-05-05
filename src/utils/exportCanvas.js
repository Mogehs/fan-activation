// exportCanvas.js — Clean PNG export from Fabric canvas

export async function exportCanvasAsPng(canvas, cdColor = '#ffffff', multiplier = 2) {
  if (!canvas) return null;
  canvas.discardActiveObject();
  canvas.renderAll();

  return new Promise((resolve) => {
    const size = canvas.width * multiplier;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d');

    const radius = size / 2;

    const drawFinal = (img) => {
      // 1. Draw solid color background for the CD
      ctx.fillStyle = cdColor === 'transparent' ? '#ffffff' : cdColor;
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw CD base image with multiply
      if (img) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.85;
        ctx.drawImage(img, 0, 0, size, size);
      }

      // Reset
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      // 3. Draw fabric canvas contents
      const fabricDataUrl = canvas.toDataURL({
        format: 'png',
        multiplier,
        quality: 1,
      });

      const fabricImg = new Image();
      fabricImg.onload = () => {
        ctx.drawImage(fabricImg, 0, 0, size, size);

        // 4. Punch the CD hole
        const holeRadius = size * 0.037;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(radius, radius, holeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Optional inner shadow for the hole (simplified)
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(23, 19, 17, 0.4)';
        ctx.lineWidth = size * 0.005;
        ctx.beginPath();
        ctx.arc(radius, radius, holeRadius, 0, Math.PI * 2);
        ctx.stroke();

        resolve(exportCanvas.toDataURL('image/png'));
      };
      fabricImg.src = fabricDataUrl;
    };

    const cdBaseImg = new Image();
    cdBaseImg.crossOrigin = 'anonymous';
    cdBaseImg.onload = () => drawFinal(cdBaseImg);
    cdBaseImg.onerror = () => {
      console.warn("Failed to load cd.png for export");
      drawFinal(null);
    };
    cdBaseImg.src = '/cd.png';
  });
}

/**
 * Trigger a browser download of the PNG.
 * @param {string} dataUrl
 * @param {string} filename
 */
export function downloadPng(dataUrl, filename = 'my-beautiful-life-cd.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Explicitly share the image file (triggering native share dialog on mobile).
 * @param {string} dataUrl
 */
export async function sharePng(dataUrl) {
  if (navigator.share && navigator.canShare) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'my-beautiful-life-cd.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'beautiful life — piper connolly',
          text: `i made my own beautiful life cd 💿\ndecorate your beautiful life here: ${window.location.href}`,
        });
        return 'shared';
      }
    } catch (e) {
      console.warn("Share failed, falling back to download", e);
    }
  }
  downloadPng(dataUrl);
  return 'downloaded';
}

/**
 * Legacy wrapper for compatibility, now just calls sharePng.
 */
export async function shareOrDownload(dataUrl) {
  return sharePng(dataUrl);
}
