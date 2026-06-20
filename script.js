// ===== Palette (light theme matching Logo blues) =====
const C = { primary: [0, 119, 182], light: [0, 180, 216], accent: [72, 202, 228], dark: [10, 22, 40] };

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.classList.add('active');
});
document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));

// ===== Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => { navLinks.classList.toggle('active'); });
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('active')));

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Fade-in Observer =====
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 60);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.service-card, .ai-card, .tech-card, .benefit-card, .gallery-item, .looking-for, .contact-info, .contact-visual').forEach(el => {
  el.classList.add('fade-in');
  fadeObs.observe(el);
});

// ===== Counter =====
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const target = parseInt(num.dataset.target);
        const start = performance.now();
        const anim = now => { const p = Math.min((now - start) / 2000, 1); num.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(anim); };
        requestAnimationFrame(anim);
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const stats = document.querySelector('.about-stats');
if (stats) counterObs.observe(stats);

// ===== Tilt =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== HERO CANVAS (BOLD & VISIBLE) =====
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouse = { x: -1000, y: -1000 };

  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  // More particles, bigger
  for (let i = 0; i < 120; i++) particles.push({
    x: Math.random() * 2000, y: Math.random() * 1200,
    vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
    size: Math.random() * 3 + 1.5,
    pulse: Math.random() * Math.PI * 2
  });

  // Shooting stars
  let shootingStars = [];
  function spawnStar() {
    shootingStars.push({
      x: Math.random() * w, y: 0,
      vx: (Math.random() - 0.3) * 4, vy: Math.random() * 3 + 2,
      life: 1, decay: 0.008 + Math.random() * 0.006
    });
  }
  setInterval(spawnStar, 800);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;

    // Bold gradient background blobs
    const blob1 = ctx.createRadialGradient(w * 0.7 + Math.sin(t * 0.3) * 100, h * 0.3 + Math.cos(t * 0.4) * 60, 0, w * 0.6, h * 0.4, w * 0.45);
    blob1.addColorStop(0, 'rgba(0, 180, 216, 0.12)');
    blob1.addColorStop(0.6, 'rgba(0, 119, 182, 0.06)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = blob1; ctx.fillRect(0, 0, w, h);

    const blob2 = ctx.createRadialGradient(w * 0.2 + Math.cos(t * 0.25) * 80, h * 0.7 + Math.sin(t * 0.35) * 50, 0, w * 0.3, h * 0.6, w * 0.35);
    blob2.addColorStop(0, 'rgba(72, 202, 228, 0.1)');
    blob2.addColorStop(0.6, 'rgba(0, 150, 199, 0.04)');
    blob2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = blob2; ctx.fillRect(0, 0, w, h);

    // Animated grid (more visible)
    ctx.strokeStyle = 'rgba(0, 119, 182, 0.06)';
    ctx.lineWidth = 0.8;
    const gs = 60, off = (t * 8) % gs;
    for (let x = -gs + off; x < w + gs; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = -gs + off; y < h + gs; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Particles with connections
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.sqrt(dx * dx + dy * dy);
      // Strong mouse repulsion
      if (dist < 200) { p.x -= dx * 0.03; p.y -= dy * 0.03; }

      const pulseSize = p.size + Math.sin(t * 3 + p.pulse) * 0.8;
      ctx.beginPath(); ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
      const alpha = dist < 200 ? 0.7 : 0.35;
      ctx.fillStyle = `rgba(0, 150, 199, ${alpha})`;
      ctx.fill();

      // Glow around particles near mouse
      if (dist < 200) {
        ctx.beginPath(); ctx.arc(p.x, p.y, pulseSize + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${0.15 * (1 - dist / 200)})`;
        ctx.fill();
      }

      // Connection lines (thicker, more visible)
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j], d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 150) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 180, 216, ${0.2 * (1 - d / 150)})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    });

    // Large rotating hexagons (much bigger & brighter)
    for (let i = 0; i < 6; i++) {
      const hx = w * (0.5 + 0.3 * Math.cos(t * 0.15 + i * 1.05));
      const hy = h * (0.5 + 0.3 * Math.sin(t * 0.2 + i * 1.05));
      const size = 40 + i * 15 + Math.sin(t * 0.5 + i) * 10;
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const angle = (Math.PI / 3) * s + t * (0.2 + i * 0.05);
        const px = hx + size * Math.cos(angle), py = hy + size * Math.sin(angle);
        s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 119, 182, ${0.15 + Math.sin(t + i) * 0.06})`;
      ctx.lineWidth = 1.5; ctx.stroke();
      // Inner hexagon
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const angle = (Math.PI / 3) * s - t * 0.1;
        const px = hx + size * 0.5 * Math.cos(angle), py = hy + size * 0.5 * Math.sin(angle);
        s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(72, 202, 228, ${0.1 + Math.sin(t * 1.5 + i) * 0.04})`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Shooting stars
    shootingStars.forEach((star, idx) => {
      star.x += star.vx;
      star.y += star.vy;
      star.life -= star.decay;
      if (star.life <= 0) { shootingStars.splice(idx, 1); return; }
      const len = 30;
      const grad = ctx.createLinearGradient(star.x, star.y, star.x - star.vx * len * 0.3, star.y - star.vy * len * 0.3);
      grad.addColorStop(0, `rgba(0, 180, 216, ${star.life * 0.6})`);
      grad.addColorStop(1, `rgba(0, 180, 216, 0)`);
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(star.x - star.vx * 8, star.y - star.vy * 8);
      ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke();
      // Head glow
      ctx.beginPath(); ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.life * 0.8})`; ctx.fill();
    });

    // Pulsing concentric circles (radar effect)
    const radarX = w * 0.75, radarY = h * 0.4;
    for (let i = 0; i < 4; i++) {
      const radius = ((t * 40 + i * 50) % 200);
      const alpha = 0.15 * (1 - radius / 200);
      ctx.beginPath(); ctx.arc(radarX, radarY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 180, 216, ${alpha})`;
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    // Bright flowing light beams
    for (let i = 0; i < 3; i++) {
      const beamX = (t * (80 + i * 30) + i * 400) % (w + 400) - 200;
      const beamY = h * (0.2 + i * 0.3);
      const grad2 = ctx.createLinearGradient(beamX - 120, beamY, beamX + 120, beamY);
      grad2.addColorStop(0, 'rgba(0, 180, 216, 0)');
      grad2.addColorStop(0.3, `rgba(0, 180, 216, ${0.12 + i * 0.03})`);
      grad2.addColorStop(0.5, `rgba(72, 202, 228, ${0.18 + i * 0.03})`);
      grad2.addColorStop(0.7, `rgba(0, 180, 216, ${0.12 + i * 0.03})`);
      grad2.addColorStop(1, 'rgba(0, 180, 216, 0)');
      ctx.strokeStyle = grad2; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(beamX - 120, beamY); ctx.lineTo(beamX + 120, beamY); ctx.stroke();
    }

    // Large glowing orbs
    for (let i = 0; i < 3; i++) {
      const ox = w * (0.2 + i * 0.3) + Math.sin(t * 0.4 + i * 2) * 100;
      const oy = h * (0.3 + (i % 2) * 0.35) + Math.cos(t * 0.3 + i) * 70;
      const grad3 = ctx.createRadialGradient(ox, oy, 0, ox, oy, 100 + i * 30);
      grad3.addColorStop(0, `rgba(0, 180, 216, ${0.1 + Math.sin(t + i) * 0.03})`);
      grad3.addColorStop(0.5, `rgba(0, 119, 182, ${0.04})`);
      grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad3; ctx.beginPath(); ctx.arc(ox, oy, 100 + i * 30, 0, Math.PI * 2); ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== ABOUT CANVAS =====
(function() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#071e3d'); bg.addColorStop(1, '#0a1628');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    // DNA helix
    for (let x = 0; x < w; x += 3) {
      const p = x / w;
      const y1 = h / 2 + Math.sin(x * 0.018 + t * 1.8) * (70 * (0.4 + p * 0.5));
      const y2 = h / 2 - Math.sin(x * 0.018 + t * 1.8) * (70 * (0.4 + p * 0.5));
      ctx.beginPath(); ctx.arc(x, y1, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 180, 216, ${0.2 + p * 0.4})`; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y2, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(72, 202, 228, ${0.2 + p * 0.4})`; ctx.fill();
      if (x % 28 === 0) {
        ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2);
        ctx.strokeStyle = `rgba(144, 224, 239, ${0.08 + Math.sin(t + x * 0.01) * 0.04})`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
    }

    // Pulse circles
    for (let i = 0; i < 6; i++) {
      const cx = w * (0.12 + (i / 6) * 0.76) + Math.sin(t + i * 0.8) * 10;
      const cy = h * (0.2 + (i % 2) * 0.55) + Math.cos(t * 0.5 + i) * 12;
      const pulse = ((t * 0.8 + i * 0.5) % 2.5) / 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, 6 + pulse * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 180, 216, ${0.25 * (1 - pulse)})`;
      ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 180, 216, 0.5)`; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== PROJECT CANVASES =====
document.querySelectorAll('.project-canvas').forEach(canvas => {
  const ctx = canvas.getContext('2d');
  const theme = canvas.dataset.theme;
  let w, h;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#071e3d'); bg.addColorStop(1, '#0a1628');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    if (theme === 'circuit') {
      const gs = 20;
      for (let i = 0; i < 10; i++) {
        const sx = Math.floor(Math.sin(i * 1.3) * w * 0.3 + w * 0.5);
        const sy = Math.floor(Math.cos(i * 1.7) * h * 0.3 + h * 0.5);
        ctx.beginPath(); ctx.moveTo(sx, sy);
        let cx2 = sx, cy2 = sy;
        for (let j = 0; j < 5; j++) { j % 2 === 0 ? cx2 += gs * (j % 3 === 0 ? 1 : -1) : cy2 += gs * (j % 3 === 0 ? 1 : -1); ctx.lineTo(cx2, cy2); }
        ctx.strokeStyle = `rgba(0, 180, 216, ${0.25 + Math.sin(t + i) * 0.1})`; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx2, cy2, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(72, 202, 228, ${0.6 + Math.sin(t * 3 + i) * 0.3})`; ctx.fill();
      }
      const px = (t * 70) % (w + 60) - 30;
      const g = ctx.createRadialGradient(px, h / 2, 0, px, h / 2, 40);
      g.addColorStop(0, 'rgba(0,180,216,0.15)'); g.addColorStop(1, 'rgba(0,180,216,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } else if (theme === 'wave') {
      for (let wave = 0; wave < 5; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) { const y = h / 2 + Math.sin(x * 0.025 + t * (1 + wave * 0.2) + wave) * (22 - wave * 3); x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.strokeStyle = `rgba(0, 180, 216, ${0.3 - wave * 0.04})`; ctx.lineWidth = 1.3 - wave * 0.2; ctx.stroke();
      }
      for (let i = 0; i < 20; i++) { const bx = (w / 20) * i + 4, bh = 6 + Math.abs(Math.sin(t * 2 + i * 0.4)) * 30; ctx.fillStyle = `rgba(72, 202, 228, ${0.12 + Math.sin(t + i) * 0.06})`; ctx.fillRect(bx, h - bh - 6, 3, bh); }
    } else if (theme === 'network') {
      const nodes = [];
      for (let i = 0; i < 14; i++) nodes.push({ x: w * (0.1 + (i % 5) * 0.2) + Math.sin(t + i) * 7, y: h * (0.2 + Math.floor(i / 5) * 0.28) + Math.cos(t * 0.7 + i) * 5, s: 3 + Math.sin(t * 2 + i) * 1 });
      nodes.forEach((n, i) => { nodes.forEach((n2, j) => { if (j <= i) return; const d = Math.hypot(n.x - n2.x, n.y - n2.y); if (d < 80) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n2.x, n2.y); ctx.strokeStyle = `rgba(0, 180, 216, ${0.2 * (1 - d / 80)})`; ctx.lineWidth = 0.7; ctx.stroke(); } }); ctx.beginPath(); ctx.arc(n.x, n.y, n.s, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 180, 216, 0.5)'; ctx.fill(); });
    } else if (theme === 'particles') {
      for (let i = 0; i < 60; i++) { const angle = (i / 60) * Math.PI * 7 + t * 0.4; const r = 12 + i * 1.2; const px = w / 2 + Math.cos(angle) * r, py = h / 2 + Math.sin(angle) * r * 0.5; ctx.beginPath(); ctx.arc(px, py, 1 + Math.sin(t * 3 + i * 0.2) * 0.4, 0, Math.PI * 2); ctx.fillStyle = `rgba(72, 202, 228, ${0.2 + (i / 60) * 0.4})`; ctx.fill(); }
      for (let ring = 0; ring < 3; ring++) { ctx.beginPath(); ctx.ellipse(w / 2, h / 2, 40 + ring * 22, 20 + ring * 11, t * 0.12 + ring * 0.5, 0, Math.PI * 2); ctx.strokeStyle = `rgba(0, 180, 216, ${0.12 - ring * 0.02})`; ctx.lineWidth = 0.7; ctx.stroke(); }
      const cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 30); cg.addColorStop(0, 'rgba(0,180,216,0.2)'); cg.addColorStop(1, 'rgba(0,180,216,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(w / 2, h / 2, 30, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
});

// ===== TECH ORBIT =====
(function() {
  const canvas = document.getElementById('techOrbitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  const items = ['Spring Cloud', 'NodeJS', 'Redis', 'Kafka', 'Vue', 'React', 'Docker', 'ELK', 'Grafana', 'Cassandra', 'Jenkins', 'K8s'];

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    const cx = w / 2, cy = h / 2;

    for (let i = 1; i <= 3; i++) {
      const rx = 50 + i * 45, ry = 25 + i * 22;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 119, 182, ${0.06 + i * 0.02})`; ctx.setLineDash([4, 4]); ctx.lineWidth = 0.8; ctx.stroke(); ctx.setLineDash([]);
    }

    items.forEach((item, i) => {
      const ring = Math.floor(i / 4) + 1;
      const rx = 50 + ring * 45, ry = 25 + ring * 22;
      const angle = (i / 4) * Math.PI * 2 + t * (0.25 - ring * 0.04);
      const px = cx + rx * Math.cos(angle), py = cy + ry * Math.sin(angle);
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 119, 182, ${0.5 + Math.sin(t * 2 + i) * 0.2})`; ctx.fill();
      ctx.font = '9px Inter, sans-serif'; ctx.fillStyle = `rgba(90, 111, 128, ${0.6 + Math.sin(t + i) * 0.2})`; ctx.textAlign = 'center'; ctx.fillText(item, px, py + 14);
    });

    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    cg.addColorStop(0, 'rgba(0, 119, 182, 0.08)'); cg.addColorStop(1, 'rgba(0, 119, 182, 0)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== CONTACT CANVAS =====
(function() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#071e3d'); bg.addColorStop(1, '#0a1628');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    // Globe-like arcs
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60 + i * 12, 40 + i * 8, t * 0.1 + i * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 180, 216, ${0.08 + Math.sin(t + i) * 0.03})`; ctx.lineWidth = 0.8; ctx.stroke();
    }
    // Connection dots
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + t * 0.3;
      const r = 50 + (i % 3) * 25;
      const px = cx + r * Math.cos(angle), py = cy + r * 0.6 * Math.sin(angle);
      ctx.beginPath(); ctx.arc(px, py, 2 + Math.sin(t * 2 + i) * 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(72, 202, 228, ${0.4 + Math.sin(t + i) * 0.2})`; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
