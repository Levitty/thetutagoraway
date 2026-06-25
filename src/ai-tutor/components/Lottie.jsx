import React, { useEffect, useRef, useState } from 'react';

// Self-hosted Lottie player for the AI Tutor surfaces. Loads the lottie-player
// web component once, then renders an animation from a local /lottie/*.json
// path (committed in public/lottie, so it never depends on an external CDN for
// the animation data). If the player can't render, an optional `fallback`
// (e.g. an emoji or SVG icon) is shown instead, so a spot is never blank.
export const Lottie = ({ src, size = 96, width, height, loop = true, fallback = null }) => {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const w = width ?? size;
  const h = height ?? size;

  useEffect(() => {
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onErr = () => setFailed(true);
    el.addEventListener('error', onErr);
    return () => el.removeEventListener('error', onErr);
  }, [src]);

  if (failed && fallback) return fallback;

  return (
    <lottie-player
      ref={ref}
      src={src}
      background="transparent"
      speed="1"
      style={{ width: w, height: h }}
      {...(loop ? { loop: true } : {})}
      autoplay
    />
  );
};

// Local, self-hosted animation paths (files live in public/lottie/).
export const LOTTIE = {
  academics: '/lottie/academics.json',
  certificate: '/lottie/certificate.json',
  checkin: '/lottie/checkin.json',
  toggle: '/lottie/toggle.json',
};

export default Lottie;
