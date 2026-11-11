// ============================================================================
// TAKING THE PICTURE: the board's SVG (tutor ink and child ink, nothing else
// on the page, never the camera) drawn to a canvas, downscaled to at most
// 1000 pixels wide and compressed as JPEG, lowering quality until it is under
// TARGET_BYTES. Browser only; the rules about when are in snapshot.js.
// ============================================================================
import { MAX_WIDTH, TARGET_BYTES } from './snapshot.js';

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('the board could not be drawn'));
  img.src = url;
});

/** @returns {Promise<{ media:'image/jpeg', data:string, w:number, h:number, bytes:number }>} */
export async function captureBoard(svg, { maxWidth = MAX_WIDTH } = {}) {
  if (!svg) throw new Error('no board');
  const vb = svg.viewBox.baseVal;
  const clone = svg.cloneNode(true);
  clone.querySelectorAll('[data-noshot]').forEach((n) => n.remove());
  let scale = Math.min(1, maxWidth / vb.width);
  const text = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = await loadImage(url);
    for (let round = 0; round < 4; round += 1) {
      const w = Math.round(vb.width * scale); const h = Math.round(vb.height * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const g = c.getContext('2d');
      g.fillStyle = '#FFFFFF';
      g.fillRect(0, 0, w, h);
      g.drawImage(img, 0, 0, w, h);
      for (const q of [0.72, 0.6, 0.48]) {
        const data = c.toDataURL('image/jpeg', q).split(',')[1];
        if (data.length <= TARGET_BYTES) return { media: 'image/jpeg', data, w, h, bytes: data.length };
      }
      scale *= 0.8;
    }
    throw new Error('the picture stayed too large');
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default { captureBoard };
