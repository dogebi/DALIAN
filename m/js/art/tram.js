/*
 * art/tram.js — 노면전차 (s05). Original drawing.
 * Container: <g class="tram"> inside the s05 svg (viewBox 0 0 1920 1080).
 * Anchors: rail head y = 902, rail gauge y = 938, wheels y = 874, pantograph shoe y = 396,
 *          body top y = 452, headlight at x −392 (front, left), contact spark at (0, 396).
 * The timeline owns the tram body position (<g class="tram-body">, tweened on x);
 * animate(t) owns the inside (window shimmer, pantograph sway).
 */
(function () {
  const ART = window.ART;

  ART.tram = {
    build(el) {
      const ties = [];
      for (let x = 40; x <= 1880; x += 92) ties.push(`<line x1="${x}" y1="896" x2="${x - 16}" y2="946" />`);
      el.innerHTML = `
        <g class="tram-scene">
          <line class="tram-wire" x1="0" y1="396" x2="1920" y2="396" />
          <g class="tram-poles">
            <path d="M120 396 L120 1000" /><path d="M1800 396 L1800 1000" />
            <path d="M96 420 L144 420 M1776 420 L1824 420" />
          </g>
          <g class="tram-ties">${ties.join('')}</g>
          <g class="tram-rails">
            <line class="rail" x1="0" y1="902" x2="1920" y2="902" />
            <line class="rail" x1="0" y1="938" x2="1920" y2="938" />
          </g>
          <ellipse class="tram-shadow" cx="0" cy="946" rx="470" ry="26" />
          <g class="tram-body">
            <g class="tram-inner">
              <rect class="tram-roof" x="-434" y="452" width="868" height="34" rx="14" />
              <rect class="tram-shell" x="-430" y="470" width="860" height="404" rx="26" />
              <rect class="tram-band" x="-430" y="762" width="860" height="34" />
              <rect class="tram-skirt" x="-430" y="826" width="860" height="48" rx="10" />
              <g class="tram-wins">
                <rect class="win" x="-378" y="528" width="148" height="176" rx="10" />
                <rect class="win" x="-208" y="528" width="148" height="176" rx="10" />
                <rect class="win" x="-38" y="528" width="148" height="176" rx="10" />
                <rect class="win" x="132" y="528" width="148" height="176" rx="10" />
                <rect class="win" x="286" y="528" width="112" height="176" rx="10" />
              </g>
              <rect class="tram-door" x="286" y="510" width="112" height="316" rx="10" />
              <line class="tram-door-line" x1="342" y1="510" x2="342" y2="826" />
              <g class="tram-lights">
                <circle class="lamp" cx="-392" cy="800" r="18" />
                <circle class="lamp glow" cx="-392" cy="800" r="46" />
                <circle class="lamp small" cx="392" cy="800" r="12" />
              </g>
              <g class="tram-bogies">
                <rect x="-300" y="856" width="200" height="30" rx="8" />
                <circle class="wheel" cx="-252" cy="874" r="28" />
                <circle class="wheel" cx="-148" cy="874" r="28" />
                <rect x="100" y="856" width="200" height="30" rx="8" />
                <circle class="wheel" cx="148" cy="874" r="28" />
                <circle class="wheel" cx="252" cy="874" r="28" />
              </g>
              <g class="tram-panto">
                <line x1="-40" y1="452" x2="10" y2="470" />
                <line x1="40" y1="452" x2="-10" y2="470" />
                <path d="M-96 396 L0 428 L96 396" />
                <line class="shoe" x1="-108" y1="396" x2="108" y2="396" />
              </g>
              <rect class="tram-plate" x="-320" y="692" width="150" height="46" rx="8" />
            </g>
          </g>
        </g>`;

      const wins = ART.qa(el, '.win');
      const inner = el.querySelector('.tram-inner');
      const body = el.querySelector('.tram-body');
      const lampGlow = el.querySelector('.tram-lights .glow');
      body.setAttribute('transform', 'translate(0 0)');

      return {
        body, wins,
        animate(t) {
          // the lit windows breathe very slightly; the lamp glow pulses
          inner.setAttribute('transform', `translate(0 ${ART.f(1.6 * Math.sin(t * 3.1))})`);
          lampGlow.setAttribute('opacity', ART.f(0.16 + 0.06 * Math.sin(t * 4.2)));
        },
      };
    },
  };
})();
