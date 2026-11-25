import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import landSource from '../../scripts/data/natural-earth-land.geojson?raw';
import { india, tradeMarkets, tradeRoutes } from '../content/trade-markets.js';

const width = 614;
const height = 539;
const centre = [width / 2, 265];
const radius = 214;
const minimumVisible = 0.65;
const green = '#c8f45d';
const silver = '#becbd9';
const grid = geoGraticule10();
const sphere = { type: 'Sphere' };
const markets = [{ ...india, agreement: true }, ...tradeMarkets];
const agreementRoutes = tradeRoutes(tradeMarkets.filter(market => market.agreement));
const additionalRoutes = tradeRoutes(tradeMarkets.filter(market => !market.agreement));
const clampLatitude = value => Math.max(-85, Math.min(85, value));

function enhanceGlobe(figure) {
  const visual = figure.querySelector('[data-globe-surface]');
  const canvas = figure.querySelector('[data-globe-canvas]');
  const still = figure.querySelector('[data-globe-still]');
  const toggle = figure.querySelector('[data-globe-toggle]');
  const selector = figure.querySelector('[data-globe-market]');
  const context = canvas.getContext('2d');
  if (!context) return;

  const land = JSON.parse(landSource);
  const projection = geoOrthographic().translate(centre).scale(radius).precision(0.8);
  const path = geoPath(projection, context);
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motionPreference.matches;
  let inView = false;
  let longitude = 38;
  let latitude = 29;
  let selected;
  let drag;
  let resumeTimer = 0;
  let interactionFrame = 0;
  let previousFrame = 0;
  let nextFrame = 0;
  let animationFrame = 0;

  function circle(x, y, size) {
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
  }

  function drawRoutes(geometry, color, lineWidth, dashes = []) {
    context.beginPath();
    path(geometry);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.setLineDash(dashes);
    context.stroke();
    context.setLineDash([]);
  }

  function drawMarkets() {
    const visible = [];
    for (const market of markets) {
      if (geoDistance([longitude, latitude], market.location) > Math.PI / 2 - 0.04) continue;
      const [x, y] = projection(market.location);
      const primary = market === selected || market.name === india.name;
      if (primary) {
        circle(x, y, 9);
        context.fillStyle = market.agreement ? '#c8f45d40' : '#becbd940';
        context.fill();
      }
      circle(x, y, primary ? 4 : 2.4);
      context.fillStyle = market.agreement ? green : silver;
      context.fill();
      if (primary || market.featured) visible.push({ market, x, y, primary });
    }

    // Give the selected market and India priority when labels would overlap.
    visible.sort((a, b) => Number(b.market === selected) - Number(a.market === selected) || Number(b.primary) - Number(a.primary));
    context.font = '12px "IBM Plex Mono", monospace';
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    context.fillStyle = '#ecf5da';
    const labels = [];
    for (const { market, x, y } of visible) {
      const textWidth = context.measureText(market.label).width;
      const left = x + 9 + textWidth > width - 12 ? x - 9 - textWidth : x + 9;
      const top = y - 10;
      if (labels.some(label => Math.abs(label.top - top) < 15 && left < label.right + 8 && left + textWidth > label.left - 8)) continue;
      context.fillText(market.label, left, top);
      labels.push({ left, right: left + textWidth, top });
    }
  }

  function draw() {
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    context.clearRect(0, 0, width, height);
    projection.rotate([-longitude, -latitude]);

    circle(...centre, radius + 23);
    context.setLineDash([2, 7]);
    context.lineWidth = 1;
    context.strokeStyle = '#536245';
    context.stroke();
    context.setLineDash([]);

    context.beginPath();
    path(sphere);
    context.fillStyle = '#1a251b';
    context.fill();

    context.beginPath();
    path(land);
    context.fillStyle = '#3d512f';
    context.fill();
    context.strokeStyle = '#9aaf7b';
    context.lineWidth = 0.75;
    context.stroke();

    context.beginPath();
    path(grid);
    context.strokeStyle = '#a8ca6e30';
    context.stroke();

    const shade = context.createRadialGradient(244, 183, 30, ...centre, radius);
    shade.addColorStop(0, '#c8f45d15');
    shade.addColorStop(0.68, '#10111405');
    shade.addColorStop(1, '#101114b0');
    circle(...centre, radius);
    context.fillStyle = shade;
    context.fill();
    context.strokeStyle = '#788761';
    context.lineWidth = 1.2;
    context.stroke();

    drawRoutes(additionalRoutes, '#becbd970', 1.2, [3, 4]);
    drawRoutes(agreementRoutes, '#c8f45d69', 1.25);
    if (selected && selected.name !== india.name) {
      drawRoutes(tradeRoutes([selected]), selected.agreement ? green : silver, 2.1);
    }
    drawMarkets();
  }

  function resize() {
    const bounds = visual.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    draw();
  }

  function animate(time) {
    if (time >= nextFrame) {
      if (previousFrame) longitude = (longitude + Math.min(time - previousFrame, 100) * 0.008) % 360;
      previousFrame = time;
      const started = performance.now();
      draw();
      nextFrame = time + Math.max(1000 / 30, (performance.now() - started) * 3);
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    if (playing && !drag && !resumeTimer && inView && !document.hidden) {
      if (!animationFrame) animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousFrame = 0;
      nextFrame = 0;
    }
  }

  function setPlaying(next) {
    playing = next;
    if (next) {
      clearTimeout(resumeTimer);
      resumeTimer = 0;
    }
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause globe rotation' : 'Play globe rotation');
    syncAnimation();
  }

  function resumeAfter(delay) {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      resumeTimer = 0;
      syncAnimation();
    }, delay);
    syncAnimation();
  }

  function queueDraw() {
    if (interactionFrame) return;
    interactionFrame = requestAnimationFrame(() => {
      interactionFrame = 0;
      draw();
    });
  }

  visual.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    visual.setPointerCapture(event.pointerId);
    visual.focus({ preventScroll: true });
    syncAnimation();
  });

  visual.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const degreesPerPixel = 360 / Math.max(visual.clientWidth, 1);
    longitude = (longitude + (drag.x - event.clientX) * degreesPerPixel) % 360;
    latitude = clampLatitude(latitude + (event.clientY - drag.y) * degreesPerPixel);
    drag.x = event.clientX;
    drag.y = event.clientY;
    queueDraw();
  });

  function endDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    drag = undefined;
    resumeAfter(1100);
  }
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    visual.addEventListener(type, endDrag);
  }

  const arrowSteps = { ArrowLeft: [12, 0], ArrowRight: [-12, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] };
  visual.addEventListener('keydown', event => {
    const step = arrowSteps[event.key];
    if (!step) return;
    event.preventDefault();
    longitude = (longitude + step[0]) % 360;
    latitude = clampLatitude(latitude + step[1]);
    resumeAfter(1100);
    queueDraw();
  });

  selector.addEventListener('change', () => {
    selected = markets.find(market => market.name === selector.value);
    if (selected) {
      [longitude, latitude] = selected.location;
      resumeAfter(2600);
    }
    queueDraw();
  });

  resize();
  canvas.hidden = false;
  still.hidden = true;
  visual.tabIndex = 0;
  visual.setAttribute('aria-label', 'India trade globe, use the arrow keys to rotate');
  figure.querySelector('[data-globe-help]').hidden = false;
  figure.querySelector('[data-globe-controls]').hidden = false;
  setPlaying(playing);
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= minimumVisible;
    syncAnimation();
  }, { threshold: minimumVisible });
  visibility.observe(visual);
  const sizing = new ResizeObserver(resize);
  sizing.observe(visual);
  toggle.addEventListener('click', () => setPlaying(!playing));
  document.addEventListener('visibilitychange', syncAnimation);
  motionPreference.addEventListener('change', event => {
    if (event.matches) setPlaying(false);
  });
  document.fonts.ready.then(draw);
}

const figure = document.querySelector('[data-trade-globe]');
if (figure && 'IntersectionObserver' in window && 'ResizeObserver' in window) {
  const activate = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio < minimumVisible) return;
    activate.disconnect();
    enhanceGlobe(figure);
  }, { threshold: minimumVisible });
  activate.observe(figure.querySelector('[data-globe-surface]'));
}
