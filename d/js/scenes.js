/*
 * scenes.js — 대련, 참으로 멋진 여행.
 * One idea per beat; everything is positioned by cue labels, so re-timed narration moves the visuals with it.
 * Positions are always 'cNN', 'cNN+=x' or 'cNN-=x': GSAP silently appends an unknown label at the END of the
 * timeline, so a bare 'cNN+0.3' never runs — every relative position here keeps its '=' or '+=' form.
 * Rules kept: no Math.random / Date / timers, no standalone gsap.to, no CSS transitions, nothing from the network.
 */
Video.define((ctx) => {
  const { tl, cue, cues, scene, onFrame, rand, fitCanvas, stage, W, H, gsap } = ctx;
  const K = FXKit.install(ctx, { accent: '255,180,84' });
  // the camera is alive: a 2.4px handheld drift on every scene, so no hold is ever frozen
  K.handheld({ amp: 2.4 });

  /* ---------------------------------------------------------------- build: illustrations + text masks */

  const coast = ART.coast.build(document.querySelector('#s02 .coast'));
  const tram = ART.tram.build(document.querySelector('#s05 .tram'));
  const street = ART.street.build(document.querySelector('#s06 .street'));

  // every multi-line headline is wrapped, so each line can rise out of its own mask
  function maskRise(sel) {
    document.querySelectorAll(sel).forEach((h) => {
      const parts = h.innerHTML.split(/<br\s*\/?>/i);
      h.innerHTML = parts.map((p) => `<span class="ln"><span class="inner">${p}</span></span>`).join('');
    });
  }
  maskRise('#s01 .hook');
  maskRise('.serif-h');
  maskRise('#s11 .end-title');

  /* ---------------------------------------------------------------- build: procedural detail (deterministic) */

  const R = rand(90210);

  // s03 — the islands of the managed coast, inside the coastline svg (900×760 viewBox)
  const isles = document.querySelector('#s03 .isles');
  const ISLE_PTS = [
    [640, 300], [742, 246], [806, 344], [700, 420], [600, 388], [524, 300],
    [430, 250], [356, 330], [268, 288], [200, 380], [300, 470], [470, 486], [648, 520],
  ];
  ISLE_PTS.forEach(([x, y], i) => {
    const c = document.createElementNS(ART.NS, 'circle');
    c.setAttribute('class', 'isle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', String(5 + (i % 3) * 3));
    isles.appendChild(c);
  });
  gsap.set('#s03 .isle', { transformOrigin: '50% 50%', scale: 0, autoAlpha: 0 });

  // s04 — the stars of 성해광장, spread through the plaza ellipse (by index, not random)
  const plazaStars = document.querySelector('#s04 .plaza-stars');
  for (let i = 0; i < 26; i++) {
    const a = i * 2.39996;
    const k = Math.sqrt((i + 1) / 27);
    const c = document.createElementNS(ART.NS, 'circle');
    c.setAttribute('class', 'plaza-star');
    c.setAttribute('cx', (960 + 620 * k * Math.cos(a)).toFixed(1));
    c.setAttribute('cy', (880 + 96 * k * Math.sin(a)).toFixed(1));
    c.setAttribute('r', (3.4 + (i % 3) * 1.6).toFixed(1));
    plazaStars.appendChild(c);
  }
  gsap.set('#s04 .plaza-star', { transformOrigin: '50% 50%', scale: 0, autoAlpha: 0 });

  // s09 — the golden pebbles of 金石灘
  const pebbles = document.querySelector('#s09 .pebbles');
  for (let i = 0; i < 62; i++) {
    const c = document.createElementNS(ART.NS, 'ellipse');
    c.setAttribute('class', 'pebble');
    c.setAttribute('cx', (R() * 1920).toFixed(1));
    c.setAttribute('cy', (872 + R() * 190).toFixed(1));
    c.setAttribute('rx', (6 + R() * 13).toFixed(1));
    c.setAttribute('ry', (4 + R() * 8).toFixed(1));
    pebbles.appendChild(c);
  }

  // s10 — the chart grid
  const grid = document.querySelector('#s10 .dotgrid');
  for (let gx = 120; gx <= 1800; gx += 112) {
    for (let gy = 140; gy <= 980; gy += 112) {
      const c = document.createElementNS(ART.NS, 'circle');
      c.setAttribute('cx', gx);
      c.setAttribute('cy', gy);
      c.setAttribute('r', 2.6);
      grid.appendChild(c);
    }
  }

  /* ---------------------------------------------------------------- initial states (one clean move each) */

  gsap.set('#s01 .horizon', { scaleX: 0 });
  gsap.set('#s02 .cam', { transformOrigin: '0% 0%', x: 0, y: 0, scale: 1.04 });
  gsap.set('#s02 .coast-tip', { autoAlpha: 0 });
  gsap.set('#s02 .coast-port', { autoAlpha: 0 });
  gsap.set('#s02 .coast-tip-ring', { opacity: 0 });
  gsap.set('#s05 .tram-body', { x: -1180 });
  gsap.set('#s05 .win', { opacity: 0.18 });
  gsap.set(street.wins, { opacity: 0 });
  gsap.set('#s08 .plate-rim, #s08 .plate', { transformOrigin: '50% 50%', autoAlpha: 0, scale: 0.92 });
  gsap.set('#s08 .food', { transformOrigin: '50% 50%', autoAlpha: 0, scale: 0.68 });
  gsap.set('#s09 .winter', { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set('#s09 .hline', { y: 0 });
  gsap.set('#s09 .t2', { autoAlpha: 0, y: 16 });
  gsap.set('#s10 .plane', { autoAlpha: 0 });
  gsap.set('#s10 .pt', { transformOrigin: '50% 50%', scale: 0 });
  gsap.set('#s11 .horizon', { scaleX: 0 });
  gsap.set('#s07 .beam', { svgOrigin: '1108 276' });

  /* ---------------------------------------------------------------- scene ranges */

  scene('#s01', 0, cue('c02').start - 0.5);
  scene('#s02', cue('c02').start - 0.5, cue('c04').start - 0.5);
  scene('#s03', cue('c04').start - 0.5, cue('c06').start - 0.2);
  scene('#s04', cue('c06').start - 0.2, cue('c07').start - 0.45);
  scene('#s05', cue('c07').start - 0.45, cue('c08').start - 0.4);
  scene('#s06', cue('c08').start - 0.4, cue('c09').start - 0.5);
  scene('#s07', cue('c09').start - 0.5, cue('c10').start - 0.2);
  scene('#s08', cue('c10').start - 0.2, cue('c12').start - 0.5);
  scene('#s09', cue('c12').start - 0.5, cue('c14').start - 0.2);
  scene('#s10', cue('c14').start - 0.2, cue('c15').start - 0.5);
  scene('#s11', cue('c15').start - 0.5, null);

  /* ---------------------------------------------------------------- the signature cut: the horizon becomes a panel */

  function sweepCut(pos) {
    // explicit positions on every call: a chained .set()/.to() after a positioned tween lands at the END of the
    // timeline in GSAP 3.15 (the panel would cover the rest of the video).
    tl.fromTo('.sweep', { scaleY: 0, transformOrigin: '50% 100%' },
      { scaleY: 1, duration: 0.42, ease: 'expo.in', immediateRender: false }, `${pos}-=0.62`)
      .set('.sweep', { transformOrigin: '50% 0%' }, `${pos}-=0.2`)
      .to('.sweep', { scaleY: 0, duration: 0.5, ease: 'expo.out' }, `${pos}-=0.2`);
  }
  sweepCut('c06');
  sweepCut('c10');
  sweepCut('c14');

  /* ---------------------------------------------------------------- colour arc */

  const TINTS = [
    ['c01-=0.4', '#04121c'], ['c02-=0.4', '#062231'], ['c04-=0.4', '#0b2b3a'],
    ['c06-=0.4', '#3a2109'], ['c07-=0.4', '#14202c'], ['c08-=0.4', '#3a220c'],
    ['c09-=0.4', '#071019'], ['c10-=0.4', '#331d09'], ['c12-=0.4', '#20404a'],
    ['c13-=0.4', '#2c3d48'], ['c14-=0.4', '#081c2c'], ['c15-=0.4', '#061520'],
  ];
  TINTS.forEach(([pos, color]) => tl.to('.tint', { '--tint': color, duration: 1.1, ease: 'sine.inOut' }, pos));

  /* ================================================================ s01 · 훅 */

  tl.fromTo('#s01 .cam', { scale: 1 }, { scale: 1.055, duration: cue('c01').duration + 2.6, ease: 'none' }, 0);
  tl.fromTo('#s01 .horizon', { scaleX: 0 }, { scaleX: 1, duration: 1.15, ease: 'expo.inOut' }, 'c01-=0.35');
  tl.from('#s01 .hook .inner', { yPercent: 118, duration: 1.05, stagger: 0.14, ease: 'expo.out' }, 'c01+=0.05');
  tl.from('#s01 .hook-sub', { autoAlpha: 0, y: 14, duration: 0.7 }, 'c01+=0.75');
  K.glintOver('#s01 .hook em', cue('c01').when('时间') + 0.55, { text: '时间' });

  // out: the horizon rises out of frame, carrying the cut
  tl.to('#s01 .horizon', { y: -676, duration: 0.55, ease: 'power2.in' }, 'c02-=0.75');
  tl.to('#s01 .cam', { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 'c02-=0.62');

  /* ================================================================ s02 · 지도와 부동항 */

  tl.fromTo('#s02 .cam', { x: 0, y: 0, scale: 1.04 }, { x: -864, y: -486, scale: 1.45, duration: 6.4, ease: 'sine.inOut' }, 'c02-=0.4');
  tl.from('#s02 .map-text .kicker', { autoAlpha: 0, y: 16, duration: 0.6 }, 'c02-=0.3');
  tl.from('#s02 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c02-=0.2');
  tl.from('#s02 .map-text .sub', { autoAlpha: 0, y: 18, duration: 0.7 }, 'c02+=0.6');
  tl.fromTo('#s02 .coast-tip', { autoAlpha: 0, y: -46 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }, 'c02-=0.1');
  gsap.set('#s02 .coast-tip-ring-2', { opacity: 0 });
  tl.fromTo('#s02 .coast-tip-ring', { attr: { r: 18 }, opacity: 0.9 }, { attr: { r: 104 }, opacity: 0, duration: 1.3, ease: 'expo.out' }, 'c02+=0.25');
  tl.fromTo('#s02 .coast-tip-ring-2', { attr: { r: 18 }, opacity: 0.7 }, { attr: { r: 78 }, opacity: 0, duration: 1.1, ease: 'expo.out' }, 'c02+=0.55');

  // c03 — the ice-free port: pier and ship arrive
  tl.to('#s02 .coast-port', { autoAlpha: 1, duration: 1.0, ease: 'power2.out' }, 'c03-=0.3');
  tl.fromTo(coast.ship, { x: -120, y: 1030 }, { x: 560, y: 1010, duration: 3.6, ease: 'power1.out' }, 'c03-=0.25');
  tl.to(coast.wake, { opacity: 0.9, duration: 1.0 }, 'c03+=0.5');

  tl.to('#s02 .cam', { autoAlpha: 0, x: -950, duration: 0.55, ease: 'power2.in' }, 'c04-=0.5');

  /* ================================================================ s03 · 규모 */

  tl.from('#s03 .num-block', { autoAlpha: 0, x: -46, duration: 0.75, stagger: 0.16, ease: 'power3.out' }, 'c04-=0.45');
  K.drift('#s03 .cam', cue('c04').start - 0.4, cue('c06').start - 0.2, 1.035);
  K.rollTo('#s03 #popNum', cue('c04').start + 0.1, { from: 0, to: 745, dur: 1.5, sample: '745' });
  K.glintOver('#blk-pop .num', cue('c04').end - 0.15, { html: '745<span class="unit">万人</span>', dur: 0.9 });

  tl.from('#s03 .cl-line', { drawSVG: '0%', duration: 1.7, ease: 'power2.inOut' }, 'c05-=0.35');
  K.rollTo('#s03 #coastNum', cue('c05').when('1,900公里') + 0.15, { from: 0, to: 1900, dur: 1.6, sample: '1,900' });
  tl.to('#s03 .isle', { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.055, ease: 'back.out(2.2)' }, cue('c05').when('岛屿'));
  K.glintOver('#blk-coast .num', cue('c05').end - 0.1, { html: '1,900<span class="unit">km</span>', dur: 0.9 });

  /* ================================================================ s04 · 성해광장 */

  tl.fromTo('#s04 .cam', { x: 48 }, { x: -48, duration: cue('c06').duration + 1.6, ease: 'none' }, 'c06-=0.2');
  tl.from('#s04 .sun', { autoAlpha: 0, scale: 0.62, duration: 1.4, ease: 'power2.out' }, 'c06-=0.2');
  tl.to('#s04 .sun', { scale: 1.06, duration: 4.6, ease: 'sine.inOut' }, 'c06+=1.4');
  tl.from('#s04 .skyline', { autoAlpha: 0, y: 28, duration: 1.1, ease: 'power3.out' }, 'c06-=0.2');
  tl.fromTo('#s04 .hr', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.3, ease: 'expo.inOut' }, 'c06-=0.2');
  tl.from('#s04 .plaza', { drawSVG: '0%', duration: 1.5, ease: 'power2.inOut' }, 'c06+=0.55');
  tl.to('#s04 .plaza-star', { autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.05, ease: 'power2.out' }, cue('c06').when('星之海'));
  tl.from('#s04 .s04-text .kicker', { autoAlpha: 0, y: 16, duration: 0.6 }, 'c06+=0.2');
  tl.from('#s04 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c06+=0.35');
  tl.from('#s04 .s04-text .sub', { autoAlpha: 0, y: 18, duration: 0.7 }, 'c06+=1.1');

  tl.to('#s04 .cam', { autoAlpha: 0, x: -130, duration: 0.5, ease: 'power2.in' }, 'c07-=0.5');

  /* ================================================================ s05 · 노면전차 */

  tl.from('#s05 .rail', { drawSVG: '0%', duration: 1.3, ease: 'power2.inOut' }, 'c07-=0.4');
  tl.from('#s05 .tram-ties line', { autoAlpha: 0, duration: 0.6, stagger: 0.012 }, 'c07-=0.4');
  tl.fromTo('#s05 .tram-body', { x: -1180 }, { x: 0, duration: 2.7, ease: 'power2.out' }, 'c07-=0.3');
  tl.to('#s05 .win', { opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power2.out' }, 'c07-=0.1');
  tl.from('#s05 .s05-text .kicker', { autoAlpha: 0, y: 14, duration: 0.6 }, 'c07-=0.35');
  tl.from('#s05 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c07-=0.25');

  // the arrival: one impact, then it settles
  const arrival = cue('c07').start + 2.45;
  K.shake('#s05 .cam', arrival, { amp: 5, dur: 0.5, wiggles: 6 });
  K.flash(arrival, { peak: 0.1, dur: 0.35 });
  K.punch(arrival, 0.03);
  K.burst(960, 398, arrival, { kind: 'spark', n: 26, speed: 320, spread: 0.9, dir: Math.PI, life: 0.7, size: 3, g: 1400 });

  tl.to('#s05 .cam', { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 'c08-=0.45');

  /* ================================================================ s06 · 러시아 거리 */

  tl.fromTo('#s06 .cam', { x: 0 }, { x: -680, duration: cue('c08').duration + 0.6, ease: 'none' }, 'c08-=0.4');
  tl.to(street.wins, { opacity: 1, duration: 0.65, stagger: 0.055, ease: 'power2.out' }, cue('c08').when('每条街'));
  tl.from('#s06 .s06-text .kicker', { autoAlpha: 0, y: 16, duration: 0.6 }, 'c08-=0.35');
  tl.from('#s06 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c08-=0.25');
  tl.from('#s06 .s06-text .sub', { autoAlpha: 0, y: 18, duration: 0.7 }, 'c08+=0.7');

  tl.to('#s06 .cam', { autoAlpha: 0, x: -830, duration: 0.5, ease: 'power2.in' }, 'c09-=0.5');

  /* ================================================================ s07 · 뤼순 */

  tl.fromTo('#s07 .beam', { rotation: -26 }, { rotation: 14, duration: 2.6, ease: 'sine.inOut' }, 'c09-=0.45');
  tl.to('#s07 .beam', { rotation: -26, duration: 2.9, ease: 'sine.inOut' }, 'c09+=2.15');
  tl.from('#s07 .lh', { autoAlpha: 0, y: 26, duration: 0.95, ease: 'power3.out' }, 'c09-=0.4');
  tl.from('#s07 .pier rect', { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.09 }, 'c09-=0.15');
  tl.from('#s07 .cranes path', { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.14 }, 'c09+=0.1');
  tl.from('#s07 .reflect line', { autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 'c09+=0.4');
  tl.fromTo('#s07 .hr', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, 'c09-=0.35');
  tl.from('#s07 .s07-text .kicker', { autoAlpha: 0, y: 16, duration: 0.6 }, 'c09-=0.3');
  tl.from('#s07 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c09-=0.2');
  K.ring(1108, 700, 'c09+=0.35', { size: 2.4, dur: 1.5, flat: true, color: 'rgba(238,246,251,0.45)', width: 2 });

  /* ================================================================ s08 · 식탁 */

  tl.fromTo('#s08 .cam', { scale: 1.0 }, { scale: 1.06, duration: cue('c10').duration + cue('c11').duration + 0.8, ease: 'none' }, 'c10-=0.25');
  tl.to('#s08 .plate-rim, #s08 .plate', { autoAlpha: 1, scale: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out' }, 'c10-=0.15');
  tl.from('#s08 .s08-text .kicker', { autoAlpha: 0, y: 16, duration: 0.6 }, 'c10-=0.2');
  tl.from('#s08 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c10-=0.1');
  tl.to('#s08 .abalone', { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.9)' }, cue('c11').when('鲍鱼'));
  tl.to('#s08 .urchin', { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.9)' }, cue('c11').when('海胆'));
  tl.to('#s08 .scallop', { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.9)' }, cue('c11').when('扇贝'));

  tl.to('#s08 .cam', { autoAlpha: 0, scale: 1.12, duration: 0.5, ease: 'power2.in' }, 'c12-=0.5');

  /* ================================================================ s09 · 금석탄, 여름과 겨울 */

  tl.fromTo('#s09 .cam', { x: 34 }, { x: -34, duration: cue('c12').duration + cue('c13').duration + 1.2, ease: 'none' }, 'c12-=0.4');
  tl.from('#s09 .pebble', { autoAlpha: 0, duration: 0.9, stagger: 0.006 }, 'c12-=0.4');
  tl.from('#s09 .crowd *', { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.05 }, 'c12-=0.2');
  tl.from('#s09 .t1 .kicker', { autoAlpha: 0, y: 14, duration: 0.6 }, 'c12-=0.4');
  tl.from('#s09 .t1 .serif-h .inner', { yPercent: 118, duration: 1.0, stagger: 0.12, ease: 'expo.out' }, 'c12-=0.3');
  tl.from('#s09 .summer .fig-wrap', { autoAlpha: 0.2, duration: 0.9 }, 'c12-=0.45');

  // the season turns: the horizon line itself wipes the summer into the winter
  tl.to('#s09 .t1', { autoAlpha: 0, y: -18, duration: 0.4, ease: 'power2.in' }, 'c13-=0.5');
  tl.fromTo('#s09 .hline', { y: 0 }, { y: 523, duration: 1.2, ease: 'power2.inOut' }, 'c13-=0.5');
  tl.fromTo('#s09 .winter', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 'c13-=0.5');
  tl.fromTo('#s09 .walker', { x: 690 }, { x: 830, duration: 5.4, ease: 'none' }, 'c13-=0.55');
  tl.to('#s09 .t2', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'c13-=0.1');
  K.ring(700, 557, cue('c13').start - 0.5, { size: 2.8, dur: 1.7, flat: true, color: 'rgba(238,246,251,0.5)', width: 2 });

  /* ================================================================ s10 · 거리 */

  const arc = '#s10 .arc';
  const plane = { k: 0 };                      // the plane's progress along the arc (closed form, jsdom-safe)
  const P0 = [420, 780], CP = [950, 430], P1 = [1480, 420];
  tl.from(arc, { drawSVG: '0%', duration: 2.5, ease: 'power1.inOut' }, 'c14-=0.35');
  K.drift('#s10 .chart-wrap', cue('c14').start - 0.35, cue('c15').start, 1.035);
  tl.to('#s10 .plane', { autoAlpha: 1, duration: 0.3 }, 'c14-=0.35');
  tl.fromTo(plane, { k: 0 }, { k: 1, duration: 2.5, ease: 'power1.inOut', immediateRender: false }, 'c14-=0.35');
  tl.to('#s10 .pt', { scale: 1, duration: 0.55, stagger: 1.15, ease: 'back.out(2.4)' }, 'c14-=0.35');
  tl.from('#s10 .city-label', { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.5 }, 'c14-=0.1');
  tl.from('#s10 .hero', { autoAlpha: 0, y: 44, duration: 0.95, ease: 'expo.out' }, 'c14+=1.35');
  tl.from('#s10 .s10-text .sub', { autoAlpha: 0, y: 18, duration: 0.7 }, 'c14+=1.9');
  K.glintOver('#s10 .hero', cue('c14').start + 2.55, { text: '1个半小时', dur: 1.1 });

  tl.to('#s10 .cam', { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 'c15-=0.5');

  /* ================================================================ s11 · 엔드카드 */

  tl.fromTo('#s11 .cam', { scale: 1 }, { scale: 1.035, duration: 5.6, ease: 'none' }, 'c15-=0.5');
  tl.from('#s11 .end-title .inner', { yPercent: 116, duration: 1.15, stagger: 0.12, ease: 'expo.out' }, 'c15-=0.5');
  tl.fromTo('#s11 .horizon', { scaleX: 0 }, { scaleX: 1, duration: 1.25, ease: 'expo.inOut' }, 'c15+=0.25');
  tl.from('#s11 .end-sub', { autoAlpha: 0, y: 14, duration: 0.8 }, 'c15+=0.85');
  K.burst(960, 470, 'c15-=0.45', { kind: 'converge', n: 28, speed: 240, life: 1.3, size: 2.6, color: 'rgba(255,214,150,1)', area: 820, areaY: 220 });
  K.glintOver('#s11 .end-title', 'c15+=1.5', { text: '大连，真是一次美妙的旅行', dur: 1.3 });

  /* ================================================================ canvas: night sky, water light, steam, waves */

  const g2 = fitCanvas(document.getElementById('field'));
  const planeEl = document.querySelector('#s10 .plane');
  const stars = Array.from({ length: 120 }, () => ({ x: R() * W, y: R() * 300, r: 0.7 + R() * 1.7, ph: R() * 6.283 }));
  const glints = Array.from({ length: 86 }, () => ({ x: R() * W, y: 690 + R() * 380, r: 1 + R() * 2.6, ph: R() * 6.283, sp: 0.5 + R() * 1.6 }));
  const steams = Array.from({ length: 24 }, () => ({ x: 1060 + R() * 360, y: 300 + R() * 260, r: 16 + R() * 34, ph: R() * 6.283, sp: 0.16 + R() * 0.22 }));

  function drawStars(t) {
    g2.fillStyle = '#eef6fb';
    for (const s of stars) {
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.9 + s.ph));
      g2.globalAlpha = tw * 0.8;
      g2.beginPath();
      g2.arc(s.x, s.y, s.r, 0, 6.283);
      g2.fill();
    }
    g2.globalAlpha = 1;
  }

  function drawGlints(t) {
    g2.fillStyle = '#ffd79a';
    for (const s of glints) {
      const k = Math.abs(Math.sin(t * s.sp + s.ph));
      const w = 6 + 42 * k;
      g2.globalAlpha = 0.10 + 0.42 * k;
      g2.fillRect(s.x - w / 2, s.y, w, s.r + 1);
    }
    g2.globalAlpha = 1;
  }

  function drawSteam(t) {
    g2.fillStyle = '#f6e6cd';
    for (const s of steams) {
      const a = t * s.sp + s.ph;
      const rise = (a * 60) % 260;
      const k = 1 - rise / 260;
      g2.globalAlpha = 0.09 + 0.20 * k;
      g2.beginPath();
      g2.arc(s.x + Math.sin(a * 1.7) * 30, s.y - rise * 1.25, s.r * (0.7 + 0.9 * k), 0, 6.283);
      g2.fill();
    }
    g2.globalAlpha = 1;
  }

  function drawWaves(t, calm) {
    const rows = calm ? 2 : 4;
    for (let i = 0; i < rows; i++) {
      const y = 592 + i * (calm ? 74 : 66);
      const amp = calm ? 2.2 : 7 - i;
      const wid = calm ? 1500 : 900 + i * 240;
      const cx = 960 + 130 * Math.sin(t * 0.4 + i);
      g2.globalAlpha = calm ? 0.16 : 0.28;
      g2.strokeStyle = calm ? '#f2f6f8' : '#dff6f4';
      g2.lineWidth = calm ? 2 : 3;
      g2.beginPath();
      for (let x = cx - wid / 2; x <= cx + wid / 2; x += 18) {
        const yy = y + amp * Math.sin(x / 90 + t * (calm ? 0.5 : 1.3) + i);
        if (x === cx - wid / 2) g2.moveTo(x, yy); else g2.lineTo(x, yy);
      }
      g2.stroke();
    }
    g2.globalAlpha = 1;
  }

  onFrame((t) => {
    g2.clearRect(0, 0, W, H);

    // the plane rides the same quadratic curve the arc is drawn with (closed form of the tweened progress)
    const mk = 1 - plane.k;
    const px = mk * mk * P0[0] + 2 * mk * plane.k * CP[0] + plane.k * plane.k * P1[0];
    const py = mk * mk * P0[1] + 2 * mk * plane.k * CP[1] + plane.k * plane.k * P1[1];
    const dx = 2 * mk * (CP[0] - P0[0]) + 2 * plane.k * (P1[0] - CP[0]);
    const dy = 2 * mk * (CP[1] - P0[1]) + 2 * plane.k * (P1[1] - CP[1]);
    planeEl.setAttribute('transform',
      `translate(${ART.f(px)} ${ART.f(py)}) rotate(${ART.f(Math.atan2(dy, dx) * 57.29578 + 90)})`);

    // the night scenes (s01, s11) and the plaza's water at golden hour
    if (t < cue('c02').start - 0.3 || t > cue('c15').start - 0.7) {
      drawStars(t);
      drawGlints(t);
    }
    if (t > cue('c06').start - 0.8 && t < cue('c07').start - 0.2) {
      drawStars(t);
      drawGlints(t);
    }
    // steam over the table
    if (t > cue('c10').start - 0.5 && t < cue('c12').start - 0.4) drawSteam(t);
    // 金石灘: summer chop, then the winter calm
    if (t > cue('c12').start - 0.6 && t < cue('c14').start - 0.3) drawWaves(t, t > cue('c13').start - 0.3);

    // the illustration modules animate only while their scene is on screen
    if (t > cue('c02').start - 2 && t < cue('c04').start) coast.animate(t);
    if (t > cue('c07').start - 2 && t < cue('c08').start) tram.animate(t);
    if (t > cue('c08').start - 2 && t < cue('c09').start) street.animate(t);
  });
});
