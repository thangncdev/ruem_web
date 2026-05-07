(function () {
  var canvas = document.getElementById('stars-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, stars = [], particles = [], galaxyDust = [], shootingStar = null, nextShootAt = 0, t = 0;

  function theme() { return window.SkyTheme && window.SkyTheme.current; }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    reinit();
  }

  function reinit() {
    initStars();
    initParticles();
    initGalaxyDust();
  }

  function initStars() {
    stars = [];
    var th = theme();
    var layers = th ? th.canvas.starLayers : [
      { count: 70, rMin: .12, rMax: .4,  aMax: .4,  spd: .0008 },
      { count: 80, rMin: .28, rMax: .75, aMax: .62, spd: .0014 },
      { count: 40, rMin: .5,  rMax: 1.2, aMax: .82, spd: .0024 },
    ];
    layers.forEach(function (l) {
      for (var i = 0; i < l.count; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: l.rMin + Math.random() * (l.rMax - l.rMin),
          baseA: l.aMax * (.4 + Math.random() * .6),
          phase: Math.random() * Math.PI * 2,
          spd: l.spd * (.7 + Math.random() * .6),
          glint: false,
        });
      }
    });
    // Mark top 10 brightest stars for cross-glint
    stars.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, 10).forEach(function (s) { s.glint = true; });
  }

  function initParticles() {
    particles = [];
    var th = theme();
    if (!th || !th.canvas.particleCount) return;
    for (var i = 0; i < th.canvas.particleCount; i++) particles.push(mkParticle(true));
  }

  function mkParticle(scatter) {
    var th = theme();
    var colors = (th && th.canvas.particleColors) || [[255, 255, 255]];
    var color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * W,
      y: scatter ? Math.random() * H : Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 0.3 + Math.random() * 0.5,
      color: color,
      alpha: 0,
      target: 0.25 + Math.random() * 0.4,
      fadeIn: true,
      fadeSpd: 0.003 + Math.random() * 0.005,
      life: Math.random() * 300,
      maxLife: 450 + Math.random() * 350,
    };
  }

  function initGalaxyDust() {
    galaxyDust = [];
    var angle = -Math.PI / 5.2;
    var cos = Math.cos(angle), sin = Math.sin(angle);
    var cx = W * 0.5, cy = H * 0.42;
    var bandW = W * 1.5, bandH = 130;
    for (var i = 0; i < 90; i++) {
      var lx = (Math.random() - 0.5) * bandW;
      var ly = (Math.random() - 0.5) * bandH * 0.72;
      galaxyDust.push({
        x: cx + lx * cos - ly * sin,
        y: cy + lx * sin + ly * cos,
        r: 0.25 + Math.random() * 0.55,
        a: 0.08 + Math.random() * 0.3,
      });
    }
  }

  function drawGalaxy() {
    var th = theme();
    if (!th || !th.canvas.galaxyEnabled) return;
    ctx.save();
    var cx = W * 0.5, cy = H * 0.42;
    var angle = -Math.PI / 5.2;
    var bandW = W * 1.5, bandH = 130;
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    var g = ctx.createLinearGradient(0, -bandH / 2, 0, bandH / 2);
    g.addColorStop(0,   'rgba(170,195,255,0)');
    g.addColorStop(0.3, 'rgba(155,180,240,0.05)');
    g.addColorStop(0.5, 'rgba(175,200,255,0.08)');
    g.addColorStop(0.7, 'rgba(155,180,240,0.05)');
    g.addColorStop(1,   'rgba(170,195,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-bandW / 2, -bandH / 2, bandW, bandH);
    ctx.restore();
    // Draw pre-computed dust stars
    galaxyDust.forEach(function (d) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,215,255,' + d.a + ')';
      ctx.fill();
    });
  }

  function drawStars() {
    stars.forEach(function (s) {
      var a = s.baseA * (.55 + .45 * Math.sin(s.phase + t * s.spd));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,218,240,' + a + ')';
      ctx.fill();
      if (s.glint && a > 0.3) {
        var len = s.r * 4.5;
        var ga = a * 0.45;
        ctx.strokeStyle = 'rgba(220,235,255,' + ga + ')';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len); ctx.stroke();
      }
    });
  }

  function drawParticles() {
    var th = theme();
    if (!th || !th.canvas.particleCount) return;
    particles.forEach(function (p, i) {
      // Brownian drift
      p.vx += (Math.random() - 0.5) * 0.03;
      p.vy += (Math.random() - 0.5) * 0.03;
      p.vx = Math.max(-0.55, Math.min(0.55, p.vx));
      p.vy = Math.max(-0.55, Math.min(0.55, p.vy));
      p.x += p.vx; p.y += p.vy;
      // Wrap edges
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
      // Fade lifecycle
      p.life++;
      var halfLife = p.maxLife * 0.5;
      if (p.life < halfLife) {
        p.alpha = Math.min(p.alpha + p.fadeSpd, p.target);
      } else {
        p.alpha = Math.max(0, p.alpha - p.fadeSpd * 0.5);
      }
      if (p.life >= p.maxLife) {
        particles[i] = mkParticle(true);
        return;
      }
      if (p.alpha <= 0) return;
      var r = p.color[0], g = p.color[1], b = p.color[2];
      var glowR = p.r * 6;
      var grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
      grd.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + p.alpha + ')');
      grd.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
      ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + p.alpha + ')';
      ctx.fill();
    });
  }

  function spawnShoot() {
    var angle = Math.PI / 6 + Math.random() * (Math.PI / 9);
    var spd = 5 + Math.random() * 4;
    shootingStar = {
      x: Math.random() * W * .65, y: Math.random() * H * .28,
      vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
      life: 0, maxLife: 65 + Math.random() * 15,
      tailLen: 70 + Math.random() * 60,
    };
  }

  function scheduleShoot() {
    nextShootAt = t + (18 + Math.random() * 17) * 60;
  }

  function drawShoot() {
    var th = theme();
    if (!th || !th.canvas.shootEnabled) return;
    if (!shootingStar) return;
    var s = shootingStar;
    s.x += s.vx; s.y += s.vy; s.life++;
    var p = s.life / s.maxLife;
    var ease = p < .5 ? p * 2 : 1 - (p - .5) * 2;
    var alpha = ease * .85;
    var dist = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
    var tx = s.x - s.vx * (s.tailLen / dist);
    var ty = s.y - s.vy * (s.tailLen / dist);
    var g2 = ctx.createLinearGradient(tx, ty, s.x, s.y);
    g2.addColorStop(0,  'rgba(200,218,240,0)');
    g2.addColorStop(.7, 'rgba(200,218,240,' + alpha * .28 + ')');
    g2.addColorStop(1,  'rgba(220,235,255,' + alpha + ')');
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = g2; ctx.lineWidth = 1.4; ctx.stroke();
    var hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
    hg.addColorStop(0, 'rgba(235,245,255,' + alpha + ')');
    hg.addColorStop(1, 'rgba(200,218,240,0)');
    ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = hg; ctx.fill();
    if (s.life >= s.maxLife) shootingStar = null;
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGalaxy();
    drawStars();
    drawParticles();
    var th = theme();
    if (th && th.canvas.shootEnabled) {
      if (t >= nextShootAt) { if (!shootingStar) spawnShoot(); scheduleShoot(); }
    }
    drawShoot();
    t++; requestAnimationFrame(loop);
  }

  window._starsReinit = reinit;
  window.addEventListener('resize', resize);
  resize(); scheduleShoot(); loop();
})();
