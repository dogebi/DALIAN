/*
 * art/coast.js — 랴오둥반도 지도 (s02). Stylised original map: no traced map data.
 * Container: <g class="coast"> inside the s02 svg (viewBox 0 0 1920 1080).
 * Anchors the timeline relies on:
 *   land tip (대련) at (1300, 890) · pin ring centred (1300, 836)
 *   port group at the tip: pier line y≈990, cranes up to y 800
 *   ship: <g class="coast-ship"> (timeline tweens x) ▸ inner <g> bobbed by animate(t)
 * Classes kept: .coast-land .coast-island .coast-grid .coast-tip .coast-port .coast-ship .coast-wake .coast-label
 */
(function () {
  const ART = window.ART;

  const LAND = 'M1140 -30 C 1170 260 1220 520 1300 890 C 1368 776 1408 656 1478 500 C 1570 300 1700 110 1880 -30 Z';
  const ISLANDS = [
    [620, 700, 15], [760, 822, 11], [902, 758, 8], [498, 862, 10],
    [880, 962, 13], [1048, 832, 7], [402, 618, 7], [1118, 980, 9], [700, 960, 6],
  ];

  ART.coast = {
    build(el) {
      el.innerHTML = `
        <g class="coast-grid">
          <line x1="120" y1="0" x2="120" y2="1080" /><line x1="480" y1="0" x2="480" y2="1080" />
          <line x1="840" y1="0" x2="840" y2="1080" /><line x1="1200" y1="0" x2="1200" y2="1080" />
          <line x1="1560" y1="0" x2="1560" y2="1080" />
          <line x1="0" y1="240" x2="1920" y2="240" /><line x1="0" y1="540" x2="1920" y2="540" />
          <line x1="0" y1="840" x2="1920" y2="840" />
        </g>
        <path class="coast-land" d="${LAND}" />
        <g class="coast-isles">${ISLANDS.map(([x, y, r]) => `<circle class="coast-island" cx="${x}" cy="${y}" r="${r}" />`).join('')}</g>
        <text class="coast-label" x="1380" y="620">辽东半岛</text>
        <g class="coast-port">
          <line x1="300" y1="990" x2="1250" y2="952" stroke="rgba(238,246,251,0.45)" stroke-width="5" />
          <path d="M700 990 L700 846 L800 846 L800 872 L716 872" />
          <path d="M980 976 L980 868 L1062 868 L1062 892 L994 892" />
          <line x1="300" y1="1012" x2="1250" y2="974" stroke="rgba(238,246,251,0.18)" stroke-width="3" />
        </g>
        <g class="coast-ship">
          <g class="coast-ship-inner">
            <path d="M-96 0 L96 0 L74 34 L-74 34 Z" />
            <rect x="-30" y="-34" width="66" height="34" rx="4" />
            <line x1="-30" y1="-52" x2="-30" y2="-34" stroke="rgba(238,246,251,0.6)" stroke-width="4" />
          </g>
          <path class="coast-wake" d="M-140 40 L-320 44 M-140 52 L-280 58" />
        </g>
        <g class="coast-tip">
          <circle class="coast-tip-ring" cx="1300" cy="836" r="24" fill="none" stroke="rgba(255,180,84,0.9)" stroke-width="3" />
          <circle class="coast-tip-ring-2" cx="1300" cy="836" r="18" fill="none" stroke="rgba(255,214,150,0.75)" stroke-width="2" />
          <path class="coast-pin" d="M1300 900 C 1284 872 1270 856 1270 838 A 30 30 0 1 1 1330 838 C 1330 856 1316 872 1300 900 Z" />
          <circle cx="1300" cy="838" r="9" fill="rgba(4,18,28,0.75)" />
          <text class="coast-tip-name" x="1236" y="862" text-anchor="end">大连</text>
          <text class="coast-tip-sub" x="1236" y="900" text-anchor="end">DALIAN</text>
        </g>`;

      const shipInner = el.querySelector('.coast-ship-inner');
      const ship = el.querySelector('.coast-ship');
      const wake = el.querySelector('.coast-wake');
      // the ship sails in from the south-west toward the tip
      ship.setAttribute('transform', 'translate(560 1010)');
      wake.setAttribute('opacity', '0');

      return {
        ship, wake,
        animate(t) {
          shipInner.setAttribute('transform',
            `translate(0 ${ART.f(3.2 * Math.sin(t * 1.15))}) rotate(${ART.f(1.6 * Math.sin(t * 0.9 + 1))})`);
        },
      };
    },
  };
})();
