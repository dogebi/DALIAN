/*
 * art/street.js — 러시아 거리 (s06). Original drawing: five facades, one recurring string course.
 * Container: <g class="street"> inside the s06 svg (viewBox 0 0 2600 1080, panned by the timeline).
 * Anchors: pavement line y = 1000 · cornice/string course y = 530 · window rows y = 600 / 720 / 840,
 *          window size 120×110 · lamps at x 500 / 1400 / 2300, head y 700.
 * Classes kept: .win (the timeline lights these in order), .string (the motif line), .curtain, .lamp-gl.
 */
(function () {
  const ART = window.ART;

  const BLD = [
    { x: 60, w: 430, roof: 'mansard' },
    { x: 580, w: 430, roof: 'gable' },
    { x: 1100, w: 430, roof: 'mansard' },
    { x: 1620, w: 430, roof: 'gable' },
    { x: 2140, w: 430, roof: 'mansard' },
  ];
  const ROWS = [600, 720, 840];

  function facade(b) {
    const { x, w } = b;
    const cx = x + w / 2;
    const roof = b.roof === 'mansard'
      ? `<path class="roof" d="M${x - 16} 530 L${x + 30} 456 L${x + w - 30} 456 L${x + w + 16} 530 Z" />`
      : `<path class="roof" d="M${x - 16} 530 L${cx} 448 L${x + w + 16} 530 Z" />`;
    const wins = ROWS.map((y) => `
        <rect class="win" x="${x + 66}" y="${y}" width="120" height="110" rx="8" />
        <rect class="win" x="${x + 244}" y="${y}" width="120" height="110" rx="8" />`).join('');
    return `
      <g class="facade">
        ${roof}
        <rect class="body" x="${x}" y="530" width="${w}" height="470" />
        <rect class="string" x="${x - 16}" y="524" width="${w + 32}" height="10" />
        <rect class="pilaster" x="${x + 200}" y="530" width="30" height="470" />
        ${wins}
      </g>`;
  }

  const LAMPS = [500, 1400, 2300].map((x) => `
      <g class="lamp-post">
        <path d="M${x} 1000 L${x} 730 L${x + 56} 730 L${x + 56} 760" />
        <circle class="lamp-gl" cx="${x + 56}" cy="772" r="34" />
        <circle class="lamp-head" cx="${x + 56}" cy="772" r="13" />
      </g>`).join('');

  ART.street = {
    build(el) {
      el.innerHTML = `
        <g class="street-scene">
          <g class="facades">${BLD.map(facade).join('')}</g>
          <g class="lamps">${LAMPS}</g>
          <line class="pavement-line" x1="0" y1="1000" x2="2600" y2="1000" />
          <rect class="pavement" x="0" y="1000" width="2600" height="80" />
          <g class="curtains">
            <rect class="curtain c1" x="646" y="600" width="26" height="110" rx="6" />
            <rect class="curtain c2" x="1690" y="720" width="26" height="110" rx="6" />
          </g>
        </g>`;

      const wins = ART.qa(el, '.win');
      const c1 = el.querySelector('.c1');
      const c2 = el.querySelector('.c2');
      const glows = ART.qa(el, '.lamp-gl');

      return {
        wins,
        animate(t) {
          // curtains breathe in an open window; lamp glows flicker slightly (closed form of t)
          c1.setAttribute('transform', `translate(${ART.f(3.4 * Math.sin(t * 1.6))} 0) skewX(${ART.f(2.2 * Math.sin(t * 1.6))})`);
          c2.setAttribute('transform', `translate(${ART.f(2.6 * Math.sin(t * 1.25 + 1.7))} 0) skewX(${ART.f(1.8 * Math.sin(t * 1.25 + 1.7))})`);
          glows.forEach((g, i) => g.setAttribute('opacity', ART.f(0.30 + 0.07 * Math.sin(t * 2.3 + i * 1.9))));
        },
      };
    },
  };
})();
