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
document.querySelectorAll('.service-card, .ai-card, .tech-card, .benefit-card, .culture-card, .looking-for, .contact-info, .contact-steps').forEach(el => {
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

// ===== HERO CANVAS (Software Industry Orbit Style) =====
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  // Software industry keywords for orbiting
  const rings = [
    { items: ['Microservices', 'High Availability', 'Load Balancing', 'API Gateway', 'CI/CD', 'Kubernetes'], speed: 0.18, radiusX: 0.2, radiusY: 0.12 },
    { items: ['Redis', 'Kafka', 'Docker', 'Spring Cloud', 'NodeJS', 'Cassandra', 'ClickHouse', 'MySQL'], speed: -0.12, radiusX: 0.28, radiusY: 0.16 },
    { items: ['Vue', 'React', 'Grafana', 'Prometheus', 'ELK', 'Jenkins', 'SonarQube', 'Git', 'Agile', 'BDD'], speed: 0.08, radiusX: 0.35, radiusY: 0.2 }
  ];

  // Floating particles for depth
  const particles = [];
  for (let i = 0; i < 50; i++) particles.push({
    x: Math.random(), y: Math.random(),
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.0003 + 0.0001,
    offset: Math.random() * Math.PI * 2
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    const cx = w * 0.75, cy = h * 0.5;

    // Subtle gradient blobs in background
    const blob1 = ctx.createRadialGradient(cx + Math.sin(t * 0.2) * 50, cy + Math.cos(t * 0.3) * 30, 0, cx, cy, w * 0.4);
    blob1.addColorStop(0, 'rgba(0, 180, 216, 0.03)');
    blob1.addColorStop(0.5, 'rgba(0, 119, 182, 0.015)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = blob1; ctx.fillRect(0, 0, w, h);

    // Floating background particles
    particles.forEach(p => {
      const px = p.x * w + Math.sin(t * 0.5 + p.offset) * 20;
      const py = p.y * h + Math.cos(t * 0.3 + p.offset) * 15;
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 150, 199, ${0.08 + Math.sin(t * 2 + p.offset) * 0.04})`;
      ctx.fill();
    });

    // Draw orbit rings (dashed ellipses)
    rings.forEach((ring, ri) => {
      const rx = w * ring.radiusX, ry = h * ring.radiusY;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.1 * (ri - 1), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 119, 182, ${0.04 + ri * 0.01})`;
      ctx.setLineDash([5, 5]); ctx.lineWidth = 0.6; ctx.stroke(); ctx.setLineDash([]);
    });

    // Draw orbiting items
    rings.forEach((ring, ri) => {
      const rx = w * ring.radiusX, ry = h * ring.radiusY;
      const tilt = 0.1 * (ri - 1);

      ring.items.forEach((item, i) => {
        const angle = (i / ring.items.length) * Math.PI * 2 + t * ring.speed;
        // Apply tilt rotation
        const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
        const rawX = rx * Math.cos(angle), rawY = ry * Math.sin(angle);
        const px = cx + rawX * cosT - rawY * sinT;
        const py = cy + rawX * sinT + rawY * cosT;

        // Depth effect: items in "back" of orbit are dimmer
        const depth = Math.sin(angle);
        const alpha = 0.2 + depth * 0.15;
        const dotSize = 2.5 + depth * 1;

        // Dot
        ctx.beginPath(); ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 119, 182, ${alpha + Math.sin(t * 2 + i) * 0.05})`;
        ctx.fill();

        // Glow
        ctx.beginPath(); ctx.arc(px, py, dotSize + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${alpha * 0.1})`;
        ctx.fill();

        // Label
        ctx.font = `${8 + depth * 1.5}px Inter, sans-serif`;
        ctx.fillStyle = `rgba(90, 111, 128, ${alpha * 0.7})`;
        ctx.textAlign = 'center';
        ctx.fillText(item, px, py + dotSize + 12);
      });
    });

    // Center glow
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
    cg.addColorStop(0, 'rgba(0, 119, 182, 0.1)');
    cg.addColorStop(0.5, 'rgba(0, 180, 216, 0.04)');
    cg.addColorStop(1, 'rgba(0, 119, 182, 0)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill();

    // Center label
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(0, 119, 182, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('St.Win', cx, cy + 4);

    // Pulsing rings from center
    for (let i = 0; i < 3; i++) {
      const pulse = ((t * 0.6 + i * 1.2) % 3.6) / 3.6;
      const pr = 20 + pulse * 60;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 180, 216, ${0.12 * (1 - pulse)})`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Connection lines between nearby items across rings (subtle)
    const allPoints = [];
    rings.forEach((ring, ri) => {
      const rx = w * ring.radiusX, ry = h * ring.radiusY;
      const tilt = 0.1 * (ri - 1);
      ring.items.forEach((item, i) => {
        const angle = (i / ring.items.length) * Math.PI * 2 + t * ring.speed;
        const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
        const rawX = rx * Math.cos(angle), rawY = ry * Math.sin(angle);
        allPoints.push({ x: cx + rawX * cosT - rawY * sinT, y: cy + rawX * sinT + rawY * cosT });
      });
    });
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        const d = Math.hypot(allPoints[i].x - allPoints[j].x, allPoints[i].y - allPoints[j].y);
        if (d < 80) {
          ctx.beginPath(); ctx.moveTo(allPoints[i].x, allPoints[i].y); ctx.lineTo(allPoints[j].x, allPoints[j].y);
          ctx.strokeStyle = `rgba(0, 180, 216, ${0.04 * (1 - d / 80)})`;
          ctx.lineWidth = 0.4; ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== ABOUT CANVAS (Code Typing - Company Values) =====
(function() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  const lines = [
    '// St.Win Core Values',
    'const company = {',
    '  name: "聖勝科技",',
    '  since: 2016,',
    '  philosophy: "以人為本",',
    '  teams: ["TW", "Overseas"],',
    '};',
    '',
    'const engineer = {',
    '  role: "Define architecture",',
    '  tools: ["Cursor", "Claude"],',
    '  focus: [',
    '    "System design",',
    '    "Harness engineering",',
    '    "Code review",',
    '  ],',
    '};',
    '',
    '// AI handles implementation',
    'const ai = await agent.build({',
    '  spec: engineer.design(),',
    '  constraints: harness,',
    '});',
  ];

  const totalChars = lines.join('\n').length;
  const typingSpeed = 14;

  function tokenize(text) {
    const tokens = [];
    if (/^\s*\/\//.test(text)) { tokens.push({ text, color: 'rgba(90, 140, 120, 0.8)' }); return tokens; }
    let i = 0;
    while (i < text.length) {
      if (text[i] === '"' || text[i] === "'") {
        const q = text[i]; let end = text.indexOf(q, i + 1);
        if (end === -1) end = text.length - 1;
        tokens.push({ text: text.substring(i, end + 1), color: 'rgba(206, 145, 120, 0.9)' });
        i = end + 1;
      } else if (/[a-zA-Z_]/.test(text[i])) {
        let end = i; while (end < text.length && /[\w]/.test(text[end])) end++;
        const word = text.substring(i, end);
        const kw = ['const','let','var','async','await','function','return','if','new','import','export'];
        if (kw.includes(word)) tokens.push({ text: word, color: 'rgba(86, 156, 214, 0.95)' });
        else if (/^\d+$/.test(word)) tokens.push({ text: word, color: 'rgba(181, 206, 168, 0.9)' });
        else tokens.push({ text: word, color: 'rgba(212, 212, 212, 0.75)' });
        i = end;
      } else {
        tokens.push({ text: text[i], color: 'rgba(212, 212, 212, 0.6)' }); i++;
      }
    }
    return tokens.length ? tokens : [{ text, color: 'rgba(212, 212, 212, 0.7)' }];
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;

    // Dark IDE background
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0d1b2a'); bg.addColorStop(1, '#0a1628');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    // Gutter
    ctx.fillStyle = 'rgba(0, 119, 182, 0.05)';
    ctx.fillRect(0, 0, 28, h);

    const fontSize = Math.max(9, Math.min(11, w * 0.022));
    const lineHeight = fontSize * 1.65;
    const startY = 14;
    const startX = 34;

    const cycleTime = totalChars / typingSpeed + 3;
    const elapsed = t % cycleTime;
    const charsToShow = Math.min(Math.floor(elapsed * typingSpeed), totalChars);

    let charCount = 0;
    ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', 'Courier New', monospace`;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const y = startY + i * lineHeight;
      if (y > h - 5) break;

      ctx.fillStyle = 'rgba(90, 111, 128, 0.3)';
      ctx.textAlign = 'right';
      ctx.fillText(String(i + 1), 22, y);
      ctx.textAlign = 'left';

      if (charCount >= charsToShow) break;

      const lineCharsAvailable = charsToShow - charCount;
      const visibleText = line.substring(0, Math.min(line.length, lineCharsAvailable));
      charCount += line.length + 1;

      const tokens = tokenize(visibleText);
      let xPos = startX;
      tokens.forEach(token => {
        ctx.fillStyle = token.color;
        ctx.fillText(token.text, xPos, y);
        xPos += ctx.measureText(token.text).width;
      });

      if (lineCharsAvailable <= line.length && lineCharsAvailable > 0) {
        if (Math.floor(t * 2.5) % 2 === 0) {
          ctx.fillStyle = 'rgba(0, 180, 216, 0.8)';
          ctx.fillRect(xPos + 1, y - fontSize + 2, 2, fontSize);
        }
      }
    }

    // Subtle scan line
    const scanY = (t * 25) % h;
    ctx.fillStyle = 'rgba(0, 180, 216, 0.015)';
    ctx.fillRect(0, scanY, w, 2);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== PROJECT CANVASES (Code Typing Effect) =====
document.querySelectorAll('.project-canvas').forEach(canvas => {
  const ctx = canvas.getContext('2d');
  const theme = canvas.dataset.theme;
  let w, h;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  // Code snippets for each card theme
  const codeSnippets = {
    circuit: [
      '// AI Agent Workflow',
      'const agent = new CursorAgent({',
      '  model: "claude-sonnet",',
      '  harness: requireSpec,',
      '});',
      '',
      'const result = await agent.implement({',
      '  spec: architectDoc,',
      '  constraints: harnessRules,',
      '  tests: bddScenarios,',
      '});',
      '',
      'await codeReview(result);',
    ],
    wave: [
      '// Harness Quality Gate',
      'pipeline {',
      '  stage("Lint")  { sh "sonar-scan" }',
      '  stage("Test")  { sh "npm run bdd" }',
      '  stage("Review") {',
      '    requireApprovals(2)',
      '    checkCoverage(">80%")',
      '  }',
      '  stage("Deploy") {',
      '    if (allGatesPassed) deploy()',
      '  }',
      '}',
    ],
    network: [
      '// Distributed Architecture',
      '@Service',
      'class OrderService {',
      '  @Autowired kafka: KafkaTemplate',
      '  @Autowired redis: RedisClient',
      '',
      '  async placeOrder(req: Order) {',
      '    await redis.lock(req.id);',
      '    kafka.send("order.created", req);',
      '    return { status: "queued" };',
      '  }',
      '}',
    ],
    particles: [
      '// Team Collaboration',
      'const workflow = {',
      '  tools: ["Cursor", "Claude", "Git"],',
      '  practices: [',
      '    "Daily standup",',
      '    "Harness sharing",',
      '    "Cross-team review",',
      '  ],',
      '  subscription: "AI Pro",',
      '  iterate: () => sprint.next(),',
      '};',
      'workflow.iterate();',
    ]
  };

  const lines = codeSnippets[theme] || codeSnippets.circuit;
  const totalChars = lines.join('\n').length;
  const typingSpeed = 18; // chars per second

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;

    // Dark IDE background
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0d1b2a'); bg.addColorStop(1, '#0a1628');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    // Subtle line numbers gutter
    ctx.fillStyle = 'rgba(0, 119, 182, 0.06)';
    ctx.fillRect(0, 0, 28, h);

    const fontSize = Math.max(9, Math.min(11, w * 0.025));
    const lineHeight = fontSize * 1.7;
    const startY = 12;
    const startX = 34;

    // Calculate how many chars to show (looping typewriter)
    const cycleTime = totalChars / typingSpeed + 2; // +2s pause at end
    const elapsed = t % cycleTime;
    const charsToShow = Math.min(Math.floor(elapsed * typingSpeed), totalChars);

    let charCount = 0;
    ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', 'Courier New', monospace`;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const y = startY + i * lineHeight;
      if (y > h - 5) break;

      // Line number
      ctx.fillStyle = 'rgba(90, 111, 128, 0.3)';
      ctx.textAlign = 'right';
      ctx.fillText(String(i + 1), 22, y);
      ctx.textAlign = 'left';

      if (charCount >= charsToShow) break;

      const lineCharsAvailable = charsToShow - charCount;
      const visibleText = line.substring(0, Math.min(line.length, lineCharsAvailable));
      charCount += line.length + 1; // +1 for newline

      // Syntax highlighting
      const tokens = tokenize(visibleText);
      let xPos = startX;
      tokens.forEach(token => {
        ctx.fillStyle = token.color;
        ctx.fillText(token.text, xPos, y);
        xPos += ctx.measureText(token.text).width;
      });

      // Blinking cursor at end of current typing line
      if (lineCharsAvailable <= line.length && lineCharsAvailable > 0) {
        if (Math.floor(t * 2.5) % 2 === 0) {
          ctx.fillStyle = 'rgba(0, 180, 216, 0.8)';
          ctx.fillRect(xPos + 1, y - fontSize + 2, 2, fontSize);
        }
      }
    }

    // Subtle scan line effect
    const scanY = (t * 30) % h;
    ctx.fillStyle = 'rgba(0, 180, 216, 0.02)';
    ctx.fillRect(0, scanY, w, 2);

    requestAnimationFrame(draw);
  }

  // Simple syntax highlighting
  function tokenize(text) {
    const tokens = [];
    const keywords = /\b(const|let|var|async|await|function|return|if|class|new|import|export|stage|def|for)\b/g;
    const types = /\b(string|number|boolean|void|Order|Service|KafkaTemplate|RedisClient)\b/g;
    const comments = /^(\s*\/\/.*)/;
    const strings = /("[^"]*"|'[^']*'|`[^`]*`)/g;
    const decorators = /(@\w+)/g;

    if (comments.test(text)) {
      tokens.push({ text, color: 'rgba(90, 140, 120, 0.8)' });
      return tokens;
    }

    let remaining = text;
    let result = [];
    // Simple approach: color the whole line by segments
    let i = 0;
    while (i < remaining.length) {
      let matched = false;

      // Check for strings
      if (remaining[i] === '"' || remaining[i] === "'") {
        const quote = remaining[i];
        let end = remaining.indexOf(quote, i + 1);
        if (end === -1) end = remaining.length - 1;
        result.push({ text: remaining.substring(i, end + 1), color: 'rgba(206, 145, 120, 0.9)' });
        i = end + 1; matched = true;
      }
      // Check for decorators
      else if (remaining[i] === '@') {
        let end = i + 1;
        while (end < remaining.length && /\w/.test(remaining[end])) end++;
        result.push({ text: remaining.substring(i, end), color: 'rgba(220, 180, 80, 0.9)' });
        i = end; matched = true;
      }
      // Check for keywords
      else if (/[a-zA-Z_]/.test(remaining[i])) {
        let end = i;
        while (end < remaining.length && /[\w]/.test(remaining[end])) end++;
        const word = remaining.substring(i, end);
        const kwList = ['const','let','var','async','await','function','return','if','class','new','import','export','stage','def','for','require','pipeline'];
        const typeList = ['string','number','boolean','void','Order','Service','KafkaTemplate','RedisClient','CursorAgent','OrderService'];
        if (kwList.includes(word)) {
          result.push({ text: word, color: 'rgba(86, 156, 214, 0.95)' });
        } else if (typeList.includes(word)) {
          result.push({ text: word, color: 'rgba(78, 201, 176, 0.9)' });
        } else {
          result.push({ text: word, color: 'rgba(212, 212, 212, 0.75)' });
        }
        i = end; matched = true;
      }

      if (!matched) {
        // Punctuation and operators
        result.push({ text: remaining[i], color: 'rgba(212, 212, 212, 0.6)' });
        i++;
      }
    }
    return result.length ? result : [{ text, color: 'rgba(212, 212, 212, 0.7)' }];
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

// ===== Scroll Progress Bar =====
(function() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#0077b6,#00b4d8,#48cae4);z-index:10001;transition:width 0.1s linear;width:0;pointer-events:none;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (scrolled * 100) + '%';
  });
})();

// ===== Section Title Character Reveal =====
(function() {
  const titles = document.querySelectorAll('.section-top h2');
  titles.forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';
    title.dataset.revealed = 'false';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.cssText = `display:inline-block;opacity:0;transform:translateY(12px);transition:opacity 0.4s ease ${i * 30}ms, transform 0.4s ease ${i * 30}ms;`;
      title.appendChild(span);
    });
  });
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.dataset.revealed === 'false') {
        entry.target.dataset.revealed = 'true';
        entry.target.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; });
      }
    });
  }, { threshold: 0.3 });
  titles.forEach(t => titleObs.observe(t));
})();

// ===== Magnetic Button Hover =====
(function() {
  const btns = document.querySelectorAll('.hero-cta, .nav-cta, .btn-contact');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

// ===== Staggered Card Entrance (alternating directions) =====
(function() {
  const cards = document.querySelectorAll('.service-card, .ai-card, .benefit-card');
  cards.forEach((card, i) => {
    const dir = i % 2 === 0 ? -30 : 30;
    card.style.opacity = '0';
    card.style.transform = `translateX(${dir}px)`;
    card.style.transition = `opacity 0.6s ease ${(i % 3) * 100}ms, transform 0.6s ease ${(i % 3) * 100}ms`;
  });
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => cardObs.observe(c));
})();

// ===== Counter Particle Burst =====
(function() {
  const statsSection = document.querySelector('.about-stats');
  if (!statsSection) return;
  let hasBurst = false;
  const burstObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasBurst) {
        hasBurst = true;
        setTimeout(() => {
          entry.target.querySelectorAll('.stat-num').forEach(num => {
            const rect = num.getBoundingClientRect();
            for (let i = 0; i < 8; i++) {
              const particle = document.createElement('div');
              const angle = (i / 8) * Math.PI * 2;
              const dist = 20 + Math.random() * 25;
              particle.style.cssText = `position:fixed;left:${rect.left + rect.width/2}px;top:${rect.top + rect.height/2}px;width:4px;height:4px;border-radius:50%;background:#00b4d8;pointer-events:none;z-index:9999;opacity:1;transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94);`;
              document.body.appendChild(particle);
              requestAnimationFrame(() => {
                particle.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
                particle.style.opacity = '0';
              });
              setTimeout(() => particle.remove(), 900);
            }
          });
        }, 2000); // after counter finishes
      }
    });
  }, { threshold: 0.5 });
  burstObs.observe(statsSection);
})();

// ===== CONTACT CANVAS (removed - replaced with step cards) =====
