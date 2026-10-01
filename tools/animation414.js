function tf_animateEquity412() {
  tf_cancelEquityAnimation412();
  const canvas = document.getElementById('equity-curve-canvas');
  if (equityChartMode !== 'line' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden || !canvas || !canvas.parentElement || !canvas.parentElement.clientWidth || !equityCurvePoints.length) {
    drawEquityCurve(); return;
  }
  // Cache the grid and complete line once. ALL has the same smooth transition
  // as short ranges without recalculating thousands of chart points each frame.
  const animation = { start: null, progress: 0, duration: 2200 };
  tfEquityAnimation412 = animation;
  const snapshot = () => {
    const layer = document.createElement('canvas');
    layer.width = canvas.width; layer.height = canvas.height;
    layer.getContext('2d').drawImage(canvas, 0, 0);
    return layer;
  };
  try {
    drawEquityCurve();
    const background = snapshot();
    animation.progress = 1;
    drawEquityCurve();
    const complete = snapshot();
    animation.progress = 0;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const left = 48 * dpr;
    const right = Math.max(left, complete.width - tf_getEquityPaddingRight() * dpr);
    const paint = progress => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);
      const revealWidth = progress >= 1 ? complete.width : Math.min(complete.width, left + (right - left) * progress);
      if (revealWidth > 0) ctx.drawImage(complete, 0, 0, revealWidth, complete.height, 0, 0, revealWidth, complete.height);
      ctx.restore();
    };
    paint(0);
    const step = now => {
      if (tfEquityAnimation412 !== animation) return;
      if (canvas.width !== complete.width || canvas.height !== complete.height) {
        tf_cancelEquityAnimation412(); drawEquityCurve(); return;
      }
      // Start at the first visible frame, after summary/ALL computation finishes.
      if (animation.start === null) animation.start = now;
      const t = Math.max(0, Math.min(1, (now - animation.start) / animation.duration));
      animation.progress = t * t * (3 - 2 * t);
      paint(animation.progress);
      if (t < 1) tfEquityAnimationFrame412 = requestAnimationFrame(step);
      else { tfEquityAnimation412 = null; tfEquityAnimationFrame412 = 0; }
    };
    tfEquityAnimationFrame412 = requestAnimationFrame(step);
  } catch (error) {
    tf_cancelEquityAnimation412(); drawEquityCurve();
  }
}
