import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import landSource from '../../scripts/data/natural-earth-land.geojson?raw';

const width = 614;
const height = 539;
const centre = [width / 2, 254];
const radius = 197;
const latitude = 29;
const minimumVisible = 0.65;
const grid = geoGraticule10();
const sphere = { type: 'Sphere' };
const markets = [
  { label: 'UK', location: [-0.12, 51.5], offset: [-12, -15] },
  { label: 'EU', location: [12.5, 48.8], offset: [12, 15] },
  { label: 'INDIA', location: [77.1, 28.6], offset: [12, -9] }
];
const routes = {
  type: 'MultiLineString',
  coordinates: markets.slice(0, 2).map(market => [market.location, markets[2].location])
};

function enhanceGlobe(figure) {
  const visual = figure.querySelector('.network-visual');
  const canvas = figure.querySelector('[data-globe-canvas]');
  const still = figure.querySelector('[data-globe-still]');
  const toggle = figure.querySelector('[data-globe-toggle]');
  const context = canvas.getContext('2d');
  if (!context) return;

  const land = JSON.parse(landSource);
  const projection = geoOrthographic().translate(centre).scale(radius).precision(0.8);
  const path = geoPath(projection, context);
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motionPreference.matches;
  let inView = false;
  let longitude = 38;
  let previousFrame = 0;
  let nextFrame = 0;
  let animationFrame = 0;

  function drawCircle(x, y, size) {
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
  }

  function draw() {
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    context.clearRect(0, 0, width, height);
    projection.rotate([-longitude, -latitude]);

    drawCircle(...centre, radius + 23);
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
    drawCircle(...centre, radius);
    context.fillStyle = shade;
    context.fill();
    context.strokeStyle = '#788761';
    context.lineWidth = 1.2;
    context.stroke();

    context.beginPath();
    path(routes);
    context.strokeStyle = '#c8f45d';
    context.lineWidth = 1.8;
    context.stroke();

    context.font = '13px "IBM Plex Mono", monospace';
    context.textBaseline = 'middle';
    for (const market of markets) {
      if (geoDistance([longitude, latitude], market.location) > Math.PI / 2 - 0.08) continue;
      const [x, y] = projection(market.location);
      drawCircle(x, y, 10);
      context.fillStyle = '#c8f45d35';
      context.fill();
      drawCircle(x, y, 4);
      context.fillStyle = '#c8f45d';
      context.fill();
      context.textAlign = market.offset[0] < 0 ? 'right' : 'left';
      context.fillStyle = '#ecf5da';
      context.fillText(market.label, x + market.offset[0], y + market.offset[1]);
    }
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
    if (playing && inView && !document.hidden) {
      if (!animationFrame) animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      animationFrame = previousFrame = nextFrame = 0;
    }
  }

  function setPlaying(next) {
    playing = next;
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause globe rotation' : 'Play globe rotation');
    syncAnimation();
  }

  resize();
  canvas.hidden = false;
  still.hidden = true;
  toggle.hidden = false;
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
  activate.observe(figure.querySelector('.network-visual'));
}
