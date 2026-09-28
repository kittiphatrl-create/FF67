/**
 * First Fantasy 67 — Turn-Based Web Game & Player Controller
 * Features:
 * 1. Top-Down Field Exploration (Cloud Strife WASD Player Controller)
 * 2. Tactical Turn-Based Battle System (Final Fantasy VII / Tactics Style)
 * 3. Elemental Weakness Matrix (Fire > Earth > Thunder > Water > Fire: 2.0x Damage!)
 * 4. Web Audio SFX (Spells, Slashes, & Victory Fanfare)
 * 5. Dynamic Canvas Rendering & VFX
 */

// ================= 1. Web Audio SFX Synthesizer =================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.1, vol = 0.1, freqRamp = null) {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (freqRamp) {
        osc.frequency.exponentialRampToValueAtTime(freqRamp, this.ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playStep() {
    this.playTone(130, 'triangle', 0.04, 0.03, 40);
  }

  playSlash() {
    this.playTone(350, 'sawtooth', 0.14, 0.1, 80);
  }

  playHit() {
    this.playTone(180, 'square', 0.12, 0.12, 30);
  }

  playWeaknessHit() {
    // 2x Damage Critical Chime
    if (!this.enabled) return;
    this.init();
    [587.33, 880, 1174.66, 1760].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, 0.12);
      }, idx * 45);
    });
  }

  playFire() {
    this.playTone(280, 'sawtooth', 0.25, 0.14, 90);
  }

  playWater() {
    this.playTone(600, 'sine', 0.22, 0.15, 200);
  }

  playThunder() {
    this.playTone(450, 'square', 0.25, 0.15, 50);
  }

  playEarth() {
    this.playTone(120, 'triangle', 0.3, 0.2, 30);
  }

  playHeal() {
    if (!this.enabled) return;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.08), idx * 60);
    });
  }


  playCoin() {
    this.playTone(987.77, 'sine', 0.08, 0.08);
    setTimeout(() => this.playTone(1318.51, 'sine', 0.15, 0.09), 60);
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'square', 0.12, 0.1), idx * 75);
    });
  }

  playBossAlarm() {
    if (!this.enabled) return;
    this.init();
    [300, 450, 300, 450].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.15, 0.12), idx * 120);
    });
  }

  playVictoryFanfare() {
    // Classic Final Fantasy Victory Fanfare (du-du-du-dun dun dun-du-dun!)
    if (!this.enabled) return;
    this.init();
    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.32 },
      { f: 415.30, d: 0.32 }, // G#4
      { f: 466.16, d: 0.32 }, // A#4
      { f: 523.25, d: 0.20 }, // C5
      { f: 466.16, d: 0.15 }, // A#4
      { f: 523.25, d: 0.60 }  // C5
    ];
    let time = 0;
    notes.forEach(n => {
      setTimeout(() => {
        this.playTone(n.f, 'square', n.d, 0.1);
      }, time * 1000);
      time += n.d + 0.03;
    });
  }

  playDungeonDescend() {
    if (!this.enabled) return;
    this.init();
    const notes = [659.25, 523.25, 392.00, 261.63];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sine', 0.18, 0.12), idx * 110);
    });
  }

  playRewardCard() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.15, 0.09), idx * 70);
    });
  }

  playFullHeal() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sine', 0.22, 0.1), idx * 80);
    });
  }

  playEquip() {
    if (!this.enabled) return;
    this.init();
    this.playTone(520, 'triangle', 0.08, 0.08);
    setTimeout(() => this.playTone(780, 'sine', 0.12, 0.1), 45);
  }

  playChest() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'square', 0.14, 0.09), idx * 80);
    });
  }

  playOpenMenu() {
    if (!this.enabled) return;
    this.init();
    this.playTone(440, 'sine', 0.07, 0.06);
    setTimeout(() => this.playTone(660, 'triangle', 0.09, 0.07), 40);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    this.playTone(160, 'sawtooth', 0.15, 0.1);
  }
}

const sfx = new SoundEngine();

// ================= 2. Elemental Weakness System =================
// Matrix: Attacker Element -> Defender Element -> Multiplier
const ELEMENT_MULTIPLIERS = {
  fire:    { earth: 2.0, water: 0.5, fire: 0.5, thunder: 1.0 },
  earth:   { thunder: 2.0, fire: 0.5, earth: 0.5, water: 1.0 },
  thunder: { water: 2.0, earth: 0.5, thunder: 0.5, fire: 1.0 },
  water:   { fire: 2.0, thunder: 0.5, water: 0.5, earth: 1.0 },
  none:    { fire: 1.0, earth: 1.0, thunder: 1.0, water: 1.0 }
};

// ================= 3. Floating Damage & Particle VFX =================
const _badgeWidthCache = {};

class FloatingText {
  constructor(text, x, y, color = '#ffffff', isCrit = false, badgeText = '') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.targetY = y - 30;
    this.color = color;
    this.isCrit = isCrit;
    this.badgeText = badgeText;
    this.alpha = 1;
    this.age = 0;
    // Snappy, readable lifespan: ~70 frames (1.1s) — avoids text congestion & lag
    this.maxLife = isCrit ? 78 : 64;
    this.scale = isCrit ? 1.4 : 1.1;
    this.currentScale = 0.4;
  }

  update() {
    this.age++;
    // Quick pop-up bounce in first 8 frames
    if (this.age <= 8) {
      const p = this.age / 8;
      this.currentScale = 0.4 + (this.scale - 0.4) * (1 - Math.pow(1 - p, 3));
      this.y += (this.targetY - this.y) * 0.3;
    } else if (this.age < this.maxLife - 18) {
      // Gentle linger float upward
      this.y -= 0.22;
      const targetScale = this.isCrit ? 1.25 : 1.0;
      this.currentScale += (targetScale - this.currentScale) * 0.08;
    } else {
      // Smooth fade out over final 18 frames
      this.y -= 0.45;
      this.alpha = Math.max(0, (this.maxLife - this.age) / 18);
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.textAlign = 'center';

    // 1. Draw Badge (💥 CRITICAL! ติดคริ! / ⚡ 2x WEAKNESS! ชนะทาง!) if present
    if (this.badgeText) {
      const badgeFontSize = Math.round(11 * (this.isCrit ? 1.15 : 1.0));
      ctx.font = `bold ${badgeFontSize}px 'Outfit', sans-serif`;
      
      const badgeY = this.y - (18 * this.currentScale);
      if (_badgeWidthCache[this.badgeText] === undefined) {
        _badgeWidthCache[this.badgeText] = ctx.measureText(this.badgeText).width;
      }
      const textWidth = _badgeWidthCache[this.badgeText];
      const padX = 8;
      const padY = 3;

      // Badge pill background (crisp, no blur for peak 60 FPS)
      ctx.fillStyle = this.isCrit ? 'rgba(220, 38, 38, 0.95)' : 'rgba(217, 119, 6, 0.95)';
      ctx.strokeStyle = this.isCrit ? '#fca5a5' : '#fef08a';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      const bx = this.x - textWidth / 2 - padX;
      const by = badgeY - badgeFontSize - padY;
      const bw = textWidth + padX * 2;
      const bh = badgeFontSize + padY * 2 + 2;
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, bw, bh, 6);
      } else {
        ctx.rect(bx, by, bw, bh);
      }
      ctx.fill();
      ctx.stroke();

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(this.badgeText, this.x, badgeY - 1);
    }

    // 2. Draw Main Damage Number
    const fontSize = Math.round((this.isCrit ? 26 : 20) * this.currentScale);
    ctx.font = `900 ${fontSize}px 'JetBrains Mono', 'Press Start 2P', monospace`;
    ctx.shadowBlur = 0;

    // Crisp Dark Outline (3px for maximum performance, no heavy blur)
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);

    // Inner bright text
    ctx.fillStyle = this.isCrit ? '#ff4d4d' : this.color;
    ctx.fillText(this.text, this.x, this.y);

    ctx.restore();
  }
}

class CombatParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.animatedSprites = [];
  }

  addText(text, x, y, color = '#ffffff', isCrit = false, badgeText = '') {
    // Cap active floating texts to 6 max: accelerate older texts so screen doesn't lag or clutter
    if (this.floatingTexts.length >= 6) {
      for (let i = 0; i < this.floatingTexts.length - 4; i++) {
        const old = this.floatingTexts[i];
        if (old.age < old.maxLife - 12) {
          old.age = old.maxLife - 12;
        }
      }
    }
    // Stagger y slightly if overlapping with a recent floating text
    let finalY = y;
    for (const t of this.floatingTexts) {
      if (Math.abs(t.x - x) < 32 && Math.abs(t.y - finalY) < 22) {
        finalY -= 22;
      }
    }
    this.floatingTexts.push(new FloatingText(text, x, finalY, color, isCrit, badgeText));
  }

  addAnimatedSprite(type, x, y, size = 120, fps = 28) {
    const assets = window.vfxAssets;
    if (!assets) return;
    const config = {
      hit: { img: assets.weaponHit, cols: 6, frames: 16 },
      fire: { img: assets.fire, cols: 8, frames: 24 },
      freeze: { img: assets.freeze, cols: 10, frames: 25 },
      magic: { img: assets.magic, cols: 9, frames: 24 }
    }[type];
    if (config && config.img && config.img.complete && config.img.naturalWidth > 0) {
      this.animatedSprites.push({
        img: config.img,
        cols: config.cols,
        totalFrames: config.frames,
        x, y, size,
        startTime: performance.now(),
        frameDuration: 1000 / fps
      });
    }
  }

  addBurst(x, y, color, count = 14, speed = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * speed + 1;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0.03
      });
    }
  }

  addDust(x, y) {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + 16,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 0.5 - 0.2,
        radius: Math.random() * 3 + 2,
        color: 'rgba(203, 213, 225, 0.6)',
        alpha: 1,
        life: 0.04
      });
    }
  }

  addSlashArc(x, y, startAngle, endAngle, radius = 42, color = '#38bdf8', lineWidth = 6) {
    this.particles.push({
      type: 'slashArc',
      x, y,
      startAngle, endAngle,
      radius,
      color,
      lineWidth,
      alpha: 1.0,
      life: 0.09
    });
  }

  addShockwave(x, y, maxRadius = 55, color = 'rgba(251, 191, 36, 0.85)') {
    this.particles.push({
      type: 'shockwave',
      x, y,
      radius: 6,
      maxRadius,
      color,
      alpha: 1.0,
      life: 0.06
    });
  }

  update() {
    const now = performance.now();
    for (let i = this.animatedSprites.length - 1; i >= 0; i--) {
      const s = this.animatedSprites[i];
      const frame = Math.floor((now - s.startTime) / s.frameDuration);
      if (frame >= s.totalFrames) {
        this.animatedSprites.splice(i, 1);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.vx) p.x += p.vx;
      if (p.vy) p.y += p.vy;
      p.alpha -= p.life;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.update();
      if (t.alpha <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  draw(ctx) {
    const now = performance.now();
    this.animatedSprites.forEach(s => {
      const frame = Math.floor((now - s.startTime) / s.frameDuration);
      if (frame < s.totalFrames) {
        const col = frame % s.cols;
        const row = Math.floor(frame / s.cols);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          s.img,
          col * 100, row * 100, 100, 100,
          Math.round(s.x - s.size / 2), Math.round(s.y - s.size / 2),
          s.size, s.size
        );
        ctx.restore();
      }
    });

    // Batch draw particles without per-particle save/restore for performance
    this.particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.alpha);
      if (p.type === 'slashArc') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.lineWidth * p.alpha;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, p.startAngle, p.endAngle);
        ctx.stroke();
      } else if (p.type === 'shockwave') {
        p.radius += (p.maxRadius - p.radius) * 0.28;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3 * p.alpha;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(Math.round(p.x), Math.round(p.y), p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    this.floatingTexts.forEach(t => t.draw(ctx));
  }
}

// ================= 4. Cloud Strife & Character Sprites =================
class CloudSpriteRenderer {
  constructor() {
    this.materiaPulse = 0;
  }

  px(ctx, color, x, y, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  // Draw the high-detail Legendary Buster Sword
  drawBusterSword(ctx, x, y, angle, scale = 1, isSlashing = false) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    if (isSlashing) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-10, -12, 20, 52);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(-8, -10, 16, 48);
      ctx.restore();
    }

    // 1. Pommel: Faceted silver pommel ring
    this.px(ctx, '#334155', -4, -31, 8, 4);
    this.px(ctx, '#94a3b8', -3, -30, 6, 2);
    this.px(ctx, '#f8fafc', -1, -30, 2, 2);

    // 2. Hilt: Burgundy leather wrapped handle with gold wire cross-bands
    this.px(ctx, '#451a03', -3, -27, 6, 14);
    this.px(ctx, '#78350f', -2, -26, 4, 12);
    this.px(ctx, '#b45309', -1, -25, 2, 10);
    this.px(ctx, '#f59e0b', -2, -23, 4, 1);
    this.px(ctx, '#f59e0b', -2, -18, 4, 1);

    // 3. Crossguard: Heavy dark brass / gunmetal guard with corner rivets
    this.px(ctx, '#1e293b', -10, -13, 20, 5);
    this.px(ctx, '#475569', -9, -12, 18, 3);
    this.px(ctx, '#94a3b8', -8, -12, 16, 1);
    this.px(ctx, '#fbbf24', -8, -12, 2, 2);
    this.px(ctx, '#fbbf24', 6, -12, 2, 2);

    // 4. Buster Sword Steel Blade (46px long, 14px wide broadsword)
    this.px(ctx, '#1e293b', -7, -8, 14, 44);
    this.px(ctx, '#334155', 0, -8, 7, 44);
    this.px(ctx, '#64748b', -6, -8, 6, 44);
    this.px(ctx, '#94a3b8', -4, -8, 3, 44);
    this.px(ctx, '#f1f5f9', -7, -8, 1, 44);
    this.px(ctx, '#ffffff', -7, 0, 1, 20);

    // Fuller (Blood Groove)
    this.px(ctx, '#0f172a', -1, -6, 2, 38);

    // Blade Point / Angled Tip
    this.px(ctx, '#334155', -5, 36, 10, 4);
    this.px(ctx, '#1e293b', -3, 40, 6, 3);
    this.px(ctx, '#475569', -1, 43, 2, 2);

    // 5. Dual Glowing Materia Slots (Pulsating Mako Green & Cyan) — no shadowBlur for perf
    // Green Materia Slot
    this.px(ctx, '#022c22', -3, -4, 6, 6);
    this.px(ctx, '#15803d', -2, -3, 4, 4);
    this.px(ctx, '#22c55e', -1, -2, 2, 2);
    this.px(ctx, '#86efac', -1, -2, 1, 1);

    // Cyan / Lightning Materia Slot
    this.px(ctx, '#082f49', -3, 6, 6, 6);
    this.px(ctx, '#0284c7', -2, 7, 4, 4);
    this.px(ctx, '#38bdf8', -1, 8, 2, 2);
    this.px(ctx, '#bae6fd', -1, 8, 1, 1);

    ctx.restore();
  }

  // Draw Cloud's Spiky Golden Blonde Hair with 3D Depth
  drawHair(ctx, direction, windSway = 0) {
    const goldSheen = '#fef9c3';
    const goldBright = '#fef08a';
    const goldMid = '#facc15';
    const goldShadow = '#ca8a04';
    const darkEdge = '#78350f';

    ctx.save();
    ctx.translate(windSway, 0);

    if (direction === 'down' || direction === 'battle' || direction === 'attack') {
      this.px(ctx, darkEdge, -12, -26, 24, 16);
      this.px(ctx, goldShadow, -11, -27, 22, 15);

      // Left Spikes
      this.px(ctx, goldMid, -12, -24, 5, 8);
      this.px(ctx, goldBright, -10, -28, 4, 7);
      this.px(ctx, goldSheen, -9, -30, 2, 4);

      // Center Crown Spikes
      this.px(ctx, goldMid, -5, -29, 6, 11);
      this.px(ctx, goldBright, -3, -34, 4, 9);
      this.px(ctx, goldSheen, -2, -36, 2, 5);

      // Right Crown Spikes
      this.px(ctx, goldMid, 2, -30, 6, 11);
      this.px(ctx, goldBright, 4, -34, 4, 8);
      this.px(ctx, goldSheen, 5, -35, 2, 4);

      // Far Right Wing Spikes
      this.px(ctx, goldMid, 8, -25, 5, 8);
      this.px(ctx, goldBright, 9, -29, 4, 7);
      this.px(ctx, goldSheen, 10, -30, 2, 3);

      // Fringe Bangs framing face
      this.px(ctx, goldMid, -10, -18, 3, 8);
      this.px(ctx, goldBright, -9, -17, 2, 6);
      this.px(ctx, goldMid, 7, -18, 3, 8);
      this.px(ctx, goldBright, 7, -17, 2, 6);
      this.px(ctx, goldBright, -4, -18, 2, 4);
    } else if (direction === 'up') {
      this.px(ctx, darkEdge, -12, -27, 24, 18);
      this.px(ctx, goldShadow, -11, -29, 22, 17);
      this.px(ctx, goldMid, -9, -32, 18, 14);

      this.px(ctx, goldBright, -8, -34, 4, 8);
      this.px(ctx, goldBright, -2, -37, 5, 10);
      this.px(ctx, goldBright, 5, -34, 4, 8);
      this.px(ctx, goldSheen, -1, -38, 3, 5);
    } else {
      this.px(ctx, darkEdge, -12, -27, 22, 16);
      this.px(ctx, goldShadow, -11, -29, 20, 15);
      this.px(ctx, goldMid, -9, -32, 16, 14);

      this.px(ctx, goldBright, -10, -32, 4, 8);
      this.px(ctx, goldBright, -3, -35, 5, 10);
      this.px(ctx, goldBright, 4, -32, 4, 7);
      this.px(ctx, goldSheen, -2, -37, 3, 5);

      this.px(ctx, goldMid, 6, -17, 3, 7);
      this.px(ctx, goldBright, 5, -16, 2, 5);
    }
    ctx.restore();
  }

  // Draw Cloud's Determined Face with Glowing Mako Eyes
  drawFace(ctx, direction) {
    const skinBase = '#ffedd5';
    const skinShadow = '#fed7aa';
    const skinDeep = '#fba17d';
    const makoCyan = '#06b6d4';
    const makoGlow = '#38bdf8';

    if (direction === 'up') return;

    if (direction === 'down' || direction === 'battle' || direction === 'attack') {
      this.px(ctx, skinShadow, -8, -17, 16, 13);
      this.px(ctx, skinBase, -7, -16, 14, 11);
      this.px(ctx, skinDeep, -3, -4, 6, 2);
      this.px(ctx, skinBase, -2, -3, 4, 2);

      // Eyebrows
      this.px(ctx, '#78350f', -6, -12, 4, 1);
      this.px(ctx, '#78350f', 2, -12, 4, 1);

      // Glowing Mako Eyes
      this.px(ctx, '#083344', -6, -11, 4, 3);
      this.px(ctx, makoGlow, -5, -11, 3, 3);
      this.px(ctx, makoCyan, -5, -10, 2, 2);
      this.px(ctx, '#ffffff', -5, -11, 1, 1);

      this.px(ctx, '#083344', 2, -11, 4, 3);
      this.px(ctx, makoGlow, 2, -11, 3, 3);
      this.px(ctx, makoCyan, 3, -10, 2, 2);
      this.px(ctx, '#ffffff', 2, -11, 1, 1);

      this.px(ctx, '#9a3412', -2, -6, 4, 1);
    } else {
      this.px(ctx, skinShadow, -6, -17, 14, 13);
      this.px(ctx, skinBase, -5, -16, 12, 11);
      this.px(ctx, skinBase, 4, -9, 3, 4);
      this.px(ctx, skinDeep, 1, -4, 4, 2);

      this.px(ctx, '#083344', 2, -11, 4, 3);
      this.px(ctx, makoGlow, 2, -11, 3, 3);
      this.px(ctx, makoCyan, 3, -10, 2, 2);
      this.px(ctx, '#ffffff', 2, -11, 1, 1);
    }
  }

  // Draw Full Cloud Character Model & Animation Stance
  draw(ctx, x, y, direction, frame, state = 'idle', scale = 1.1, comboStep = 1, attackProgress = 0, extraData = null) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);

    // 1. Soft Elliptical Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    const time = Date.now();
    const windSway = Math.sin(time / 220) * 1.0;

    let bobY = 0;
    let forwardLean = 0;
    if (state === 'run') {
      bobY = Math.sin(frame * Math.PI * 2) * 3.2;
      forwardLean = (direction === 'left' ? -0.15 : (direction === 'right' ? 0.15 : 0.05));
    } else if (state === 'walk') {
      bobY = Math.sin(frame * Math.PI * 2) * 2.0;
    } else if (state === 'attack' || state === 'defend' || state === 'cast' || state === 'limit') {
      bobY = 0;
    } else {
      bobY = Math.sin(time / 380) * 1.0;
    }
    ctx.translate(0, bobY);
    if (forwardLean !== 0) ctx.rotate(forwardLean);

    // A. DEFENSIVE GUARD & PARRY STANCE (Sword held across body)
    if (state === 'defend') {
      this.drawDefendStance(ctx, time);
      ctx.restore();
      return;
    }

    // B. MAGIC & ABILITY CASTING STANCE (Sword pointed skyward channeling runes)
    if (state === 'cast') {
      const elem = (extraData && extraData.elem) ? extraData.elem : 'fire';
      this.drawCastingStance(ctx, time, attackProgress, elem);
      ctx.restore();
      return;
    }

    // C. LIMIT BREAK HYPER CHARGE & SLURRY (Supercharged golden aura)
    if (state === 'limit') {
      this.drawLimitBreakStance(ctx, time, attackProgress);
      ctx.restore();
      return;
    }

    // D. ATTACK / SLASHING ANIMATION STATE
    if (state === 'attack') {
      if (typeof playerAttackState !== 'undefined' && attackProgress === 0 && comboStep === 1) {
        comboStep = playerAttackState.comboStep;
        attackProgress = playerAttackState.progress;
      }
      this.drawAttackStance(ctx, direction, comboStep, attackProgress, time);
      ctx.restore();
      return;
    }

    // E. BATTLE COMBAT STANCE
    if (direction === 'battle') {
      this.drawBattleReadyStance(ctx, time);
      ctx.restore();
      return;
    }

    // C. EXPLORATION 4-DIRECTION MOVEMENT
    const legCycle = Math.sin(frame * Math.PI * 2);
    const swordSway = (state === 'run' ? Math.sin(frame * Math.PI * 2) * 0.12 : (state === 'walk' ? Math.sin(frame * Math.PI * 2) * 0.06 : 0));

    if (direction === 'down') {
      this.drawBusterSword(ctx, 10, -5, -0.44 + swordSway, 0.95);
      this.drawLegs(ctx, legCycle, false);
      this.drawTorso(ctx, 'front');
      this.drawPauldronArm(ctx, -13, -2, -legCycle * 0.3);
      this.drawNormalArm(ctx, 11, -2, legCycle * 0.3);
      this.drawFace(ctx, 'down');
      this.drawHair(ctx, 'down', windSway);

    } else if (direction === 'up') {
      this.drawLegs(ctx, legCycle, true);
      this.drawTorso(ctx, 'back');
      this.drawBusterSword(ctx, 2, -2, -0.32 + swordSway, 1.05);
      this.drawNormalArm(ctx, -12, -2, legCycle * 0.3);
      this.drawNormalArm(ctx, 11, -2, -legCycle * 0.3);
      this.drawHair(ctx, 'up', windSway);

    } else {
      const flip = direction === 'left';
      ctx.save();
      if (flip) ctx.scale(-1, 1);
      this.drawBusterSword(ctx, -10, -3, -0.52 + swordSway, 0.95);
      this.drawProfileLegs(ctx, legCycle);
      this.drawTorso(ctx, 'side');
      this.drawPauldronArm(ctx, -2, -2, legCycle * 0.4);
      this.drawFace(ctx, 'side');
      this.drawHair(ctx, 'side', windSway);
      ctx.restore();
    }

    ctx.restore();
  }

  drawLegs(ctx, cycle, isBack = false) {
    const lOffset = cycle * 5;
    const rOffset = -cycle * 5;

    // Left Leg & Boot
    this.px(ctx, '#18181b', -9, 8 + lOffset, 7, 9);
    this.px(ctx, '#27272a', -8, 8 + lOffset, 5, 7);
    this.px(ctx, '#0f172a', -9, 16 + lOffset, 7, 7);
    this.px(ctx, '#334155', -9, 16 + lOffset, 7, 2);
    this.px(ctx, '#cbd5e1', -8, 19 + lOffset, 2, 2);
    this.px(ctx, '#020617', -10, 22 + lOffset, 8, 2);

    // Right Leg & Boot
    this.px(ctx, '#18181b', 3, 8 + rOffset, 7, 9);
    this.px(ctx, '#27272a', 4, 8 + rOffset, 5, 7);
    this.px(ctx, '#0f172a', 3, 16 + rOffset, 7, 7);
    this.px(ctx, '#334155', 3, 16 + rOffset, 7, 2);
    this.px(ctx, '#cbd5e1', 7, 19 + rOffset, 2, 2);
    this.px(ctx, '#020617', 2, 22 + rOffset, 8, 2);
  }

  drawProfileLegs(ctx, cycle) {
    this.px(ctx, '#0f172a', -6 - cycle * 5, 8, 7, 9);
    this.px(ctx, '#020617', -7 - cycle * 5, 16, 7, 7);

    this.px(ctx, '#18181b', -1 + cycle * 5, 8, 7, 9);
    this.px(ctx, '#27272a', 0 + cycle * 5, 8, 5, 7);
    this.px(ctx, '#0f172a', -2 + cycle * 5, 16, 8, 7);
    this.px(ctx, '#cbd5e1', 2 + cycle * 5, 18, 2, 2);
  }

  drawTorso(ctx, view) {
    const vestDark = '#1e1b4b';
    const vestMid = '#312e81';
    const vestRib = '#4338ca';
    const harness = '#78350f';
    const buckle = '#cbd5e1';

    if (view === 'front') {
      this.px(ctx, vestDark, -5, -6, 10, 4);
      this.px(ctx, vestMid, -4, -5, 8, 2);
      this.px(ctx, vestDark, -9, -3, 18, 13);
      this.px(ctx, vestMid, -8, -2, 16, 11);
      this.px(ctx, vestRib, -5, -2, 2, 10);
      this.px(ctx, vestRib, 3, -2, 2, 10);

      this.px(ctx, harness, -8, -2, 4, 3);
      this.px(ctx, harness, -4, 1, 8, 3);
      this.px(ctx, harness, 4, 4, 4, 3);
      this.px(ctx, buckle, -2, 1, 4, 3);

      this.px(ctx, '#0f172a', -9, 6, 18, 4);
      this.px(ctx, '#f59e0b', -2, 7, 4, 2);
    } else if (view === 'back') {
      this.px(ctx, vestDark, -9, -4, 18, 14);
      this.px(ctx, vestMid, -8, -3, 16, 12);
      this.px(ctx, harness, -7, -3, 14, 3);
      this.px(ctx, '#0f172a', -9, 6, 18, 4);
    } else {
      this.px(ctx, vestDark, -7, -4, 14, 14);
      this.px(ctx, vestMid, -6, -3, 12, 12);
      this.px(ctx, harness, -4, 0, 4, 8);
      this.px(ctx, '#0f172a', -7, 6, 14, 4);
    }
  }

  drawPauldronArm(ctx, x, y, swing = 0) {
    ctx.save();
    ctx.translate(x, y + swing * 4);

    this.px(ctx, '#1e293b', -3, -8, 11, 10);
    this.px(ctx, '#475569', -2, -7, 9, 8);
    this.px(ctx, '#94a3b8', -1, -6, 7, 5);
    this.px(ctx, '#f8fafc', 0, -5, 4, 2);
    this.px(ctx, '#f59e0b', -1, -6, 2, 2);
    this.px(ctx, '#f59e0b', 4, -4, 2, 2);

    this.px(ctx, '#ffedd5', -1, 1, 5, 5);
    this.px(ctx, '#78350f', -2, 6, 6, 6);
    this.px(ctx, '#cbd5e1', -2, 7, 6, 1);
    this.px(ctx, '#18181b', -1, 11, 5, 4);

    ctx.restore();
  }

  drawNormalArm(ctx, x, y, swing = 0) {
    ctx.save();
    ctx.translate(x, y + swing * 4);
    this.px(ctx, '#ffedd5', -2, 0, 5, 6);
    this.px(ctx, '#78350f', -2, 5, 5, 6);
    this.px(ctx, '#cbd5e1', -2, 6, 5, 1);
    this.px(ctx, '#18181b', -2, 10, 5, 4);
    ctx.restore();
  }

  drawBattleReadyStance(ctx, time) {
    const stancePulse = Math.sin(time / 280) * 1.5;
    this.drawBusterSword(ctx, 16, -4 + stancePulse, 1.25, 1.15, false);

    this.px(ctx, '#18181b', -12, 8, 8, 9);
    this.px(ctx, '#0f172a', -13, 16, 9, 7);
    this.px(ctx, '#cbd5e1', -11, 18, 2, 2);

    this.px(ctx, '#18181b', 4, 8, 8, 9);
    this.px(ctx, '#0f172a', 4, 16, 9, 7);
    this.px(ctx, '#cbd5e1', 9, 18, 2, 2);

    this.drawTorso(ctx, 'front');
    this.drawPauldronArm(ctx, -13, -2, 0);
    this.px(ctx, '#ffedd5', 6, -2, 8, 4);
    this.px(ctx, '#18181b', 12, -3, 6, 5);

    this.drawFace(ctx, 'battle');
    this.drawHair(ctx, 'battle', 0);
  }

  // 1. Defensive Guard & Parry Stance (Raises broad Buster Sword horizontally across torso)
  drawDefendStance(ctx, time) {
    // Rooted Leg Stance
    this.px(ctx, '#18181b', -13, 8, 9, 9);
    this.px(ctx, '#0f172a', -14, 16, 9, 7);
    this.px(ctx, '#cbd5e1', -12, 18, 2, 2);

    this.px(ctx, '#18181b', 4, 8, 10, 9);
    this.px(ctx, '#0f172a', 5, 16, 10, 7);
    this.px(ctx, '#cbd5e1', 11, 18, 2, 2);

    this.drawTorso(ctx, 'front');

    // Huge Buster Sword raised horizontally across chest guarding body!
    this.drawBusterSword(ctx, 4, 0, 1.52, 1.25, false);

    // Guard barrier shimmer & spark deflection pulse (Golden Aegis Shield)
    ctx.save();
    const gPulse = 0.45 + Math.sin(time / 140) * 0.2;
    ctx.globalAlpha = gPulse;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
    ctx.beginPath();
    ctx.ellipse(2, 0, 24, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Deflection spark motes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2, -10, 8, 2);
    ctx.fillRect(8, 4, 2, 8);
    ctx.restore();

    // Arms firmly bracing the blade
    this.drawPauldronArm(ctx, -12, -2, 0);
    this.px(ctx, '#ffedd5', 6, -1, 8, 4);  // Right hand holding hilt
    this.px(ctx, '#18181b', 12, -2, 6, 6);
    this.px(ctx, '#ffedd5', -6, -3, 6, 5); // Left hand bracing blade back
    this.px(ctx, '#18181b', -8, -1, 6, 5);

    this.drawFace(ctx, 'battle');
    this.drawHair(ctx, 'battle', 0);
  }

  // 2. Magic Casting Stance (Holds Buster Sword skyward, pulsing Materia & channeling spell runes)
  drawCastingStance(ctx, time, progress, elem = 'fire') {
    const elemColor = (elem === 'fire') ? '#ef4444' : (elem === 'water') ? '#38bdf8' : (elem === 'thunder') ? '#facc15' : (elem === 'earth') ? '#22c55e' : '#a855f7';
    const pulse = Math.sin(time / 110) * 2.5;

    // Stance
    this.drawLegs(ctx, 0);
    this.drawTorso(ctx, 'front');

    // Buster Sword held vertically aloft in right hand (pointing straight up)
    this.drawBusterSword(ctx, 16, -16 + pulse, 0, 1.25, true);

    // Channeling magical aura around blade and Materia
    ctx.save();
    ctx.strokeStyle = elemColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(16, -34, 18 + Math.sin(time / 70) * 4, 0, Math.PI * 2);
    ctx.stroke();

    // Swirling magic motes rising
    for (let i = 0; i < 3; i++) {
      const a = (time * 0.005 + i * 2.1) % (Math.PI * 2);
      const mx = 16 + Math.cos(a) * 20;
      const my = -34 + Math.sin(a) * 14;
      ctx.fillStyle = elemColor;
      ctx.fillRect(mx - 2, my - 2, 4, 4);
    }
    ctx.restore();

    // Left hand outstretched forward channeling spell
    this.drawPauldronArm(ctx, -14, -3, 0);
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(-22, -4, 10, 4);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-24, -5, 5, 6);

    this.drawFace(ctx, 'battle');
    this.drawHair(ctx, 'battle', -2);
  }

  // 3. Limit Break Hyper-State Stance (Omnislash / Cross-Slash charging aura & finisher)
  drawLimitBreakStance(ctx, time, progress) {
    // Golden Limit Break Supercharged Aura
    ctx.save();
    // Rising golden energy spikes around Cloud
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
    ctx.lineWidth = 2.5;
    for (let i = -16; i <= 16; i += 8) {
      const h = 20 + Math.sin(time / 70 + i) * 12;
      ctx.beginPath();
      ctx.moveTo(i, 20);
      ctx.lineTo(i + (Math.random() - 0.5) * 4, 20 - h);
      ctx.stroke();
    }
    ctx.restore();

    if (progress < 0.25) {
      // Phase 1: Powerful charge crouch
      ctx.translate(0, 4);
      this.drawBusterSword(ctx, -12, -4, 2.2, 1.25, true);
      this.drawLegs(ctx, -0.4);
      this.drawTorso(ctx, 'front');
      this.drawPauldronArm(ctx, -10, 2, 0);
      this.drawFace(ctx, 'battle');
      this.drawHair(ctx, 'battle', 0);
    } else if (progress < 0.7) {
      // Phase 2: High velocity leaping cross-slash
      const leapT = (progress - 0.25) / 0.45;
      const leapY = -Math.sin(leapT * Math.PI) * 28;
      ctx.translate(8, leapY);
      this.drawBusterSword(ctx, 12, -6, -0.8 + leapT * 3.0, 1.35, true);
      this.drawLegs(ctx, 0.5);
      this.drawTorso(ctx, 'front');
      this.drawPauldronArm(ctx, -6, -2, 0);
      this.drawFace(ctx, 'attack');
      this.drawHair(ctx, 'attack', 4);
    } else {
      // Phase 3: Supreme downward finisher smash
      ctx.translate(4, 2);
      this.drawBusterSword(ctx, 6, 8, 0.1, 1.3, false);
      this.drawLegs(ctx, 0);
      this.drawTorso(ctx, 'front');
      this.drawPauldronArm(ctx, -8, 2, 0);
      this.drawFace(ctx, 'attack');
      this.drawHair(ctx, 'attack', -2);
    }
  }

  // Attack & Slashing Stances with Multi-Step Combos
  drawAttackStance(ctx, direction, comboStep, progress, time) {
    const flip = direction === 'left';
    if (flip) ctx.scale(-1, 1);

    if (comboStep === 1) {
      if (progress < 0.3) {
        ctx.translate(-4, 0);
        this.drawBusterSword(ctx, -14, -12, -1.8, 1.15, true);
        this.drawLegs(ctx, -0.3);
        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -10, -2, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', -2);
      } else if (progress < 0.7) {
        const swingT = (progress - 0.3) / 0.4;
        const swordAngle = -1.2 + swingT * 2.8;
        ctx.translate(6, 2);
        this.drawBusterSword(ctx, 10, -2, swordAngle, 1.25, true);

        this.px(ctx, '#18181b', -12, 10, 8, 7);
        this.px(ctx, '#0f172a', -14, 16, 9, 6);
        this.px(ctx, '#18181b', 2, 7, 10, 10);
        this.px(ctx, '#0f172a', 6, 16, 8, 6);

        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -6, 0, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', 3);
      } else {
        ctx.translate(3, 0);
        this.drawBusterSword(ctx, 22, 6, 1.6, 1.15, false);
        this.drawLegs(ctx, 0.2);
        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -8, -1, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', 1);
      }

    } else if (comboStep === 2) {
      if (progress < 0.3) {
        ctx.translate(0, 4);
        this.drawBusterSword(ctx, -10, 8, 2.2, 1.15, true);
        this.drawLegs(ctx, 0);
        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -10, 2, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', 0);
      } else if (progress < 0.7) {
        const swingT = (progress - 0.3) / 0.4;
        const swordAngle = 1.8 - swingT * 3.2;
        ctx.translate(2, -4);
        this.drawBusterSword(ctx, 14, -8, swordAngle, 1.25, true);
        this.drawLegs(ctx, 0.4);
        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -4, -4, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', -2);
      } else {
        ctx.translate(0, -2);
        this.drawBusterSword(ctx, 12, -18, -1.2, 1.15, false);
        this.drawLegs(ctx, 0);
        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -6, -2, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', 0);
      }

    } else {
      // Combo 3: Braver Slam
      if (progress < 0.4) {
        const leapY = -Math.sin((progress / 0.4) * Math.PI) * 16;
        ctx.translate(0, leapY);
        this.drawBusterSword(ctx, 0, -24, 0, 1.3, true);

        this.px(ctx, '#18181b', -8, 6, 7, 7);
        this.px(ctx, '#0f172a', -7, 12, 6, 5);
        this.px(ctx, '#18181b', 2, 7, 7, 7);
        this.px(ctx, '#0f172a', 3, 13, 6, 5);

        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -10, -6, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', -3);
      } else if (progress < 0.75) {
        ctx.translate(0, 4);
        this.drawBusterSword(ctx, 4, 10, 0.05, 1.3, false);

        this.px(ctx, '#18181b', -13, 10, 9, 6);
        this.px(ctx, '#0f172a', -15, 15, 9, 6);
        this.px(ctx, '#18181b', 4, 10, 9, 6);
        this.px(ctx, '#0f172a', 5, 15, 9, 6);

        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -6, 2, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', 4);
      } else {
        ctx.translate(0, 2);
        this.drawBusterSword(ctx, 12, 4, 0.4, 1.15, false);
        this.drawLegs(ctx, 0);
        this.drawTorso(ctx, 'front');
        this.drawPauldronArm(ctx, -8, 0, 0);
        this.drawFace(ctx, 'attack');
        this.drawHair(ctx, 'attack', 0);
      }
    }
  }
}

// Black Mage Companion Sprite

class TifaRenderer {
  px(ctx, color, x, y, w, h) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
  draw(ctx, x, y, direction, frame, state = 'idle', scale = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 26, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    let bobY = (state === 'walk' || state === 'run') ? Math.sin(frame * Math.PI) * 2.5 : Math.sin(Date.now() / 350) * 0.8;
    ctx.translate(0, bobY);
    
    // Colors
    const skin = '#ffe0bd';
    const skinDark = '#e0b589';
    const hair = '#171717';
    const hairHighlight = '#2d2d2d';
    const top = '#f8fafc';
    const skirt = '#18181b';
    const leather = '#09090b';
    const boots = '#dc2626';
    const metal = '#9ca3af';

    if (direction === 'battle') {
      // 1. BACK HAIR
      this.px(ctx, hair, -6, -4, 12, 22);
      this.px(ctx, hairHighlight, -4, -4, 4, 18); // hair detail
      
      // 2. BACK LEG (Right)
      this.px(ctx, skinDark, 1, 10, 4, 4); // Thigh
      this.px(ctx, leather, 1, 14, 4, 7); // Thigh high sock
      this.px(ctx, boots, 0, 21, 6, 5); // Red boot
      this.px(ctx, leather, 0, 25, 6, 2); // Sole
      this.px(ctx, metal, 1, 21, 4, 1); // Metal trim
      
      // 3. FRONT LEG (Left)
      this.px(ctx, skin, -5, 10, 4, 4); // Thigh
      this.px(ctx, leather, -5, 14, 4, 8); // Thigh high sock
      this.px(ctx, boots, -6, 22, 6, 5); // Red boot
      this.px(ctx, leather, -6, 26, 6, 2); // Sole
      this.px(ctx, metal, -5, 22, 4, 1); // Metal trim

      // 4. TORSO & SKIRT
      this.px(ctx, skin, -4, 5, 8, 3); // Belly
      this.px(ctx, leather, -6, 8, 12, 2); // Belt
      this.px(ctx, metal, -2, 8, 2, 2); // Belt buckle
      this.px(ctx, skirt, -7, 10, 14, 4); // Pleated Skirt
      
      this.px(ctx, top, -5, -1, 10, 6); // White tank top
      this.px(ctx, skirt, -5, -2, 10, 1); // Black collar trim
      this.px(ctx, skirt, -5, 4, 10, 1); // Black bottom trim
      this.px(ctx, leather, -6, -1, 2, 10); // Left suspender
      this.px(ctx, leather, 4, -1, 2, 10); // Right suspender

      // 5. BACK ARM (Right)
      this.px(ctx, skinDark, 5, -1, 4, 4); // Shoulder
      this.px(ctx, leather, 6, 2, 3, 6); // Black sleeve
      this.px(ctx, boots, 7, 6, 4, 4); // Red gauntlet
      this.px(ctx, metal, 8, 7, 2, 2); // Metal knuckle

      // 6. HEAD & FACE
      this.px(ctx, hair, -8, -14, 16, 8); // Hair base
      this.px(ctx, skin, -6, -10, 12, 10); // Face
      this.px(ctx, skinDark, -2, -3, 2, 1); // Nose
      
      // Eyes (Red with shine)
      this.px(ctx, '#ef4444', -4, -6, 2, 2); 
      this.px(ctx, '#ef4444', 3, -6, 2, 2);
      this.px(ctx, '#ffffff', -3, -6, 1, 1); 
      this.px(ctx, '#ffffff', 4, -6, 1, 1);
      
      // Teardrop Earrings
      this.px(ctx, metal, 5, -4, 1, 2);
      this.px(ctx, metal, -6, -4, 1, 2);

      // Front Hair Strands
      this.px(ctx, hair, -7, -10, 2, 12); // Left lock
      this.px(ctx, hair, 5, -10, 2, 6); // Right lock

      // 7. FRONT ARM (Left) - Punching stance
      this.px(ctx, skin, -9, 1, 5, 4); // Shoulder
      this.px(ctx, leather, -12, 3, 6, 4); // Black sleeve
      this.px(ctx, boots, -15, 3, 5, 5); // Red gauntlet
      this.px(ctx, metal, -15, 4, 3, 3); // Metal guard
    }
    ctx.restore();
  }
}

// Black Mage Companion Sprite
class BlackMageRenderer {
  draw(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);

    const bob = Math.sin(Date.now() / 320) * 1.5;
    ctx.translate(0, bob);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blue Robe
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-10, -2, 20, 18);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(-12, 10, 24, 6);

    // Glowing Yellow Eyes in Shadow
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -12, 16, 11);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-5, -8, 3, 3);
    ctx.fillRect(2, -8, 3, 3);

    // Wizard Hat (Pointy Cone)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, -12, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(12, -28);
    ctx.lineTo(8, -12);
    ctx.fill();

    // Staff
    ctx.fillStyle = '#78350f';
    ctx.fillRect(11, -18, 3, 34);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(12, -20, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class PaladinRenderer {
  draw(ctx, x, y, scale = 1.35) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);

    const bob = Math.sin(Date.now() / 300) * 1.5;
    ctx.translate(0, bob);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Azure Paladin Cloak
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-14, 18);
    ctx.lineTo(8, 18);
    ctx.lineTo(6, -5);
    ctx.fill();

    // Silver / Platinum Plate Body Armor
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-8, -6, 16, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-6, 2, 12, 8);

    // Golden Trim & Crest
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-2, -4, 4, 10);
    ctx.fillRect(-5, -2, 10, 3);

    // Legs / Greaves
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-6, 12, 4, 8);
    ctx.fillRect(2, 12, 4, 8);

    // Paladin Helm with Golden Wings
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, -14, 9, 0, Math.PI * 2);
    ctx.fill();

    // Helm Visor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -15, 12, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-4, -15, 8, 2);

    // Winged Helm Crest
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.lineTo(-15, -24);
    ctx.lineTo(-6, -20);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8, -16);
    ctx.lineTo(15, -24);
    ctx.lineTo(6, -20);
    ctx.fill();

    // Holy Greatshield (Left hand)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(-16, -10);
    ctx.lineTo(-7, -10);
    ctx.lineTo(-7, 8);
    ctx.lineTo(-11, 14);
    ctx.lineTo(-16, 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Holy Blade (Right hand)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(11, -2, 3, 6);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(8, -3, 9, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(12, -22, 2, 20);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(10, -24, 6, 24);

    ctx.restore();
  }
}

class AerisRenderer {
  draw(ctx, x, y, scale = 1.35) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);

    const bob = Math.sin(Date.now() / 320) * 1.5;
    ctx.translate(0, bob);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pink Cetra Dress
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(-12, 18);
    ctx.lineTo(12, 18);
    ctx.lineTo(8, -4);
    ctx.fill();

    // Red Bolero Jacket
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7, -6, 14, 10);

    // Head & Hair
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Brunette hair & Ribbon
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-6, -18, 12, 7);
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(0, -18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Guard Staff
    ctx.fillStyle = '#d97706';
    ctx.fillRect(9, -20, 2, 36);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(10, -22, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class ChronoRenderer {
  draw(ctx, x, y, scale = 1.35) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);

    const bob = Math.sin(Date.now() / 240) * 1.5;
    ctx.translate(0, bob);

    // Soft Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Leather Boots
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-6, 12, 5, 7);
    ctx.fillRect(2, 12, 5, 7);

    // Tan Trousers
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-6, 4, 5, 9);
    ctx.fillRect(2, 4, 5, 9);

    // Green Tunic (Chrono signature Akira Toriyama green)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-8, -6, 16, 12);
    // Dark chest armor plate
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-7, -4, 14, 8);
    // Brown belt & pouch
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-8, 3, 16, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-2, 3, 4, 3);

    // Head / Face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -12, 6, 0, Math.PI * 2);
    ctx.fill();

    // Determined anime eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(1, -13, 2, 2);

    // Blue Headband (Chrono signature)
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-6, -16, 12, 4);
    // Headband ribbon flowing in wind
    const ribbonWave = Math.sin(Date.now() / 150) * 3;
    ctx.beginPath();
    ctx.moveTo(-6, -15);
    ctx.lineTo(-14, -13 + ribbonWave);
    ctx.lineTo(-16, -17 + ribbonWave);
    ctx.lineTo(-6, -16);
    ctx.fill();

    // Spiky Crimson Red Hair (Iconic Chrono Spikes)
    ctx.fillStyle = '#dc2626';
    // Center main crown spike
    ctx.beginPath();
    ctx.moveTo(-5, -16);
    ctx.lineTo(-2, -27);
    ctx.lineTo(2, -16);
    ctx.fill();
    // Left side spike
    ctx.beginPath();
    ctx.moveTo(-7, -15);
    ctx.lineTo(-12, -23);
    ctx.lineTo(-4, -17);
    ctx.fill();
    // Right side spike
    ctx.beginPath();
    ctx.moveTo(1, -16);
    ctx.lineTo(8, -24);
    ctx.lineTo(6, -15);
    ctx.fill();
    // Top flare
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(1, -29);
    ctx.lineTo(5, -20);
    ctx.fill();

    // Katana Blade at side
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(8, -18, 3, 28);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, -18, 1, 28);
    // Gold Tsuba & Brown Katana Hilt
    ctx.fillStyle = '#facc15';
    ctx.fillRect(6, 10, 7, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, 12, 3, 8);

    // Electric sparks around Katana (Time/Lightning Element)
    if (Math.random() < 0.45) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const sparkY = -12 + Math.random() * 20;
      ctx.moveTo(9, sparkY);
      ctx.lineTo(14 + Math.random() * 4, sparkY + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }

    ctx.restore();
  }
}


// Enemy Sprite Renderers
class EnemyRenderer {
  draw(ctx, x, y, enemy) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    const bob = Math.sin(Date.now() / 280 + x) * 2;
    ctx.translate(0, bob);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 24, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw based on element & type
    
    if (enemy.isBoss && enemy.name.includes('Scorpion')) {
      const time = Date.now();
      const isCharging = enemy.isCharging || enemy.tailUp;

      // Mechanical shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 28, 38, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Warning Aura if charging laser
      if (isCharging) {
        ctx.fillStyle = 'rgba(234, 179, 8, ' + (0.25 + Math.sin(time / 80) * 0.15) + ')';
        ctx.beginPath();
        ctx.arc(0, -10, 55, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 4 Hydraulic Legs
      ctx.fillStyle = '#334155';
      [-36, -18, 18, 36].forEach(lx => {
        ctx.fillRect(lx - 4, 10, 8, 22);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx - 5, 28, 10, 5);
        ctx.fillStyle = '#334155';
      });

      // Main Chassis / Carapace
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-32, -18, 64, 34);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-26, -14, 52, 26);
      ctx.fillStyle = '#3b82f6'; // Armor Trim
      ctx.fillRect(-24, 0, 48, 4);

      // Dual Front Pincer Arms
      ctx.fillStyle = '#475569';
      ctx.fillRect(-44, -12, 14, 18);
      ctx.fillRect(30, -12, 14, 18);
      // Bronze Claws
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-48, -20, 8, 12);
      ctx.fillRect(-42, -22, 6, 8);
      ctx.fillRect(40, -20, 8, 12);
      ctx.fillRect(36, -22, 6, 8);

      // Red Optics / Sensor Visor
      ctx.fillStyle = isCharging ? '#ef4444' : '#38bdf8';
      ctx.fillRect(-14, -6, 28, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.sin(time / 200) * 8 - 2, -5, 4, 6);

      // Segmented Overhead Scorpion Tail
      ctx.fillStyle = '#334155';
      const tailBaseY = isCharging ? -28 : -20;
      ctx.fillRect(-6, tailBaseY - 14, 12, 16);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-8, tailBaseY - 28, 16, 16);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10, tailBaseY - 44, 20, 18);

      // Stinger Cannon (Raised High)
      ctx.fillStyle = isCharging ? '#f59e0b' : '#64748b';
      ctx.fillRect(-12, tailBaseY - 58, 24, 16);
      ctx.fillStyle = isCharging ? '#ef4444' : '#0284c7';
      ctx.fillRect(-4, tailBaseY - 64, 8, 8); // Cannon muzzle

      // Electric spark arcs if charging laser
      if (isCharging) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const sx = (Math.random() - 0.5) * 40;
          const sy = tailBaseY - 60 + (Math.random() - 0.5) * 30;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
    } else if (enemy.isBoss) {
      // Behemoth Boss
      ctx.fillStyle = '#4c1d95'; // Dark purple body
      ctx.fillRect(-35, -45, 70, 50);
      ctx.fillStyle = '#6d28d9';
      ctx.fillRect(-45, -20, 90, 40); // legs base

      // Horns
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(-25, -45); ctx.lineTo(-35, -75); ctx.lineTo(-15, -45);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(25, -45); ctx.lineTo(35, -75); ctx.lineTo(15, -45);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-20, -30, 10, 6);
      ctx.fillRect(10, -30, 10, 6);
      
      // Mane/Fur
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-15, -60, 30, 20);
    } else if (enemy.name.includes('Slime')) {
      const time = Date.now();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.ellipse(0, 0, 20 + Math.sin(time/150)*3, 14 - Math.sin(time/150)*3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.ellipse(-6, -6, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-10, -4, 6, 6);
      ctx.fillRect(4, -4, 6, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(-8, -2, 3, 3);
      ctx.fillRect(6, -2, 3, 3);
    } else if (enemy.element === 'fire') {
      // Hellhound / Fire Demon
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-18, -6, 36, 26);
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(-22, -18, 20, 16); // Head
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-18, -14, 4, 4);   // Eye
      // Flame Spikes
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-10, -6); ctx.lineTo(-4, -18); ctx.lineTo(2, -6);
      ctx.moveTo(4, -6); ctx.lineTo(10, -18); ctx.lineTo(16, -6);
      ctx.fill();
    } else if (enemy.element === 'water') {
      // Shinra Mech Sweeper
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-18, -14, 36, 32);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-14, -8, 28, 14); // Visor
      ctx.fillStyle = '#475569';
      ctx.fillRect(-24, -4, 8, 24);  // Left cannon
      ctx.fillRect(16, -4, 8, 24);   // Right cannon
    } else if (enemy.element === 'earth') {
      // Earth Golem
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-20, -18, 40, 38);
      ctx.fillStyle = '#166534';
      ctx.fillRect(-16, -12, 14, 14);
      ctx.fillRect(2, -12, 14, 14);
      ctx.fillStyle = '#a3e635'; // Moss highlights
      ctx.fillRect(-10, -4, 6, 6);
      ctx.fillRect(8, 6, 8, 6);
      ctx.fillStyle = '#ef4444'; // Red gem eyes
      ctx.fillRect(-10, -8, 4, 4);
      ctx.fillRect(6, -8, 4, 4);
    } else if (enemy.element === 'thunder') {
      // Thunder Drake / Spark Wyrm
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-18, -10, 36, 28);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-14, -10); ctx.lineTo(0, -28); ctx.lineTo(14, -10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -6, 12, 8);
    }

    ctx.restore();
  }
}

// ================= 5. Field Exploration & World (Harvest Summer Pack) =================

class HarvestAssetManager {
  constructor() {
    this.loaded = false;
    this.bg = new Image();
    this.fences = new Image();
    this.objects = new Image();
    this.trees = new Image();
    this.leaves = new Image();
    this.set1 = new Image();

    const base = 'Harvest%20Sumer%20Free%20Ver.%20Pack/';
    this.bg.src = base + 'Harvest%20BG.png';
    this.fences.src = base + 'tilesets/fences%20and%20ladders%20etc.png';
    this.objects.src = base + 'Vegetation/Some%20Objects.png';
    this.trees.src = base + 'Vegetation/Trees%203.png';
    this.leaves.src = base + 'falling%20leaf/4%20frames.png';
    this.set1.src = base + 'tilesets/Set%201.0.png';

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 6) {
        this.loaded = true;
      }
    };

    [this.bg, this.fences, this.objects, this.trees, this.leaves, this.set1].forEach(img => {
      img.onload = checkLoaded;
      img.onerror = checkLoaded;
    });
  }
}
window.harvestAssets = new HarvestAssetManager();

class VfxAssetManager {
  constructor() {
    this.weaponHit = new Image();
    this.weaponHit.src = 'Free%20Pixel%20Effects%20Pack/10_weaponhit_spritesheet.png';

    this.fire = new Image();
    this.fire.src = 'Free%20Pixel%20Effects%20Pack/11_fire_spritesheet.png';

    this.freeze = new Image();
    this.freeze.src = 'Free%20Pixel%20Effects%20Pack/19_freezing_spritesheet.png';

    this.magic = new Image();
    this.magic.src = 'Free%20Pixel%20Effects%20Pack/1_magicspell_spritesheet.png';

    this.chests = new Image();
    this.chestsCanvas = null;
    this.chests.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = this.chests.naturalWidth || this.chests.width;
        c.height = this.chests.naturalHeight || this.chests.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(this.chests, 0, 0);
        const imgData = ctx.getImageData(0, 0, c.width, c.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i+1], b = d[i+2];
          if ((r >= 240 && g >= 240 && b >= 240) || (Math.abs(r - g) <= 6 && Math.abs(g - b) <= 6 && r >= 180)) {
            d[i+3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        this.chestsCanvas = c;
      } catch (err) {
        console.warn('Chests transparency processing warning:', err);
      }
    };
    this.chests.src = 'oubliette_chests_twg/oubliette_chests/chests.PNG';

    this.weapons = new Image();
    this.weapons.src = 'File.png';
  }
}
window.vfxAssets = new VfxAssetManager();

class IsometricTerrainRenderer {
  constructor(width = 2560, height = 2000) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.loaded = false;

    this.grassImages = [];
    this.dirtImages = [];
    this.stoneImages = [];

    const total = 10 + 4 + 4;
    let count = 0;
    const checkReady = () => {
      count++;
      if (count >= total) {
        this.loaded = true;
        this.renderTerrain();
      }
    };

    for (let i = 1; i <= 10; i++) {
      const img = new Image();
      img.onload = checkReady;
      img.onerror = checkReady;
      img.src = `isometric-nature-pack/grass${i}.png`;
      this.grassImages.push(img);
    }
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.onload = checkReady;
      img.onerror = checkReady;
      img.src = `isometric-nature-pack/dirt${i}.png`;
      this.dirtImages.push(img);
    }
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.onload = checkReady;
      img.onerror = checkReady;
      img.src = `isometric-nature-pack/stone${i}.png`;
      this.stoneImages.push(img);
    }
  }

  renderTerrain() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#abd551';
    ctx.fillRect(0, 0, this.width, this.height);

    const stepX = 128;
    const stepY = 50;
    const numRows = Math.ceil(this.height / stepY) + 3;
    const numCols = Math.ceil(this.width / stepX) + 3;

    for (let r = -2; r < numRows; r++) {
      const rowY = r * stepY;
      const offsetX = (Math.abs(r) % 2 === 0) ? 0 : 64;
      for (let c = -2; c < numCols; c++) {
        const colX = c * stepX + offsetX;
        const centerX = colX + 64;
        const centerY = rowY + 32;

        const isHighway = centerY >= 425 && centerY <= 515 && centerX >= 80 && centerX <= 2400;
        const isSouthTrail = centerX >= 890 && centerX <= 990 && centerY >= 480;
        const isDriveway = centerX >= 295 && centerX <= 385 && centerY >= 380 && centerY <= 470;
        const isPlaza = (centerY >= 410 && centerY <= 475) && ((centerX >= 950 && centerX <= 1245) || (centerX >= 1450 && centerX <= 1685));

        let tileImg;
        if (isPlaza) {
          const hash = Math.abs(Math.sin(centerX * 12.9898 + centerY * 78.233) * 43758.5453);
          tileImg = this.stoneImages[Math.floor(hash) % this.stoneImages.length];
        } else if (isHighway || isSouthTrail || isDriveway) {
          const hash = Math.abs(Math.sin(centerX * 12.9898 + centerY * 78.233) * 43758.5453);
          tileImg = this.dirtImages[Math.floor(hash) % this.dirtImages.length];
        } else {
          // Smooth grass weighting: 82% smooth primary grass1, 12% subtle texture grass2/grass3, 6% flower accents
          const hash = Math.abs(Math.sin(centerX * 17.135 + centerY * 91.731) * 43758.5453) % 1.0;
          if (hash < 0.82) {
            tileImg = this.grassImages[0]; // grass1.png (clean flat base)
          } else if (hash < 0.94) {
            tileImg = (hash < 0.88) ? this.grassImages[1] : this.grassImages[2];
          } else {
            tileImg = this.grassImages[6]; // grass7 (soft flowers)
          }
        }

        if (tileImg && tileImg.complete && tileImg.naturalWidth > 0) {
          ctx.drawImage(tileImg, colX, rowY, 129, 130);
        }
      }
    }
  }

  draw(targetCtx) {
    if (this.loaded) {
      targetCtx.drawImage(this.canvas, 0, 0);
    }
  }
}

class ChimneySmoke {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
  }
  update() {
    if (Math.random() < 0.28) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 5,
        y: this.y,
        vx: 0.35 + Math.random() * 0.45,
        vy: -0.75 - Math.random() * 0.5,
        r: 3 + Math.random() * 2.5,
        alpha: 0.65
      });
    }
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.r += 0.08;
      p.alpha -= 0.007;
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }
  draw(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.fillStyle = `rgba(241, 245, 249, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

class PixelHouseRenderer {
  constructor() {
    this.farmSmoke = new ChimneySmoke(256, 252);
    this.shopSmoke = new ChimneySmoke(1200, 250);
  }

  update() {
    this.farmSmoke.update();
    this.shopSmoke.update();
  }

  // 1. Cloud & Tifa's Cozy Farmhouse (Harvest Cottage)
  drawFarmhouse(ctx, x, y, time, assets) {
    ctx.save();

    // Soft ground ambient shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x + 110, y + 155, 125, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chimney & Animated Smoke (behind roof)
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 22, y - 20, 26, 55);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 24, y - 18, 22, 51);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 20, y - 24, 30, 8); // chimney stone cap
    this.farmSmoke.draw(ctx);

    // Main House Walls (Rustic Timber & Siding)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y + 45, 220, 115);

    // Horizontal timber plank siding
    const plankColors = ['#b45309', '#92400e', '#a16207', '#b45309', '#78350f'];
    for (let py = 0; py < 10; py++) {
      ctx.fillStyle = plankColors[py % plankColors.length];
      ctx.fillRect(x + 4, y + 48 + py * 9, 212, 8);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 4, y + 55 + py * 9, 212, 1);
    }

    // Corner vertical timber beams
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 2, y + 45, 12, 115);
    ctx.fillRect(x + 206, y + 45, 12, 115);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y + 45, 2, 115);
    ctx.fillRect(x + 218, y + 45, 2, 115);

    // Stone Foundation Skirt
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 2, y + 138, 216, 22);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 4, y + 140, 212, 18);
    // Stone mortar lines
    ctx.fillStyle = '#1e293b';
    for (let sx = x + 16; sx < x + 210; sx += 22) {
      ctx.fillRect(sx, y + 140, 2, 18);
    }

    // Gable Terracotta Cedar Shingle Roof
    const roofOverhang = 12;
    const rw = 220 + roofOverhang * 2;
    ctx.fillStyle = '#431407';
    ctx.fillRect(x - roofOverhang, y, rw, 50);

    // Layered Shingles
    const shingleBands = ['#9a3412', '#c2410c', '#ea580c', '#c2410c', '#9a3412'];
    shingleBands.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect(x - roofOverhang + 2, y + idx * 9, rw - 4, 8);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(x - roofOverhang + 2, y + idx * 9 + 7, rw - 4, 2);
    });

    // Roof eaves trim
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - roofOverhang - 2, y + 45, rw + 4, 6);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - roofOverhang - 2, y + 51, rw + 4, 2);

    // Triangular Gable Peak Trim
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(x + 110, y - 24);
    ctx.lineTo(x + 20, y + 4);
    ctx.lineTo(x + 200, y + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(x + 110, y - 18);
    ctx.lineTo(x + 30, y + 2);
    ctx.lineTo(x + 190, y + 2);
    ctx.closePath();
    ctx.fill();

    // Attic circular window
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(x + 110, y - 4, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + 110, y - 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 109, y - 13, 2, 18);
    ctx.fillRect(x + 101, y - 5, 18, 2);

    // Cottage Windows (Glowing Warm Amber Light + Window Flowerboxes)
    const drawWindow = (wx, wy) => {
      // Wood frame
      ctx.fillStyle = '#451a03';
      ctx.fillRect(wx - 2, wy - 2, 36, 40);
      // Amber glow
      const grad = ctx.createLinearGradient(wx, wy, wx, wy + 36);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(wx, wy, 32, 36);
      // Window mullions
      ctx.fillStyle = '#451a03';
      ctx.fillRect(wx + 15, wy, 2, 36);
      ctx.fillRect(wx, wy + 17, 32, 2);
      // Glass sheen
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(wx + 2, wy + 2, 10, 4);

      // Flowerbox planter
      ctx.fillStyle = '#78350f';
      ctx.fillRect(wx - 4, wy + 36, 40, 11);
      ctx.fillStyle = '#16a34a'; // greenery
      ctx.fillRect(wx - 3, wy + 33, 38, 5);
      // Red & Yellow pixel flowers
      const flowerColors = ['#ef4444', '#fde047', '#f472b6', '#ef4444', '#fde047'];
      flowerColors.forEach((fc, fi) => {
        ctx.fillStyle = fc;
        ctx.fillRect(wx + fi * 7 + 1, wy + 32 + (fi % 2) * 2, 4, 4);
      });
    };

    drawWindow(x + 30, y + 64);
    drawWindow(x + 154, y + 64);

    // Front Porch Deck & Covered Awning
    const porchX = x + 72;
    const porchY = y + 115;
    const porchW = 76;
    const porchH = 45;

    // Porch wooden deck floor
    ctx.fillStyle = '#78350f';
    ctx.fillRect(porchX, porchY + 20, porchW, 25);
    ctx.fillStyle = '#b45309';
    for (let dy = 0; dy < 4; dy++) {
      ctx.fillRect(porchX + 2, porchY + 22 + dy * 5, porchW - 4, 4);
    }
    // Front stone step
    ctx.fillStyle = '#64748b';
    ctx.fillRect(porchX + 14, porchY + 45, porchW - 28, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(porchX + 16, porchY + 45, porchW - 32, 2);

    // Porch wooden columns
    ctx.fillStyle = '#78350f';
    ctx.fillRect(porchX + 4, porchY - 6, 8, 30);
    ctx.fillRect(porchX + porchW - 12, porchY - 6, 8, 30);

    // Porch canopy roof
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(porchX - 4, porchY - 14, porchW + 8, 10);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(porchX - 6, porchY - 6, porchW + 12, 4);

    // Front Door
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 94, y + 78, 32, 57);
    ctx.fillStyle = '#713f12';
    ctx.fillRect(x + 96, y + 80, 28, 53);
    // Door panels
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 99, y + 84, 10, 20);
    ctx.fillRect(x + 111, y + 84, 10, 20);
    ctx.fillRect(x + 99, y + 108, 10, 20);
    ctx.fillRect(x + 111, y + 108, 10, 20);
    // Brass door handle
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 120, y + 105, 3, 4);

    // Hanging Brass Porch Lantern (Warm Ambient Glow)
    const lx = porchX + porchW / 2;
    const ly = porchY + 4;
    const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 28);
    glow.addColorStop(0, 'rgba(253, 224, 71, 0.7)');
    glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx, ly, 28, 0, Math.PI * 2);
    ctx.fill();

    // Lantern fixture
    ctx.fillStyle = '#451a03';
    ctx.fillRect(lx - 1, ly - 8, 2, 4);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(lx - 4, ly - 4, 8, 9);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lx - 2, ly - 2, 4, 5);

    // Draw Props from Harvest Sumer Pack:
    if (assets && assets.fences && assets.fences.complete && assets.fences.naturalWidth > 0) {
      // Wooden ladder propped against house side
      ctx.drawImage(assets.fences, 96, 64, 16, 32, x + 200, y + 78, 24, 48);
    }
    if (assets && assets.objects && assets.objects.complete && assets.objects.naturalWidth > 0) {
      // Firewood log stack beside chimney wall
      ctx.drawImage(assets.objects, 0, 0, 16, 16, x + 8, y + 130, 24, 24);
      // Apple basket on the porch
      ctx.drawImage(assets.objects, 48, 0, 16, 16, porchX + 4, y + 128, 22, 22);
    }

    ctx.restore();
  }

  // 2. Midgar Edge Village Shop / Item Mart
  drawItemShop(ctx, x, y, time, assets) {
    ctx.save();

    // Ambient ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x + 120, y + 160, 135, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chimney & Smoke
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 195, y - 18, 24, 50);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 192, y - 22, 30, 8);
    this.shopSmoke.draw(ctx);

    // Main Store Walls
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y + 42, 240, 118);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 4, y + 46, 232, 110);

    // Timber framing & stone foundation
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 2, y + 140, 236, 20);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 4, y + 142, 232, 16);

    // Slanted High Gable Cedar Roof
    const rw = 256;
    ctx.fillStyle = '#431407';
    ctx.fillRect(x - 8, y, rw, 46);
    for (let ry = 0; ry < 5; ry++) {
      ctx.fillStyle = ry % 2 === 0 ? '#7c2d12' : '#9a3412';
      ctx.fillRect(x - 6, y + ry * 8, rw - 4, 7);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(x - 6, y + ry * 8 + 6, rw - 4, 1);
    }
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 10, y + 40, rw + 4, 6);

    // Vibrant Striped Crimson & Cream Awning Canopy
    const awX = x + 16;
    const awY = y + 46;
    const awW = 208;
    const awH = 34;

    const numStripes = 13;
    const sw = awW / numStripes;
    for (let s = 0; s < numStripes; s++) {
      ctx.fillStyle = s % 2 === 0 ? '#dc2626' : '#fef3c7';
      ctx.fillRect(awX + s * sw, awY, sw, awH);
      // Scalloped bottom fringe
      ctx.beginPath();
      ctx.arc(awX + s * sw + sw / 2, awY + awH, sw / 2, 0, Math.PI);
      ctx.fill();
    }
    // Awning shadow on counter
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(awX, awY + awH + 4, awW, 6);

    // Hanging Ornate Trade Sign: "ITEM SHOP"
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 55, y + 12, 130, 24);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 55, y + 12, 130, 24);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🛒 ITEM SHOP', x + 120, y + 28);

    // Open Shop Counter Window
    const cwX = x + 34;
    const cwY = y + 90;
    const cwW = 172;
    const cwH = 50;

    // Interior dark backing & shelves
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cwX, cwY, cwW, cwH);

    // Shelves with glowing potion bottles
    ctx.fillStyle = '#312e81';
    ctx.fillRect(cwX, cwY + 18, cwW, 4);

    // Glowing Potions on Shelves
    const potionColors = ['#22c55e', '#38bdf8', '#facc15', '#ec4899', '#22c55e', '#38bdf8'];
    potionColors.forEach((pc, pi) => {
      const px = cwX + 16 + pi * 26;
      const py = cwY + 6;
      ctx.fillStyle = pc;
      ctx.fillRect(px, py + 2, 8, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 2, py, 4, 3); // stopper
      // Sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(px + 2, py + 4, 2, 2);
    });

    // Front Wooden Shop Counter Top
    ctx.fillStyle = '#92400e';
    ctx.fillRect(cwX - 6, cwY + 36, cwW + 12, 14);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cwX - 4, cwY + 38, cwW + 8, 5);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cwX - 6, cwY + 50, cwW + 12, 16);

    // Shopkeeper NPC is rendered standing behind the counter
    const skX = x + 120;
    const skY = cwY + 30;
    // Hair / Face
    ctx.fillStyle = '#ca8a04'; // blonde hair
    ctx.fillRect(skX - 8, skY - 24, 16, 8);
    ctx.fillStyle = '#fed7aa'; // face
    ctx.fillRect(skX - 7, skY - 16, 14, 12);
    ctx.fillStyle = '#0f172a'; // eyes
    ctx.fillRect(skX - 5, skY - 12, 2, 3);
    ctx.fillRect(skX + 3, skY - 12, 2, 3);
    // Apron & shirt
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(skX - 10, skY - 4, 20, 10);
    ctx.fillStyle = '#ffffff'; // white shopkeeper apron
    ctx.fillRect(skX - 7, skY - 2, 14, 8);

    // Props: Fruit crates and cider barrel outside shop
    if (assets && assets.objects && assets.objects.complete && assets.objects.naturalWidth > 0) {
      // Apple crate on side
      ctx.drawImage(assets.objects, 64, 0, 16, 16, x + 192, y + 130, 26, 26);
      ctx.drawImage(assets.objects, 48, 0, 16, 16, x + 16, y + 132, 22, 22);
    }

    ctx.restore();
  }

  // 3. Village Mayor's Manor / Town Hall
  drawMayorManor(ctx, x, y, time, assets) {
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x + 115, y + 158, 130, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main Manor Stone Foundation & Lower Floor
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 46, 230, 114);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 4, y + 50, 222, 106);

    // Whitewashed stone upper storey with Tudor half-timbering
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(x + 8, y + 52, 214, 60);

    // Dark oak half-timber diagonal beams
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 8, y + 52, 10, 60);
    ctx.fillRect(x + 110, y + 52, 10, 60);
    ctx.fillRect(x + 212, y + 52, 10, 60);
    // Diagonal brace
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 52); ctx.lineTo(x + 110, y + 112); ctx.lineTo(x + 102, y + 112); ctx.lineTo(x + 18, y + 60);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 212, y + 52); ctx.lineTo(x + 120, y + 112); ctx.lineTo(x + 128, y + 112); ctx.lineTo(x + 212, y + 60);
    ctx.fill();

    // Slate Blue Curved Roof
    const rw = 246;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 8, y, rw, 48);
    for (let sy = 0; sy < 5; sy++) {
      ctx.fillStyle = sy % 2 === 0 ? '#1e293b' : '#334155';
      ctx.fillRect(x - 6, y + sy * 9, rw - 4, 8);
    }

    // Dormer attic window
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 95, y - 12, 40, 36);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(x + 115, y - 24); ctx.lineTo(x + 90, y - 10); ctx.lineTo(x + 140, y - 10);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 102, y - 2, 26, 22);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 114, y - 2, 2, 22);
    ctx.fillRect(x + 102, y + 8, 26, 2);

    // Stone Porch & Arched Door
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 92, y + 88, 46, 72);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(x + 96, y + 92, 38, 64);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 124, y + 124, 4, 4); // gold knob

    // Twin Manor Windows
    const drawManorWin = (wx, wy) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wx - 2, wy - 2, 34, 38);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(wx, wy, 30, 34);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wx + 14, wy, 2, 34);
      ctx.fillRect(wx, wy + 16, 30, 2);
    };
    drawManorWin(x + 36, y + 74);
    drawManorWin(x + 160, y + 74);

    // Stone Steps & Planters
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 82, y + 154, 66, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 86, y + 154, 58, 2);

    // Climbing Ivy on Left Wall
    ctx.fillStyle = '#15803d';
    for (let iv = 0; iv < 12; iv++) {
      ctx.beginPath();
      ctx.arc(x + 12 + Math.sin(iv * 1.5) * 6, y + 70 + iv * 6, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class FieldWorld {
  constructor(width = 1920, height = 1760) {
    this.width = width;
    this.height = height;

    this.harvestAssets = window.harvestAssets;
    this.houseRenderer = new PixelHouseRenderer();
    this.terrainType = 'isometric';
    this.isoRenderer = new IsometricTerrainRenderer(this.width, this.height);

    // 1. Coins placed along pathways, near houses, and secret corners
    this.coins = [
      { x: 340, y: 530, collected: false },
      { x: 490, y: 470, collected: false },
      { x: 740, y: 470, collected: false },
      { x: 920, y: 470, collected: false },
      { x: 1250, y: 470, collected: false },
      { x: 1440, y: 470, collected: false },
      { x: 380, y: 720, collected: false },
      { x: 940, y: 820, collected: false },
      { x: 940, y: 1240, collected: false },
      { x: 1320, y: 1100, collected: false }
    ];

    // 2. Roaming Monsters placed in the South Wilderness
    this.monsters = [
      { x: 580, y: 1020, element: 'fire', name: 'Fire Hound', defeated: false },
      { x: 1250, y: 920, element: 'earth', name: 'Earth Treant', defeated: false },
      { x: 780, y: 1420, element: 'water', name: 'Sweeper Mech', defeated: false },
      { x: 1480, y: 1440, element: 'boss', name: 'Behemoth', defeated: false, isBoss: true }
    ];

    // 3. Ancient Treasure Chest in south-east grove
    this.chest = { x: 1360, y: 1120, opened: false };

    // 4. Village NPCs
    this.npcs = [
      {
        id: 'tifa',
        x: 440,
        y: 470,
        name: 'Tifa Lockhart',
        role: 'Companion',
        color: '#f43f5e',
        avatar: '🥊',
        text: 'ยินดีต้อนรับกลับบ้านนะคลาวด์! ถ้าต้องการซื้อยาฟื้นพลัง ให้เดินไปที่ร้านค้าทางขวาได้เลย!'
      },
      {
        id: 'shopkeeper',
        x: 1110,
        y: 420,
        name: 'Merchant Anna (แม่ค้าพเนจร)',
        role: 'Merchant',
        color: '#f59e0b',
        avatar: '🛒',
        text: 'ยินดีต้อนรับสู่อาณาจักรร้านค้าแอนนา! มีทั้งยาฟื้นฟู สมุนไพร คลังอาวุธระดับตำนาน และรับซื้อ Material วัตถุดิบทุกชนิดด้วยนะจ๊ะ!',
        isShop: true
      },
      {
        id: 'mayor',
        x: 1530,
        y: 435,
        name: 'Village Mayor',
        role: 'Elder',
        color: '#3b82f6',
        avatar: '📜',
        text: 'สวัสดีพ่อหนุ่มคลาวด์! ฤดูเก็บเกี่ยวปีนี้อุดมสมบูรณ์มาก แต่ระวังสัตว์ร้ายทางทิศใต้ด้วยนะ!'
      }
    ];

    // 5. Solid House Building Collision Boundaries (AABB)
    this.buildings = [
      { id: 'farmhouse', x: 230, y: 280, w: 220, h: 140 },
      { id: 'itemshop',  x: 990, y: 280, w: 230, h: 140 },
      { id: 'mayor',     x: 1470, y: 280, w: 220, h: 140 }
    ];

    // 6. Solid Fence Collision Boundaries (Paddock enclosing the farmstead)
    this.fences = [
      // Top fence line (with gate gap at 350..415)
      { x: 140, y: 540, w: 210, h: 18 },
      { x: 420, y: 540, w: 190, h: 18 },
      // Bottom fence line
      { x: 140, y: 840, w: 470, h: 18 },
      // Left fence line
      { x: 140, y: 540, w: 18, h: 310 },
      // Right fence line
      { x: 600, y: 540, w: 18, h: 310 }
    ];

    // 7. 2D Pixel Art Summer Trees from Trees 3.png
    // Pure grass clearings in the open southern meadows (100% free of houses, fences, roads, and stumps)
    // Minimum 320px spacing between trees for wide breathing room and clean composition.
    this.pixelTrees = [
      // East Orchard Pasture (south of Mayor's house, wide open meadow)
      { x: 1750, y: 685, type: 3 }, // Evergreen Pine

      // Village South Entrance (south of main road, east of paddock)
      { x: 775, y: 640, type: 1 }, // Golden Flowering Oak

      // Sunny Central Glade (east of South Trail, wide peaceful meadow)
      { x: 1105, y: 820, type: 0 }, // Broadleaf Summer Oak

      // South-West Wilderness Clearing (west of South Trail, clear grassy plain)
      { x: 415, y: 1135, type: 2 }, // Cypress Pine

      // South-East Wildflower Meadow (north of Boss area, open clearing)
      { x: 1540, y: 1225, type: 1 }, // Golden Flowering Oak

      // South Wildlands Haven (south-central clear expanse)
      { x: 1225, y: 1375, type: 3 } // Evergreen Pine
    ];

    // Maintain backwards compatibility for treeCache / 3D trees
    this.trees = [];
  }

  // Draw Ground Terrain & Character Walking Paths
  drawTerrain(ctx, time) {
    ctx.imageSmoothingEnabled = false;

    // 1. Isometric Nature Pack Ground Mode
    if (this.terrainType === 'isometric' && this.isoRenderer && this.isoRenderer.loaded) {
      this.isoRenderer.draw(ctx);
      return;
    }

    // 2. Draw Harvest BG.png (1920x1760 pixel art background)
    if (this.harvestAssets.loaded && this.harvestAssets.bg.complete && this.harvestAssets.bg.naturalWidth > 0) {
      ctx.drawImage(this.harvestAssets.bg, 0, 0, this.width, this.height);
    } else {
      // Lush procedural grass fallback
      ctx.fillStyle = '#2f983d';
      ctx.fillRect(0, 0, this.width, this.height);
      // Subtle grass texture
      ctx.fillStyle = '#278334';
      for (let gx = 0; gx < this.width; gx += 40) {
        for (let gy = 0; gy < this.height; gy += 40) {
          if ((gx + gy) % 80 === 0) {
            ctx.fillRect(gx + 4, gy + 8, 6, 3);
          }
        }
      }
    }

    // 2. Character Walk Paths & Roads (พื้นที่เราเดิน ที่ตัวละครเดิน)
    // We render natural dirt road networks connecting all key areas
    const drawDirtPathSegment = (px, py, pw, ph) => {
      // Base dirt color
      ctx.fillStyle = '#c95e37';
      ctx.fillRect(px, py, pw, ph);
      // Earthen warm undertone
      ctx.fillStyle = '#82392b';
      ctx.fillRect(px, py + ph - 3, pw, 3);
      ctx.fillRect(px, py, pw, 3);
      // Path cobblestones / pebbles
      ctx.fillStyle = '#e68f45';
      const count = Math.floor((pw * ph) / 300);
      for (let i = 0; i < count; i++) {
        const sx = px + 6 + (Math.sin(i * 19.3) * 0.5 + 0.5) * (pw - 14);
        const sy = py + 4 + (Math.cos(i * 27.7) * 0.5 + 0.5) * (ph - 10);
        ctx.fillRect(Math.round(sx), Math.round(sy), 4, 3);
      }
    };

    // A. Main Village East-West Highway
    drawDirtPathSegment(100, 445, 1720, 60);

    // B. Cloud's Farmhouse Driveway (connecting porch to main road)
    drawDirtPathSegment(310, 410, 75, 55);

    // C. South Adventure Trail (leading to monsters & treasure)
    drawDirtPathSegment(910, 495, 65, 1160);

    // D. Item Shop & Plaza Cobblestone Paving
    ctx.fillStyle = '#a44b32';
    ctx.fillRect(960, 415, 290, 45);
    ctx.fillStyle = '#c95e37';
    for (let bx = 964; bx < 1240; bx += 18) {
      for (let by = 418; by < 455; by += 12) {
        ctx.fillRect(bx, by, 16, 10);
      }
    }

    // E. Mayor's Manor Entrance Flagstones
    ctx.fillStyle = '#a44b32';
    ctx.fillRect(1460, 415, 210, 45);
    for (let bx = 1464; bx < 1660; bx += 20) {
      for (let by = 418; by < 455; by += 12) {
        ctx.fillRect(bx, by, 18, 10);
      }
    }
  }

  drawCoins(ctx, time) {
    const bob = Math.sin(time / 240) * 4;
    this.coins.forEach(c => {
      if (c.collected) return;
      ctx.save();
      ctx.translate(c.x, c.y + bob);
      // Soft glow
      ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      // Gold coin
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-2, -2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawChest(ctx) {
    const assets = window.vfxAssets;
    if (assets && assets.chests && assets.chests.complete && assets.chests.naturalWidth > 0) {
      let frame = 0;
      if (this.chest.opened) {
        const elapsed = (performance.now() - (this.chest.openedAt || 0));
        frame = Math.min(3, Math.floor(elapsed / 90));
      }
      const sx = 277 + frame * 23;
      const sy = 184;
      const sw = 21;
      const sh = 21;
      const dw = 42;
      const dh = 42;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(this.chest.x, this.chest.y + 12, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        assets.chestsCanvas || assets.chests,
        sx, sy, sw, sh,
        Math.round(this.chest.x - dw / 2), Math.round(this.chest.y - dh / 2),
        dw, dh
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(this.chest.x, this.chest.y);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 8, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = this.chest.opened ? '#451a03' : '#78350f';
      ctx.fillRect(-18, -14, 36, 26);
      ctx.restore();
    }
  }

  drawMonster(ctx, m, time) {
    ctx.save();
    ctx.translate(m.x, m.y + Math.sin(time / 300 + m.x) * 3);

    // Alert [ ! ] or Chase [ 💢 ] Indicator Bubble
    if (m.state === 'alert') {
      const alertBob = Math.sin(time / 80) * 4;
      ctx.save();
      ctx.translate(0, -36 + alertBob);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', 0, 4);
      ctx.restore();
    } else if (m.state === 'chase') {
      const angerPulse = Math.sin(time / 60) * 3;
      ctx.save();
      ctx.translate(0, -36 + angerPulse);
      ctx.fillStyle = '#dc2626';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💢', 0, 0);
      ctx.restore();
    }

    // Warning Aura
    ctx.fillStyle = (m.state === 'chase') ? 'rgba(239, 68, 68, 0.6)'
                   : (m.state === 'alert') ? 'rgba(245, 158, 11, 0.5)'
                   : m.element === 'fire' ? 'rgba(239, 68, 68, 0.35)'
                   : m.element === 'water' ? 'rgba(56, 189, 248, 0.35)'
                   : m.element === 'boss' ? 'rgba(139, 92, 246, 0.5)'
                   : 'rgba(34, 197, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, m.isBoss ? 44 : 26, 0, Math.PI * 2);
    ctx.fill();

    // Monster Sprite Marker
    ctx.fillStyle = (m.state === 'chase') ? '#b91c1c' : (m.isBoss ? '#7c3aed' : '#dc2626');
    const size = m.isBoss ? 36 : 24;
    ctx.fillRect(-size/2, -size/2, size, size);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(m.element === 'fire' ? '🔥' : m.element === 'water' ? '💧' : m.isBoss ? '💀' : '🌿', 0, 4);

    // Name tag
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px Outfit, sans-serif';
    const tag = (m.state === 'chase') ? `💢 ${m.name} (CHASE!)` : (m.state === 'alert') ? `⚠️ ${m.name} (!)` : m.name;
    ctx.fillText(tag, 0, m.isBoss ? -24 : -18);
    ctx.restore();
  }

  // Draw Fences & Paddock Gates
  drawFences(ctx) {
    const assets = this.harvestAssets;
    const hasFenceImg = assets.loaded && assets.fences.complete && assets.fences.naturalWidth > 0;

    // A. Draw Archway Gate at Farmstead entrance (350, 495)
    if (hasFenceImg) {
      // Arch gate composite: sx: 96, sy: 0, sw: 32, sh: 48 scaled 2x -> 64x96
      ctx.drawImage(assets.fences, 96, 0, 32, 48, 350, 470, 64, 96);
    } else {
      // Procedural wooden archway fallback
      ctx.fillStyle = '#78350f';
      ctx.fillRect(355, 475, 10, 70);
      ctx.fillRect(405, 475, 10, 70);
      ctx.fillRect(350, 470, 70, 14);
    }

    // B. Draw Farm Paddock Fences
    // Top fence segments
    const drawFenceLineH = (x1, x2, fy) => {
      for (let fx = x1; fx < x2; fx += 32) {
        if (hasFenceImg) {
          ctx.drawImage(assets.fences, 32, 64, 32, 24, fx, fy - 18, 32, 24);
        } else {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(fx, fy - 14, 32, 14);
          ctx.fillStyle = '#451a03';
          ctx.fillRect(fx, fy - 14, 4, 16);
        }
      }
    };

    drawFenceLineH(140, 350, 545);
    drawFenceLineH(414, 600, 545);
    drawFenceLineH(140, 600, 845);

    // Vertical side fences
    const drawFenceLineV = (fx, y1, y2) => {
      for (let fy = y1; fy < y2; fy += 28) {
        if (hasFenceImg) {
          ctx.drawImage(assets.fences, 32, 32, 16, 28, fx, fy, 16, 28);
        } else {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(fx, fy, 8, 28);
        }
      }
    };
    drawFenceLineV(140, 545, 845);
    drawFenceLineV(600, 545, 845);

    // C. Mailboxes from Pack
    if (hasFenceImg) {
      // Farmhouse mailbox
      ctx.drawImage(assets.fences, 112, 64, 16, 24, 415, 450, 24, 36);
      // Mayor mailbox
      ctx.drawImage(assets.fences, 112, 64, 16, 24, 1435, 440, 24, 36);
      // Crossroads guidepost sign (680, 440)
      ctx.drawImage(assets.fences, 128, 64, 16, 24, 680, 440, 26, 38);
    }
  }

  // Draw 2D Pixel Tree (Clean single sprite, authentic proportions, zero clipping)
  drawPixelTree(ctx, tree) {
    const assets = this.harvestAssets;
    const hasTreeImg = assets.loaded && assets.trees.complete && assets.trees.naturalWidth > 0;
    const scale = 2.0;

    if (hasTreeImg) {
      if (tree.type === 0 || tree.type === 1) {
        // Broadleaf Summer Oak (Type 0 = Summer Green, Type 1 = Golden/Blossom)
        // Authentic sprite size: 48x54 px (includes crown, trunk, and roots)
        const sx = tree.type === 0 ? 0 : 48;
        const sy = 0;
        const sw = 48;
        const sh = 54;

        const dw = sw * scale; // 96px
        const dh = sh * scale; // 108px

        // Soft ground shadow at base of tree
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(tree.x, tree.y - 4, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw complete oak tree
        ctx.drawImage(
          assets.trees,
          sx, sy, sw, sh,
          Math.round(tree.x - dw / 2), Math.round(tree.y - dh),
          dw, dh
        );
      } else {
        // Evergreen Pine / Cypress (Type 2 = Pine 1, Type 3 = Pine 2)
        // Authentic sprite size: 29x47 px (from y=16 to 63)
        const sx = tree.type === 2 ? 98 : 128;
        const sy = 16;
        const sw = 29;
        const sh = 47;

        const pw = sw * scale; // 58px
        const ph = sh * scale; // 94px

        // Soft ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(tree.x, tree.y - 4, 22, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw complete pine tree
        ctx.drawImage(
          assets.trees,
          sx, sy, sw, sh,
          Math.round(tree.x - pw / 2), Math.round(tree.y - ph),
          pw, ph
        );
      }
    } else {
      // Procedural pixel tree fallback
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(tree.x, tree.y - 4, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tree.x - 7, tree.y - 30, 14, 30);
      ctx.fillStyle = tree.type === 1 ? '#ca8a04' : '#15803d';
      ctx.beginPath();
      ctx.arc(tree.x, tree.y - 50, 32, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw NPC Character on Field
  drawNpc(ctx, npc, time) {
    ctx.save();
    ctx.translate(npc.x, npc.y);

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite Body (Retro RPG Style)
    const bob = Math.sin(time / 280 + npc.x) * 1.5;
    ctx.translate(0, bob);

    // Body Outfit
    ctx.fillStyle = npc.color || '#3b82f6';
    ctx.fillRect(-9, -24, 18, 22);

    // Face / Head
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -36, 14, 13);

    // Hair
    ctx.fillStyle = npc.id === 'tifa' ? '#1c1917' : npc.id === 'mayor' ? '#94a3b8' : '#eab308';
    ctx.fillRect(-8, -39, 16, 7);
    if (npc.id === 'tifa') {
      // Long hair down
      ctx.fillRect(-9, -32, 4, 18);
    }

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -30, 2, 3);
    ctx.fillRect(2, -30, 2, 3);

    // Name Plate & Role
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(-38, -54, 76, 14);
    ctx.strokeStyle = npc.color || '#3b82f6';
    ctx.lineWidth = 1;
    ctx.strokeRect(-38, -54, 76, 14);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${npc.avatar} ${npc.name}`, 0, -44);

    ctx.restore();
  }

  // Draw Interaction Prompt when Player is nearby
  drawInteractPrompt(ctx, text, x, y) {
    // Cache measureText results to avoid expensive measurement every frame
    if (!this._promptWidthCache) this._promptWidthCache = {};
    ctx.font = 'bold 9px Outfit, sans-serif';
    if (this._promptWidthCache[text] === undefined) {
      this._promptWidthCache[text] = ctx.measureText(text).width + 18;
    }
    const textW = this._promptWidthCache[text];
    ctx.save();
    ctx.translate(x, y - 55);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(-textW / 2, -10, textW, 20);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-textW / 2, -10, textW, 20);

    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 4);
    ctx.restore();
  }

  // Master Field Render Loop
  draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir) {
    this.houseRenderer.update();

    // 1. Base Terrain & Walking Roads
    this.drawTerrain(ctx, time);

    // 2. Fences, Gates & Enclosures
    this.drawFences(ctx);

    // 3. Golden Coins
    this.drawCoins(ctx, time);

    // 4. Depth / Y-Sorted Entities (Houses, Trees, Props, NPCs, Chest, Monsters, Player)
    const renderList = [];

    // A. Houses
    renderList.push({
      y: 420, // Farmhouse base line
      draw: () => this.houseRenderer.drawFarmhouse(ctx, 230, 270, time, this.harvestAssets)
    });
    renderList.push({
      y: 425, // Item Shop base line
      draw: () => this.houseRenderer.drawItemShop(ctx, 990, 270, time, this.harvestAssets)
    });
    renderList.push({
      y: 425, // Mayor Manor base line
      draw: () => this.houseRenderer.drawMayorManor(ctx, 1470, 270, time, this.harvestAssets)
    });

    // B. 2D Pixel Trees
    this.pixelTrees.forEach(t => {
      renderList.push({
        y: t.y,
        draw: () => this.drawPixelTree(ctx, t)
      });
    });

    // C. NPCs
    this.npcs.forEach(npc => {
      renderList.push({
        y: npc.y,
        draw: () => this.drawNpc(ctx, npc, time)
      });
    });

    // D. Treasure Chest
    renderList.push({
      y: this.chest.y,
      draw: () => this.drawChest(ctx)
    });

    // E. Roaming Field Monsters
    this.monsters.forEach(m => {
      if (!m.defeated) {
        renderList.push({
          y: m.y,
          draw: () => this.drawMonster(ctx, m, time)
        });
      }
    });

    // F. Player (Hero Cloud Strife)
    renderList.push({
      y: playerY,
      draw: () => cloudFieldRenderer.draw(ctx, playerX, playerY, playerDir, animFrame, playerState, 1.1, (window.playerAttackState ? window.playerAttackState.comboStep : 1), (window.playerAttackState ? window.playerAttackState.progress : 0))
    });

    // Sort back-to-front by Y coordinate!
    renderList.sort((a, b) => a.y - b.y);

    // Render all sorted items
    renderList.forEach(item => item.draw());

    // 5. Interaction Prompts when Cloud is nearby
    this.npcs.forEach(npc => {
      if (Math.hypot(playerX - npc.x, playerY - npc.y) < 65) {
        const label = npc.isShop ? '🛒 [SPACE] เข้าสู่ร้านค้า (SHOP)' : '💬 [SPACE] พูดคุย (TALK)';
        this.drawInteractPrompt(ctx, label, npc.x, npc.y - 12);
      }
    });

    if (!this.chest.opened && Math.hypot(playerX - this.chest.x, playerY - this.chest.y) < 55) {
      this.drawInteractPrompt(ctx, '🌟 [SPACE] เปิดหีบสมบัติ (OPEN)', this.chest.x, this.chest.y);
    }
  }
}

// CityMap legacy shim for complete backward-compatibility

// ================= Enhanced Map Worlds: Whisper Forest & Forgotten Dungeon =================
class ForestWorld extends FieldWorld {
  constructor() {
    super(1920, 1760);
    this.name = 'Whisper Forest';
    this.description = 'ป่าดงดิบทางทิศตะวันออก มีสัตว์ร้ายชุกชุมและมีทางเชื่อมสู่ซากดันเจี้ยนโบราณ';
    this.monsters = [
      { x: 620, y: 920, element: 'fire', name: 'Hellhound', defeated: false },
      { x: 1220, y: 820, element: 'water', name: 'Water Slime', defeated: false },
      { x: 800, y: 1340, element: 'earth', name: 'Earth Treant', defeated: false },
      { x: 1420, y: 1280, element: 'thunder', name: 'Spark Drake', defeated: false }
    ];
    this.chest = { x: 1380, y: 1100, opened: false, type: 'forest' };
    this.herbNode = { x: 450, y: 750, gathered: false };
    // Forest doesn't have town houses, only dense trees
    this.buildings = [];
  }

  draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir) {
    super.draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir);

    // Draw Ancient Archway to Dungeon at (1600, 280)
    ctx.save();
    ctx.translate(1600, 280);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-35, -70, 70, 70);
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(0, -35, 24, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-24, -35, 48, 35);
    // Glowing runic portal
    ctx.fillStyle = 'rgba(56, 189, 248, ' + (0.35 + Math.sin(time / 200) * 0.2) + ')';
    ctx.fillRect(-20, -32, 40, 32);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️ DUNGEON ENTRANCE', 0, -80);
    ctx.restore();

    // Draw Herb Gathering Node at (450, 750)
    if (!this.herbNode.gathered) {
      ctx.save();
      ctx.translate(this.herbNode.x, this.herbNode.y);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🌿', 0, 5);
      if (Math.hypot(playerX - this.herbNode.x, playerY - this.herbNode.y) < 55) {
        this.drawInteractPrompt(ctx, '🌿 [SPACE] เก็บสมุนไพร (GATHER)', 0, -20);
      }
      ctx.restore();
    }

    // Portal Prompt near Dungeon Entrance
    if (Math.hypot(playerX - 1600, playerY - 280) < 70) {
      this.drawInteractPrompt(ctx, '🏛️ [SPACE] เข้าสู่ซากดันเจี้ยน (ENTER DUNGEON)', 1600, 230);
    }
  }
}

// ================= High-Fidelity Torch Brazier & Dynamic Lighting System =================
class TorchBrazierRenderer {
  constructor() {
    this.torches = new Map(); // id -> particle pool
    this.fireSprite = new Image();
    this.fireSpriteLoaded = false;
    this.fireSprite.src = 'Free Pixel Effects Pack/11_fire_spritesheet.png';
    this.fireSprite.onload = () => { this.fireSpriteLoaded = true; };
  }

  getParticles(id) {
    if (!this.torches.has(id)) {
      const particles = [];
      for (let i = 0; i < 8; i++) {
        particles.push(this.createParticle(true));
      }
      this.torches.set(id, particles);
    }
    return this.torches.get(id);
  }

  createParticle(randomInitialAge = false) {
    const lifeMax = 42 + Math.random() * 45;
    return {
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 8 - 28,
      vx: (Math.random() - 0.5) * 0.75,
      vy: -(0.85 + Math.random() * 1.55),
      size: 1.5 + Math.random() * 2.2,
      life: randomInitialAge ? Math.random() * lifeMax : 0,
      lifeMax: lifeMax,
      seed: Math.random() * 100
    };
  }

  // Draw Ornate Stone Pedestal + Metal Brazier Bowl + Lively Flame + Rising Embers
  draw(ctx, x, y, time, torchId = 't_0') {
    ctx.save();
    ctx.translate(x, y);

    // 1. Soft Ambient Contact Shadow under Pillar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 28, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 15, 36, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Stone Pillar Pedestal (3-tier Gothic Carved Stone - Warm Dungeon Granite)
    // --- Bottom Plinth (Base) ---
    const gradBase = ctx.createLinearGradient(-24, 0, 24, 0);
    gradBase.addColorStop(0, '#1c1917');
    gradBase.addColorStop(0.3, '#292524');
    gradBase.addColorStop(0.7, '#44403c');
    gradBase.addColorStop(1, '#0c0a09');
    ctx.fillStyle = gradBase;
    ctx.fillRect(-22, 2, 44, 12);

    ctx.fillStyle = '#57534e';
    ctx.fillRect(-22, 2, 44, 2);
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(-22, 12, 44, 2);

    // --- Central Column Shaft ---
    const gradShaft = ctx.createLinearGradient(-18, 0, 18, 0);
    gradShaft.addColorStop(0, '#1c1917');
    gradShaft.addColorStop(0.2, '#292524');
    gradShaft.addColorStop(0.5, '#44403c');
    gradShaft.addColorStop(0.8, '#292524');
    gradShaft.addColorStop(1, '#0c0a09');
    ctx.fillStyle = gradShaft;
    ctx.fillRect(-17, -34, 34, 36);

    // Carved stone vertical grooves & stone texture details
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-11, -32, 2, 32);
    ctx.fillRect(9, -32, 2, 32);
    ctx.fillStyle = '#57534e';
    ctx.fillRect(-9, -32, 1, 32);
    ctx.fillRect(11, -32, 1, 32);

    // Gothic chisel diamond relief on front
    ctx.strokeStyle = 'rgba(12, 10, 9, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -22, 12, 12);
    ctx.fillStyle = 'rgba(87, 83, 78, 0.4)';
    ctx.fillRect(-5, -21, 10, 10);

    // --- Top Capital / Collar ---
    const gradCap = ctx.createLinearGradient(-22, 0, 22, 0);
    gradCap.addColorStop(0, '#1c1917');
    gradCap.addColorStop(0.3, '#44403c');
    gradCap.addColorStop(0.7, '#57534e');
    gradCap.addColorStop(1, '#1c1917');
    ctx.fillStyle = gradCap;
    ctx.fillRect(-21, -44, 42, 10);
    ctx.fillStyle = '#78716c';
    ctx.fillRect(-21, -44, 42, 2); // Top rim highlight

    // 3. Forged Iron Brazier Bowl & Mounts
    ctx.strokeStyle = '#0c0a09';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, -34);
    ctx.quadraticCurveTo(-26, -42, -22, -50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(16, -34);
    ctx.quadraticCurveTo(26, -42, 22, -50);
    ctx.stroke();

    // Rivet studs
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(-17, -35, 3, 3);
    ctx.fillRect(14, -35, 3, 3);

    // Metal Fire Bowl Body
    const gradBowl = ctx.createLinearGradient(0, -56, 0, -42);
    gradBowl.addColorStop(0, '#292524');
    gradBowl.addColorStop(0.5, '#1c1917');
    gradBowl.addColorStop(1, '#0c0a09');
    ctx.fillStyle = gradBowl;
    ctx.beginPath();
    ctx.moveTo(-20, -48);
    ctx.quadraticCurveTo(0, -40, 20, -48);
    ctx.lineTo(16, -44);
    ctx.lineTo(-16, -44);
    ctx.closePath();
    ctx.fill();

    // Bowl rim
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -48, 20, 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Glowing Charcoal / Hot Ember Bed inside Bowl
    const heatPulse = 0.7 + Math.sin(time / 120 + x) * 0.25;
    ctx.fillStyle = `rgba(234, 88, 12, ${heatPulse})`;
    ctx.beginPath();
    ctx.ellipse(0, -48, 17, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(251, 191, 36, ${heatPulse + 0.15})`;
    ctx.beginPath();
    ctx.ellipse(0, -49, 11, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Dynamic Blazing Fire Flame
    this.drawFlame(ctx, 0, -50, time, x + y);

    // 5. Rising Ember Spark Particles
    this.drawEmbers(ctx, torchId);

    ctx.restore();
  }

  // Draw Realistic Multi-Layer Organic Flame
  drawFlame(ctx, ox, oy, time, seed) {
    ctx.save();
    ctx.translate(ox, oy);

    const sway1 = Math.sin(time / 110 + seed * 2) * 3.5;
    const sway2 = Math.cos(time / 95 + seed) * 2.5;
    const heightPulse = Math.sin(time / 70 + seed) * 4;

    // Layer 1: Ambient Fire Halo (Fast soft glow)
    ctx.fillStyle = 'rgba(251, 146, 60, 0.2)';
    ctx.beginPath();
    ctx.arc(0, -14, 26, 0, Math.PI * 2);
    ctx.fill();

    // Layer 2: Outer Crimson Flame Tongues (Dynamic Bezier)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-16, 2);
    ctx.quadraticCurveTo(-18 + sway1, -18, -4 + sway2, -38 + heightPulse);
    ctx.quadraticCurveTo(8 + sway1, -22, 16, 2);
    ctx.quadraticCurveTo(0, -4, -16, 2);
    ctx.closePath();
    ctx.fill();

    // Second licking outer tongue
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-14, 1);
    ctx.quadraticCurveTo(-10 + sway2, -24, 2 + sway1, -44 + heightPulse * 0.8);
    ctx.quadraticCurveTo(12 + sway2, -18, 14, 1);
    ctx.closePath();
    ctx.fill();

    // Layer 3: Vibrant Blazing Orange Flame
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-12, 1);
    ctx.quadraticCurveTo(-12 + sway1 * 0.7, -16, -1 + sway2 * 0.7, -34 + heightPulse * 0.7);
    ctx.quadraticCurveTo(10 + sway1 * 0.7, -16, 12, 1);
    ctx.closePath();
    ctx.fill();

    // Layer 4: Hot Golden-Yellow Flame Core
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.quadraticCurveTo(-7 + sway2 * 0.5, -12, 0 + sway1 * 0.5, -24 + heightPulse * 0.5);
    ctx.quadraticCurveTo(7 + sway2 * 0.5, -12, 8, 0);
    ctx.closePath();
    ctx.fill();

    // Layer 5: Brilliant White-Hot Center
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(-4, -7, 0, -14 + heightPulse * 0.3);
    ctx.quadraticCurveTo(4, -7, 4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Draw Rising Ember Sparks (batched for peak 60 FPS)
  drawEmbers(ctx, torchId) {
    const particles = this.getParticles(torchId);
    ctx.save();
    particles.forEach(p => {
      p.life += 1;
      p.x += p.vx + Math.sin(p.life * 0.15 + p.seed) * 0.45;
      p.y += p.vy;

      if (p.life >= p.lifeMax) {
        Object.assign(p, this.createParticle(false));
      }

      const progress = p.life / p.lifeMax;
      const alpha = progress < 0.2 ? progress / 0.2 : (1 - progress);
      const curSize = p.size * (1 - progress * 0.65);

      let col = '#fef08a';
      if (progress > 0.65) col = '#dc2626';
      else if (progress > 0.3) col = '#f97316';

      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.9));
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x, p.y - 20, curSize, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Draw Arcane Ritual Magic Circle etched into ground
  drawArcaneCircle(ctx, cx, cy, time, radius = 120, color = 'rgba(239, 68, 68,') {
    ctx.save();
    ctx.translate(cx, cy);

    const rot1 = time * 0.00035;
    const rot2 = -time * 0.00028;
    const pulse = 0.55 + Math.sin(time / 250) * 0.22;

    // Glowing ground aura
    const groundGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.3);
    groundGlow.addColorStop(0, color + `${0.22 * pulse})`);
    groundGlow.addColorStop(0.6, color + `${0.08 * pulse})`);
    groundGlow.addColorStop(1, color + '0)');
    ctx.fillStyle = groundGlow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Outer Circle Ring
    ctx.strokeStyle = color + `${0.7 * pulse})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary Outer Concentric Ring
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.88, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Outer Glyph Ticks / Celestial Runes
    ctx.save();
    ctx.rotate(rot1);
    ctx.strokeStyle = color + `${0.6 * pulse})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI * 2) / 24;
      const x1 = Math.cos(a) * (radius * 0.88);
      const y1 = Math.sin(a) * (radius * 0.88);
      const x2 = Math.cos(a) * radius;
      const y2 = Math.sin(a) * radius;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    // Middle Concentric Ring
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Counter-Rotating Geometric Star (Pentagram)
    ctx.save();
    ctx.rotate(rot2);
    ctx.strokeStyle = color + `${0.75 * pulse})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    const points = 5;
    for (let i = 0; i < points; i++) {
      const a = (i * Math.PI * 4) / points - Math.PI / 2;
      const px = Math.cos(a) * (radius * 0.7);
      const py = Math.sin(a) * (radius * 0.7);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner Star Inscribed Circle
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Central Occult Core Eye / Pulsing Ember
    ctx.fillStyle = color + `${0.85 * pulse})`;
    ctx.beginPath();
    ctx.arc(0, 0, 8 + Math.sin(time / 140) * 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
const torchBrazierRenderer = new TorchBrazierRenderer();

class DungeonLightingEngine {
  constructor() {}

  renderLighting(mainCtx, time, world, playerX, playerY, camX, camY) {
    const w = mainCtx.canvas.width;
    const h = mainCtx.canvas.height;

    mainCtx.save();
    // 1. Natural dark dungeon vignette (smooth neutral darkness, no harsh blue tint)
    const vig = mainCtx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.38, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(2, 4, 8, 0.42)');
    mainCtx.fillStyle = vig;
    mainCtx.fillRect(0, 0, w, h);

    // 2. Soft warm ambient torch glows (only for visible on-screen torches!)
    if (world.torches) {
      world.torches.forEach(t => {
        const sx = t.x + camX;
        const sy = t.y + camY - 50;
        if (sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80) return;

        const flicker = Math.sin(time / 110 + t.x) * 4;
        const radius = 80 + flicker;
        const warmGrad = mainCtx.createRadialGradient(sx, sy, 0, sx, sy, radius);
        warmGrad.addColorStop(0, 'rgba(251, 146, 60, 0.16)');
        warmGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
        warmGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        mainCtx.fillStyle = warmGrad;
        mainCtx.beginPath();
        mainCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        mainCtx.fill();
      });
    }
    mainCtx.restore();
  }
}
const dungeonLightingEngine = new DungeonLightingEngine();

// ================= RPG Dungeon Assets & Decorative System =================
class DungeonAssetsManager {
  constructor() {
    this.images = {};
    this.loaded = {};
    this.patterns = {};

    this.loadImage('stoneGround', 'assets/Stone_cemetery/Texture/TX Tileset Stone Ground.png');
    this.loadImage('stoneWall', 'assets/Stone_cemetery/Texture/TX Tileset Wall.png');
    this.loadImage('floorCastle', 'assets/Top_Down_Kingdom_Tileset_FREE/Tilesets/Floor_1.png');
    this.loadImage('bigAngel', 'assets/Stone_cemetery/Sculptures/Big_angel_sculpture/Sculpture_01.png');
    this.loadImage('smallAngel', 'assets/Stone_cemetery/Sculptures/Small_angel_sculpture/Sculpture_01.png');
    this.loadImage('column', 'assets/Stone_cemetery/Crosses_&_gravestones/Columns/Column_01.png');
    this.loadImage('gravestone1', 'assets/Stone_cemetery/Crosses_&_gravestones/Gravestones/Gravestone_01.png');
    this.loadImage('gravestone2', 'assets/Stone_cemetery/Crosses_&_gravestones/Gravestones/Gravestone_02.png');
    this.loadImage('monsterWalkFront', 'assets/Dungeon assets pack/Characters/Monster/Monster_walk_front.png');
    this.loadImage('monsterWalkBack', 'assets/Dungeon assets pack/Characters/Monster/Monster_walk_back.png');
    this.loadImage('banditHeavy', 'assets/Bandits/Sprites/Heavy Bandit/Idle/HeavyBandit_Idle_0.png');
    this.loadImage('banditLight', 'assets/Bandits/Sprites/Light Bandit/Idle/LightBandit_Idle_0.png');
    this.loadImage('lockIcon', 'assets/Free Icon Pack v3.1 (Basic)/Free Icon Pack v3.1 (Basic)/Item/Lock/64px/Lock 1st 64px.png');
    this.loadImage('unlockIcon', 'assets/Free Icon Pack v3.1 (Basic)/Free Icon Pack v3.1 (Basic)/Item/Lock/64px/Unlock 1st 64px.png');
  }

  loadImage(key, src) {
    const img = new Image();
    img.src = src;
    img.onload = () => { this.loaded[key] = true; };
    this.images[key] = img;
  }

  getPattern(ctx, key) {
    if (!this.loaded[key]) return null;
    if (!this.patterns[key]) {
      this.patterns[key] = ctx.createPattern(this.images[key], 'repeat');
    }
    return this.patterns[key];
  }

  drawBigAngel(ctx, x, y, scale = 0.85) {
    if (this.loaded['bigAngel']) {
      const img = this.images['bigAngel'];
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x, y + 10, w * 0.35, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, x - w / 2, y - h + 10, w, h);
      ctx.restore();
    }
  }

  drawSmallAngel(ctx, x, y, scale = 0.8) {
    if (this.loaded['smallAngel']) {
      const img = this.images['smallAngel'];
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x, y + 6, w * 0.3, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, x - w / 2, y - h + 6, w, h);
      ctx.restore();
    }
  }

  drawColumn(ctx, x, y, scale = 0.9) {
    if (this.loaded['column']) {
      const img = this.images['column'];
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x, y + 6, w * 0.4, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, x - w / 2, y - h + 6, w, h);
      ctx.restore();
    }
  }

  drawGravestone(ctx, x, y, type = 1, scale = 0.9) {
    const key = type === 2 ? 'gravestone2' : 'gravestone1';
    if (this.loaded[key]) {
      const img = this.images[key];
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x, y + 4, w * 0.35, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, x - w / 2, y - h + 4, w, h);
      ctx.restore();
    }
  }

  drawMonster(ctx, m, time) {
    const anim = Math.floor((time / 200) % 4);
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    let drawn = false;
    if (m.element === 'fire' || m.element === 'thunder') {
      const bKey = m.element === 'fire' ? 'banditHeavy' : 'banditLight';
      if (this.loaded[bKey]) {
        const img = this.images[bKey];
        ctx.drawImage(img, -24, -36, 48, 48);
        drawn = true;
      }
    } else {
      if (this.loaded['monsterWalkFront']) {
        const img = this.images['monsterWalkFront'];
        ctx.drawImage(img, 0, anim * 16, 16, 16, -18, -26, 36, 36);
        drawn = true;
      }
    }

    if (!drawn) {
      ctx.fillStyle = (m.element === 'fire' ? '#dc2626' : m.element === 'water' ? '#0284c7' : m.element === 'thunder' ? '#ca8a04' : '#15803d');
      ctx.fillRect(-14, -14, 28, 28);
    }

    const elemBadge = m.element === 'fire' ? '🔥' : m.element === 'water' ? '💧' : m.element === 'thunder' ? '⚡' : '🌿';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeText(`${elemBadge} ${m.name}`, 0, -32);
    ctx.fillText(`${elemBadge} ${m.name}`, 0, -32);
    ctx.restore();
  }

  drawLockIcon(ctx, x, y) {
    if (this.loaded['lockIcon']) {
      ctx.drawImage(this.images['lockIcon'], x - 14, y - 14, 28, 28);
    } else {
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', x, y + 6);
    }
  }

  drawUnlockIcon(ctx, x, y) {
    if (this.loaded['unlockIcon']) {
      ctx.drawImage(this.images['unlockIcon'], x - 14, y - 14, 28, 28);
    } else {
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔓', x, y + 6);
    }
  }
}
const dungeonAssets = new DungeonAssetsManager();

class DungeonWorld {
  constructor(width = 1600, height = 1200) {
    this.width = width;
    this.height = height;
    this.name = 'Labyrinth of Awakening';
    this.terrainType = 'dungeon';
    this.floor = 1;
    this.theme = 'cell';
    this.spawnX = 700;
    this.spawnY = 800;

    this.enemyRenderer = new EnemyRenderer();
    this.paladinRenderer = new PaladinRenderer();
    this.aerisRenderer = new AerisRenderer();
    this.chronoRenderer = new ChronoRenderer();
    this.tifaRenderer = new TifaRenderer();
    this.mageRenderer = new BlackMageRenderer();

    this.monsters = [];
    this.chests = [];
    this.pillars = [];
    this.torches = [];
    this.crystals = [];
    this.lavaFissures = [];
    this.sculptures = [];
    this.gravestones = [];
    this.columns = [];
    this.stairsDown = null;
    this.stairsUp = null;

    this.loadFloor(1);
  }

  loadFloor(floorNum) {
    this.floor = floorNum;
    this.monsters = [];
    this.chests = [];
    this.pillars = [];
    this.torches = [];
    this.crystals = [];
    this.lavaFissures = [];
    this.sculptures = [];
    this.gravestones = [];
    this.columns = [];

    const isAlreadyCleared = !!window.dungeonState?.clearedFloors?.[floorNum];

    if (floorNum === 1) {
      this.name = 'B1F: Cell of Awakening (ห้องขังแห่งการตื่นรู้)';
      this.theme = 'cell';
      this.width = 1400; this.height = 1100;
      this.spawnX = 700; this.spawnY = 750;
      this.stairsDown = { x: 700, y: 220, label: '⬇️ ก้าวลงสู่ชั้น B2F' };
      this.monsters = [
        { x: 450, y: 500, element: 'water', encounterType: 'water', name: 'Cave Slime A', defeated: false },
        { x: 950, y: 500, element: 'earth', encounterType: 'earth', name: 'Shadow Bat B', defeated: false }
      ];
      this.chests = [
        { x: 380, y: 750, opened: false, loot: 'Potion x2, 150 GIL', type: 'b1' }
      ];
      this.columns = [
        { x: 350, y: 400 }, { x: 1050, y: 400 }
      ];
      this.torches = [
        { x: 350, y: 350 }, { x: 1050, y: 350 },
        { x: 350, y: 720 }, { x: 1050, y: 720 }
      ];
    } else if (floorNum === 2) {
      this.name = 'B2F: Crypt of the Fallen (สุสานผู้ถูกลืม)';
      this.theme = 'crypt';
      this.width = 1600; this.height = 1200;
      this.spawnX = 800; this.spawnY = 1000;
      this.stairsDown = { x: 1250, y: 250, label: '⬇️ ก้าวลงสู่ชั้น B3F' };
      this.stairsUp = { x: 800, y: 1100, label: '⬆️ ขึ้นสู่ชั้น B1F' };
      this.monsters = [
        { x: 750, y: 650, element: 'earth', encounterType: 'earth', name: 'Skeleton Warrior A', defeated: false },
        { x: 1100, y: 750, element: 'thunder', encounterType: 'wild', name: 'Crypt Specter B', defeated: false }
      ];
      this.chests = [
        { x: 1300, y: 850, opened: false, loot: 'Iron Bangle, Hi-Potion x1', type: 'b2' }
      ];
      this.sculptures = [
        { x: 380, y: 280, type: 'big' },
        { x: 1220, y: 280, type: 'big' }
      ];
      this.gravestones = [
        { x: 550, y: 680, type: 1 }, { x: 660, y: 680, type: 2 },
        { x: 940, y: 680, type: 1 }, { x: 1050, y: 680, type: 2 },
        { x: 550, y: 880, type: 1 }, { x: 1050, y: 880, type: 2 }
      ];
      this.columns = [
        { x: 450, y: 350 }, { x: 1150, y: 350 },
        { x: 450, y: 850 }, { x: 1150, y: 850 }
      ];
      this.torches = [
        { x: 700, y: 350 }, { x: 900, y: 350 }
      ];
    } else if (floorNum === 3) {
      this.name = 'B3F: Subterranean Caverns (ถ้ำหินงอกใต้พิภพ)';
      this.theme = 'cavern';
      this.width = 1600; this.height = 1200;
      this.spawnX = 800; this.spawnY = 1000;
      this.stairsDown = { x: 1300, y: 250, label: '⬇️ เข้าสู่ป้อมปราการ B4F' };
      this.stairsUp = { x: 800, y: 1100, label: '⬆️ ขึ้นสู่ชั้น B2F' };
      this.monsters = [
        { x: 600, y: 650, element: 'fire', encounterType: 'fire', name: 'Fire Salamander', defeated: false },
        { x: 1050, y: 650, element: 'earth', encounterType: 'earth', name: 'Rock Beetle', defeated: false }
      ];
      this.chests = [
        { x: 450, y: 850, opened: false, loot: 'Oak Staff, Ether x2, 300 GIL', type: 'b3' }
      ];
      this.sculptures = [
        { x: 600, y: 380, type: 'small' },
        { x: 900, y: 380, type: 'small' }
      ];
      this.columns = [
        { x: 450, y: 350 }, { x: 1150, y: 350 },
        { x: 450, y: 850 }, { x: 1150, y: 850 }
      ];
      this.crystals = [
        { x: 350, y: 350, color: '#38bdf8' }, { x: 1250, y: 450, color: '#c084fc' },
        { x: 600, y: 850, color: '#38bdf8' }, { x: 1050, y: 850, color: '#34d399' }
      ];
    } else if (floorNum === 4) {
      this.name = 'B4F: Gate of the Colossus (ป้อมปราการผู้พิทักษ์ - MINI-BOSS)';
      this.theme = 'colossus';
      this.width = 1600; this.height = 1200;
      this.spawnX = 800; this.spawnY = 1000;
      this.stairsDown = { x: 800, y: 220, label: '⬆️ ก้าวขึ้นสู่ Midgar Edge Haven (B5F)' };
      this.stairsUp = { x: 800, y: 1100, label: '⬆️ ขึ้นสู่ชั้น B3F' };
      this.monsters = [
        { x: 800, y: 550, element: 'earth', encounterType: 'boss_golem', name: 'Iron Sentinel Golem (MINI-BOSS)', isBoss: true, defeated: false }
      ];
      this.chests = [
        { x: 380, y: 550, opened: false, loot: 'Mythril Greatsword, 500 GIL', type: 'b4a' },
        { x: 1220, y: 550, opened: false, loot: 'Titanium Bangle, Elixir x1', type: 'b4b' }
      ];
      this.sculptures = [
        { x: 400, y: 260, type: 'big' },
        { x: 1200, y: 260, type: 'big' }
      ];
      this.columns = [
        { x: 500, y: 450 }, { x: 1100, y: 450 },
        { x: 500, y: 750 }, { x: 1100, y: 750 }
      ];
      this.torches = [
        { x: 700, y: 250 }, { x: 900, y: 250 }
      ];
    } else if (floorNum === 6) {
      this.name = 'B6F: Magma Crucible (เตาหลอมแมกม่า)';
      this.theme = 'magma';
      this.width = 1600; this.height = 1200;
      this.spawnX = 800; this.spawnY = 1000;
      this.stairsDown = { x: 1250, y: 250, label: '⬇️ ก้าวลงสู่ชั้น B7F' };
      this.stairsUp = { x: 800, y: 1100, label: '⬆️ กลับสู่ Safe Haven B5F' };
      this.monsters = [
        { x: 650, y: 650, element: 'fire', encounterType: 'fire', name: 'Magma Drake', defeated: false },
        { x: 1050, y: 650, element: 'fire', encounterType: 'fire', name: 'Hellhound Alpha', defeated: false }
      ];
      this.chests = [
        { x: 450, y: 850, opened: false, loot: 'Flame Bangle, Hi-Potion x2, 500 GIL', type: 'b6' }
      ];
      this.columns = [
        { x: 300, y: 350 }, { x: 1300, y: 350 }
      ];
      this.lavaFissures = [
        { x1: 200, y1: 500, x2: 600, y2: 560 },
        { x1: 1000, y1: 500, x2: 1400, y2: 560 }
      ];
    } else if (floorNum === 7) {
      this.name = 'B7F: Frostfang Hollows (หุบผาเหมันต์)';
      this.theme = 'ice';
      this.width = 1600; this.height = 1200;
      this.spawnX = 800; this.spawnY = 1000;
      this.stairsDown = { x: 350, y: 250, label: '⬇️ ก้าวลงสู่ชั้น B8F' };
      this.stairsUp = { x: 800, y: 1100, label: '⬆️ ขึ้นสู่ชั้น B6F' };
      this.monsters = [
        { x: 650, y: 650, element: 'water', encounterType: 'water', name: 'Frost Wendigo', defeated: false },
        { x: 1050, y: 650, element: 'water', encounterType: 'water', name: 'Ice Wraith', defeated: false }
      ];
      this.chests = [
        { x: 1250, y: 850, opened: false, loot: 'Blizzard Blade, Elixir x1, 600 GIL', type: 'b7' }
      ];
      this.sculptures = [
        { x: 450, y: 320, type: 'small' },
        { x: 1150, y: 320, type: 'small' }
      ];
      this.crystals = [
        { x: 350, y: 450, color: '#67e8f9' }, { x: 1250, y: 450, color: '#38bdf8' },
        { x: 600, y: 750, color: '#a5f3fc' }, { x: 1050, y: 750, color: '#38bdf8' }
      ];
    } else if (floorNum === 8) {
      this.name = 'B8F: Abyssal Vault (สุสานวิญญาณแห่งความมืด)';
      this.theme = 'abyss';
      this.width = 1600; this.height = 1200;
      this.spawnX = 800; this.spawnY = 1000;
      this.stairsDown = { x: 1300, y: 250, label: "⬇️ ก้าวเข้าสู่รังมังกร B9F" };
      this.stairsUp = { x: 800, y: 1100, label: '⬆️ ขึ้นสู่ชั้น B7F' };
      this.monsters = [
        { x: 650, y: 650, element: 'thunder', encounterType: 'wild', name: 'Nether Chimera', defeated: false },
        { x: 1050, y: 650, element: 'earth', encounterType: 'earth', name: 'Death Specter', defeated: false }
      ];
      this.chests = [
        { x: 800, y: 850, opened: false, loot: 'Diamond Bangle, Turbo Ether x2, 800 GIL', type: 'b8' }
      ];
      this.columns = [
        { x: 450, y: 450 }, { x: 1150, y: 450 }
      ];
      this.gravestones = [
        { x: 600, y: 750, type: 1 }, { x: 1000, y: 750, type: 2 }
      ];
    } else if (floorNum === 9) {
      this.name = "B9F: Dragon's Maw (รังมังกรบรรพกาล - ELITE BOSS)";
      this.theme = 'dragon';
      this.width = 1800; this.height = 1300;
      this.spawnX = 900; this.spawnY = 1100;
      this.stairsDown = { x: 900, y: 220, label: '🌀 ก้าวเข้าสู่ประตูมิติชั้น B10F' };
      this.stairsUp = { x: 900, y: 1200, label: '⬆️ ขึ้นสู่ชั้น B8F' };
      this.monsters = [
        { x: 900, y: 500, element: 'fire', encounterType: 'boss_dragon', name: 'Ancient Red Dragon (ELITE BOSS)', isBoss: true, defeated: false }
      ];
      this.chests = [
        { x: 450, y: 500, opened: false, loot: 'Dragon Scale, Megalixir x2, 1500 GIL', type: 'b9a' },
        { x: 1350, y: 500, opened: false, loot: 'Murasame Blade ⚔️, 2000 GIL', type: 'b9b' }
      ];
      this.sculptures = [
        { x: 450, y: 280, type: 'big' },
        { x: 1350, y: 280, type: 'big' }
      ];
      this.torches = [
        { x: 750, y: 220 }, { x: 1050, y: 220 }
      ];
    } else if (floorNum === 10) {
      this.name = 'B10F: Throne of the Void (บัลลังก์แห่งความว่างเปล่า - FINAL BOSS)';
      this.theme = 'void';
      this.width = 1800; this.height = 1400;
      this.spawnX = 900; this.spawnY = 1200;
      this.stairsUp = { x: 900, y: 1300, label: '⬆️ กลับสู่ชั้น B9F' };
      this.monsters = [
        { x: 900, y: 520, element: 'thunder', encounterType: 'boss_bahamut', name: 'Bahamut Zero (FINAL BOSS)', isBoss: true, defeated: false }
      ];
      this.sculptures = [
        { x: 550, y: 300, type: 'big' },
        { x: 1250, y: 300, type: 'big' }
      ];
      this.chests = [];
    }

    if (isAlreadyCleared) {
      this.monsters.forEach(m => m.defeated = true);
    }
  }

  drawTerrain(ctx, time) {
    const pat = dungeonAssets.getPattern(ctx, 'stoneGround');
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, this.width, this.height);
    } else {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    const tints = {
      cell: 'rgba(9, 13, 22, 0.75)',
      crypt: 'rgba(12, 13, 24, 0.68)',
      cavern: 'rgba(8, 20, 32, 0.68)',
      colossus: 'rgba(15, 23, 42, 0.62)',
      magma: 'rgba(40, 10, 5, 0.72)',
      ice: 'rgba(6, 26, 41, 0.68)',
      abyss: 'rgba(15, 8, 28, 0.72)',
      dragon: 'rgba(24, 11, 6, 0.68)',
      void: 'rgba(2, 4, 10, 0.82)'
    };
    ctx.fillStyle = tints[this.theme] || 'rgba(9, 13, 22, 0.72)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle runic grid
    ctx.strokeStyle = this.theme === 'crypt' ? 'rgba(129, 140, 248, 0.18)' :
                      this.theme === 'cavern' ? 'rgba(56, 189, 248, 0.16)' :
                      this.theme === 'magma' ? 'rgba(239, 68, 68, 0.22)' :
                      this.theme === 'ice' ? 'rgba(103, 232, 249, 0.22)' :
                      this.theme === 'abyss' ? 'rgba(168, 85, 247, 0.22)' :
                      this.theme === 'dragon' ? 'rgba(245, 158, 11, 0.2)' :
                      'rgba(30, 41, 59, 0.35)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < this.width; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
    }

    if (this.theme === 'cell') {
      ctx.fillStyle = '#334155';
      for (let x = 120; x < this.width - 120; x += 32) {
        ctx.fillRect(x, 40, 6, 70);
      }
      // Glowing Occult Ritual Circle etched into floor
      torchBrazierRenderer.drawArcaneCircle(ctx, 700, 500, time, 125, 'rgba(239, 68, 68,');
    } else if (this.theme === 'crypt') {
      // Tifa's locked prison cage on B2F if not rescued
      if (!window.dungeonState?.rescued?.tifa) {
        ctx.save();
        ctx.translate(450, 480);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-45, -45, 90, 90);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(-45, -45, 90, 90);
        for (let bx = -35; bx <= 35; bx += 18) {
          ctx.beginPath(); ctx.moveTo(bx, -45); ctx.lineTo(bx, 45); ctx.stroke();
        }
        this.tifaRenderer.draw(ctx, 0, 10, 'down', 0, 'idle', 1.0);
        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🥊 TIFA (HELP!)', 0, -55);
        ctx.restore();
      }
    } else if (this.theme === 'cavern') {
      // Vivi trapped in arcane barrier on B3F if not rescued
      if (!window.dungeonState?.rescued?.vivi) {
        ctx.save();
        ctx.translate(750, 480);
        const barrierPulse = Math.sin(time / 180) * 4;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 42 + barrierPulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fill();
        this.mageRenderer.draw(ctx, 0, 10, 'down', 0, 'idle', 1.0);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧙 VIVI (TRAPPED!)', 0, -55);
        ctx.restore();
      }
    } else if (this.theme === 'colossus') {
      ctx.save();
      ctx.translate(800, 550);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
      ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    } else if (this.theme === 'magma') {
      this.lavaFissures.forEach(f => {
        ctx.strokeStyle = 'rgba(249, 115, 22, ' + (0.5 + Math.sin(time / 150) * 0.2) + ')';
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(f.x1, f.y1); ctx.lineTo(f.x2, f.y2); ctx.stroke();
      });
    } else if (this.theme === 'dragon') {
      ctx.save();
      ctx.translate(900, 500);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 180, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    } else if (this.theme === 'void') {
      for (let i = 0; i < 50; i++) {
        const sx = ((i * 137) % this.width);
        const sy = ((i * 229 + time * 0.02) % this.height);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.3 + Math.sin(time / 200 + i) * 0.3) + ')';
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.save();
      ctx.translate(900, 520);
      const rot = time * 0.0005;
      ctx.rotate(rot);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 220, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
      ctx.beginPath(); ctx.arc(0, 0, 160, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    // Outer stone walls with battlements
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, this.width, 54);
    ctx.fillRect(0, 0, 54, this.height);
    ctx.fillRect(this.width - 54, 0, 54, this.height);
    ctx.fillRect(0, this.height - 54, this.width, 54);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(54, 54, this.width - 108, this.height - 108);

    ctx.fillStyle = '#475569';
    for (let x = 60; x < this.width - 60; x += 36) {
      ctx.fillRect(x, 48, 20, 6);
      ctx.fillRect(x, this.height - 54, 20, 6);
    }
    for (let y = 60; y < this.height - 60; y += 36) {
      ctx.fillRect(48, y, 6, 20);
      ctx.fillRect(this.width - 54, y, 6, 20);
    }
  }

  draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir) {
    this.drawTerrain(ctx, time);

    // Draw Ancient Columns
    this.columns.forEach(c => {
      dungeonAssets.drawColumn(ctx, c.x, c.y);
    });

    // Draw Sculptures / Statues
    this.sculptures.forEach(s => {
      if (s.type === 'big') dungeonAssets.drawBigAngel(ctx, s.x, s.y);
      else dungeonAssets.drawSmallAngel(ctx, s.x, s.y);
    });

    // Draw Gravestones
    this.gravestones.forEach(g => {
      dungeonAssets.drawGravestone(ctx, g.x, g.y, g.type || 1);
    });

    // Draw Pillars
    this.pillars.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath(); ctx.ellipse(0, 10, 24, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(-18, -48, 36, 52);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-22, -54, 44, 10);
      ctx.fillRect(-22, -2, 44, 8);
      ctx.restore();
    });

    // Draw Torches (High-Fidelity Carved Stone Pedestal + Metal Brazier + Lively Fire + Sparks)
    this.torches.forEach((t, idx) => {
      torchBrazierRenderer.draw(ctx, t.x, t.y, time, `dungeon_t_${this.floor}_${idx}`);
    });

    // Draw Crystals
    this.crystals.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.moveTo(0, -28); ctx.lineTo(12, 6); ctx.lineTo(-12, 6); ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Draw Chests
    this.chests.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(0, 8, 20, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c.opened ? '#451a03' : '#b45309';
      ctx.fillRect(-18, -14, 36, 26);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-18, -4, 36, 4);
      ctx.restore();
    });

    // Draw Stairs Down / Portal with LOCKED / UNLOCKED State
    if (this.stairsDown) {
      const isCleared = !!window.dungeonState?.clearedFloors?.[this.floor] || (this.monsters && this.monsters.length > 0 && this.monsters.every(m => m.defeated));
      const remaining = this.monsters.filter(m => !m.defeated).length;

      ctx.save();
      ctx.translate(this.stairsDown.x, this.stairsDown.y);

      if (!isCleared && remaining > 0) {
        // LOCKED: Red sealed barrier with crossed chains and lock icon
        ctx.fillStyle = '#1e1014';
        ctx.fillRect(-40, -56, 80, 56);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-40, -56, 80, 56);

        const pulse = 0.3 + Math.sin(time / 180) * 0.15;
        ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
        ctx.fillRect(-28, -48, 56, 48);

        ctx.strokeStyle = 'rgba(248, 113, 113, 0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-36, -50); ctx.lineTo(36, -4);
        ctx.moveTo(36, -50); ctx.lineTo(-36, -4);
        ctx.stroke();

        dungeonAssets.drawLockIcon(ctx, 0, -28);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🔒 LOCKED (${remaining} มอนสเตอร์)`, 0, -64);
      } else {
        // UNLOCKED: Shimmering green/cyan open portal
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-38, -52, 76, 52);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.strokeRect(-38, -52, 76, 52);

        const glow = 0.45 + Math.sin(time / 200) * 0.2;
        ctx.fillStyle = `rgba(56, 189, 248, ${glow})`;
        ctx.fillRect(-26, -46, 52, 46);

        dungeonAssets.drawUnlockIcon(ctx, 0, -26);

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.stairsDown.label || '⬇️ NEXT FLOOR', 0, -60);
      }
      ctx.restore();
    }

    // Draw Stairs Up (Always Open)
    if (this.stairsUp) {
      ctx.save();
      ctx.translate(this.stairsUp.x, this.stairsUp.y);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-30, -40, 60, 40);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-18, -32, 36, 32);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.stairsUp.label || '⬆️ PREV FLOOR', 0, -48);
      ctx.restore();
    }

    // Draw Monsters using dungeonAssets
    this.monsters.forEach(m => {
      if (!m.defeated) {
        ctx.save();
        ctx.translate(m.x, m.y + Math.sin(time / 280 + m.x) * 3);
        if (m.isBoss) {
          this.enemyRenderer.draw(ctx, 0, 0, m);
          ctx.fillStyle = '#f0abfc';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('💀 ' + m.name, 0, -70);
        } else {
          dungeonAssets.drawMonster(ctx, m, time);
        }
        ctx.restore();
      }
    });

    // Draw Cloud Player
    cloudFieldRenderer.draw(ctx, playerX, playerY, playerDir, animFrame, playerState, 1.1, (window.playerAttackState ? window.playerAttackState.comboStep : 1), (window.playerAttackState ? window.playerAttackState.progress : 0));

    // Interactive Prompts
    this.chests.forEach(c => {
      if (!c.opened && Math.hypot(playerX - c.x, playerY - c.y) < 55) {
        this.drawInteractPrompt(ctx, '🌟 [SPACE] เปิดหีบสมบัติ (OPEN CHEST)', c.x, c.y);
      }
    });

    if (this.stairsDown && Math.hypot(playerX - this.stairsDown.x, playerY - this.stairsDown.y) < 65) {
      const isCleared = !!window.dungeonState?.clearedFloors?.[this.floor] || (this.monsters && this.monsters.length > 0 && this.monsters.every(m => m.defeated));
      const remaining = this.monsters.filter(m => !m.defeated).length;
      if (!isCleared && remaining > 0) {
        this.drawInteractPrompt(ctx, `🔒 [ทางลงถูกปิดผนึก] ต้องกำจัดมอนสเตอร์ในห้องให้หมดก่อน! (${remaining} ตัว)`, this.stairsDown.x, this.stairsDown.y);
      } else {
        this.drawInteractPrompt(ctx, this.stairsDown.label + ' [SPACE] (เปิดอิสระ)', this.stairsDown.x, this.stairsDown.y);
      }
    }
    if (this.stairsUp && Math.hypot(playerX - this.stairsUp.x, playerY - this.stairsUp.y) < 65) {
      this.drawInteractPrompt(ctx, this.stairsUp.label + ' [SPACE] (ขึ้น-ลงอิสระ)', this.stairsUp.x, this.stairsUp.y);
    }

    // B2F: Tifa prompt
    if (this.floor === 2 && !window.dungeonState?.rescued?.tifa && Math.hypot(playerX - 450, playerY - 480) < 65) {
      const remaining = this.monsters.filter(m => !m.defeated).length;
      this.drawInteractPrompt(ctx, `🥊 [SPACE] Tifa (ในกรง): 'กำจัดมอนสเตอร์ในสุสานให้หมดก่อนนะ! (เหลือ ${remaining})'`, 450, 480);
    }
    // B3F: Vivi prompt
    if (this.floor === 3 && !window.dungeonState?.rescued?.vivi && Math.hypot(playerX - 750, playerY - 480) < 65) {
      const remaining = this.monsters.filter(m => !m.defeated).length;
      this.drawInteractPrompt(ctx, `🧙 [SPACE] Vivi (ในบาเรีย): 'ช่วยปราบมอนสเตอร์ในถ้ำเพื่อสลายบาเรียทีครับ! (เหลือ ${remaining})'`, 750, 480);
    }
    // B7F: Cecil encounter prompt
    if (this.floor === 7 && !window.dungeonState?.rescued?.cecil && Math.hypot(playerX - 600, playerY - 350) < 65) {
      this.drawInteractPrompt(ctx, '🛡️ [SPACE] เจอ Cecil อัศวินที่หลงทาง [ชั้น B7F]!', 600, 350);
    }
    // B9F: Aeris encounter prompt
    if (this.floor === 9 && !window.dungeonState?.rescued?.aeris && Math.hypot(playerX - 800, playerY - 380) < 65) {
      this.drawInteractPrompt(ctx, '🌸 [SPACE] เจอ Aeris ผู้นำทาง [ชั้น B9F]!', 800, 380);
    }
  }

  drawInteractPrompt(ctx, text, x, y) {
    if (!this._promptWidthCache) this._promptWidthCache = {};
    ctx.font = 'bold 9px Outfit, sans-serif';
    if (this._promptWidthCache[text] === undefined) {
      this._promptWidthCache[text] = ctx.measureText(text).width + 18;
    }
    const textW = this._promptWidthCache[text];
    ctx.save();
    ctx.translate(x, y - 55);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(-textW / 2, -10, textW, 20);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-textW / 2, -10, textW, 20);
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 4);
    ctx.restore();
  }
}


// 4th World Map: Sunken Shrine & Boss Chamber
class ShrineWorld extends DungeonWorld {
  constructor() {
    super(1920, 1760);
    this.name = 'Sunken Shrine & Boss Sanctum';
    this.description = 'วิหารศักดิ์สิทธิ์โบราณที่จมอยู่ใต้ดิน ที่สถิตของ Guard Scorpion และหีบสมบัติระดับตำนาน';
    this.monsters = [
      { x: 960, y: 640, element: 'boss', name: 'Guard Scorpion (MINI-BOSS)', defeated: false, isBoss: true },
      { x: 640, y: 1080, element: 'thunder', name: 'Thunder Drake', defeated: false },
      { x: 1280, y: 1080, element: 'water', name: 'Leviathan Slime', defeated: false }
    ];
    this.chests = [
      { x: 740, y: 460, opened: false, openedAt: 0, type: 'ancientA' },
      { x: 1180, y: 460, opened: false, openedAt: 0, type: 'ancientB' }
    ];
    this.sculptures = [
      { x: 740, y: 480, type: 'big' },
      { x: 1180, y: 480, type: 'big' }
    ];
    this.columns = [
      { x: 500, y: 640 }, { x: 1420, y: 640 },
      { x: 500, y: 1200 }, { x: 1420, y: 1200 }
    ];
  }

  drawTerrain(ctx, time) {
    // Sacred blue/water sunken shrine floor
    ctx.fillStyle = '#031726';
    ctx.fillRect(0, 0, this.width, this.height);

    // Glowing water ripples & runic tiles
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < this.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Grand Sacred Altar Circle at (960, 640)
    ctx.save();
    ctx.translate(960, 640);
    const pulse = Math.sin(time / 250) * 10;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 180 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 130, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Runic Walls
    ctx.fillStyle = '#0f2942';
    ctx.fillRect(0, 0, this.width, 60);
    ctx.fillRect(0, 0, 60, this.height);
    ctx.fillRect(this.width - 60, 0, 60, this.height);
    ctx.fillRect(0, this.height - 60, this.width, 60);
  }

  draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir) {
    super.draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir);

    // South Portal back to Dungeon (960, 1680)
    ctx.save();
    ctx.translate(960, 1680);
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, -10, 28, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️ [SPACE] กลับสู่ DUNGEON', 0, -38);
    ctx.restore();

    if (Math.hypot(playerX - 960, playerY - 1680) < 65) {
      this.drawInteractPrompt(ctx, '🏛️ [SPACE] กลับสู่ DUNGEON', 960, 1630);
    }
  }
}

// Legacy stub alias
class CityMap extends FieldWorld {}

// ================= RPG Weapons & Items Catalogs =================
window.playerGil = 500;

const WEAPONS_DB = [
  // --- Cloud (Greatswords) ---
  {
    id: 'buster',
    heroId: 'cloud',
    name: 'Buster Greatsword',
    type: 'Greatsword',
    atk: 25,
    price: 0,
    owned: true,
    col: 0, row: 3,
    badge: 'badge-fire',
    badgeText: 'STARTER',
    desc: 'ดาบยักษ์สัญลักษณ์ของ Cloud เพิ่มพลังโจมตี +25 ATK (อาวุธเริ่มต้น)'
  },
  {
    id: 'flame_saber',
    heroId: 'cloud',
    name: 'Flame Saber',
    type: 'Elemental Sword',
    elem: 'fire',
    atk: 45,
    price: 250,
    owned: false,
    col: 0, row: 0,
    badge: 'badge-fire',
    badgeText: 'FIRE ATK',
    desc: 'ดาบเปลวเพลิงแผดเผา เพิ่มพลังโจมตี +45 ATK ชนะทางศัตรูธาตุดิน'
  },
  {
    id: 'frost_brand',
    heroId: 'cloud',
    name: 'Frost Brand',
    type: 'Elemental Sword',
    elem: 'water',
    atk: 50,
    price: 320,
    owned: false,
    col: 1, row: 0,
    badge: 'badge-water',
    badgeText: 'FROST ATK',
    desc: 'ดาบคมผลึกน้ำแข็ง เพิ่มพลังโจมตี +50 ATK ชนะทางศัตรูธาตุไฟ'
  },
  {
    id: 'force_stealer',
    heroId: 'cloud',
    name: 'Force Stealer (ดาบสะกดวิญญาณ)',
    type: 'Greatsword',
    atk: 65,
    price: 450,
    owned: false,
    iconFile: 'assets/Icons/icon17.png',
    badge: 'badge-crit',
    badgeText: 'ATK +65',
    desc: 'ดาบคมสองด้าน เพิ่มพลังโจมตี +65 ATK ฟื้นคืนสมาธิเมื่อฟันโดน'
  },
  {
    id: 'hardedge',
    heroId: 'cloud',
    name: 'Hardedge Greatsword',
    type: 'Greatsword',
    atk: 75,
    price: 580,
    owned: false,
    col: 1, row: 3,
    badge: 'badge-crit',
    badgeText: 'HEAVY ATK',
    desc: 'ดาบใบกว้างผ่าเหล็ก เพิ่มพลังโจมตี +75 ATK'
  },
  {
    id: 'rune_blade',
    heroId: 'cloud',
    name: 'Rune Blade (ดาบรูนศิลา)',
    type: 'Runic Greatsword',
    atk: 95,
    magic: 25,
    price: 850,
    owned: false,
    iconFile: 'assets/Icons/icon18.png',
    badge: 'badge-thunder',
    badgeText: 'ATK+95 MAG+25',
    desc: 'ดาบสลักอักขระเวทมนตร์โบราณ เพิ่มพลังโจมตี +95 ATK, +25 MAG'
  },
  {
    id: 'ultima',
    heroId: 'cloud',
    name: 'Ultima Blade',
    type: 'Mythic Sword',
    elem: 'thunder',
    atk: 120,
    price: 1200,
    owned: false,
    col: 5, row: 3,
    badge: 'badge-legend',
    badgeText: 'ULTIMA',
    desc: 'สุดยอดศาสตราวุธแห่งแสง เพิ่มพลังโจมตีมหาศาล +120 ATK'
  },
  {
    id: 'apocalypse',
    heroId: 'cloud',
    name: 'Apocalypse (ดาบวันสิ้นพิภพ)',
    type: 'Ancient Greatsword',
    atk: 145,
    price: 1600,
    owned: false,
    iconFile: 'assets/Icons/icon19.png',
    badge: 'badge-legend',
    badgeText: 'APOCALYPSE',
    desc: 'ดาบแห่งการพิพากษา พลังโจมตีมหาศาล +145 ATK ได้รับ EXP เพิ่มขึ้น 50%!'
  },

  // --- Tifa (Knuckles & Claws) ---
  {
    id: 'leather_gloves',
    heroId: 'tifa',
    name: 'Leather Gloves',
    type: 'Fist',
    atk: 22,
    price: 0,
    owned: true,
    col: 0, row: 1,
    badge: 'badge-crit',
    badgeText: 'STARTER',
    desc: 'ถุงมือหนังกระชับมือของ Tifa เพิ่มพลังหมัด +22 ATK (อาวุธเริ่มต้น)'
  },
  {
    id: 'metal_knuckles',
    heroId: 'tifa',
    name: 'Metal Knuckles',
    type: 'Knuckles',
    atk: 42,
    price: 240,
    owned: false,
    col: 1, row: 1,
    badge: 'badge-crit',
    badgeText: 'STRIKE',
    desc: 'สนับมือโลหะผสม เพิ่มพลังโจมตีหมัด +42 ATK'
  },
  {
    id: 'motor_drive',
    heroId: 'tifa',
    name: 'Motor Drive (หมัดไอพ่นเทอร์โบ)',
    type: 'Knuckles',
    atk: 56,
    price: 360,
    owned: false,
    iconFile: 'assets/Icons/icon20.png',
    badge: 'badge-crit',
    badgeText: 'RAPID STRIKE',
    desc: 'สนับมือกลไกไอพ่นเทอร์โบ เพิ่มความเร็วในการออกหมัด +56 ATK'
  },
  {
    id: 'mythril_claws',
    heroId: 'tifa',
    name: 'Mythril Claws',
    type: 'Claws',
    atk: 68,
    price: 480,
    owned: false,
    col: 2, row: 1,
    badge: 'badge-crit',
    badgeText: 'CRIT +20%',
    desc: 'กรงเล็บแร่ไมธิริล เพิ่มพลังโจมตี +68 ATK และโอกาสติดคริติคอลสูง'
  },
  {
    id: 'kaiser_knuckles',
    heroId: 'tifa',
    name: 'Kaiser Knuckles (หมัดจักรพรรดิสายฟ้า)',
    type: 'Knuckles',
    elem: 'thunder',
    atk: 88,
    price: 780,
    owned: false,
    iconFile: 'assets/Icons/icon21.png',
    badge: 'badge-thunder',
    badgeText: 'THUNDER FIST',
    desc: 'สนับมือจักรพรรดิอัสนีบาต ประจุพลังสายฟ้าฟาด +88 ATK'
  },
  {
    id: 'dragon_claws',
    heroId: 'tifa',
    name: 'Dragon Claws',
    type: 'Dragon Fists',
    elem: 'fire',
    atk: 110,
    price: 1050,
    owned: false,
    col: 4, row: 1,
    badge: 'badge-fire',
    badgeText: 'DRAGON FIRE',
    desc: 'กรงเล็บมังกรเพลิง เพิ่มพลังหมัดมหาศาล +110 ATK'
  },
  {
    id: 'gods_hand',
    heroId: 'tifa',
    name: "God's Hand (หัตถ์เทวะพิชิตชัย)",
    type: 'God Knuckles',
    atk: 138,
    price: 1550,
    owned: false,
    iconFile: 'assets/Icons/icon22.png',
    badge: 'badge-legend',
    badgeText: '100% HIT',
    desc: 'สุดยอดสนับมือศักดิ์สิทธิ์ โจมตีแม่นยำ 100% เสมอ พลังหมัด +138 ATK'
  },

  // --- Vivi (Staves & Rods) ---
  {
    id: 'oak_staff',
    heroId: 'vivi',
    name: 'Oak Staff',
    type: 'Staff',
    atk: 15,
    magic: 20,
    price: 0,
    owned: true,
    col: 0, row: 2,
    badge: 'badge-water',
    badgeText: 'STARTER',
    desc: 'ไม้เท้าไม้โอ๊คโบราณ เพิ่ม +15 ATK, +20 MAG (อาวุธเริ่มต้น)'
  },
  {
    id: 'flame_staff',
    heroId: 'vivi',
    name: 'Flame Staff',
    type: 'Elemental Staff',
    elem: 'fire',
    atk: 25,
    magic: 45,
    price: 260,
    owned: false,
    col: 1, row: 2,
    badge: 'badge-fire',
    badgeText: 'FIRE BOOST',
    desc: 'คทาเพลิงสุริยัน เพิ่ม +25 ATK, +45 MAG เสริมพลังเวทเพลิง'
  },
  {
    id: 'lightning_rod',
    heroId: 'vivi',
    name: 'Lightning Rod',
    type: 'Thunder Rod',
    elem: 'thunder',
    atk: 30,
    magic: 65,
    price: 460,
    owned: false,
    col: 2, row: 2,
    badge: 'badge-thunder',
    badgeText: 'THUNDER BOOST',
    desc: 'คทาสายฟ้า เสริมพลังเวทอัสนีบาต +30 ATK, +65 MAG'
  },
  {
    id: 'high_arcane_rod',
    heroId: 'vivi',
    name: 'High Arcane Rod (คทาอาคมสูงสุด)',
    type: 'Archmage Staff',
    atk: 35,
    magic: 90,
    price: 650,
    owned: false,
    iconFile: 'assets/Icons/icon23.png',
    badge: 'badge-water',
    badgeText: 'MAG +90',
    desc: 'คทาจอมเวทหลวง ร่ายคาถารวดเร็วและรุนแรง +90 MAG'
  },
  {
    id: 'wizard_rod',
    heroId: 'vivi',
    name: 'Wizard Rod',
    type: 'Archmage Rod',
    elem: 'earth',
    atk: 40,
    magic: 115,
    price: 1100,
    owned: false,
    col: 5, row: 2,
    badge: 'badge-legend',
    badgeText: 'ALL ELEM BOOST',
    desc: 'สุดยอดคทามหาจอมเวท เสริมพลังเวทมนตร์ทุกธาตุ +40 ATK, +115 MAG'
  },
  {
    id: 'stardust_rod',
    heroId: 'vivi',
    name: 'Stardust Rod (คทาละอองดวงดาว)',
    type: 'Cosmic Rod',
    elem: 'thunder',
    atk: 45,
    magic: 140,
    price: 1350,
    owned: false,
    iconFile: 'assets/Icons/icon24.png',
    badge: 'badge-legend',
    badgeText: 'STARDUST',
    desc: 'คทาแห่งห้วงจักรวาล เสริมพลังเวททุกธาตุ +45 ATK, +140 MAG'
  },

  // --- Cecil (Paladin Swords) ---
  {
    id: 'paladin_sword',
    heroId: 'cecil',
    name: 'Paladin Sword',
    type: 'Holy Sword',
    atk: 28,
    def: 15,
    price: 0,
    owned: true,
    col: 0, row: 4,
    badge: 'badge-water',
    badgeText: 'STARTER',
    desc: 'ดาบอัศวินพาลาดิน เพิ่ม +28 ATK, +15 DEF (อาวุธเริ่มต้น)'
  },
  {
    id: 'mythril_sword',
    heroId: 'cecil',
    name: 'Mythril Sword',
    type: 'Knight Sword',
    atk: 48,
    def: 25,
    price: 340,
    owned: false,
    col: 1, row: 4,
    badge: 'badge-crit',
    badgeText: 'DEF +25',
    desc: 'ดาบเหล็กกล้าไมธิริลบริสุทธิ์ เพิ่ม +48 ATK, +25 DEF'
  },
  {
    id: 'blood_sword',
    heroId: 'cecil',
    name: 'Blood Sword (ดาบโลหิตสูบวิญญาณ)',
    type: 'Vampiric Blade',
    atk: 65,
    def: 20,
    price: 540,
    owned: false,
    iconFile: 'assets/Icons/icon25.png',
    badge: 'badge-fire',
    badgeText: 'HP DRAIN',
    desc: 'ดาบโบราณที่ดูดซับพลังชีวิตของศัตรูมาฟื้นฟูผู้ใช้ +65 ATK, +20 DEF'
  },
  {
    id: 'excalibur',
    heroId: 'cecil',
    name: 'Excalibur',
    type: 'Holy Blade',
    elem: 'thunder',
    atk: 85,
    def: 40,
    price: 820,
    owned: false,
    col: 3, row: 4,
    badge: 'badge-legend',
    badgeText: 'HOLY BLADE',
    desc: 'ดาบศักดิ์สิทธิ์ในตำนาน ฟันทะลวงความมืด +85 ATK, +40 DEF'
  },
  {
    id: 'lightbringer',
    heroId: 'cecil',
    name: 'Lightbringer (ดาบแสงพิสุทธิ์)',
    type: 'Holy Sword',
    elem: 'holy',
    atk: 105,
    def: 48,
    price: 980,
    owned: false,
    iconFile: 'assets/Icons/icon26.png',
    badge: 'badge-legend',
    badgeText: 'HOLY SHIELD',
    desc: 'ดาบแสงสว่าง ขจัดความมืดและคุ้มครองเพื่อนร่วมทีม +105 ATK, +48 DEF'
  },
  {
    id: 'ragnarok',
    heroId: 'cecil',
    name: 'Ragnarok',
    type: 'Divine Sword',
    elem: 'holy',
    atk: 125,
    def: 55,
    price: 1300,
    owned: false,
    col: 5, row: 4,
    badge: 'badge-legend',
    badgeText: 'RAGNAROK',
    desc: 'สุดยอดดาบเทวาธิราช เพิ่มพลังชีวิตและการป้องกันสูงสุด +125 ATK, +55 DEF'
  },

  // --- Aeris (Guard Sticks & Rods) ---
  {
    id: 'guard_stick',
    heroId: 'aeris',
    name: 'Guard Stick',
    type: 'Rod',
    atk: 16,
    magic: 25,
    price: 0,
    owned: true,
    col: 0, row: 5,
    badge: 'badge-water',
    badgeText: 'STARTER',
    desc: 'ไม้เท้าป้องกันตัวของ Aeris เพิ่ม +16 ATK, +25 MAG (อาวุธเริ่มต้น)'
  },
  {
    id: 'princess_guard',
    heroId: 'aeris',
    name: 'Princess Guard',
    type: 'Cetra Rod',
    atk: 35,
    magic: 60,
    price: 280,
    owned: false,
    col: 1, row: 5,
    badge: 'badge-fire',
    badgeText: 'HEAL BOOST',
    desc: 'คทาเจ้าหญิงเซตรา เพิ่มผลการรักษา +35 ATK, +60 MAG'
  },
  {
    id: 'healing_wind_bell',
    heroId: 'aeris',
    name: 'Healing Wind Bell (กระดิ่งสายลมฟื้นฟู)',
    type: 'Sacred Bell',
    atk: 38,
    magic: 75,
    price: 420,
    owned: false,
    iconFile: 'assets/Icons/icon27.png',
    badge: 'badge-water',
    badgeText: 'REGEN HP',
    desc: 'กระดิ่งเซตรา ผสานสายลมแห่งดวงดาว เพิ่มผลการรักษา +75 MAG'
  },
  {
    id: 'fairy_tale',
    heroId: 'aeris',
    name: 'Fairy Tale',
    type: 'Fairy Rod',
    atk: 52,
    magic: 85,
    price: 520,
    owned: false,
    col: 2, row: 5,
    badge: 'badge-water',
    badgeText: 'HOLY MAGIC',
    desc: 'ไม้เท้าแห่งเทพนิยาย เพิ่มพลังเวทศักดิ์สิทธิ์ +52 ATK, +85 MAG'
  },
  {
    id: 'centurial_rod',
    heroId: 'aeris',
    name: 'Centurial Rod (คทาร้อยปีแห่งพงไพร)',
    type: 'Cetra Relic',
    atk: 58,
    magic: 130,
    price: 1200,
    owned: false,
    iconFile: 'assets/Icons/icon28.png',
    badge: 'badge-legend',
    badgeText: 'MASS HEAL',
    desc: 'คทาศักดิ์สิทธิ์โบราณจากพงไพร เสริมพลังฟื้นฟูและมนต์ขาว +130 MAG'
  },
  {
    id: 'aurora_rod',
    heroId: 'aeris',
    name: 'Aurora Rod',
    type: 'Mythic Rod',
    atk: 68,
    magic: 120,
    price: 1150,
    owned: false,
    col: 5, row: 5,
    badge: 'badge-legend',
    badgeText: 'AURORA HEAL',
    desc: 'สุดยอดคทาแสงออโรรา ชุบชีวิตและฟื้นพลังเต็มเปี่ยม +68 ATK, +120 MAG'
  },

  // --- Chrono (Katanas) ---
  {
    id: 'wooden_katana',
    heroId: 'chrono',
    name: 'Wooden Katana',
    type: 'Katana',
    atk: 26,
    spd: 5,
    price: 0,
    owned: true,
    col: 0, row: 6,
    badge: 'badge-crit',
    badgeText: 'STARTER',
    desc: 'ดาบไม้ฝึกซ้อมของโครโน เพิ่ม +26 ATK, +5 SPD (อาวุธเริ่มต้น)'
  },
  {
    id: 'thunder_katana',
    heroId: 'chrono',
    name: 'Thunder Katana',
    type: 'Katana',
    elem: 'thunder',
    atk: 55,
    spd: 10,
    price: 420,
    owned: false,
    col: 2, row: 1,
    badge: 'badge-thunder',
    badgeText: 'THUNDER ATK',
    desc: 'ดาบซามูไรประจุสายฟ้าของโครโน เพิ่ม +55 ATK, +10 SPD ชนะทางธาตุน้ำ'
  },
  {
    id: 'shiva_edge',
    heroId: 'chrono',
    name: 'Shiva Edge (ดาบเหมันต์นิรันดร์)',
    type: 'Ice Katana',
    elem: 'water',
    atk: 68,
    spd: 12,
    price: 560,
    owned: false,
    iconFile: 'assets/Icons/icon29.png',
    badge: 'badge-water',
    badgeText: 'SLOW STRIKE',
    desc: 'ดาบคาตานะใบมีดเยือกแข็ง ฟันแล้วศัตรูติดสถานะเชื่องช้า +68 ATK, +12 SPD'
  },
  {
    id: 'murasame',
    heroId: 'chrono',
    name: 'Murasame Blade',
    type: 'Nodachi',
    atk: 85,
    spd: 15,
    price: 750,
    owned: false,
    col: 2, row: 4,
    badge: 'badge-crit',
    badgeText: 'HIGH CRIT',
    desc: 'ดาบคาตานะยาวระดับมหากาพย์ เพิ่ม +85 ATK, +15 SPD และคริติคอล 50%'
  },
  {
    id: 'rainbow_katana',
    heroId: 'chrono',
    name: 'Rainbow Katana',
    type: 'Time Katana',
    elem: 'thunder',
    atk: 130,
    spd: 25,
    price: 1350,
    owned: false,
    col: 5, row: 6,
    badge: 'badge-legend',
    badgeText: '70% CRIT CHANCE',
    desc: 'สุดยอดดาบสายรุ้งแห่งกาลเวลาของ Chrono Trigger! เพิ่ม +130 ATK, +25 SPD คริติคอล 70%!'
  },
  {
    id: 'dreamseeker',
    heroId: 'chrono',
    name: 'Dreamseeker (ดาบผู้ไขว่คว้าความฝัน)',
    type: 'Master Katana',
    atk: 155,
    spd: 30,
    price: 1800,
    owned: false,
    iconFile: 'assets/Icons/icon30.png',
    badge: 'badge-legend',
    badgeText: '90% CRIT CHANCE',
    desc: 'สุดยอดดาบในตำนานของ Chrono Trigger! พลังโจมตี +155 ATK คริติคอล 90%!'
  }
];

const MATERIA_DB = [
  {
    id: 'mat_fire',
    name: 'Fire Materia (มาทีเรียเพลิง)',
    elem: 'fire',
    icon: '🔥',
    color: '#ef4444',
    spellId: 'fira',
    spellName: 'Fira (มนตราเพลิงกัลป์)',
    mp: 14,
    mult: 2.2,
    desc: 'เพิ่มพลังโจมตีธาตุไฟ และปลดล็อคเวทมนตร์ Fira ชนะทางธาตุดิน (2x DMG)'
  },
  {
    id: 'mat_ice',
    name: 'Ice Materia (มาทีเรียน้ำแข็ง)',
    elem: 'water',
    icon: '❄️',
    color: '#38bdf8',
    spellId: 'blizzara',
    spellName: 'Blizzara (มนตราน้ำแข็งกัลป์)',
    mp: 14,
    mult: 2.2,
    desc: 'เพิ่มพลังโจมตีธาตุน้ำแข็ง และปลดล็อคเวทมนตร์ Blizzara ชนะทางธาตุไฟ (2x DMG)'
  },
  {
    id: 'mat_lightning',
    name: 'Lightning Materia (มาทีเรียสายฟ้า)',
    elem: 'thunder',
    icon: '⚡',
    color: '#facc15',
    spellId: 'thundara',
    spellName: 'Thundara (มนตราอัสนีบาต)',
    mp: 14,
    mult: 2.2,
    desc: 'เพิ่มพลังโจมตีธาตุสายฟ้า และปลดล็อคเวทมนตร์ Thundara ชนะทางจักรกลและธาตุน้ำ (2x DMG)'
  },
  {
    id: 'mat_heal',
    name: 'Healing Materia (มาทีเรียรักษา)',
    elem: 'holy',
    icon: '💚',
    color: '#4ade80',
    spellId: 'cura',
    spellName: 'Cura (มนตราฟื้นฟู)',
    mp: 12,
    healAmount: 400,
    desc: 'ฟื้นฟูพลังชีวิตสมาชิกในทีม +400 HP ในการต่อสู้'
  }
];

window.MATERIA_DB = MATERIA_DB;

const ITEMS_DB = [
  {
    id: 'potion',
    name: 'Potion (โพชั่น)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon1.png',
    price: 50,
    desc: 'ฟื้นฟูพลังชีวิต HP +250 หน่วยให้ทุกคนในทีม'
  },
  {
    id: 'hi_potion',
    name: 'Hi-Potion (ไฮโพชั่น)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon2.png',
    price: 120,
    desc: 'ฟื้นฟูพลังชีวิต HP +500 หน่วยให้ทุกคนในทีม'
  },
  {
    id: 'x_potion',
    name: 'X-Potion (เอ็กซ์โพชั่น)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon3.png',
    price: 250,
    desc: 'ยาโอสถขั้นสูง ฟื้นฟู HP +1,200 หน่วยให้ทุกคนในทีม'
  },
  {
    id: 'ether',
    name: 'Ether (อีเธอร์)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon15.png',
    price: 100,
    desc: 'ฟื้นฟูพลังเวท MP +80 หน่วยให้ทุกคนในทีม'
  },
  {
    id: 'turbo_ether',
    name: 'Turbo Ether (เทอร์โบอีเธอร์)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon16.png',
    price: 220,
    desc: 'ฟื้นฟูพลังเวท MP ขั้นสูง +160 หน่วย'
  },
  {
    id: 'elixir',
    name: 'Elixir (อิลิกเซอร์)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon32.png',
    price: 450,
    desc: 'ยาโอสถทิพย์ ฟื้นฟู HP & MP เต็มเปี่ยม 100%'
  },
  {
    id: 'megalixir',
    name: 'Megalixir (เมกาอิลิกเซอร์)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon44.png',
    price: 1200,
    desc: 'สุดยอดโอสถสวรรค์ ฟื้นฟู HP & MP เต็ม 100% ให้ทุกคนในทีมพร้อมกัน!'
  },
  {
    id: 'hero_drink',
    name: 'Hero Drink (น้ำยาฮีโร่)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon21.png',
    price: 350,
    desc: 'เพิ่มพลังโจมตี ATK +40% ชั่วคราวในการต่อสู้'
  },
  {
    id: 'barrier_shield',
    name: 'Barrier Shell (ม่านพลังเวท)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon12.png',
    price: 280,
    desc: 'กางม่านพลังป้องกัน DEF +50% ชั่วคราวในการต่อสู้'
  },
  {
    id: 'remedy',
    name: 'Remedy (ยารักษาครอบจักรวาล)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon7.png',
    price: 150,
    desc: 'รักษาทุกสถานะผิดปกติทันที (ตาบอด, ใบ้, พิษ, ชา)'
  },
  {
    id: 'phoenix_down',
    name: 'Phoenix Down (ขนนกฟีนิกซ์)',
    iconFile: 'assets/48 Free Magic Potions Pixel Art Icons/PNG/Transperent/Icon28.png',
    price: 300,
    desc: 'ชุบชีวิตเพื่อนร่วมทีมที่หมดสติขึ้นมาพร้อมพลัง 50%'
  }
];

window.WEAPONS_DB = WEAPONS_DB;
window.ITEMS_DB = ITEMS_DB;

// ================= Extended RPG Materials & Skills DB =================
const MATERIALS_DB = [
  { id: 'slime_jelly', name: 'Slime Jelly (วุ้นสไลม์)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon3.png', sellPrice: 35, desc: 'หยดเยิ้มจากสไลม์ ใช้ปรุงยาหรือขายทำกำไร' },
  { id: 'beast_fang', name: 'Beast Fang (เขี้ยวสัตว์อสูร)', iconFile: 'assets/Icons/icon10.png', sellPrice: 60, desc: 'เขี้ยวคมกริบของอสูรป่า ใช้เสริมพลังคมดาบ' },
  { id: 'dragon_scale', name: 'Dragon Scale (เกล็ดมังกร)', iconFile: 'assets/Icons/icon11.png', sellPrice: 150, desc: 'เกล็ดมังกรทนความร้อนสูง ล้ำค่าและหายาก' },
  { id: 'magic_core', name: 'Magic Core (แกนเวทมนตร์)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon35.png', sellPrice: 200, desc: 'แกนพลังงานเวทจากโกเลมและมอนสเตอร์เวท' },
  { id: 'mythril_ore', name: 'Mythril Ore (แร่ไมธิริล)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon22.png', sellPrice: 300, desc: 'แร่โลหะศักดิ์สิทธิ์น้ำหนักเบาและแข็งแกร่งเป็นเลิศ' },
  { id: 'ruby_gem', name: 'Ruby Gem (อัญมณีทับทิมเพลิง)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon1.png', sellPrice: 380, desc: 'อัญมณีสีแดงเพลิงบริสุทธิ์ ขุดได้จากเตาหลอมแมกม่า B6F' },
  { id: 'sapphire_crystal', name: 'Sapphire Crystal (ผลึกไพลินวารี)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon10.png', sellPrice: 420, desc: 'ผลึกสีน้ำเงินประกายน้ำแข็ง พบได้ในหุบผาเหมันต์ B7F' },
  { id: 'emerald_stone', name: 'Emerald Stone (มรกตวายุ)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon17.png', sellPrice: 480, desc: 'มรกตสีเขียวมรกต ล้ำค่าและมีพลังเวทสถิตอยู่' },
  { id: 'diamond_shard', name: 'Diamond Shard (เศษเพชรประกายแสง)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon25.png', sellPrice: 850, desc: 'เพชรแท้เจียระไน แข็งแกร่งที่สุดในปฐพี มูลค่าสูงลิบลิ่ว' },
  { id: 'star_core', name: 'Star Core (แกนดาวตกบรรพกาล)', iconFile: 'assets/48 Free Minerals Pixel Art Icons Pack/PNG/Transperent/Icon45.png', sellPrice: 1600, desc: 'แกนพลังงานจักรวาลจาก B10F Throne of the Void' },
  { id: 'forest_herb', name: 'Forest Herb (สมุนไพรพงไพร)', iconFile: 'assets/Icons/icon14.png', sellPrice: 25, desc: 'สมุนไพรป่าสด ช่วยสมานแผลและฟื้นฟู' },
  { id: 'ancient_relic', name: 'Ancient Relic (ซากโบราณวัตถุ)', iconFile: 'assets/Icons/icon15.png', sellPrice: 450, desc: 'ชิ้นส่วนโบราณจากซากดันเจี้ยน มีมูลค่ามหาศาล' },
  { id: 'scorpion_tail', name: 'Scorpion Core (แกนจักรกลการ์ดสกอร์เปียน)', iconFile: 'assets/Icons/icon16.png', sellPrice: 1000, desc: 'แกนปฏิกรณ์อาวุธกล่องดำตกจาก Guard Scorpion Mini-Boss' }
];

window.playerInventory = {
  consumables: { potion: 5, hi_potion: 2, x_potion: 1, ether: 4, turbo_ether: 1, elixir: 1, megalixir: 0, hero_drink: 1, barrier_shield: 1, remedy: 2, phoenix_down: 2, antidote: 3, burn_salve: 3 },
  materials: { slime_jelly: 2, forest_herb: 3, beast_fang: 1, dragon_scale: 0, magic_core: 0, mythril_ore: 1, ruby_gem: 1, sapphire_crystal: 0, emerald_stone: 0, diamond_shard: 0, star_core: 0, ancient_relic: 0, scorpion_tail: 0 }
};


// ================= Skill Unlock Table (skills unlock at specific levels) =================
const SKILL_UNLOCK_TABLE = {
  cloud: [
    { id: 'braver',      levelRequired: 1 },  // มีติดตัวตั้งแต่เริ่ม (ความทรงจำตื่นขึ้น)
    { id: 'fire',        levelRequired: 1 },  // มนตราเพลิงอัคคีประจำตัว
    { id: 'cross_slash', levelRequired: 4 },
    { id: 'blade_beam',  levelRequired: 6 },
    { id: 'meteorain',   levelRequired: 8 }   // Limit Break tier 2
  ],
  tifa: [
    { id: 'beat_rush',   levelRequired: 1 },  // พร้อมใช้ทันทีเมื่อช่วยที่ B3F
    { id: 'somersault',  levelRequired: 3 },  // พร้อมใช้ทันที
    { id: 'water_kick',  levelRequired: 5 },
    { id: 'chakra',      levelRequired: 7 }
  ],
  vivi: [
    { id: 'fire',        levelRequired: 1 },  // พร้อมใช้ทันทีเมื่อพบที่ B5F
    { id: 'blizzard',    levelRequired: 1 },  // พร้อมใช้ทันที
    { id: 'thunder',     levelRequired: 5 },  // พร้อมใช้ทันที
    { id: 'quake',       levelRequired: 7 },
    { id: 'bio',         levelRequired: 9 },
    { id: 'flare',       levelRequired: 10 },
    { id: 'arithmeticks',levelRequired: 10 }
  ],
  cecil: [
    { id: 'holy_blade',   levelRequired: 1 },  // พร้อมใช้ทันทีเมื่อพบที่ B7F
    { id: 'cover',        levelRequired: 1 },  // พร้อมใช้ทันที
    { id: 'radiant_cure', levelRequired: 7 },  // พร้อมใช้ทันที
    { id: 'saint_fall',   levelRequired: 9 }
  ],
  aeris: [
    { id: 'cura',         levelRequired: 1 },  // พร้อมใช้ทันทีเมื่อพบที่ B9F
    { id: 'seal_evil',    levelRequired: 1 },  // พร้อมใช้ทันที
    { id: 'ray_judgment', levelRequired: 9 }
  ],
  chrono: [
    { id: 'lightning_slash', levelRequired: 1 },
    { id: 'cyclone',         levelRequired: 1 },
    { id: 'spincut',         levelRequired: 10 },
    { id: 'luminaire',       levelRequired: 10 }
  ]
};

// Skill Memory Awakening Quotes when learning/recalling new techniques
const SKILL_MEMORY_QUOTES = {
  braver: "Cloud: 'จำได้แล้ว! ท่าฟันดาบกระโดดผ่าอากาศ [Braver]! นี่คือเพลงดาบ SOLDIER ประจำตัวฉัน!'",
  fire: "Cloud: 'จำได้แล้ว! สัมผัสของพลังมาทีเรีย... ฉันรวบรวมเพลิงอัคคีร่าย [Fire] ได้!'",
  cross_slash: "Cloud: 'จำได้แล้ว! วาดคมดาบตัดอากาศเป็นกากบาทสายฟ้า [Cross-Slash]!'",
  blade_beam: "Cloud: 'จำได้แล้ว! ฟันคลื่นกระแทกอัดลงพื้น [Blade Beam] ระเบิดถล่มศัตรูรอบทิศ!'",
  meteorain: "Cloud: 'ขีดจำกัดถูกทำลาย... มหาอุกกาบาตดาวตก [Meteorain]! สัญชาตญาณขั้นสุดยอดของฉันกลับมาแล้ว!'",
  beat_rush: "Tifa: 'จำได้แล้ว! ท่วงท่าคอมโบหมัดรัวมังกร [Beat Rush]! ลุยกันเลย!'",
  somersault: "Tifa: 'นึกออกแล้ว! สปริงตัวเตะลังกาหลังสอยคาง [Somersault] ให้ศัตรูมึนงง!'",
  water_kick: "Tifa: 'จำได้แล้ว! เพลงเตะคลื่นวารี [Water Kick] ซัดมอนสเตอร์ไฟกระเด็น!'",
  chakra: "Tifa: 'จำได้แล้ว! รวมลมปราณจักระ [Chakra] เพื่อฟื้นฟูแผลและล้างพิษให้เพื่อนๆ!'",
  blizzard: "Vivi: 'จำได้แล้วครับ! ละอองไอเย็นรวมเป็นแท่งน้ำแข็ง [Blizzard] แช่แข็งศัตรู!'",
  thunder: "Vivi: 'จำได้แล้วครับ! สายฟ้าฟาดจากฟ้า [Thunder] ชนะทางมอนสเตอร์น้ำ!'",
  quake: "Vivi: 'แผ่นดินไหวสะเทือนลั่น [Quake]! ผมจำวิธีส่งคลื่นมนตราลงใต้พิภพได้แล้วครับ!'",
  bio: "Vivi: 'หมอกพิษมนตร์ดำทมิฬ [Bio]... พลังโบราณตื่นขึ้นมาในตัวผมแล้ว!'",
  flare: "Vivi: 'มหาเวททำลายล้างสูงสุด [Flare]... ผมจำพลังที่แท้จริงได้แล้วครับ!'",
  arithmeticks: "Vivi: 'ศาสตร์คำนวณศักดิ์สิทธิ์ [Arithmeticks]! ทะลวงทุกธาตุด้วยการคำนวณ!'",
  holy_blade: "Cecil: 'ดาบศักดิ์สิทธิ์ [Holy Blade]! ข้าจำวิชาดาบแสงแห่งพาราดินได้แล้ว!'",
  cover: "Cecil: 'การพิทักษ์ [Cover]! ข้าขอเอาตัวเข้าแลกเพื่อปกป้องพวกพ้อง!'",
  radiant_cure: "Cecil: 'แสงอธิษฐาน [Radiant Cure]... ข้าสามารถเยียวยาบาดแผลให้ทุกคนได้!'",
  saint_fall: "Cecil: 'หอกแสงศักดิ์สิทธิ์ลงทัณฑ์ [Saint Fall]! แสงสว่างจงกวาดล้างความมืด!'",
  cura: "Aeris: 'เสียงกระซิบจากดวงดาว... ฉันจำวิธีร่ายมนต์รักษา [Cura] ได้แล้วค่ะ!'",
  seal_evil: "Aeris: 'พลังบริสุทธิ์แห่งเผ่าเซตรา... ฉันสามารถใช้ [Seal Evil] ผนึกมารร้ายได้!'",
  ray_judgment: "Aeris: 'ลำแสงแห่งการพิพากษา [Ray of Judgment]... ให้พลังดวงดาวนำทางพวกเรา!'",
  lightning_slash: "Chrono: 'ดาบอัสนีบาตผ่ามิติ [Lightning Slash]! วิชาประจำตัวของข้า!'",
  cyclone: "Chrono: 'หมุนดาบเป็นพายุไซโคลน [Cyclone]! กวาดศัตรูทั้งหมดในสนาม!'",
  spincut: "Chrono: 'ผ่ามิติแสง [Dimensional Cleave]! ฟันดาบด้วยความเร็วเหนือแสง!'",
  luminaire: "Chrono: 'มหาเวทลูมิแนร์ [Luminaire]! พลังสูงสุดแห่งกาลเวลา!'"
};

// Get unlocked skills for a character at their current level
function getUnlockedSkills(characterId, characterLevel) {
  const allSkills = CHARACTER_SKILLS_MASTER[characterId] || [];
  const unlockTable = SKILL_UNLOCK_TABLE[characterId] || [];
  return allSkills.filter(skill => {
    const entry = unlockTable.find(u => u.id === skill.id);
    return entry ? characterLevel >= entry.levelRequired : false;
  });
}

// All skills defined (used as master list; filtered by level at runtime)
const CHARACTER_SKILLS_MASTER = {
  cloud: [
    { id: 'braver', name: 'Braver (เบรฟเวอร์)', mp: 12, elem: 'none', type: 'single', mult: 1.8, desc: 'ฟันดาบยักษ์กระโดดผ่าศัตรูอย่างรุนแรง (1.8x ATK) [เพลงดาบจำได้ขึ้นใจ]' },
    { id: 'fire', name: 'Fire (มนตราเพลิงอัคคี)', mp: 10, elem: 'fire', type: 'single', mult: 2.0, burn: 1, desc: 'ลูกบอลไฟแผดเผา ชนะทางธาตุดิน (2x DMG) [เวทมนตร์ประจำตัว]' },
    { id: 'cross_slash', name: 'Cross-Slash (กากบาทสายฟ้า)', mp: 24, elem: 'thunder', type: 'single', mult: 2.2, stun: 0.6, desc: 'ฟันดาบเป็นรูปกากบาท มีโอกาสทำให้ศัตรูติด Stun [ปลดล็อค Lv.4]' },
    { id: 'blade_beam', name: 'Blade Beam (คลื่นดาบปฐพี)', mp: 34, elem: 'earth', type: 'all', mult: 1.5, desc: 'ฟันคลื่นพลังระเบิดกระจายโดนศัตรูทั้งหมด [ปลดล็อค Lv.6]' },
    { id: 'meteorain', name: 'Meteorain (อุกกาบาตสังหาร)', mp: 42, elem: 'none', type: 'all', mult: 2.5, desc: 'Limit Break Lv.2! ฝนอุกกาบาตตกใส่ศัตรูทุกตัว [ปลดล็อค Lv.8]' }
  ],
  tifa: [
    { id: 'beat_rush', name: 'Beat Rush (หมัดรัวมังกร)', mp: 12, elem: 'none', type: 'single', mult: 1.6, crit: 0.4, desc: 'คอมโบหมัดรัวต่อเนื่อง อัตราติดคริติคอลสูง [วิชาประจำตัว]' },
    { id: 'somersault', name: 'Somersault (ลูกเตะลังกาหลัง)', mp: 20, elem: 'none', type: 'single', mult: 2.0, stun: 0.5, desc: 'เตะสอยคางศัตรูลอยขึ้น มีโอกาสทำให้มึนงง [วิชาประจำตัว]' },
    { id: 'water_kick', name: 'Water Kick (วอเตอร์คิก)', mp: 24, elem: 'water', type: 'single', mult: 2.1, desc: 'เตะคลื่นวารี ชนะทางธาตุไฟ (2x Damage!) [ปลดล็อค Lv.5]' },
    { id: 'chakra', name: 'Chakra (ลมปราณจักระ)', mp: 18, elem: 'none', type: 'heal', healPct: 0.35, desc: 'รวมลมปราณ ฟื้นฟู HP 35% ให้เพื่อนร่วมทีมและล้างพิษ/ไฟไหม้ [ปลดล็อค Lv.7]' }
  ],
  vivi: [
    { id: 'fire', name: 'Fire / Fira (มนตราเพลิงอัคคี)', mp: 10, elem: 'fire', type: 'single', mult: 2.2, burn: 2, desc: 'ลูกบอลไฟแผดเผา ชนะทางธาตุดิน (2x DMG) ติดสถานะ Burn [วิชาประจำตัว]' },
    { id: 'blizzard', name: 'Blizzard / Blizzara (มนตราน้ำแข็งยะเยือก)', mp: 10, elem: 'water', type: 'single', mult: 2.2, desc: 'แท่งน้ำแข็งเย็นยะเยือก ชนะทางธาตุไฟ (2x DMG) [วิชาประจำตัว]' },
    { id: 'thunder', name: 'Thunder / Thundara (มนตราสายฟ้าฟาด)', mp: 12, elem: 'thunder', type: 'single', mult: 2.2, desc: 'อัสนีบาตฟาดลงมา ชนะทางธาตุน้ำ (2x DMG) [วิชาประจำตัว]' },
    { id: 'quake', name: 'Quake (เวทแผ่นดินไหว)', mp: 18, elem: 'earth', type: 'all', mult: 1.9, desc: 'แผ่นดินไหวถล่มใส่ศัตรูทั้งหมด ชนะทางธาตุสายฟ้า [ปลดล็อค Lv.7]' },
    { id: 'bio', name: 'Bio (มนตราหมอกพิษทมิฬ)', mp: 16, elem: 'earth', type: 'all', mult: 1.8, poison: true, desc: 'ปล่อยหมอกพิษมนตร์ดำใส่ศัตรูทั้งหมด ทำให้ติด Poison [ปลดล็อค Lv.9]' },
    { id: 'flare', name: 'Flare (มหาเวทมนตร์ดำแฟลร์)', mp: 38, elem: 'none', type: 'single', mult: 3.5, desc: 'สุดยอดเวทมนตร์ทำลายล้างไร้ธาตุ อานุภาพมหาศาล [ปลดล็อค Lv.10]' },
    { id: 'arithmeticks', name: 'Arithmeticks (คำนวณศักดิ์สิทธิ์)', mp: 24, elem: 'none', type: 'calc', mult: 2.6, desc: 'ศาสตร์คำนวณของ Arithmetician! ยิงลำแสงศักดิ์สิทธิ์ทะลวงทุกธาตุ [ปลดล็อค Lv.10]' }
  ],
  cecil: [
    { id: 'holy_blade', name: 'Holy Blade (ดาบศักดิ์สิทธิ์)', mp: 14, elem: 'thunder', type: 'single', mult: 2.0, desc: 'ฟันดาบแสงศักดิ์สิทธิ์ทะลวงเกราะศัตรู (Holy Strike) [วิชาประจำตัว]' },
    { id: 'cover', name: 'Sentinel Cover (ปกป้องพันธมิตร)', mp: 10, elem: 'none', type: 'single', mult: 1.2, desc: 'ตั้งท่าพิทักษ์เพื่อนร่วมทีม เพิ่ม DEF 50% ให้ตนเอง [วิชาประจำตัว]' },
    { id: 'radiant_cure', name: 'Radiant Cure (แสงรักษา)', mp: 16, elem: 'none', type: 'heal', healPct: 0.40, desc: 'อธิษฐานแสงศักดิ์สิทธิ์ ฟื้นฟู HP 40% ให้ทุกคนในปาร์ตี้ [วิชาประจำตัว]' },
    { id: 'saint_fall', name: 'Saint Fall (หอกแสงลงทัณฑ์)', mp: 38, elem: 'thunder', type: 'all', mult: 2.5, desc: 'เรียกหอกแสงตกจากฟากฟ้าฟาดใส่ศัตรูทั้งหมด [ปลดล็อค Lv.9]' }
  ],
  aeris: [
    { id: 'cura', name: 'Cura (มนตราเยียวยา)', mp: 14, elem: 'none', type: 'heal', healPct: 0.45, desc: 'เวทฟื้นฟู HP 45% ให้เพื่อนร่วมทีมทุกคน [วิชาประจำตัว]' },
    { id: 'seal_evil', name: 'Seal Evil (ผนึกมาร)', mp: 18, elem: 'none', type: 'single', mult: 1.2, stun: 0.8, desc: 'สวดมนต์สะกดวิญญาณ มีโอกาสสูงมากทำให้ศัตรูติด Stun [วิชาประจำตัว]' },
    { id: 'ray_judgment', name: 'Ray of Judgment (ลำแสงพิพากษา)', mp: 30, elem: 'thunder', type: 'single', mult: 2.8, desc: 'ยิงลำแสงเวทมนตร์โบราณแห่งเผ่าเซตรา [ปลดล็อค Lv.9]' }
  ],
  chrono: [
    { id: 'lightning_slash', name: 'Lightning Slash (ดาบอัสนีบาต)', mp: 14, elem: 'thunder', type: 'single', mult: 2.2, desc: 'ฟันดาบคาตานะสายฟ้าฟาด ชนะทางธาตุน้ำ (2x DMG) [วิชาประจำตัว]' },
    { id: 'cyclone', name: 'Cyclone (ไซโคลนดาบพายุ)', mp: 20, elem: 'none', type: 'all', mult: 1.9, desc: 'หมุนตัวฟันดาบเป็นพายุไซโคลน ฟาดศัตรูทั้งหมดในสนาม [วิชาประจำตัว]' },
    { id: 'spincut', name: 'Dimensional Cleave (ผ่ามิติแสง)', mp: 26, elem: 'thunder', type: 'single', mult: 2.7, crit: 0.45, desc: 'ฟันดาบด้วยความเร็วเหนือแสง โอกาสติดคริติคอลสูงมาก [ปลดล็อค Lv.10]' },
    { id: 'luminaire', name: 'Luminaire (มหาเวทลูมิแนร์)', mp: 42, elem: 'thunder', type: 'all', mult: 3.5, desc: 'ปลดปล่อยพลังสายฟ้าศักดิ์สิทธิ์สูงสุดแห่งกาลเวลา ถล่มสนามรบทั้งหมด! [ปลดล็อค Lv.10]' }
  ]
};

// Backwards compatibility alias
const CHARACTER_SKILLS = CHARACTER_SKILLS_MASTER;

// ================= Global Character Roster — START WEAK, GROW STRONG =================
// unlockFloor: ชั้นที่จะพบและเพิ่มเข้าปาร์ตี้ (0 = เริ่มมาด้วย)
// Characters start at low levels and grow through play
window.characterRoster = {
  cloud: {
    id: 'cloud',
    name: 'Cloud Stif',
    job: 'SOLDIER (Rookie)',
    avatar: '🗡️',
    portrait: 'portraits/portrait_cloud.jpg',
    unlockFloor: 0,  // เริ่มมาด้วยเลย
    // Stats Lv.1 — มีพลังพอสู้ได้ ไม่ตายง่ายเกินไป
    level: 1, exp: 0, nextExp: 120, jobLevel: 1, jobExp: 0, jp: 0, statPoints: 0,
    hp: 210, maxHp: 210, baseHp: 210, mp: 40, maxMp: 40, baseMp: 40, limit: 0, maxLimit: 100,
    baseAtk: 18, atk: 18, baseDef: 12, def: 12, baseMagic: 14, magic: 14, baseSpd: 22, spd: 22, bravery: 55, faith: 45,
    equippedWeapon: 'Wooden Sword', equippedArmor: 'Cloth Tunic',
    equippedMateria: [null, null],
    defending: false, status: {}
  },
  tifa: {
    id: 'tifa',
    name: 'Fata Lockhart',
    job: 'Monk (Novice)',
    avatar: '🥊',
    portrait: 'portraits/portrait_tifa.jpg',
    unlockFloor: 3,  // พบที่ B3F ในกรงเหล็ก
    // Stats Lv.3 — กระจอกพอใช้
    level: 3, exp: 0, nextExp: 200, jobLevel: 1, jobExp: 0, jp: 0, statPoints: 0,
    hp: 260, maxHp: 260, baseHp: 260, mp: 45, maxMp: 45, baseMp: 45, limit: 0, maxLimit: 100,
    baseAtk: 28, atk: 28, baseDef: 18, def: 18, baseMagic: 12, magic: 12, baseSpd: 35, spd: 35, bravery: 65, faith: 40,
    equippedWeapon: 'Leather Gloves', equippedArmor: 'Iron Bangle',
    equippedMateria: [null, null],
    defending: false, status: {}
  },
  vivi: {
    id: 'vivi',
    name: 'Vivi Spellcraft',
    job: 'Black Mage (Apprentice)',
    avatar: '🧙',
    portrait: 'portraits/portrait_vivi.jpg',
    unlockFloor: 5,  // พบที่ B5F Safe Haven
    // Stats Lv.5 — เวทอ่อนๆ แต่หัวดี
    level: 5, exp: 0, nextExp: 350, jobLevel: 1, jobExp: 0, jp: 0, statPoints: 0,
    hp: 240, maxHp: 240, baseHp: 240, mp: 95, maxMp: 95, baseMp: 95, limit: 0, maxLimit: 100,
    baseAtk: 14, atk: 14, baseDef: 10, def: 10, baseMagic: 48, magic: 48, baseSpd: 22, spd: 22, bravery: 32, faith: 72,
    equippedWeapon: 'Oak Staff', equippedArmor: 'Silk Robe',
    equippedMateria: [null, null],
    defending: false, status: {}
  },
  cecil: {
    id: 'cecil',
    name: 'Sir Cecilo',
    job: 'Paladin Knight (Lost)',
    avatar: '🛡️',
    portrait: 'portraits/portrait_cecil.jpg',
    unlockFloor: 7,  // พบที่ B7F — อัศวินที่หลงทาง
    // Stats Lv.7 — แข็งแกร่งแต่ยังไม่ถึงจุดสูงสุด
    level: 7, exp: 0, nextExp: 600, jobLevel: 2, jobExp: 0, jp: 50, statPoints: 0,
    hp: 380, maxHp: 380, baseHp: 380, mp: 55, maxMp: 55, baseMp: 55, limit: 0, maxLimit: 100,
    baseAtk: 42, atk: 42, baseDef: 38, def: 38, baseMagic: 22, magic: 22, baseSpd: 24, spd: 24, bravery: 72, faith: 60,
    equippedWeapon: 'Paladin Sword', equippedArmor: 'Iron Plate',
    equippedMateria: [null, null],
    defending: false, status: {}
  },
  aeris: {
    id: 'aeris',
    name: 'Aera Starbloom',
    job: 'Cetra Healer',
    avatar: '🌸',
    portrait: 'portraits/portrait_aeris.jpg',
    unlockFloor: 9,  // พบที่ B9F — ผู้นำทางสู่ Final Boss
    // Stats Lv.9 — หมอดีแต่ยังพัฒนาได้อีก
    level: 9, exp: 0, nextExp: 900, jobLevel: 3, jobExp: 0, jp: 150, statPoints: 0,
    hp: 310, maxHp: 310, baseHp: 310, mp: 135, maxMp: 135, baseMp: 135, limit: 0, maxLimit: 100,
    baseAtk: 22, atk: 22, baseDef: 18, def: 18, baseMagic: 72, magic: 72, baseSpd: 30, spd: 30, bravery: 42, faith: 80,
    equippedWeapon: 'Guard Stick', equippedArmor: 'White Cloak',
    equippedMateria: [null, null],
    defending: false, status: {}
  },
  chrono: {
    id: 'chrono',
    name: 'Chronos Timekeeper',
    job: 'Time Blade Hero',
    avatar: '⚡',
    portrait: 'portraits/portrait_chrono.jpg',
    unlockFloor: 10,  // พบที่ B10F ก่อนสู้ Final Boss
    // Stats Lv.10 — endgame bonus character
    level: 10, exp: 0, nextExp: 1200, jobLevel: 3, jobExp: 0, jp: 200, statPoints: 0,
    hp: 420, maxHp: 420, baseHp: 420, mp: 80, maxMp: 80, baseMp: 80, limit: 0, maxLimit: 100,
    baseAtk: 58, atk: 58, baseDef: 30, def: 30, baseMagic: 35, magic: 35, baseSpd: 40, spd: 40, bravery: 78, faith: 55,
    equippedWeapon: 'Wooden Katana', equippedArmor: 'Chrono Tunic',
    equippedMateria: [null, null],
    defending: false, status: {}
  }
};

// Wooden Sword starter weapon for Cloud
if (!WEAPONS_DB.find(w => w.id === 'wooden_sword_cloud')) {
  WEAPONS_DB.unshift({
    id: 'wooden_sword_cloud',
    heroId: 'cloud',
    name: 'Wooden Sword',
    type: 'Starter',
    atk: 8,
    price: 0,
    owned: true,
    col: 0, row: 0,
    badge: 'badge-water',
    badgeText: 'STARTER',
    desc: 'ดาบไม้ฝึกหัดของ Cloud ที่เพิ่งตื่นขึ้นมา (+8 ATK)'
  });
}

window.equippedWeapon = WEAPONS_DB.find(w => w.id === 'wooden_sword_cloud') || WEAPONS_DB[0];
window.playerGil = 50;  // เริ่มต้นแทบไม่มีเงิน

// ================= 6. Tactical Turn-Based Battle Engine =================
class BattleEngine {
  constructor(onBattleEnd) {
    this.onBattleEnd = onBattleEnd;
    this.active = false;
    this.turn = 'player'; // 'player', 'enemy', 'busy'

    // Party starts with just Cloud (Lv.1 solo) — others join as floors are cleared
    // Uses characterRoster as the single source of truth
    this.party = [window.characterRoster.cloud];

    this.enemies = [];
    this.selectedEnemyIdx = 0;
    this.items = window.playerInventory ? window.playerInventory.consumables : { potion: 3, hi_potion: 1, ether: 2, turbo_ether: 0, elixir: 0, phoenix_down: 1 };

    this.cloudRenderer = new CloudSpriteRenderer();
    this.tifaRenderer = new TifaRenderer();
    this.mageRenderer = new BlackMageRenderer();
    this.enemyRenderer = new EnemyRenderer();

    this.activeActorIndex = 0; // Index of living party member acting
    this.actionQueue = [];
  }

  getActiveActor() {
    return this.party[this.activeActorIndex] || this.party.find(m => m.hp > 0) || this.party[0];
  }

  startBattle(encounterType = 'wild') {
    this.active = true;
    this.turn = 'player';
    this.encounterType = encounterType;
    this._lastEncounterType = encounterType; // stored for retry
    this.activeActorIndex = 0;
    this.battleStartTime = Date.now();
    this.weaknessHits = 0;

    // Reset party defending status
    this.party.forEach(m => {
      m.defending = false;
      m.status = m.status || {};
    });

    const bossCard = document.getElementById('boss-health-card');
    const bossWarning = document.getElementById('boss-stance-warning');
    const bLabel = document.getElementById('boss-name-label');

    if (encounterType === 'boss_golem') {
      sfx.playBossAlarm();
      this.enemies = [
        {
          name: 'Iron Sentinel Golem (MINI-BOSS)',
          element: 'earth',
          hp: 1200,
          maxHp: 1200,
          atk: 45,
          def: 35,
          isBoss: true,
          bossType: 'golem',
          phase: 1,
          turnCount: 0,
          stoneGuardActive: false,
          status: {}
        }
      ];
      if (bossCard) bossCard.style.display = 'block';
      if (bLabel) bLabel.textContent = 'IRON SENTINEL GOLEM (MINI-BOSS)';
      setCombatLog('🚨 MINI-BOSS: Iron Sentinel Golem ปรากฏตัวขวางทางขึ้นสู่ชั้น 4! ⚡ ธาตุสายฟ้าทำ 2x! (HP<50% → Iron Rage โจมตีทุกคน)');
    } else if (encounterType === 'boss_dragon') {
      sfx.playBossAlarm();
      this.enemies = [
        {
          name: 'Ancient Red Dragon (ELITE BOSS)',
          element: 'fire',
          hp: 3500,
          maxHp: 3500,
          atk: 82,
          def: 40,
          isBoss: true,
          bossType: 'dragon',
          phase: 1,
          turnCount: 0,
          breathCharging: false,
          status: {}
        }
      ];
      if (bossCard) bossCard.style.display = 'block';
      if (bLabel) bLabel.textContent = 'ANCIENT RED DRAGON (ELITE BOSS)';
      setCombatLog('🚨 ELITE BOSS: Ancient Red Dragon แผดเสียงคำรามก้องรังมังกร! 💧 ธาตุน้ำทำ 2x! (HP<40% → Dragon Breath ลามทั้งปาร์ตี้)');
    } else if (encounterType === 'boss_bahamut') {
      sfx.playBossAlarm();
      this.enemies = [
        {
          name: 'Bahamut Zero (FINAL BOSS)',
          element: 'thunder',
          hp: 6000,
          maxHp: 6000,
          atk: 110,
          def: 48,
          isBoss: true,
          bossType: 'bahamut',
          phase: 1,
          turnCount: 0,
          teraflareCharge: 0,
          status: {}
        }
      ];
      if (bossCard) bossCard.style.display = 'block';
      if (bLabel) bLabel.textContent = 'BAHAMUT ZERO (FINAL BOSS)';
      setCombatLog('🚨 FINAL BOSS: Bahamut Zero ปรากฏตัว! 🌿 ธาตุดินทำ 2x! ⚠️ ทุก 4 รอบ → Teraflare ถล่มทั้งทีม 80% HP!');
    } else if (encounterType === 'boss') {
      sfx.playBossAlarm();
      this.enemies = [
        {
          name: 'Guard Scorpion (MINI-BOSS)',
          element: 'thunder',
          hp: 2000,
          maxHp: 2000,
          atk: 55,
          def: 35,
          isBoss: true,
          bossType: 'scorpion',
          tailUp: false,
          isCharging: false,
          turnsSinceTail: 0,
          phase: 1,
          status: {}
        }
      ];
      if (bossCard) bossCard.style.display = 'block';
      if (bossWarning) bossWarning.style.display = 'none';
      setCombatLog('🚨 MINI-BOSS ENCOUNTER: Guard Scorpion ปรากฏตัวขึ้นในห้องโถงโบราณ! ระวังท่าชาร์จ Tail Laser!');
    } else if (encounterType === 'fire') {
      // Balanced scaling: B1F=0.55x, B5F=0.95x, B10F=1.45x
      const fl = window.dungeonState?.currentFloor || 1;
      const hpScale = 0.45 + fl * 0.10;
      const atkScale = 0.45 + fl * 0.09;
      this.enemies = [
        { name: 'Hellhound A', element: 'fire', hp: Math.round(300*hpScale), maxHp: Math.round(300*hpScale), atk: Math.round(38*atkScale), def: Math.round(10*hpScale), status: {} },
        { name: 'Fire Drake B', element: 'fire', hp: Math.round(260*hpScale), maxHp: Math.round(260*hpScale), atk: Math.round(34*atkScale), def: Math.round(9*hpScale), status: {} }
      ];
      if (bossCard) bossCard.style.display = 'none';
      setCombatLog('🔥 เข้าสู่การต่อสู้กับฝูงสัตว์ร้ายธาตุไฟ! โจมตีด้วยเวทน้ำ Blizzard เพื่อทำ 2.0x Weakness!');
    } else if (encounterType === 'water') {
      const fl = window.dungeonState?.currentFloor || 1;
      const hpScale = 0.45 + fl * 0.10;
      const atkScale = 0.45 + fl * 0.09;
      this.enemies = [
        { name: 'Water Slime A', element: 'water', hp: Math.round(280*hpScale), maxHp: Math.round(280*hpScale), atk: Math.round(32*atkScale), def: Math.round(8*hpScale), status: {} },
        { name: 'Water Slime B', element: 'water', hp: Math.round(220*hpScale), maxHp: Math.round(220*hpScale), atk: Math.round(28*atkScale), def: Math.round(6*hpScale), status: {} }
      ];
      if (bossCard) bossCard.style.display = 'none';
      setCombatLog('💧 เข้าสู่การต่อสู้กับสไลม์วารี! โจมตีด้วยเวทสายฟ้า Thunder เพื่อทำ 2.0x Weakness!');
    } else if (encounterType === 'earth') {
      const fl = window.dungeonState?.currentFloor || 1;
      const hpScale = 0.45 + fl * 0.10;
      const atkScale = 0.45 + fl * 0.09;
      this.enemies = [
        { name: 'Earth Golem A', element: 'earth', hp: Math.round(360*hpScale), maxHp: Math.round(360*hpScale), atk: Math.round(42*atkScale), def: Math.round(15*hpScale), status: {} },
        { name: 'Forest Treant B', element: 'earth', hp: Math.round(280*hpScale), maxHp: Math.round(280*hpScale), atk: Math.round(35*atkScale), def: Math.round(12*hpScale), status: {} }
      ];
      if (bossCard) bossCard.style.display = 'none';
      setCombatLog('🌿 เข้าสู่การต่อสู้กับอสูรพฤกษา! โจมตีด้วยเวทไฟ Fire เพื่อทำ 2.0x Weakness!');
    } else {
      // Mixed wilderness encounter
      const fl = window.dungeonState?.currentFloor || 1;
      const hpScale = 0.45 + fl * 0.10;
      const atkScale = 0.45 + fl * 0.09;
      this.enemies = [
        { name: 'Wild Hellhound', element: 'fire', hp: Math.round(270*hpScale), maxHp: Math.round(270*hpScale), atk: Math.round(32*atkScale), def: Math.round(8*hpScale), status: {} },
        { name: 'Thunder Drake', element: 'thunder', hp: Math.round(300*hpScale), maxHp: Math.round(300*hpScale), atk: Math.round(36*atkScale), def: Math.round(9*hpScale), status: {} }
      ];
      if (bossCard) bossCard.style.display = 'none';
      setCombatLog('⚔️ การต่อสู้เริ่มต้นขึ้น! เลือกคำสั่งโจมตี, สกิลประจำตัว หรือใช้เวทมนตร์ธาตุ!');
    }

    const partyContainer = document.getElementById('party-hud-container');
    if (partyContainer) partyContainer.innerHTML = '';
    const enemiesContainer = document.getElementById('enemies-hud-container');
    if (enemiesContainer) enemiesContainer.innerHTML = '';

    this.selectedEnemyIdx = 0;
    this.updateTimeline();
    updateBattleHUD();

    if (!window.dungeonState?.firstBattleSpoken) {
      if (window.dungeonState) window.dungeonState.firstBattleSpoken = true;
      setTimeout(() => {
        setCombatLog('💡 Cloud: "จำได้แล้ว! ฉันใช้เพลงดาบ Braver และเวทไฟ Fire ได้! พร้อมสู้แล้ว!" (กด DEFEND เพื่อบล็อกและมีโอกาส Parry สวนกลับ 50%!)');
      }, 400);
    }
  }

  updateTimeline() {
    const timelineEl = document.getElementById('timeline-chips');
    if (!timelineEl) return;
    timelineEl.innerHTML = '';

    const participants = [];
    this.party.forEach(m => {
      if (m.hp > 0) {
        participants.push({ name: m.name.split(' ')[0], type: 'player', id: m.id, spd: m.spd });
      }
    });
    this.enemies.forEach((e, idx) => {
      if (e.hp > 0) {
        participants.push({ name: e.name.split(' ')[0], type: e.isBoss ? 'boss' : 'enemy', id: 'e' + idx, spd: e.isBoss ? 48 : 36 });
      }
    });

    participants.sort((a, b) => b.spd - a.spd);

    const currentActorId = this.party[this.activeActorIndex]?.id;
    participants.forEach((p, i) => {
      // Add animated arrow separator between chips
      if (i > 0) {
        const arrow = document.createElement('span');
        arrow.className = 'ct-arrow-separator';
        arrow.textContent = '▶';
        timelineEl.appendChild(arrow);
      }

      const chip = document.createElement('div');
      const isCur = (p.type === 'player' && p.id === currentActorId) ||
                    (p.type !== 'player' && this.turn === 'enemy' && i === 0);
      const isNext = !isCur && i === (participants.findIndex(pp => {
        return (pp.type === 'player' && pp.id === currentActorId) ||
               (pp.type !== 'player' && this.turn === 'enemy');
      }) + 1) % participants.length;

      chip.className = `ct-chip ${p.type}${isCur ? ' is-current' : ''}${isNext ? ' is-next' : ''}`;

      const icon = p.type === 'player' ? '⚔️' : p.type === 'boss' ? '🦂' : '👹';
      const tag = isCur
        ? `<span class="ct-turn-tag tag-current">NOW</span>`
        : isNext
          ? `<span class="ct-turn-tag tag-next">NEXT</span>`
          : '';

      chip.innerHTML = `<span>${icon}</span>${p.name}${tag}`;
      timelineEl.appendChild(chip);
    });
  }

  setTurn(t) {
    this.turn = t;
    if (this._busySafetyTimeout) clearTimeout(this._busySafetyTimeout);
    if (t === 'busy') {
      this._busySafetyTimeout = setTimeout(() => {
        if (this.turn === 'busy' && this.active) {
          console.warn('⚠️ Turn safety watchdog: recovering from stuck busy state');
          if (this.enemies.every(e => e.hp <= 0)) {
            this.checkTurnOutcome();
          } else {
            this.turn = 'player';
            this.updateTimeline();
            updateBattleHUD();
          }
        }
      }, 4000);
    }
  }

  getTarget() {
    let target = this.enemies[this.selectedEnemyIdx];
    if (target && target.hp > 0) {
      return target;
    }
    const firstAliveIdx = this.enemies.findIndex(e => e && e.hp > 0);
    if (firstAliveIdx !== -1) {
      this.selectedEnemyIdx = firstAliveIdx;
      return this.enemies[firstAliveIdx];
    }
    return null;
  }

  // Damage Calculator incorporating Stats, Faith/Bravery & Elemental Multipliers
  calculateDamage(attackerPower, attackElement, defenderElement, isMagic = false, caster = null, target = null) {
    const mult = ELEMENT_MULTIPLIERS[attackElement]?.[defenderElement] || 1.0;
    if (mult > 1.0) {
      this.weaknessHits = (this.weaknessHits || 0) + 1;
    }
    let base = attackerPower;

    if (isMagic && caster && target) {
      // Magic damage affected by Faith (FFT formula)
      const faithMod = ((caster.faith || 60) * (target.faith || 60)) / 4000;
      base = base * (0.8 + faithMod * 0.4);
    } else if (caster) {
      // Physical damage affected by Bravery (FFT formula)
      const braveryMod = (caster.bravery || 70) / 70;
      base = base * braveryMod;
    }

    const variance = 0.9 + Math.random() * 0.22;
    let totalDamage = Math.round(base * variance * mult);

    // Defender Defend Stance
    if (target && target.defending) {
      totalDamage = Math.round(totalDamage * 0.5);
    }
    // Defender Protect Status
    if (target && target.status && target.status.protect > 0 && !isMagic) {
      totalDamage = Math.round(totalDamage * 0.67);
    }

    return { damage: Math.max(1, totalDamage), multiplier: mult };
  }

  // 1. Basic Physical Attack / Strike (Dynamic Dash & Slash Combo)
  executePhysicalAttack() {
    if (this.turn !== 'player') return;
    const target = this.getTarget();
    if (!target || target.hp <= 0) {
      if (this.enemies.every(e => e.hp <= 0)) {
        this.checkTurnOutcome();
      }
      return;
    }

    const actor = this.getActiveActor();
    this.setTurn('busy');
    actor.defending = false;

    const heroWeapon = WEAPONS_DB.find(w => w.name === actor.equippedWeapon);
    const weaponElem = heroWeapon ? (heroWeapon.elem || 'none') : 'none';
    const totalPower = actor.atk;

    const partyBaseX = canvas.width * 0.28;
    const partyBaseY = canvas.height * 0.45;
    const partySlots = [
      { x: partyBaseX + 10, y: partyBaseY + 50 },
      { x: partyBaseX - 30, y: partyBaseY - 30 },
      { x: partyBaseX - 60, y: partyBaseY - 110 },
      { x: partyBaseX - 40, y: partyBaseY + 120 }
    ];
    const actorIdx = Math.max(0, this.party.findIndex(m => m.id === actor.id));
    const startPos = partySlots[actorIdx] || partySlots[0];
    const enemyY = canvas.height * 0.38 + this.selectedEnemyIdx * 60;
    const enemyX = canvas.width * 0.68;

    const comboStep = ((actor.comboStep = (actor.comboStep || 0) % 3) + 1);
    actor.comboStep = comboStep;

    // Launch forward dash and combat slash animation
    actor.attackAnim = {
      startTime: Date.now(),
      dashDuration: 220,
      slashDuration: 300,
      returnDuration: 220,
      totalDuration: 740,
      startX: startPos.x,
      startY: startPos.y,
      targetX: enemyX - 52,
      targetY: enemyY,
      comboStep: comboStep
    };

    // Impact timing: triggers when actor dashes right into enemy
    setTimeout(() => {
      // Play Elemental / Attack SFX
      if (weaponElem === 'fire') sfx.playFire();
      else if (weaponElem === 'water') sfx.playWater();
      else if (weaponElem === 'thunder') sfx.playThunder();
      else if (weaponElem === 'earth') sfx.playEarth();
      else sfx.playSlash();

      if (comboStep === 3) sfx.playHit();

      const { damage, multiplier } = this.calculateDamage(totalPower, weaponElem, target.element, false, actor, target);

      target.hp = Math.max(0, target.hp - damage);
      target.lastHpDelta = -damage;
      setTimeout(() => { target.lastHpDelta = null; updateBattleHUD(); }, 2500);

      if (target.hp <= 0) {
        const nextIdx = this.enemies.findIndex(e => e && e.hp > 0);
        if (nextIdx !== -1) this.selectedEnemyIdx = nextIdx;
      }

      const hitColor = (weaponElem === 'fire') ? '#f87171' : (weaponElem === 'water') ? '#38bdf8' : (weaponElem === 'thunder') ? '#facc15' : '#cbd5e1';

      // Visual combo slash arcs & bursts based on comboStep
      if (comboStep === 1) {
        combatVfx.addSlashArc(enemyX - 25, enemyY, -1.2, 1.2, 54, '#38bdf8', 8);
        combatVfx.addBurst(enemyX, enemyY, hitColor, 20, 5);
        combatVfx.addBurst(enemyX, enemyY, '#ffffff', 8, 3.5);
      } else if (comboStep === 2) {
        combatVfx.addSlashArc(enemyX - 25, enemyY, 1.3, -1.3, 58, '#22c55e', 8);
        combatVfx.addBurst(enemyX, enemyY, '#4ade80', 22, 6);
        combatVfx.addBurst(enemyX, enemyY, '#ffffff', 8, 3.5);
      } else {
        combatVfx.addSlashArc(enemyX - 25, enemyY, -1.6, 1.6, 68, '#fbbf24', 10);
        combatVfx.addShockwave(enemyX, enemyY, 75, 'rgba(251, 191, 36, 0.9)');
        combatVfx.addBurst(enemyX, enemyY, '#fbbf24', 32, 7);
        combatVfx.addBurst(enemyX, enemyY, '#ffffff', 12, 4);
        triggerScreenFlash();
      }

      combatVfx.addAnimatedSprite('hit', enemyX, enemyY, 130, 24);

      if (multiplier >= 2.0) {
        sfx.playWeaknessHit();
        triggerScreenFlash();
        combatVfx.addBurst(enemyX, enemyY, '#fbbf24', 28, 8);
        combatVfx.addText(`-${damage}`, enemyX, enemyY - 10, '#fbbf24', true, '💥 2x WEAKNESS!');
      } else {
        combatVfx.addText(`-${damage}`, enemyX, enemyY - 10, hitColor !== '#cbd5e1' ? hitColor : '#ffffff', true);
      }

      const weaponTitle = actor.equippedWeapon || 'Legendary Buster Sword';
      setCombatLog(`⚔️ ${actor.name} ใช้ [${weaponTitle}${weaponElem !== 'none' ? ` (${weaponElem.toUpperCase()})` : ''}] ฟันคอมโบ ${comboStep} ใส่ ${target.name} ทำดาเมจ -${damage} หน่วย!`);
      updateBattleHUD();
    }, 230);

    // Turn resolution timing: triggers when actor has fully leaped back into position
    setTimeout(() => {
      actor.attackAnim = null;
      if (target.isBoss && target.tailUp) {
        setTimeout(() => this.triggerBossCounterAttack(actor), 400);
        return;
      }
      setTimeout(() => this.checkTurnOutcome(), 350);
    }, 760);
  }

  // 2. Character-Specific Abilities & Magic + Equippable Materia Spells
  executeAbility(skillId) {
    if (this.turn !== 'player') return;
    const actor = this.getActiveActor();
    const skillsList = CHARACTER_SKILLS[actor.id] || [];

    // Combine with spells granted by equipped Materia
    const materiaSkills = [];
    if (actor.equippedMateria) {
      actor.equippedMateria.forEach(mId => {
        if (!mId) return;
        const mat = MATERIA_DB.find(m => m.id === mId);
        if (mat) {
          materiaSkills.push({
            id: mat.spellId,
            name: `${mat.spellName} [Materia]`,
            mp: mat.mp,
            elem: mat.elem,
            type: (mat.elem === 'earth' || mat.spellId === 'flare') ? 'all' : (mat.spellId === 'cura' ? 'heal' : 'single'),
            mult: mat.mult || 2.2,
            healPct: mat.healPct || 0.55,
            desc: mat.desc
          });
        }
      });
    }

    const combinedSkills = [...skillsList, ...materiaSkills];
    const skill = combinedSkills.find(s => s.id === skillId);
    if (!skill) return;

    let target = null;
    if (skill.type !== 'heal') {
      target = this.getTarget();
      if (!target || target.hp <= 0) {
        if (this.enemies.every(e => e.hp <= 0)) {
          this.checkTurnOutcome();
        } else {
          setCombatLog('⚠️ เป้าหมายศัตรูไม่ถูกต้องหรือถูกกำจัดแล้ว!');
        }
        return;
      }
    }

    if (actor.mp < skill.mp) {
      setCombatLog('⚠️ MP ไม่เพียงพอสำหรับการใช้สกิลนี้!');
      sfx.playHit();
      return;
    }

    this.setTurn('busy');
    actor.defending = false;
    actor.mp -= skill.mp;
    actor.lastMpDelta = -skill.mp;
    setTimeout(() => { actor.lastMpDelta = null; updateBattleHUD(); }, 2000);

    // Launch Magic Casting Stance
    actor.castAnim = {
      startTime: Date.now(),
      duration: 850,
      elem: skill.elem || 'fire'
    };

    // A. Heal Ability (e.g. Tifa Chakra)
    if (skill.type === 'heal') {
      sfx.playHeal();
      combatVfx.addAnimatedSprite('magic', canvas.width * 0.28, canvas.height * 0.45, 140, 24);
      this.party.forEach(m => {
        if (m.hp > 0) {
          const healAmt = Math.round(m.maxHp * (skill.healPct || 0.35));
          m.hp = Math.min(m.maxHp, m.hp + healAmt);
          m.lastHpDelta = healAmt;
          if (m.status) {
            delete m.status.poison;
            delete m.status.burn;
          }
        }
      });
      combatVfx.addText('+35% HP RECOVER', canvas.width * 0.28, canvas.height * 0.42, '#34d399', true);
      setCombatLog(`✨ ${actor.name} ใช้สกิล ${skill.name}! รวบรวมลมปราณฟื้นฟู HP 35% ให้ทุกคนและลบล้างพิษ/ไฟไหม้!`);
      updateBattleHUD();
      setTimeout(() => {
        actor.castAnim = null;
        this.advancePartyTurn();
      }, 850);
      return;
    }

    const enemyY = canvas.height * 0.38 + this.selectedEnemyIdx * 60;
    const enemyX = canvas.width * 0.68;

    // Delivery timing: triggers after casting channels power
    setTimeout(() => {
      // Play Elemental / Skill SFX
      if (skill.elem === 'fire') sfx.playFire();
      else if (skill.elem === 'water') sfx.playWater();
      else if (skill.elem === 'thunder') sfx.playThunder();
      else if (skill.elem === 'earth') sfx.playEarth();
      else sfx.playSlash();

      // Hit targets (single or all)
      const targets = (skill.type === 'all') ? this.enemies.filter(e => e.hp > 0) : [target];

      targets.forEach((t, i) => {
        const isMagic = skill.elem !== 'none' || actor.id === 'vivi';
        const power = isMagic ? (actor.magic * (skill.mult || 2.0)) : (actor.atk * (skill.mult || 1.8));
        const { damage, multiplier } = this.calculateDamage(power, skill.elem, t.element, isMagic, actor, t);

        t.hp = Math.max(0, t.hp - damage);
        t.lastHpDelta = -damage;

        // Status infliction
        if (skill.burn && t.element !== 'fire') t.status.burn = skill.burn;
        if (skill.stun && Math.random() < skill.stun) t.status.stun = 1;

        // VFX
        if (skill.elem === 'fire') combatVfx.addAnimatedSprite('fire', enemyX, enemyY + i * 50, 150, 24);
        else if (skill.elem === 'water') combatVfx.addAnimatedSprite('freeze', enemyX, enemyY + i * 50, 150, 26);
        else combatVfx.addAnimatedSprite('magic', enemyX, enemyY + i * 50, 140, 24);

        if (multiplier >= 2.0) {
          sfx.playWeaknessHit();
          triggerScreenFlash();
          combatVfx.addBurst(enemyX, enemyY + i * 50, '#fbbf24', 24, 6);
          combatVfx.addText(`💥 2X WEAKNESS! -${damage}`, enemyX, enemyY - 15 + i * 50, '#fbbf24', true);
        } else {
          combatVfx.addText(`-${damage}`, enemyX, enemyY - 10 + i * 50, '#38bdf8', true);
        }

        // Check Boss Laser Interruption (Water/Ice or Stun on Guard Scorpion)
        if (t.isBoss && t.tailUp && (skill.elem === 'water' || skill.stun)) {
          t.tailUp = false;
          t.isCharging = false;
          const w = document.getElementById('boss-stance-warning');
          if (w) w.style.display = 'none';
          sfx.playWeaknessHit();
          combatVfx.addText('⚡ CHARGE INTERRUPTED!', enemyX, enemyY - 45, '#38bdf8', true);
          setCombatLog(`❄️ ยอดเยี่ยมมาก! ${skill.name} ของ ${actor.name} ขัดขวางการชาร์จ TAIL LASER ของ Guard Scorpion สำเร็จ!`);
        }
      });

      setCombatLog(`✨ ${actor.name} ร่ายเวท [${skill.name}] โจมตีใส่ศัตรูอย่างรุนแรง!`);
      updateBattleHUD();
    }, 360);

    // Complete cast stance & advance turn
    setTimeout(() => {
      actor.castAnim = null;
      if (skill.elem === 'none' && target.isBoss && target.tailUp) {
        setTimeout(() => this.triggerBossCounterAttack(actor), 400);
        return;
      }
      this.checkTurnOutcome();
    }, 850);
  }

  // 4. Limit Break (Supercharged Omnislash / Cross-Slash multi-stage sequence)
  executeLimitBreak() {
    if (this.turn !== 'player') return;
    const actor = this.getActiveActor();
    if (actor.limit < 100) {
      setCombatLog('⚠️ หลอด Limit Break ยังไม่เต็ม (ต้องสะสมให้ครบ 100%)!');
      sfx.playHit();
      return;
    }

    const target = this.getTarget();
    if (!target || target.hp <= 0) {
      if (this.enemies.every(e => e.hp <= 0)) {
        this.checkTurnOutcome();
      }
      return;
    }

    this.setTurn('busy');
    actor.limit = 0;
    actor.defending = false;

    const partyBaseX = canvas.width * 0.28;
    const partyBaseY = canvas.height * 0.45;
    const partySlots = [
      { x: partyBaseX + 10, y: partyBaseY + 50 },
      { x: partyBaseX - 30, y: partyBaseY - 30 },
      { x: partyBaseX - 60, y: partyBaseY - 110 },
      { x: partyBaseX - 40, y: partyBaseY + 120 }
    ];
    const actorIdx = Math.max(0, this.party.findIndex(m => m.id === actor.id));
    const startPos = partySlots[actorIdx] || partySlots[0];
    const enemyY = canvas.height * 0.38 + this.selectedEnemyIdx * 60;
    const enemyX = canvas.width * 0.68;

    actor.limitAnim = {
      startTime: Date.now(),
      duration: 1300,
      startX: startPos.x,
      startY: startPos.y,
      targetX: enemyX - 52,
      targetY: enemyY
    };

    // Staged Limit Break Combo Attacks
    // Stage 1: Power rush strike (at 380ms)
    setTimeout(() => {
      sfx.playSlash();
      combatVfx.addSlashArc(enemyX - 25, enemyY, -1.3, 1.3, 62, '#facc15', 9);
      combatVfx.addBurst(enemyX, enemyY, '#fbbf24', 20, 6);
      combatVfx.addAnimatedSprite('hit', enemyX, enemyY, 110, 24);
    }, 380);

    // Stage 2: Leaping aerial cleave (at 680ms)
    setTimeout(() => {
      sfx.playSlash();
      combatVfx.addSlashArc(enemyX - 25, enemyY, 1.4, -1.4, 68, '#f59e0b', 10);
      combatVfx.addBurst(enemyX, enemyY, '#f97316', 24, 7);
      combatVfx.addAnimatedSprite('hit', enemyX, enemyY, 130, 24);
    }, 680);

    // Stage 3: Supreme Finisher Slam & Damage Application (at 980ms)
    setTimeout(() => {
      sfx.playWeaknessHit();
      triggerScreenFlash();

      const weaponAtk = (actor.id === 'cloud' && window.equippedWeapon) ? window.equippedWeapon.atk : 0;
      const power = ((actor.baseAtk || actor.atk) + weaponAtk) * 4.2;
      const damage = Math.round(power * (0.95 + Math.random() * 0.15));
      target.hp = Math.max(0, target.hp - damage);
      target.lastHpDelta = -damage;
      if (target.hp <= 0) {
        const nextIdx = this.enemies.findIndex(e => e && e.hp > 0);
        if (nextIdx !== -1) this.selectedEnemyIdx = nextIdx;
      }
      actor.lastLimitDelta = -100;
      setTimeout(() => { target.lastHpDelta = null; actor.lastLimitDelta = null; updateBattleHUD(); }, 2500);

      combatVfx.addShockwave(enemyX, enemyY, 85, 'rgba(251, 191, 36, 0.95)');
      combatVfx.addAnimatedSprite('magic', enemyX, enemyY, 200, 24);
      combatVfx.addAnimatedSprite('hit', enemyX, enemyY, 170, 26);
      combatVfx.addBurst(enemyX, enemyY, '#f97316', 35, 10);
      combatVfx.addText(`⚡ LIMIT BREAK! -${damage}`, enemyX, enemyY - 25, '#fbbf24', true);

      setCombatLog(`💥 ${actor.name} ปลดปล่อยขีดจำกัด LIMIT BREAK ฟันทะลวง ${target.name} อย่างรุนแรงสะท้านปฐพี (-${damage})!`);
      updateBattleHUD();
    }, 980);

    // Stage 4: Return to formation & finish turn
    setTimeout(() => {
      actor.limitAnim = null;
      this.checkTurnOutcome();
    }, 1320);
  }

  // 5. Use Item
  useItem(itemType) {
    if (this.turn !== 'player') return;
    const items = window.playerInventory ? window.playerInventory.consumables : this.items;
    if (!items[itemType] || items[itemType] <= 0) {
      setCombatLog('⚠️ ไอเทมชิ้นนี้หมดแล้ว!');
      sfx.playHit();
      return;
    }

    this.setTurn('busy');
    items[itemType]--;
    sfx.playHeal();
    combatVfx.addAnimatedSprite('magic', canvas.width * 0.28, canvas.height * 0.45, 130, 24);

    if (itemType === 'potion') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.hp = Math.min(m.maxHp, m.hp + 250);
          m.lastHpDelta = 250;
        }
      });
      setCombatLog('🧪 ใช้ Potion ฟื้นฟู HP +250 หน่วยให้ทุกคนในทีม!');
    } else if (itemType === 'hi_potion') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.hp = Math.min(m.maxHp, m.hp + 500);
          m.lastHpDelta = 500;
        }
      });
      setCombatLog('🧪 ใช้ Hi-Potion ฟื้นฟู HP +500 หน่วยให้ทุกคนในทีม!');
    } else if (itemType === 'ether') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.mp = Math.min(m.maxMp, m.mp + 80);
          m.lastMpDelta = 80;
        }
      });
      setCombatLog('✨ ใช้ Ether ฟื้นฟู MP +80 หน่วยให้ทุกคนในทีม!');
    } else if (itemType === 'turbo_ether') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.mp = Math.min(m.maxMp, m.mp + 160);
          m.lastMpDelta = 160;
        }
      });
      setCombatLog('✨ ใช้ Turbo Ether ฟื้นฟู MP +160 หน่วยให้ทุกคนในทีม!');
    } else if (itemType === 'elixir') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.hp = m.maxHp;
          m.mp = m.maxMp;
          m.lastHpDelta = 999;
        }
      });
      setCombatLog('🌟 ใช้ Elixir ฟื้นฟู HP & MP เต็ม 100% ให้ทุกคนในทีม!');
    } else if (itemType === 'x_potion') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.hp = Math.min(m.maxHp, m.hp + 1200);
          m.lastHpDelta = 1200;
        }
      });
      setCombatLog('🧪 ใช้ X-Potion ฟื้นฟู HP มหาศาล +1,200 หน่วยให้ทุกคนในทีม!');
    } else if (itemType === 'megalixir') {
      this.party.forEach(m => {
        if (m.hp > 0) {
          m.hp = m.maxHp;
          m.mp = m.maxMp;
          m.status = {};
          m.lastHpDelta = 999;
          m.lastMpDelta = 999;
        }
      });
      setCombatLog('🌟 ใช้ Megalixir ฟื้นฟู HP & MP เต็ม 100% พร้อมล้างทุกสถานะผิดปกติให้ทุกคน!');
    } else if (itemType === 'hero_drink') {
      const actor = this.getActiveActor();
      if (actor) {
        actor.atk = Math.round(actor.atk * 1.4);
        combatVfx.addBurst(playerX, playerY, '#facc15', 20, 5);
        setCombatLog(`⚡ ใช้ Hero Drink เพิ่มพลังโจมตี ATK +40% ให้ ${actor.name}!`);
      }
    } else if (itemType === 'barrier_shield') {
      const actor = this.getActiveActor();
      if (actor) {
        actor.def = Math.round(actor.def * 1.5);
        combatVfx.addBurst(playerX, playerY, '#38bdf8', 20, 5);
        setCombatLog(`🛡️ ใช้ Barrier Shell กางม่านพลังเวทป้องกัน DEF +50% ให้ ${actor.name}!`);
      }
    } else if (itemType === 'remedy') {
      this.party.forEach(m => {
        m.status = {};
      });
      setCombatLog('🌿 ใช้ Remedy ชะล้างทุกสถานะผิดปกติของทุกคนในทีมจนหมดสิ้น!');
    } else if (itemType === 'phoenix_down') {
      let revived = false;
      this.party.forEach(m => {
        if (m.hp <= 0 && !revived) {
          m.hp = Math.round(m.maxHp * 0.5);
          m.lastHpDelta = m.hp;
          revived = true;
          setCombatLog(`💖 ชุบชีวิต ${m.name} ขึ้นมาพร้อมพลัง 50%!`);
        }
      });
      if (!revived) setCombatLog('ไม่มีสมาชิกหมดสติ ฟื้นฟู HP +100 ให้ทุกคน');
    }

    setTimeout(() => {
      this.party.forEach(m => { m.lastHpDelta = null; m.lastMpDelta = null; });
      updateBattleHUD();
    }, 2500);

    updateBattleHUD();
    setTimeout(() => this.advancePartyTurn(), 700);
  }

  // Check if all party members are dead -> trigger Quest Failed
  checkPartyDefeat() {
    const isWiped = this.party.length > 0 && this.party.every(m => m.hp <= 0);
    if (isWiped) {
      this.turn = 'busy';
      setCombatLog('💀 ปาร์ตี้พ่ายแพ้ทั้งหมด! ไม่มีใครเหลือพลังต่อสู้อีกต่อไป...');
      setTimeout(() => {
        showQuestFailed();
      }, 700);
      return true;
    }
    return false;
  }

  // 3. Defend Command
  executeDefend() {
    if (this.turn !== 'player') return;
    const actor = this.getActiveActor();
    this.setTurn('busy');
    actor.defending = true;
    actor.limit = Math.min(actor.maxLimit, actor.limit + 25);
    actor.lastLimitDelta = +25;
    setTimeout(() => { actor.lastLimitDelta = null; updateBattleHUD(); }, 2000);

    sfx.playTone(400, 'triangle', 0.2, 0.1);
    combatVfx.addBurst(canvas.width * 0.28, canvas.height * 0.45, '#fbbf24', 12, 3);
    combatVfx.addText('🛡️ DEFEND & PARRY STANCE!', canvas.width * 0.28, canvas.height * 0.42, '#fef08a', true);

    setCombatLog(`🛡️ ${actor.name} ตั้งการ์ดป้องกัน! บล็อกลดดาเมจ 55% + มีโอกาส Parry สวนกลับ 50% (บอส 20%) ชาร์จ Limit +25%!`);
    updateBattleHUD();
    setTimeout(() => this.advancePartyTurn(), 700);
  }

  // Boss Counter-Attack when player physical attacks while Tail is Up
  triggerBossCounterAttack(attacker) {
    sfx.playHit();
    triggerScreenFlash();
    const boss = this.enemies.find(e => e.isBoss);
    const counterDmg = boss ? Math.round(boss.atk * 1.6 * (0.85 + Math.random() * 0.3)) : 80;
    attacker.hp = Math.max(0, attacker.hp - counterDmg);
    attacker.lastHpDelta = -counterDmg;
    attacker.limit = Math.min(attacker.maxLimit, attacker.limit + 30);

    combatVfx.addBurst(canvas.width * 0.28, canvas.height * 0.45, '#ef4444', 20, 6);
    combatVfx.addText(`💥 COUNTER-ATTACK! -${counterDmg}`, canvas.width * 0.28, canvas.height * 0.40, '#ef4444', true);

    setCombatLog(`⚠️ TAIL COUNTER-ATTACK! Guard Scorpion ตวัดหางฟาดใส่ ${attacker.name} อย่างรุนแรง (-${counterDmg} HP) เนื่องจากโจมตีกายภาพขณะหางยกอยู่!`);
    updateBattleHUD();

    if (this.checkPartyDefeat()) return;
    setTimeout(() => this.checkTurnOutcome(), 900);
  }

  // Advance turn to next alive party member or enemy turn
  advancePartyTurn() {
    if (this.checkPartyDefeat()) return;

    // Find next living member after this.activeActorIndex
    let nextIdx = -1;
    for (let i = this.activeActorIndex + 1; i < this.party.length; i++) {
      if (this.party[i] && this.party[i].hp > 0) {
        nextIdx = i;
        break;
      }
    }

    if (nextIdx !== -1) {
      this.activeActorIndex = nextIdx;
      this.turn = 'player';
      const actor = this.getActiveActor();
      document.getElementById('turn-banner-text').textContent = `PLAYER TURN: คำสั่งของ ${actor.name}`;
      const nameEl = document.getElementById('active-actor-name');
      if (nameEl) nameEl.textContent = actor.name;
      this.updateTimeline();
      updateBattleHUD();
    } else {
      // Finished all living party member actions, switch to Enemy turn!
      this.activeActorIndex = this.party.findIndex(m => m.hp > 0);
      if (this.activeActorIndex === -1) this.activeActorIndex = 0;
      this.turn = 'enemy';
      document.getElementById('turn-banner-text').textContent = 'ENEMY TURN: ศัตรูกำลังเคลื่อนไหว...';
      this.updateTimeline();
      setTimeout(() => this.enemyTurn(), 800);
    }
  }

  checkTurnOutcome() {
    // Check Victory
    const allEnemiesDead = this.enemies.every(e => e.hp <= 0);
    if (allEnemiesDead) {
      this.turn = 'busy';
      sfx.playVictoryFanfare();
      triggerScreenFlash();
      showVictoryModal(true, this.enemies.some(e => e.isBoss));
      return;
    }

    // Auto-switch target
    if (this.enemies[this.selectedEnemyIdx]?.hp <= 0) {
      const nextIdx = this.enemies.findIndex(e => e.hp > 0);
      if (nextIdx !== -1) this.selectedEnemyIdx = nextIdx;
    }

    // Apply Burn status
    this.enemies.forEach((e, i) => {
      if (e.hp > 0 && e.status && e.status.burn > 0) {
        const bdmg = 25;
        e.hp = Math.max(0, e.hp - bdmg);
        e.status.burn--;
        combatVfx.addText(`🔥 -${bdmg}`, canvas.width * 0.68, canvas.height * 0.38 + i * 60, '#f97316');
        setCombatLog(`🔥 ${e.name} ถูกไฟแผดเผา -${bdmg} HP! (เหลืออีก ${e.status.burn} เทิร์น)`);
      }
    });

    this.advancePartyTurn();
  }

  // Enemy Turn Execution with Parry & Counter Mechanics
  enemyTurn() {
    this.turn = 'enemy';
    if (this.checkPartyDefeat()) return;

    const livingEnemies = this.enemies.filter(e => e.hp > 0);
    if (livingEnemies.length === 0) {
      this.checkTurnOutcome();
      return;
    }

    // Process enemies sequentially
    let eIdx = 0;
    const processNextEnemy = () => {
      if (this.checkPartyDefeat()) return;

      if (eIdx >= livingEnemies.length) {
        // Party turn resumes
        if (this.checkPartyDefeat()) return;

        this.turn = 'player';
        // Reset defending status for all heroes in the new round
        this.party.forEach(m => m.defending = false);
        this.activeActorIndex = this.party.findIndex(m => m.hp > 0);
        if (this.activeActorIndex === -1) this.activeActorIndex = 0;
        const nextLive = this.enemies.findIndex(e => e && e.hp > 0);
        if (nextLive !== -1) this.selectedEnemyIdx = nextLive;
        const actor = this.getActiveActor();
        document.getElementById('turn-banner-text').textContent = `PLAYER TURN: คำสั่งของ ${actor.name}`;
        const nameEl = document.getElementById('active-actor-name');
        if (nameEl) nameEl.textContent = actor.name;
        this.updateTimeline();
        updateBattleHUD();
        return;
      }

      const enemy = livingEnemies[eIdx];
      eIdx++;
      if (!enemy || enemy.hp <= 0) {
        setTimeout(processNextEnemy, 200);
        return;
      }

      // Advanced Boss AI (type-specific)
      if (enemy.isBoss) {
        const bossCard = document.getElementById('boss-health-card');
        const bossWarning = document.getElementById('boss-stance-warning');
        enemy.turnCount = (enemy.turnCount || 0) + 1;

        // ══════════════════════════════════════════
        // GUARD SCORPION — Tail Laser Mechanic
        // ══════════════════════════════════════════
        if (!enemy.bossType || enemy.bossType === 'scorpion') {
          enemy.turnsSinceTail = (enemy.turnsSinceTail || 0) + 1;

          if (enemy.tailUp) {
            enemy.tailUp = false;
            enemy.isCharging = false;
            if (bossWarning) bossWarning.style.display = 'none';

            sfx.playThunder();
            triggerScreenFlash();
            combatVfx.addAnimatedSprite('magic', canvas.width * 0.3, canvas.height * 0.45, 220, 24);

            this.party.forEach(m => {
              if (m.hp > 0) {
                const baseDmg = m.defending ? 50 : 110;
                const dmg = Math.round(baseDmg * (0.85 + Math.random() * 0.3));
                m.hp = Math.max(0, m.hp - dmg);
                m.lastHpDelta = -dmg;
                m.limit = Math.min(m.maxLimit, m.limit + 35);
              }
            });

            setCombatLog('⚡ TAIL LASER FIRED! Guard Scorpion ปลดปล่อยลำแสงเลเซอร์ทำลายล้างใส่ทุกคนในทีม!');
            updateBattleHUD();
            if (this.checkPartyDefeat()) return;
            setTimeout(processNextEnemy, 1100);
            return;
          }

          if (enemy.turnsSinceTail >= 2 && enemy.hp <= 1500) {
            enemy.tailUp = true;
            enemy.isCharging = true;
            enemy.turnsSinceTail = 0;
            if (bossWarning) bossWarning.style.display = 'block';
            sfx.playBossAlarm();
            combatVfx.addBurst(canvas.width * 0.68, canvas.height * 0.40, '#facc15', 25, 6);
            combatVfx.addText('⚠️ TAIL UP! CHARGING!', canvas.width * 0.68, canvas.height * 0.32, '#facc15', true);
            setCombatLog('⚠️ Guard Scorpion ชูหางชาร์จ TAIL LASER! ห้ามโจมตีกายภาพ! (ใช้เวทน้ำหรือตั้งการ์ดป้องกัน)');
            updateBattleHUD();
            setTimeout(processNextEnemy, 1000);
            return;
          }
        }

        // ══════════════════════════════════════════
        // IRON SENTINEL GOLEM — Stone Guard + Iron Rage
        // ══════════════════════════════════════════
        else if (enemy.bossType === 'golem') {
          const hpPct = enemy.hp / enemy.maxHp;

          // Phase 2: HP < 50% → Iron Rage (AOE attack every other turn)
          if (hpPct < 0.50 && enemy.phase === 1) {
            enemy.phase = 2;
            sfx.playBossAlarm();
            combatVfx.addBurst(canvas.width * 0.68, canvas.height * 0.40, '#ef4444', 28, 6);
            combatVfx.addText('💢 IRON RAGE!', canvas.width * 0.68, canvas.height * 0.30, '#ef4444', true);
            setCombatLog('💢 PHASE 2: Iron Sentinel Golem เข้าสู่ Iron Rage! โจมตีด้วยกำปั้นเหล็กถล่มทั้งปาร์ตี้!');
            updateBattleHUD();
          }

          // Stone Guard: every 3 turns, raise DEF for 1 turn
          if (enemy.turnCount % 3 === 0 && enemy.phase === 1) {
            enemy.stoneGuardActive = true;
            const origDef = enemy.def;
            enemy.def = enemy.def * 2;
            combatVfx.addText('🗿 STONE GUARD!', canvas.width * 0.68, canvas.height * 0.28, '#94a3b8', true);
            setCombatLog('🗿 Iron Sentinel Golem เปิดใช้ Stone Guard! DEF เพิ่มขึ้น 2 เท่าในรอบนี้!');
            setTimeout(() => { enemy.def = origDef; enemy.stoneGuardActive = false; }, 1800);
            updateBattleHUD();
            setTimeout(processNextEnemy, 900);
            return;
          }

          // Phase 2: Iron Rage — AOE attack
          if (enemy.phase === 2) {
            sfx.playEarth();
            triggerScreenFlash();
            combatVfx.addAnimatedSprite('magic', canvas.width * 0.3, canvas.height * 0.45, 200, 24);
            this.party.forEach(m => {
              if (m.hp > 0) {
                const baseDmg = m.defending ? Math.round(enemy.atk * 0.7) : Math.round(enemy.atk * 1.5);
                const dmg = Math.round(baseDmg * (0.85 + Math.random() * 0.3));
                m.hp = Math.max(0, m.hp - dmg);
                m.lastHpDelta = -dmg;
                m.limit = Math.min(m.maxLimit, m.limit + 30);
              }
            });
            setCombatLog('💢 IRON RAGE! Iron Sentinel Golem ปลดปล่อยกำปั้นเหล็กถล่มทุกคน! ⚡ ใช้ Thunder ทำ 2x!');
            updateBattleHUD();
            if (this.checkPartyDefeat()) return;
            setTimeout(processNextEnemy, 1000);
            return;
          }
        }

        // ══════════════════════════════════════════
        // ANCIENT RED DRAGON — Roar + Dragon Breath
        // ══════════════════════════════════════════
        else if (enemy.bossType === 'dragon') {
          const hpPct = enemy.hp / enemy.maxHp;

          // Phase 2: HP < 40% → Dragon Breath becomes available
          if (hpPct < 0.40 && enemy.phase === 1) {
            enemy.phase = 2;
            sfx.playBossAlarm();
            combatVfx.addAnimatedSprite('fire', canvas.width * 0.68, canvas.height * 0.40, 180, 24);
            combatVfx.addText('🔥 DRAGON BREATH!', canvas.width * 0.68, canvas.height * 0.28, '#f97316', true);
            setCombatLog('🔥 PHASE 2: Ancient Red Dragon สูดลมหายใจเปลวเพลิง Dragon Breath! ตั้งการ์ด Defend หรือใช้เวทน้ำ!');
            updateBattleHUD();
          }

          // Roar: every 3 turns in Phase 1 — SPD debuff
          if (enemy.turnCount % 3 === 0 && enemy.phase === 1) {
            sfx.playFire();
            combatVfx.addBurst(canvas.width * 0.68, canvas.height * 0.40, '#f97316', 20, 5);
            combatVfx.addText('🦎 DRAGON ROAR!', canvas.width * 0.68, canvas.height * 0.28, '#f97316', true);
            // Briefly reduce party SPD
            this.party.forEach(m => { if (m.hp > 0) m.spd = Math.max(10, m.spd - 8); });
            setCombatLog('🦎 DRAGON ROAR! Dragon คำรามสะท้านสนามรบ ลดความเร็วทีม (SPD -8) 1 รอบ!');
            setTimeout(() => this.party.forEach(m => m.spd = (m.baseSpd || m.spd + 8)), 2500);
            updateBattleHUD();
            setTimeout(processNextEnemy, 900);
            return;
          }

          // Phase 2: Dragon Breath AOE every 2 turns
          if (enemy.phase === 2 && enemy.turnCount % 2 === 0) {
            sfx.playFire();
            triggerScreenFlash();
            combatVfx.addAnimatedSprite('fire', canvas.width * 0.3, canvas.height * 0.45, 220, 24);
            this.party.forEach(m => {
              if (m.hp > 0) {
                const baseDmg = m.defending ? 40 : 75;
                const dmg = Math.round(baseDmg * (0.85 + Math.random() * 0.3));
                m.hp = Math.max(0, m.hp - dmg);
                m.lastHpDelta = -dmg;
                m.status = m.status || {};
                if (!m.status.burn) m.status.burn = 2; // Burn status
                m.limit = Math.min(m.maxLimit, m.limit + 30);
              }
            });
            setCombatLog('🔥 DRAGON BREATH! Ancient Red Dragon เผาผลาญทั้งปาร์ตี้ด้วยลมหายใจเปลวเพลิง ทำให้ติดสถานะ Burn! 💧 ใช้ Blizzard ทำ 2x!');
            updateBattleHUD();
            if (this.checkPartyDefeat()) return;
            setTimeout(processNextEnemy, 1100);
            return;
          }
        }

        // ══════════════════════════════════════════
        // BAHAMUT ZERO — Teraflare Charging
        // ══════════════════════════════════════════
        else if (enemy.bossType === 'bahamut') {
          const hpPct = enemy.hp / enemy.maxHp;

          // Phase transitions
          if (hpPct < 0.60 && enemy.phase === 1) {
            enemy.phase = 2;
            sfx.playBossAlarm();
            combatVfx.addText('💀 SHADOW FLARE PHASE!', canvas.width * 0.68, canvas.height * 0.28, '#a78bfa', true);
            setCombatLog('💀 PHASE 2: Bahamut Zero เข้าสู่ Shadow Flare! โจมตีสุ่มเป้าหมายรุนแรงและชาร์จ Teraflare เร็วขึ้น!');
          }
          if (hpPct < 0.25 && enemy.phase === 2) {
            enemy.phase = 3;
            sfx.playBossAlarm();
            combatVfx.addText('⚡ TERAFLARE EVERY 2 TURNS!', canvas.width * 0.68, canvas.height * 0.28, '#ef4444', true);
            setCombatLog('⚡ PHASE 3: Bahamut Zero FINAL PHASE! Teraflare จะระเบิดทุก 2 รอบ! ไม่มีเวลาพัก!');
          }

          // Teraflare charging mechanic
          const teraInterval = enemy.phase >= 3 ? 2 : 4;
          enemy.teraflareCharge = (enemy.teraflareCharge || 0) + 1;

          if (enemy.teraflareCharge >= teraInterval) {
            // TERAFLARE FIRES!
            enemy.teraflareCharge = 0;
            sfx.playThunder();
            triggerScreenFlash();
            combatVfx.addAnimatedSprite('magic', canvas.width * 0.3, canvas.height * 0.45, 260, 24);
            combatVfx.addBurst(canvas.width * 0.3, canvas.height * 0.45, '#a78bfa', 40, 8);

            this.party.forEach(m => {
              if (m.hp > 0) {
                const teraDmg = m.defending
                  ? Math.round(m.maxHp * 0.40)  // Defend reduces to 40%
                  : Math.round(m.maxHp * 0.80); // Full Teraflare = 80% max HP!
                m.hp = Math.max(1, m.hp - teraDmg); // Survive with 1 HP minimum (not insta-kill)
                m.lastHpDelta = -teraDmg;
                m.limit = Math.min(m.maxLimit, m.limit + 50);
                combatVfx.addText(`⚡ TERA -${teraDmg}`, canvas.width * 0.3, canvas.height * 0.42, '#a78bfa', true);
              }
            });

            setCombatLog('⚡ TERAFLARE!!! Bahamut Zero ปล่อยพลังทำลายล้างระดับจักรวาล! โจมตีทุกคน 80% ของ MaxHP! (Defend ลดเหลือ 40%)');
            updateBattleHUD();
            if (this.checkPartyDefeat()) return;
            setTimeout(processNextEnemy, 1400);
            return;
          } else {
            // Countdown warning for Teraflare
            const turnsLeft = teraInterval - enemy.teraflareCharge;
            if (turnsLeft <= 2) {
              combatVfx.addText(`⚡ TERAFLARE in ${turnsLeft}!`, canvas.width * 0.68, canvas.height * 0.28, '#a78bfa', true);
              if (bossWarning) {
                bossWarning.style.display = 'block';
                bossWarning.textContent = `⚡ TERAFLARE CHARGING! (${turnsLeft} turns)`;
              }
              sfx.playBossAlarm();
            }

            // Phase 2+: Shadow Flare on single random target
            if (enemy.phase >= 2) {
              const livingParty2 = this.party.filter(m => m.hp > 0);
              if (livingParty2.length > 0) {
                const t = livingParty2[Math.floor(Math.random() * livingParty2.length)];
                sfx.playThunder();
                combatVfx.addBurst(canvas.width * 0.3, canvas.height * 0.46, '#a78bfa', 20, 5);
                const shadowDmg = Math.round(enemy.atk * 1.3 * (0.85 + Math.random() * 0.3));
                t.hp = Math.max(0, t.hp - shadowDmg);
                t.lastHpDelta = -shadowDmg;
                t.limit = Math.min(t.maxLimit, t.limit + 35);
                combatVfx.addText(`💀 -${shadowDmg}`, canvas.width * 0.3, canvas.height * 0.44, '#a78bfa');
                setCombatLog(`💀 SHADOW FLARE! Bahamut Zero ปล่อยเปลวเพลิงมืดใส่ ${t.name} (-${shadowDmg} HP)!`);
                updateBattleHUD();
                if (this.checkPartyDefeat()) return;
                setTimeout(processNextEnemy, 950);
                return;
              }
            }
          }
        }
      }

      // Standard Enemy Attack
      const livingParty = this.party.filter(m => m.hp > 0);
      if (livingParty.length === 0) {
        this.checkPartyDefeat();
        return;
      }
      const targetMember = livingParty[Math.floor(Math.random() * livingParty.length)];

      // Check Parry & Block if hero is defending
      if (targetMember.defending) {
        const parryChance = enemy.isBoss ? 0.20 : 0.50; // บอส 20%, มอนสเตอร์ทั่วไป 50%
        const isParry = Math.random() < parryChance;

        if (isParry) {
          // === PARRY SUCCESS! ===
          // 0 damage, sound effect, spark burst, counter-attack!
          targetMember.lastHpDelta = null;
          targetMember.limit = Math.min(targetMember.maxLimit, targetMember.limit + 20);

          sfx.playWeaknessHit();
          triggerScreenFlash();
          combatVfx.addBurst(canvas.width * 0.3, canvas.height * 0.46, '#facc15', 30, 7);
          combatVfx.addText('⚔️ PARRY & COUNTER!', canvas.width * 0.3, canvas.height * 0.40, '#facc15', true);

          // Counter-attack: Hero immediately strikes back!
          const weaponAtk = (targetMember.id === 'cloud' && window.equippedWeapon) ? (window.equippedWeapon.atk || 0) : 0;
          const heroAtk = (targetMember.baseAtk || targetMember.atk || 20) + weaponAtk;
          const counterPower = heroAtk * 1.35;
          const counterDmg = Math.max(8, Math.round(counterPower * (0.9 + Math.random() * 0.25) - (enemy.def || 0) / 4));

          enemy.hp = Math.max(0, enemy.hp - counterDmg);
          enemy.lastHpDelta = -counterDmg;

          const enemyY = canvas.height * 0.38 + (livingEnemies.indexOf(enemy) >= 0 ? livingEnemies.indexOf(enemy) : 0) * 60;
          combatVfx.addBurst(canvas.width * 0.68, enemyY, '#38bdf8', 18, 5);
          combatVfx.addText(`-${counterDmg}`, canvas.width * 0.68, enemyY - 20, '#38bdf8');

          setCombatLog(`⚔️⚡ PARRY! ${targetMember.name} ตั้งการ์ดปัดป้องการโจมตีของ ${enemy.name} อย่างสมบูรณ์แบบ! แล้วฟันดาบสวนกลับทำดาเมจ -${counterDmg} HP!`);
          updateBattleHUD();

          if (enemy.hp <= 0) {
            setCombatLog(`💥 ${enemy.name} พ่ายแพ้ต่อการสวนกลับ (Parry Counter) ของ ${targetMember.name}!`);
            const nextLive = this.enemies.findIndex(e => e && e.hp > 0);
            if (nextLive !== -1) this.selectedEnemyIdx = nextLive;
            const allEnemiesDefeated = this.enemies.every(e => e.hp <= 0);
            if (allEnemiesDefeated) {
              setTimeout(() => this.checkTurnOutcome(), 800);
              return;
            }
          }

          setTimeout(processNextEnemy, 1000);
          return;
        } else {
          // === NORMAL BLOCK (Defended without Parry) ===
          sfx.playHit();
          let rawDmg = Math.max(2, Math.round(enemy.atk * (0.85 + Math.random() * 0.3) - (targetMember.def || 0) / 3));
          let dmg = Math.max(1, Math.round(rawDmg * 0.45)); // ลดดาเมจลง 55%

          targetMember.hp = Math.max(0, targetMember.hp - dmg);
          targetMember.lastHpDelta = -dmg;
          targetMember.limit = Math.min(targetMember.maxLimit, targetMember.limit + 25);
          targetMember.lastLimitDelta = +25;

          combatVfx.addBurst(canvas.width * 0.3, canvas.height * 0.46, '#60a5fa', 12);
          combatVfx.addText(`🛡️ BLOCKED -${dmg}`, canvas.width * 0.3, canvas.height * 0.44, '#93c5fd');

          setCombatLog(`🛡️ ${targetMember.name} ยกการ์ดป้องกัน! บล็อกดาเมจลดลงเหลือ -${dmg} HP! (Limit +25%)`);
          updateBattleHUD();

          if (this.checkPartyDefeat()) return;
          setTimeout(processNextEnemy, 900);
          return;
        }
      }

      // Standard Un-defended Attack
      sfx.playHit();
      let dmg = Math.max(2, Math.round(enemy.atk * (0.85 + Math.random() * 0.3) - (targetMember.def || 0) / 3));
      targetMember.hp = Math.max(0, targetMember.hp - dmg);
      targetMember.lastHpDelta = -dmg;
      targetMember.limit = Math.min(targetMember.maxLimit, targetMember.limit + 25);
      targetMember.lastLimitDelta = +25;

      combatVfx.addBurst(canvas.width * 0.3, canvas.height * 0.46, '#ef4444', 10);
      combatVfx.addText(`-${dmg}`, canvas.width * 0.3, canvas.height * 0.44, '#ef4444');

      setCombatLog(`👹 ${enemy.name} โจมตีใส่ ${targetMember.name} ทำดาเมจ -${dmg} HP! (Limit +25%)`);
      updateBattleHUD();

      if (this.checkPartyDefeat()) return;
      setTimeout(processNextEnemy, 900);
    };

    setTimeout(processNextEnemy, 600);
  }

  drawArena(ctx) {
    const time = Date.now();

    // Atmospheric Dark Dungeon Stone Arena Floor (Neutral charcoal & slate, no blue tint)
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 30,
      canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.72
    );
    grad.addColorStop(0, '#1c1917');
    grad.addColorStop(0.35, '#141416');
    grad.addColorStop(0.75, '#0c0c0e');
    grad.addColorStop(1, '#050506');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Dungeon Flagstone Joints (Warm dark stone seams, NOT bright cyan grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.032)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Central Arcane Battle Ring (etched glowing ritual circle)
    torchBrazierRenderer.drawArcaneCircle(ctx, canvas.width * 0.5, canvas.height * 0.48, time, Math.min(canvas.width, canvas.height) * 0.28, 'rgba(239, 68, 68,');

    // 4 Corner Ornate Stone Pillar Braziers
    const arenaTorches = [
      { x: canvas.width * 0.08, y: canvas.height * 0.22 },
      { x: canvas.width * 0.92, y: canvas.height * 0.22 },
      { x: canvas.width * 0.08, y: canvas.height * 0.80 },
      { x: canvas.width * 0.92, y: canvas.height * 0.80 }
    ];
    arenaTorches.forEach((at, idx) => {
      torchBrazierRenderer.draw(ctx, at.x, at.y, time, `arena_t_${idx}`);
    });

    // Draw Party (Left side - up to 4 members dynamically)
    const partyBaseX = canvas.width * 0.28;
    const partyBaseY = canvas.height * 0.45;

    const partySlots = [
      { x: partyBaseX + 10, y: partyBaseY + 50, ringY: partyBaseY + 70 },
      { x: partyBaseX - 30, y: partyBaseY - 30, ringY: partyBaseY - 10 },
      { x: partyBaseX - 60, y: partyBaseY - 110, ringY: partyBaseY - 90 },
      { x: partyBaseX - 40, y: partyBaseY + 120, ringY: partyBaseY + 140 }
    ];

    let ringX = partySlots[0].x, ringY = partySlots[0].ringY;
    const curActor = this.getActiveActor();

    this.party.forEach((member, i) => {
      const pos = partySlots[i] || partySlots[0];
      let drawX = pos.x;
      let drawY = pos.y;
      let state = 'idle';
      let comboStep = 1;
      let progress = 0;
      let dir = 'battle';
      let extraData = null;

      if (member.limitAnim) {
        const anim = member.limitAnim;
        const elapsed = Date.now() - anim.startTime;
        progress = Math.min(1, elapsed / anim.duration);
        state = 'limit';
        if (elapsed < 350) {
          const t = elapsed / 350;
          const ease = t * t * (3 - 2 * t);
          drawX = anim.startX + (anim.targetX - anim.startX) * ease;
          drawY = anim.startY + (anim.targetY - anim.startY) * ease;
          dir = 'right';
        } else if (elapsed < 1050) {
          drawX = anim.targetX;
          drawY = anim.targetY;
          dir = 'right';
        } else {
          const t = Math.min(1, (elapsed - 1050) / 270);
          const ease = t * t;
          drawX = anim.targetX + (anim.startX - anim.targetX) * ease;
          drawY = anim.targetY + (anim.startY - anim.targetY) * ease - Math.sin(t * Math.PI) * 26;
          dir = 'left';
        }
      } else if (member.castAnim) {
        const anim = member.castAnim;
        const elapsed = Date.now() - anim.startTime;
        progress = Math.min(1, elapsed / anim.duration);
        state = 'cast';
        extraData = { elem: anim.elem };
        drawX = pos.x + 8;
        dir = 'battle';
      } else if (member.attackAnim) {
        const anim = member.attackAnim;
        const elapsed = Date.now() - anim.startTime;
        comboStep = anim.comboStep || 1;
        if (elapsed < anim.dashDuration) {
          const t = elapsed / anim.dashDuration;
          const ease = t * t * (3 - 2 * t);
          drawX = anim.startX + (anim.targetX - anim.startX) * ease;
          drawY = anim.startY + (anim.targetY - anim.startY) * ease;
          state = 'run';
          dir = 'right';
        } else if (elapsed < anim.dashDuration + anim.slashDuration) {
          drawX = anim.targetX;
          drawY = anim.targetY;
          state = 'attack';
          progress = (elapsed - anim.dashDuration) / anim.slashDuration;
          dir = 'right';
        } else if (elapsed < anim.totalDuration) {
          const t = (elapsed - anim.dashDuration - anim.slashDuration) / anim.returnDuration;
          const ease = t * t;
          drawX = anim.targetX + (anim.startX - anim.targetX) * ease;
          drawY = anim.targetY + (anim.startY - anim.targetY) * ease - Math.sin(t * Math.PI) * 22;
          state = 'run';
          dir = 'left';
        } else {
          member.attackAnim = null;
        }
      } else if (member.defending) {
        state = 'defend';
        dir = 'battle';
      }

      if (curActor && curActor.id === member.id && !member.attackAnim && !member.limitAnim) {
        ringX = pos.x;
        ringY = pos.ringY;
      }
      if (member.id === 'cloud') {
        this.cloudRenderer.draw(ctx, drawX, drawY, dir, Date.now() / 150, state, 1.4, comboStep, progress, extraData);
      } else if (member.id === 'tifa') {
        this.tifaRenderer.draw(ctx, drawX, drawY, dir, Date.now() / 150, state, 1.35);
      } else if (member.id === 'vivi') {
        this.mageRenderer.draw(ctx, drawX, drawY, 1.3);
      } else if (member.id === 'cecil') {
        this.paladinRenderer.draw(ctx, drawX, drawY, 1.35);
      } else if (member.id === 'aeris') {
        this.aerisRenderer.draw(ctx, drawX, drawY, 1.35);
      } else if (member.id === 'chrono') {
        this.chronoRenderer.draw(ctx, drawX, drawY, 1.35);
      } else {
        this.cloudRenderer.draw(ctx, drawX, drawY, dir, Date.now() / 150, state, 1.4, comboStep, progress, extraData);
      }
    });

    if (this.turn === 'player') {
      const time = Date.now();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(ringX, ringY, 26 + Math.sin(time / 150) * 3, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw Enemies (Right side)
    const enemyBaseX = canvas.width * 0.68;
    const enemyBaseY = canvas.height * 0.40;
    this.enemies.forEach((enemy, idx) => {
      if (enemy.hp > 0) {
        const ey = enemyBaseY + (idx - 0.5) * 80;
        this.enemyRenderer.draw(ctx, enemyBaseX + idx * 40, ey, enemy);

        // Highlight ring around selected enemy
        if (idx === this.selectedEnemyIdx) {
          const time = Date.now();
          ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.ellipse(enemyBaseX + idx * 40, ey + 24, 28 + Math.sin(time/150)*4, 12 + Math.sin(time/150)*2, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          const pY = ey - 40 + Math.sin(time/100)*5;
          ctx.moveTo(enemyBaseX + idx * 40 - 10, pY - 15);
          ctx.lineTo(enemyBaseX + idx * 40 + 10, pY - 15);
          ctx.lineTo(enemyBaseX + idx * 40, pY);
          ctx.fill();
        }
      }
    });

    // Atmospheric Edge Vignette for Dark Fantasy Arena
    ctx.save();
    const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.38, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.72);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(2, 4, 10, 0.65)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

// ================= 7. Orchestration & Maps =================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const combatVfx = new CombatParticleSystem();

// Multiple World Maps
const villageWorld = new FieldWorld();
const forestWorld = new ForestWorld();
const dungeonWorld = new DungeonWorld();
const cityWorld = villageWorld; // compatibility alias
const world = villageWorld;     // compatibility alias

let currentMapId = 'village';

function getCurrentWorld() {
  if (currentMapId === 'village') return villageWorld;
  if (currentMapId === 'forest') return forestWorld;
  if (currentMapId === 'dungeon') return dungeonWorld;
  return villageWorld;
}

function switchMap(mapId, targetX = null, targetY = null) {
  currentMapId = mapId;
  if (targetX !== null) playerX = targetX;
  if (targetY !== null) {
    playerY = (mapId === 'village' && targetY < 430) ? 470 : targetY;
  } else if (mapId === 'village' && playerY < 430) {
    playerY = 470;
  }

  const locEl = document.getElementById('tele-location');
  if (locEl) {
    if (mapId === 'village') locEl.textContent = '🏡 Midgar Edge Village';
    else if (mapId === 'forest') locEl.textContent = '🌲 Whisper Forest';
    else if (mapId === 'dungeon') locEl.textContent = '🏛️ Forgotten Ruins (Dungeon)';
  }

  sfx.playTone(523.25, 'triangle', 0.15, 0.1);
  triggerScreenFlash();
}

const cloudFieldRenderer = new CloudSpriteRenderer();

let currentMode = 'exploration'; // 'exploration' or 'battle'
let playerX = 350, playerY = 470;
let playerVx = 0, playerVy = 0;
let playerDir = 'down';
let playerState = 'idle';
let animFrame = 0;

const keys = { up: false, down: false, left: false, right: false, shift: false, space: false, slash: false };

const playerAttackState = {
  isAttacking: false,
  comboStep: 1,
  startTime: 0,
  duration: 320,
  lastComboTime: 0,
  progress: 0
};
window.playerAttackState = playerAttackState;

function triggerPlayerSlash() {
  if (currentMode !== 'exploration') return;

  const now = Date.now();
  // Combo chain window: within 850ms of previous attack advance combo 1 -> 2 -> 3 -> 1
  if (now - playerAttackState.lastComboTime < 850) {
    playerAttackState.comboStep = (playerAttackState.comboStep % 3) + 1;
  } else {
    playerAttackState.comboStep = 1;
  }

  playerAttackState.isAttacking = true;
  playerAttackState.startTime = now;
  playerAttackState.lastComboTime = now;
  playerAttackState.duration = (playerAttackState.comboStep === 3) ? 440 : 320;
  playerAttackState.progress = 0;
  playerState = 'attack';

  // Highlight HUD button briefly
  const slashBtn = document.getElementById('btn-hud-slash');
  if (slashBtn) {
    slashBtn.classList.add('pressed');
    setTimeout(() => slashBtn.classList.remove('pressed'), 200);
  }

  // SFX
  sfx.playSlash();
  if (playerAttackState.comboStep === 3) {
    sfx.playHit();
  }

  // Direction offsets
  const dirOffsets = {
    'down': { dx: 0, dy: 38, angle: Math.PI * 0.5 },
    'up': { dx: 0, dy: -38, angle: -Math.PI * 0.5 },
    'left': { dx: -38, dy: 0, angle: Math.PI },
    'right': { dx: 38, dy: 0, angle: 0 }
  };
  const off = dirOffsets[playerDir] || { dx: 0, dy: 38, angle: Math.PI * 0.5 };
  const slashX = playerX + off.dx;
  const slashY = playerY + off.dy;

  // Lunge forward slightly with momentum
  const curWorld = getCurrentWorld();
  const lungeDist = playerAttackState.comboStep === 3 ? 14 : 9;
  playerX = Math.max(35, Math.min(curWorld.width - 35, playerX + Math.cos(off.angle) * lungeDist));
  const minY = (currentMapId === 'village') ? 430 : 40;
  playerY = Math.max(minY, Math.min(curWorld.height - 40, playerY + Math.sin(off.angle) * lungeDist));

  // Visual Effects based on Combo Step
  const step = playerAttackState.comboStep;
  if (step === 1) {
    // Cross Cleave: Radiant Cyan Slash Arc + Sparks
    combatVfx.addSlashArc(slashX, slashY, off.angle - 1.2, off.angle + 1.2, 48, '#38bdf8', 7);
    combatVfx.addBurst(slashX, slashY, '#38bdf8', 14, 3.5);
    combatVfx.addBurst(slashX, slashY, '#ffffff', 6, 2.5);
    combatVfx.addAnimatedSprite('hit', slashX, slashY, 95, 26);
    combatVfx.addText('⚔️ [COMBO 1] CROSS CLEAVE!', slashX, slashY - 22, '#38bdf8', true);
  } else if (step === 2) {
    // Ascending Edge: Emerald Green Upward Slash + Mako Bursts
    combatVfx.addSlashArc(slashX, slashY, off.angle + 1.3, off.angle - 1.3, 52, '#22c55e', 8);
    combatVfx.addBurst(slashX, slashY, '#22c55e', 16, 4);
    combatVfx.addBurst(slashX, slashY, '#86efac', 8, 3);
    combatVfx.addAnimatedSprite('hit', slashX, slashY, 105, 24);
    combatVfx.addText('⚡ [COMBO 2] ASCENDING EDGE!', slashX, slashY - 24, '#4ade80', true);
  } else {
    // Braver Slam: Heavy Ground Smash + Golden Shockwave + Impact Crater Sparks
    combatVfx.addSlashArc(slashX, slashY, off.angle - 1.6, off.angle + 1.6, 62, '#facc15', 9);
    combatVfx.addShockwave(slashX, slashY, 70, 'rgba(251, 191, 36, 0.9)');
    combatVfx.addBurst(slashX, slashY, '#fbbf24', 24, 5.5);
    combatVfx.addBurst(slashX, slashY, '#ffffff', 10, 4);
    combatVfx.addAnimatedSprite('hit', slashX, slashY, 130, 20);
    combatVfx.addText('💥 [COMBO 3] BRAVER SLAM!!', slashX, slashY - 28, '#f59e0b', true);
    triggerScreenFlash();
  }

  // Preemptive Monster Strike check
  if (curWorld.monsters) {
    const hitMonster = curWorld.monsters.find(m => !m.defeated && Math.hypot(slashX - m.x, slashY - m.y) < 65);
    if (hitMonster) {
      hitMonster.defeated = true;
      if (typeof checkFloorClearStatus === 'function') checkFloorClearStatus();
      sfx.playHit();
      combatVfx.addText('💥 PREEMPTIVE STRIKE!', hitMonster.x, hitMonster.y - 25, '#fbbf24', true);
      setTimeout(() => {
        switchMode('battle', hitMonster.element);
      }, 180);
    }
  }
}
window.triggerPlayerSlash = triggerPlayerSlash;

const battleEngine = new BattleEngine(() => {
  switchMode('exploration');
});

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function triggerScreenFlash() {
  const flash = document.getElementById('screen-flash');
  if (flash) {
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 120);
  }
}

function switchMode(mode, encounterElement = null) {
  currentMode = mode;
  const explHud = document.getElementById('exploration-hud');
  const btlHud = document.getElementById('battle-hud');

  if (mode === 'battle') {
    explHud.style.display = 'none';
    btlHud.style.display = 'flex';
    triggerScreenFlash();
    battleEngine.startBattle(encounterElement || 'wild');
  } else {
    explHud.style.display = 'block';
    btlHud.style.display = 'none';
  }
}

// btn-mode-toggle removed — battles now triggered via dungeon encounters only

// Sound Toggle
const soundToggle = document.getElementById('sound-toggle');
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    const on = sfx.toggle();
    document.getElementById('sound-icon').textContent = on ? '🔊' : '🔇';
    document.getElementById('sound-text').textContent = on ? 'SOUND ON' : 'MUTED';
  });
}

let _cachedLogEl = null;
function setCombatLog(msg) {
  if (!_cachedLogEl) _cachedLogEl = document.getElementById('log-text');
  if (_cachedLogEl) _cachedLogEl.innerHTML = msg;
}

// Render dynamic abilities submenu for active party character
// Shows ONLY skills unlocked at the character's current level
function renderAbilitiesMenu() {
  const actor = battleEngine.getActiveActor();
  const subHeader = document.getElementById('skills-sub-header');
  if (subHeader) subHeader.textContent = `${actor.name.toUpperCase()} ABILITIES (Lv.${actor.level})`;

  const grid = document.getElementById('character-skills-grid');
  if (!grid) return;

  // Get skills unlocked at current level
  const skills = getUnlockedSkills(actor.id, actor.level);

  // Spells granted by equipped Materia
  const materiaSkills = [];
  if (actor.equippedMateria) {
    actor.equippedMateria.forEach(mId => {
      if (!mId) return;
      const mat = MATERIA_DB.find(m => m.id === mId);
      if (mat) {
        materiaSkills.push({
          id: mat.spellId,
          name: `${mat.spellName} [Materia]`,
          mp: mat.mp,
          elem: mat.elem,
          desc: mat.desc
        });
      }
    });
  }

  const allSkills = [...skills, ...materiaSkills];

  if (allSkills.length === 0) {
    // No skills unlocked yet — show hint
    grid.innerHTML = `
      <div style="padding: 16px; text-align: center; color: #94a3b8;">
        <div style="font-size: 28px; margin-bottom: 8px;">🔒</div>
        <div style="font-size: 13px; font-weight: 700; color: #f8fafc;">ยังไม่มีสกิล</div>
        <div style="font-size: 11px; margin-top: 6px;">Cloud Lv.1 มีแค่ Basic Attack</div>
        <div style="font-size: 11px; color: #4ade80; margin-top: 4px;">🔓 เลเวลอัพถึง Lv.2 เพื่อปลดล็อค Braver!</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = allSkills.map(skill => {
    const canAfford = actor.mp >= skill.mp;
    return `
      <button class="spell-btn" data-skill-id="${skill.id}" ${!canAfford ? 'style="opacity: 0.5;"' : ''}>
        <span class="spell-icon">${skill.elem === 'fire' ? '🔥' : skill.elem === 'water' ? '💧' : skill.elem === 'thunder' ? '⚡' : skill.elem === 'earth' ? '🌿' : skill.elem === 'holy' ? '✨' : '⚔️'}</span>
        <div class="spell-info">
          <span class="spell-name">${skill.name}</span>
          <span class="spell-weak">${skill.desc}</span>
        </div>
        <span class="spell-mp">${skill.mp} MP</span>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.spell-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sId = btn.getAttribute('data-skill-id');
      hideAllSubMenus();
      battleEngine.executeAbility(sId);
    });
  });
}

// Render battle items menu
function renderBattleItems() {
  const grid = document.getElementById('battle-items-grid');
  if (!grid) return;
  const items = window.playerInventory ? window.playerInventory.consumables : battleEngine.items;

  grid.innerHTML = ITEMS_DB.map(it => {
    const count = items[it.id] || 0;
    return `
      <button class="item-btn" data-item="${it.id}" ${count <= 0 ? 'style="opacity: 0.5;"' : ''}>
        <span class="item-icon"><img src="${it.iconFile}" style="width: 22px; height: 22px; vertical-align: middle;"></span>
        <div class="item-info">
          <span class="item-name">${it.name}</span>
          <span class="item-desc">${it.desc}</span>
        </div>
        <span class="item-count">x${count}</span>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const iId = btn.getAttribute('data-item');
      hideAllSubMenus();
      battleEngine.useItem(iId);
    });
  });
}

function updateBattleHUD() {
  // If entire party is down, trigger defeat immediately
  if (battleEngine.active && battleEngine.party.length > 0 && battleEngine.party.every(m => m.hp <= 0)) {
    battleEngine.checkPartyDefeat();
  }

  // Update Boss Health Bar if Boss encounter
  const boss = battleEngine.enemies.find(e => e.isBoss);
  const bossCard = document.getElementById('boss-health-card');
  if (boss && bossCard && boss.hp > 0) {
    bossCard.style.display = 'block';
    const hpPct = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));
    const fill = document.getElementById('boss-hp-fill');
    if (fill) fill.style.width = `${hpPct}%`;
    const num = document.getElementById('boss-hp-num');
    if (num) num.textContent = `${boss.hp} / ${boss.maxHp} HP (${hpPct}%)`;
    const badge = document.getElementById('boss-phase-badge');
    if (badge) badge.textContent = boss.hp > 2200 ? 'PHASE 1' : boss.hp > 900 ? 'PHASE 2' : 'PHASE 3 ENRAGE';
  } else if (bossCard && (!boss || boss.hp <= 0)) {
    bossCard.style.display = 'none';
  }

  // Update Party HUD
  const partyContainer = document.getElementById('party-hud-container');
  if (partyContainer) {
    battleEngine.party.forEach((member, mIdx) => {
      const hpPct = Math.max(0, Math.min(100, Math.round((member.hp / member.maxHp) * 100)));
      const mpPct = Math.max(0, Math.min(100, Math.round((member.mp / member.maxMp) * 100)));
      const limitPct = Math.max(0, Math.min(100, Math.round((member.limit / member.maxLimit) * 100)));
      const isCur = (mIdx === battleEngine.activeActorIndex);

      let row = document.getElementById(`party-row-${member.id}`);
      if (!row) {
        row = document.createElement('div');
        row.className = `member-row ${isCur ? 'active-actor' : ''}`;
        row.id = `party-row-${member.id}`;
        row.innerHTML = `
          <div class="member-avatar"><img src="${member.portrait}" style="width: 38px; height: 38px; border-radius: 6px; object-fit: cover;"></div>
          <div class="member-details">
            <div class="member-top">
              <span class="member-name">${member.name}</span>
              <span class="member-job">${member.job}</span>
            </div>
            <div class="bars-group">
              <div class="bar-box">
                <div class="bar-label-row">
                  <span class="bar-type">HP <span class="pct-tag hp-tag">${hpPct}%</span> <span class="hp-delta-slot"></span></span>
                  <span class="val-text hp-val">${member.hp}/${member.maxHp}</span>
                </div>
                <div class="meter-bg">
                  <div class="meter-ghost" style="width: ${hpPct}%;"></div>
                  <div class="meter-fill hp ${hpPct <= 25 ? 'low-hp' : ''}" style="width: ${hpPct}%;"></div>
                </div>
              </div>
              <div class="bar-box">
                <div class="bar-label-row">
                  <span class="bar-type">MP <span class="pct-tag mp-tag">${mpPct}%</span> <span class="mp-delta-slot"></span></span>
                  <span class="val-text mp-val">${member.mp}/${member.maxMp}</span>
                </div>
                <div class="meter-bg">
                  <div class="meter-ghost" style="width: ${mpPct}%; background: #93c5fd;"></div>
                  <div class="meter-fill mp" style="width: ${mpPct}%;"></div>
                </div>
              </div>
              <div class="bar-box">
                <div class="bar-label-row">
                  <span class="bar-type">LIMIT <span class="pct-tag limit-tag">${limitPct}%</span> <span class="limit-delta-slot"></span></span>
                  <span class="val-text limit-val">${limitPct}%</span>
                </div>
                <div class="meter-bg">
                  <div class="meter-ghost" style="width: ${limitPct}%; background: #fef08a;"></div>
                  <div class="meter-fill limit" style="width: ${limitPct}%;"></div>
                </div>
              </div>
            </div>
          </div>
        `;
        partyContainer.appendChild(row);
      } else {
        row.className = `member-row ${isCur ? 'active-actor' : ''}`;
        const hpTag = row.querySelector('.hp-tag');
        if (hpTag) hpTag.textContent = `${hpPct}%`;
        const hpVal = row.querySelector('.hp-val');
        if (hpVal) hpVal.textContent = `${member.hp}/${member.maxHp}`;
        const hpFill = row.querySelector('.meter-fill.hp');
        if (hpFill) {
          hpFill.style.width = `${hpPct}%`;
          if (hpPct <= 25) hpFill.classList.add('low-hp');
          else hpFill.classList.remove('low-hp');
        }
        const hpGhost = row.querySelector('.meter-bg .meter-ghost');
        if (hpGhost) hpGhost.style.width = `${hpPct}%`;

        const mpTag = row.querySelector('.mp-tag');
        if (mpTag) mpTag.textContent = `${mpPct}%`;
        const mpVal = row.querySelector('.mp-val');
        if (mpVal) mpVal.textContent = `${member.mp}/${member.maxMp}`;
        const mpFill = row.querySelector('.meter-fill.mp');
        if (mpFill) mpFill.style.width = `${mpPct}%`;

        const limitTag = row.querySelector('.limit-tag');
        if (limitTag) limitTag.textContent = `${limitPct}%`;
        const limitVal = row.querySelector('.limit-val');
        if (limitVal) limitVal.textContent = `${limitPct}%`;
        const limitFill = row.querySelector('.meter-fill.limit');
        if (limitFill) limitFill.style.width = `${limitPct}%`;
      }
    });
  }

  // Enemies Top Cards
  const enemiesContainer = document.getElementById('enemies-hud-container');
  if (enemiesContainer) {
    if (battleEngine.enemies.length > 0) {
      const curSelected = battleEngine.enemies[battleEngine.selectedEnemyIdx];
      if (!curSelected || curSelected.hp <= 0) {
        const liveIdx = battleEngine.enemies.findIndex(e => e && e.hp > 0);
        if (liveIdx !== -1) {
          battleEngine.selectedEnemyIdx = liveIdx;
        }
      }
    }
    battleEngine.enemies.forEach((enemy, idx) => {
      let card = document.getElementById(`enemy-card-${idx}`);
      if (enemy.hp <= 0) {
        if (card) card.style.display = 'none';
        return;
      }
      const hpPct = Math.max(0, Math.min(100, Math.round((enemy.hp / enemy.maxHp) * 100)));
      if (!card) {
        card = document.createElement('div');
        card.id = `enemy-card-${idx}`;
        card.className = `enemy-card ${idx === battleEngine.selectedEnemyIdx ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="enemy-card-top">
            <span class="enemy-name">${enemy.name}</span>
            <span class="elem-badge ${enemy.element}">[${enemy.element.toUpperCase()}]</span>
          </div>
          <div class="hp-bar-bg">
            <div class="hp-bar-ghost" style="width: ${hpPct}%;"></div>
            <div class="hp-bar-fill" style="width: ${hpPct}%;"></div>
          </div>
          <div class="hp-text">
            <span>HP <span class="pct-tag enemy-hp-tag">${hpPct}%</span></span>
            <span class="enemy-hp-num">${enemy.hp}/${enemy.maxHp}</span>
          </div>
        `;
        card.addEventListener('click', () => {
          if (enemy.hp > 0) {
            battleEngine.selectedEnemyIdx = idx;
            updateBattleHUD();
          }
        });
        enemiesContainer.appendChild(card);
      } else {
        card.style.display = 'flex';
        card.className = `enemy-card ${idx === battleEngine.selectedEnemyIdx ? 'selected' : ''}`;
        const fill = card.querySelector('.hp-bar-fill');
        if (fill) fill.style.width = `${hpPct}%`;
        const hpTag = card.querySelector('.enemy-hp-tag');
        if (hpTag) hpTag.textContent = `${hpPct}%`;
        const hpNum = card.querySelector('.enemy-hp-num');
        if (hpNum) hpNum.textContent = `${enemy.hp}/${enemy.maxHp}`;
      }
    });
  }
}

function hideAllSubMenus() {
  document.getElementById('main-actions-menu').style.display = 'block';
  document.getElementById('magic-sub-menu').style.display = 'none';
  document.getElementById('items-sub-menu').style.display = 'none';
  document.getElementById('target-sub-menu').style.display = 'none';
}

document.getElementById('btn-attack').addEventListener('click', () => {
  battleEngine.executePhysicalAttack();
});

document.getElementById('btn-magic').addEventListener('click', () => {
  document.getElementById('main-actions-menu').style.display = 'none';
  renderAbilitiesMenu();
  document.getElementById('magic-sub-menu').style.display = 'flex';
});

document.getElementById('btn-defend').addEventListener('click', () => {
  battleEngine.executeDefend();
});

document.getElementById('btn-limit').addEventListener('click', () => {
  battleEngine.executeLimitBreak();
});

document.getElementById('btn-items').addEventListener('click', () => {
  document.getElementById('main-actions-menu').style.display = 'none';
  renderBattleItems();
  document.getElementById('items-sub-menu').style.display = 'flex';
});

document.getElementById('btn-magic-back').addEventListener('click', hideAllSubMenus);
document.getElementById('btn-items-back').addEventListener('click', hideAllSubMenus);
document.getElementById('btn-target-back').addEventListener('click', hideAllSubMenus);

// ============================================================
// ============================================================
// GAME OVER & QUEST FAILED — Full-screen defeat screen
// ============================================================
function showQuestFailed() {
  battleEngine.turn = 'busy';

  // Play defeat sound
  try {
    const ctx2 = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx2.createOscillator();
    const gain = ctx2.createGain();
    osc.connect(gain); gain.connect(ctx2.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx2.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx2.currentTime + 1.8);
    gain.gain.setValueAtTime(0.4, ctx2.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 2.0);
    osc.start(ctx2.currentTime);
    osc.stop(ctx2.currentTime + 2.0);
  } catch(e) {}

  // Remove existing overlay if any
  const old = document.getElementById('quest-failed-overlay');
  if (old && typeof old.remove === 'function') old.remove();

  const curFloor = window.dungeonState?.currentFloor || 1;
  const questName = FLOOR_QUESTS?.[curFloor]?.name || 'Cell of Awakening';

  const overlay = document.createElement('div');
  overlay.id = 'quest-failed-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: radial-gradient(circle at center, rgba(35, 8, 8, 0.96) 0%, rgba(5, 5, 8, 0.98) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    backdrop-filter: blur(10px);
    animation: fadeInOverlay 0.8s ease;
    padding: 24px;
    box-sizing: border-box;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes fadeInOverlay { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      @keyframes skullPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #ef4444); } 50% { transform: scale(1.08); filter: drop-shadow(0 0 35px #dc2626); } }
      @keyframes gameOverGlow { 0%, 100% { text-shadow: 0 0 20px #ef4444, 0 0 45px #991b1b, 0 4px 0 #000; } 50% { text-shadow: 0 0 35px #f87171, 0 0 70px #b91c1c, 0 4px 0 #000; } }
      @keyframes flickerFail { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.35; } 94% { opacity: 1; } 98% { opacity: 0.6; } }
    </style>

    <div style="font-size: clamp(52px, 8vw, 84px); margin-bottom: 8px; animation: skullPulse 2.4s ease-in-out infinite;">💀</div>

    <div style="
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(28px, 6vw, 56px);
      color: #ef4444;
      letter-spacing: 8px;
      margin-bottom: 12px;
      animation: gameOverGlow 1.8s ease-in-out infinite, flickerFail 4s infinite;
      text-align: center;
    ">GAME OVER</div>

    <div style="
      display: inline-block;
      padding: 6px 20px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 9999px;
      font-family: 'Press Start 2P', monospace;
      font-size: 11px;
      color: #fca5a5;
      letter-spacing: 3px;
      margin-bottom: 18px;
    ">⚔️ QUEST FAILED • ภารกิจล้มเหลว ⚔️</div>

    <p style="
      color: #cbd5e1;
      font-size: 15px;
      margin: 0 0 24px 0;
      font-family: 'Outfit', sans-serif;
      text-align: center;
      max-width: 520px;
      line-height: 1.6;
    ">ความมืดมิดกลืนกินสติสัมปชัญญะ... จิตวิญญาณแห่งเหล่านักรบดับวูบลงในส่วนลึกของดันเจี้ยน</p>

    <!-- Telemetry Card -->
    <div style="
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 12px;
      padding: 16px 28px;
      margin-bottom: 28px;
      display: flex;
      gap: 32px;
      text-align: center;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
    ">
      <div>
        <div style="font-size: 11px; color: #94a3b8; font-family: Outfit, sans-serif;">ชั้นที่พ่ายแพ้ (FLOOR)</div>
        <div style="font-size: 16px; font-weight: 700; color: #f87171; font-family: 'Press Start 2P', monospace; margin-top: 4px;">B${curFloor}F</div>
      </div>
      <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
      <div>
        <div style="font-size: 11px; color: #94a3b8; font-family: Outfit, sans-serif;">ภารกิจ (OBJECTIVE)</div>
        <div style="font-size: 14px; font-weight: 600; color: #f1f5f9; font-family: Outfit, sans-serif; margin-top: 4px;">${questName}</div>
      </div>
      <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
      <div>
        <div style="font-size: 11px; color: #94a3b8; font-family: Outfit, sans-serif;">เงินคงเหลือ (GIL)</div>
        <div style="font-size: 15px; font-weight: 700; color: #fbbf24; font-family: Outfit, sans-serif; margin-top: 4px;">${window.playerGil || 500} 🪙</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 380px;">
      <button id="btn-retry-quest" style="
        background: linear-gradient(135deg, #b91c1c, #ef4444);
        border: 2px solid #f87171;
        color: #ffffff;
        font-family: 'Press Start 2P', monospace;
        font-size: 12px;
        padding: 16px 24px;
        border-radius: 10px;
        cursor: pointer;
        letter-spacing: 2px;
        box-shadow: 0 0 25px rgba(239, 68, 68, 0.45);
        transition: transform 0.15s, box-shadow 0.15s;
      ">⟳ TRY AGAIN (สู้ใหม่อีกครั้ง)</button>

      <button id="btn-retreat-quest" style="
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.4);
        color: #e2e8f0;
        font-family: Outfit, sans-serif;
        font-size: 14px;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        letter-spacing: 1px;
      ">⛺ RETREAT TO EXPLORATION (ฟื้นตัวกลับสู่ดันเจี้ยน)</button>

      <button id="btn-quit-quest" style="
        background: transparent;
        border: 1px solid rgba(100, 116, 139, 0.4);
        color: #94a3b8;
        font-family: Outfit, sans-serif;
        font-size: 13px;
        padding: 10px 24px;
        border-radius: 6px;
        cursor: pointer;
      ">🏠 RETURN TO TITLE (กลับหน้าหลัก)</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // 1. Retry battle with fresh stamina
  document.getElementById('btn-retry-quest').addEventListener('click', () => {
    overlay.remove();
    battleEngine.party.forEach(m => {
      m.hp = Math.max(1, Math.round(m.maxHp * 0.4));
      m.mp = Math.max(1, Math.round(m.maxMp * 0.4));
      m.status = {};
      m.defending = false;
    });
    switchMode('battle', battleEngine._lastEncounterType || 'wild');
  });

  // 2. Retreat to exploration mode with minimal recovery
  document.getElementById('btn-retreat-quest').addEventListener('click', () => {
    overlay.remove();
    battleEngine.party.forEach(m => {
      m.hp = Math.max(1, Math.round(m.maxHp * 0.3));
      m.mp = Math.max(1, Math.round(m.maxMp * 0.2));
      m.status = {};
      m.defending = false;
    });
    switchMode('exploration');
    updateBattleHUD();
  });

  // 3. Return to title screen
  document.getElementById('btn-quit-quest').addEventListener('click', () => {
    overlay.remove();
    battleEngine.party.forEach(m => {
      m.hp = m.maxHp;
      m.mp = m.maxMp;
      m.status = {};
      m.defending = false;
    });
    switchMode('exploration');
    const titleOverlay = document.getElementById('title-screen-overlay');
    if (titleOverlay) titleOverlay.style.display = 'flex';
  });
}

// ============================================================
// MISSION COMPLETE \u2014 Full-screen boss clear screen
// ============================================================
function showMissionComplete(floorNum) {
  const old = document.getElementById('mission-complete-overlay');
  if (old && typeof old.remove === 'function') old.remove();

  // Victory fanfare sound
  try {
    const ctx2 = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx2.createOscillator();
      const gain = ctx2.createGain();
      osc.connect(gain); gain.connect(ctx2.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx2.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.25, ctx2.currentTime + i * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + i * 0.18 + 0.4);
      osc.start(ctx2.currentTime + i * 0.18);
      osc.stop(ctx2.currentTime + i * 0.18 + 0.4);
    });
  } catch(e) {}

  const quest = FLOOR_QUESTS?.[floorNum] || {};
  const overlay = document.createElement('div');
  overlay.id = 'mission-complete-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: radial-gradient(ellipse at center, rgba(21,128,61,0.35) 0%, rgba(0,0,0,0.95) 70%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    animation: fadeInOverlay 0.5s ease;
  `;
  overlay.innerHTML = `
    <div style="font-size: clamp(48px,10vw,88px); margin-bottom: 12px;">\ud83c\udfc6</div>
    <div style="
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(16px, 3.5vw, 32px);
      color: #4ade80;
      letter-spacing: 4px;
      text-shadow: 0 0 30px #16a34a;
      margin-bottom: 8px;
    ">MISSION COMPLETE!</div>
    <div style="color: #fde047; font-size: 14px; margin-bottom: 6px; font-family: Outfit, sans-serif; font-weight: 700;">
      B${floorNum}F — ${quest.name || 'Floor Cleared'}
    </div>
    <div style="color: #86efac; font-size: 12px; margin-bottom: 32px; font-family: Outfit, sans-serif;">\ud83c\udfc6 ${quest.reward || ''}</div>
    <button id="btn-continue-mc" style="
      background: linear-gradient(135deg, #14532d, #16a34a);
      border: 2px solid #4ade80;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 11px;
      padding: 14px 32px;
      border-radius: 8px;
      cursor: pointer;
      letter-spacing: 2px;
    ">\u25b6 CONTINUE</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('btn-continue-mc').addEventListener('click', () => {
    overlay.remove();
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => { overlay.remove(); }, 5000);
}

// Victory Modal with EXP, JP, Gil, and Materials
function showVictoryModal(won, isBoss = false) {
  const modal = document.getElementById('battle-result-modal');
  const icon = document.getElementById('res-icon');
  const title = document.getElementById('res-title');
  const sub = document.getElementById('res-sub');
  const stats = document.getElementById('res-stats');

  modal.style.display = 'flex';
  if (won) {
    icon.textContent = isBoss ? '👑' : '🏆';
    title.textContent = isBoss ? 'MINI-BOSS DEFEATED!' : 'VICTORY ACHIEVED!';
    battleEngine.pendingReward = isBoss || (window.dungeonState?.currentFloor !== 5 && Math.random() < 0.65);
    sub.textContent = isBoss ? 'โค่นล้ม Boss สำเร็จ ได้รับรางวัลระดับตำนาน!' : 'เอาชนะการต่อสู้สำเร็จ!';

    // Trigger Mission Complete overlay for boss kills (delayed so result modal shows first)
    if (isBoss) {
      const fl = window.dungeonState?.currentFloor || 1;
      setTimeout(() => showMissionComplete(fl), 1200);
    }

    // EXP/GIL scaled by floor — early floors give less (Lv.1 friendly pacing)
    const currentFloor = window.dungeonState?.currentFloor || 1;
    const floorMultiplier = 0.5 + (currentFloor * 0.15); // B1F=0.65x, B5F=1.25x, B10F=2.0x
    const expGained = Math.round((isBoss ? 500 : 120) * floorMultiplier);
    const jpGained = Math.round((isBoss ? 150 : 45) * floorMultiplier);
    const gilGained = Math.round((isBoss ? 800 : 80) * floorMultiplier);

    window.playerGil = (window.playerGil || 0) + gilGained;

    // Check Level Up for each party member (Auto Stat Growth + Stat Points Allocation)
    let levelUpText = '';
    battleEngine.party.forEach(m => {
      m.exp += expGained;
      m.jp += jpGained;
      while (m.exp >= m.nextExp) {
        const oldLevel = m.level;
        m.level++;
        m.exp -= m.nextExp;
        m.nextExp = Math.round(m.nextExp * 1.5);
        m.maxHp += 45; m.hp = m.maxHp;
        m.maxMp += 15; m.mp = m.maxMp;
        m.baseAtk = (m.baseAtk || m.atk) + 4;
        m.atk += 4;
        m.magic += 4;
        m.def += 3;
        m.spd += 2;
        m.statPoints = (m.statPoints || 0) + 3;

        if (window.characterRoster && window.characterRoster[m.id]) {
          const r = window.characterRoster[m.id];
          r.level = m.level;
          r.maxHp = m.maxHp; r.hp = m.hp;
          r.maxMp = m.maxMp; r.mp = m.mp;
          r.atk = m.atk; r.baseAtk = m.baseAtk;
          r.def = m.def; r.baseDef = (r.baseDef || 30) + 3;
          r.magic = m.magic; r.baseMagic = (r.baseMagic || 30) + 4;
          r.spd = m.spd; r.baseSpd = (r.baseSpd || 35) + 2;
          r.statPoints = (r.statPoints || 0) + 3;
        }

        // Check for newly unlocked skills at this level
        const newSkills = (SKILL_UNLOCK_TABLE[m.id] || [])
          .filter(u => u.levelRequired === m.level)
          .map(u => CHARACTER_SKILLS_MASTER[m.id]?.find(s => s.id === u.id))
          .filter(Boolean);

        let skillUnlockText = '';
        if (newSkills.length > 0) {
          skillUnlockText = newSkills.map(s => {
            const memoryQuote = SKILL_MEMORY_QUOTES[s.id] || `${m.name}: 'ข้ารู้สึกถึงพลังที่ตื่นขึ้น... จำวิธีใช้ท่านั้นได้แล้ว!'`;
            return `
              <div style="background: rgba(251, 191, 36, 0.12); border-left: 3px solid #f59e0b; padding: 6px 12px; margin: 6px 0; border-radius: 4px; text-align: left;">
                <div style="color: #fbbf24; font-size: 11px; font-weight: bold;">🔓 ปลดล็อคสกิลใหม่: <b>${s.name}</b></div>
                <div style="color: #fde68a; font-size: 11px; font-style: italic; margin-top: 2px;">💬 ${memoryQuote}</div>
              </div>
            `;
          }).join('');
        }

        levelUpText += `<div style="color: #4ade80; margin: 4px 0;">🎉 <b>${m.name}</b> LEVEL UP! ➔ Lv.${m.level} (HP +45, MP +15, ATK +4, DEF +3, MAG +4) <span style="color: #facc15;">[+3 Stat Points!]</span></div>${skillUnlockText}`;
      }
    });

    let droppedItems = '';
    const currentFl = window.dungeonState?.currentFloor || 1;
    if (isBoss) {
      window.playerInventory.materials.scorpion_tail = (window.playerInventory.materials.scorpion_tail || 0) + 1;
      window.playerInventory.materials.star_core = (window.playerInventory.materials.star_core || 0) + 1;
      window.playerInventory.consumables.elixir = (window.playerInventory.consumables.elixir || 0) + 1;
      window.playerInventory.consumables.megalixir = (window.playerInventory.consumables.megalixir || 0) + 1;
      droppedItems = '📦 Star Core x1, Megalixir x1, Scorpion Core x1, Elixir x1';
    } else {
      if (currentFl === 6) {
        window.playerInventory.materials.ruby_gem = (window.playerInventory.materials.ruby_gem || 0) + 1;
        droppedItems = '📦 Ruby Gem (อัญมณีทับทิมเพลิง) x1, Potion x1';
      } else if (currentFl === 7) {
        window.playerInventory.materials.sapphire_crystal = (window.playerInventory.materials.sapphire_crystal || 0) + 1;
        droppedItems = '📦 Sapphire Crystal (ผลึกไพลินวารี) x1, Hi-Potion x1';
      } else if (currentFl >= 8) {
        window.playerInventory.materials.diamond_shard = (window.playerInventory.materials.diamond_shard || 0) + 1;
        droppedItems = '📦 Diamond Shard (เศษเพชรประกายแสง) x1, X-Potion x1';
        window.playerInventory.consumables.x_potion = (window.playerInventory.consumables.x_potion || 0) + 1;
      } else {
        window.playerInventory.materials.slime_jelly = (window.playerInventory.materials.slime_jelly || 0) + 1;
        droppedItems = '📦 Slime Jelly x1, Potion x1';
      }
      window.playerInventory.consumables.potion = (window.playerInventory.consumables.potion || 0) + 1;
    }

    stats.innerHTML = `
      <div>⭐ ได้รับ EXP: +${expGained} EXP</div>
      <div>🎖️ ได้รับ JP (Job Points): +${jpGained} JP</div>
      <div>🪙 ได้รับ Gil: +${gilGained} Gil</div>
      <div>${droppedItems}</div>
      ${levelUpText}
    `;

    if (levelUpText) sfx.playLevelUp();
    updateGilTelemetry();
  } else {
    // When battle is lost, immediately show the full-screen Quest Failed screen
    showQuestFailed();
    return;
  }
}

document.getElementById('btn-result-close').addEventListener('click', () => {
  document.getElementById('battle-result-modal').style.display = 'none';
  switchMode('exploration');
  checkFloorClearStatus();
  if (battleEngine.pendingReward) {
    battleEngine.pendingReward = false;
    openRoguelikeRewardModal(true, window.dungeonState.currentFloor);
  }
});

// ================= 8. In-Game Main Menu (Tactical RPG) =================
function toggleMainMenu() {
  const modal = document.getElementById('main-menu-modal');
  if (!modal) return;
  const isOpening = modal.style.display !== 'flex';
  modal.style.display = isOpening ? 'flex' : 'none';
  if (isOpening) {
    sfx.playTone(600, 'sine', 0.1, 0.08);
    renderMainMenuTab('party');
    const gilEl = document.getElementById('menu-gil-count');
    if (gilEl) gilEl.textContent = window.playerGil || 500;
  }
}

function renderMainMenuTab(tabName) {
  window.currentMenuTab = tabName;

  // Update sidebar active buttons
  document.querySelectorAll('.menu-nav-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
  });

  // Switch panels
  document.querySelectorAll('.menu-tab-panel').forEach(p => p.style.display = 'none');
  const activePanel = document.getElementById(`menu-tab-${tabName}`);
  if (activePanel) activePanel.style.display = 'block';

  // Render specific tab content
  if (tabName === 'party') {
    const container = document.getElementById('menu-party-cards-container');
    const rosterContainer = document.getElementById('menu-roster-cards-container');
    if (!container) return;

    if (window.selectedPartySlot === undefined) window.selectedPartySlot = 0;

    container.innerHTML = battleEngine.party.map((member, idx) => {
      const expPct = Math.round((member.exp / member.nextExp) * 100);
      const hpPct = Math.round((member.hp / member.maxHp) * 100);
      const mpPct = Math.round((member.mp / member.maxMp) * 100);
      const isSelected = (window.selectedPartySlot === idx);
      const pts = member.statPoints || 0;

      return `
        <div class="menu-party-card ${isSelected ? 'selected-slot' : ''}" style="${isSelected ? 'border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);' : ''}">
          <div class="party-card-portrait-box">
            <img src="${member.portrait}" alt="${member.name}">
          </div>
          <div class="party-card-main-info">
            <div class="party-card-header">
              <div>
                <span class="party-slot-tag">SLOT ${idx + 1}${idx === 0 ? ' (LEADER)' : ''}</span>
                <span class="party-card-name">${member.name} (Lv.${member.level})</span>
              </div>
              <button class="btn-swap-member" data-swap-slot="${idx}">
                ${isSelected ? '✓ กำลังเลือกช่องนี้' : '🔄 สลับสมาชิก'}
              </button>
            </div>

            <div class="party-bars-row">
              <div class="party-bar-group">
                <div class="party-bar-label"><span>HP</span> <span>${member.hp}/${member.maxHp} ${(member.allocatedStats?.hp || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.hp})</b>` : ''}</span></div>
                <div class="party-bar-track"><div class="party-bar-fill hp" style="width: ${hpPct}%;"></div></div>
              </div>
              <div class="party-bar-group">
                <div class="party-bar-label"><span>MP</span> <span>${member.mp}/${member.maxMp} ${(member.allocatedStats?.mp || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.mp})</b>` : ''}</span></div>
                <div class="party-bar-track"><div class="party-bar-fill mp" style="width: ${mpPct}%;"></div></div>
              </div>
            </div>

            <div class="party-bar-group">
              <div class="party-bar-label"><span>EXP (${member.exp}/${member.nextExp})</span> <span>${expPct}%</span></div>
              <div class="party-bar-track"><div class="party-bar-fill exp" style="width: ${expPct}%;"></div></div>
            </div>

            <div class="fft-stats-grid">
              <div class="fft-stat-item"><span>ATK:</span> <b class="highlight">${member.atk} ${(member.allocatedStats?.atk || 0) > 0 ? `<span style="color: #4ade80; font-size: 11px;">(+${member.allocatedStats.atk})</span>` : ''}</b></div>
              <div class="fft-stat-item"><span>DEF:</span> <b>${member.def} ${(member.allocatedStats?.def || 0) > 0 ? `<span style="color: #4ade80; font-size: 11px;">(+${member.allocatedStats.def})</span>` : ''}</b></div>
              <div class="fft-stat-item"><span>MAG:</span> <b class="highlight">${member.magic} ${(member.allocatedStats?.magic || 0) > 0 ? `<span style="color: #4ade80; font-size: 11px;">(+${member.allocatedStats.magic})</span>` : ''}</b></div>
              <div class="fft-stat-item"><span>SPD:</span> <b>${member.spd} ${(member.allocatedStats?.spd || 0) > 0 ? `<span style="color: #4ade80; font-size: 11px;">(+${member.allocatedStats.spd})</span>` : ''}</b></div>
              <div class="fft-stat-item"><span>BRAVERY:</span> <b class="highlight">${member.bravery}</b></div>
              <div class="fft-stat-item"><span>FAITH:</span> <b class="highlight">${member.faith}</b></div>
              <div class="fft-stat-item"><span>WEAPON:</span> <b>${member.equippedWeapon || 'Standard'}</b></div>
              <div class="fft-stat-item"><span>JP:</span> <b class="highlight">${member.jp}</b></div>
            </div>

            <!-- Stat Points Allocation & Interactive Growth with bonus indicator -->
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="stat-points-badge">⭐ แต้มอัพสเตตัสคงเหลือ: <b>${pts}</b> แต้ม</span>
                <span style="font-size: 10px; color: #94a3b8;">${pts > 0 ? 'กด [+] เพื่อเพิ่มสเตตัส' : 'เลเวลอัพเพื่อรับแต้มเพิ่ม (+3/Lv)'}</span>
              </div>
              <div class="stat-alloc-grid">
                <div class="stat-alloc-item">
                  <span>HP +30 ${(member.allocatedStats?.hp || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.hp})</b>` : ''}</span>
                  <button class="btn-stat-plus" data-stat-hero="${member.id}" data-stat-type="hp" ${pts <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="stat-alloc-item">
                  <span>MP +12 ${(member.allocatedStats?.mp || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.mp})</b>` : ''}</span>
                  <button class="btn-stat-plus" data-stat-hero="${member.id}" data-stat-type="mp" ${pts <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="stat-alloc-item">
                  <span>ATK +3 ${(member.allocatedStats?.atk || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.atk})</b>` : ''}</span>
                  <button class="btn-stat-plus" data-stat-hero="${member.id}" data-stat-type="atk" ${pts <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="stat-alloc-item">
                  <span>DEF +2 ${(member.allocatedStats?.def || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.def})</b>` : ''}</span>
                  <button class="btn-stat-plus" data-stat-hero="${member.id}" data-stat-type="def" ${pts <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="stat-alloc-item">
                  <span>MAG +3 ${(member.allocatedStats?.magic || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.magic})</b>` : ''}</span>
                  <button class="btn-stat-plus" data-stat-hero="${member.id}" data-stat-type="magic" ${pts <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <div class="stat-alloc-item">
                  <span>SPD +2 ${(member.allocatedStats?.spd || 0) > 0 ? `<b style="color: #4ade80; font-size: 10px;">(+${member.allocatedStats.spd})</b>` : ''}</span>
                  <button class="btn-stat-plus" data-stat-hero="${member.id}" data-stat-type="spd" ${pts <= 0 ? 'disabled' : ''}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Stat allocation plus buttons
    container.querySelectorAll('[data-stat-hero]').forEach(btn => {
      btn.addEventListener('click', () => {
        const heroId = btn.getAttribute('data-stat-hero');
        const statType = btn.getAttribute('data-stat-type');
        const hero = window.characterRoster[heroId];
        if (!hero || (hero.statPoints || 0) <= 0) return;

        hero.statPoints--;
        hero.allocatedStats = hero.allocatedStats || { hp: 0, mp: 0, atk: 0, def: 0, magic: 0, spd: 0 };
        if (statType === 'hp') {
          hero.baseHp = (hero.baseHp || hero.maxHp) + 30;
          hero.maxHp += 30;
          hero.hp = Math.min(hero.maxHp, hero.hp + 30);
          hero.allocatedStats.hp = (hero.allocatedStats.hp || 0) + 30;
        } else if (statType === 'mp') {
          hero.baseMp = (hero.baseMp || hero.maxMp) + 12;
          hero.maxMp += 12;
          hero.mp = Math.min(hero.maxMp, hero.mp + 12);
          hero.allocatedStats.mp = (hero.allocatedStats.mp || 0) + 12;
        } else if (statType === 'atk') {
          hero.baseAtk = (hero.baseAtk || 50) + 3;
          hero.atk += 3;
          hero.allocatedStats.atk = (hero.allocatedStats.atk || 0) + 3;
        } else if (statType === 'def') {
          hero.baseDef = (hero.baseDef || 30) + 2;
          hero.def += 2;
          hero.allocatedStats.def = (hero.allocatedStats.def || 0) + 2;
        } else if (statType === 'magic') {
          hero.baseMagic = (hero.baseMagic || 30) + 3;
          hero.magic += 3;
          hero.allocatedStats.magic = (hero.allocatedStats.magic || 0) + 3;
        } else if (statType === 'spd') {
          hero.baseSpd = (hero.baseSpd || 35) + 2;
          hero.spd += 2;
          hero.allocatedStats.spd = (hero.allocatedStats.spd || 0) + 2;
        }

        const partyMember = battleEngine.party.find(m => m.id === heroId);
        if (partyMember) {
          partyMember.maxHp = hero.maxHp;
          partyMember.hp = hero.hp;
          partyMember.maxMp = hero.maxMp;
          partyMember.mp = hero.mp;
          partyMember.baseAtk = hero.baseAtk;
          partyMember.atk = hero.atk;
          partyMember.def = hero.def;
          partyMember.magic = hero.magic;
          partyMember.spd = hero.spd;
          partyMember.statPoints = hero.statPoints;
          partyMember.allocatedStats = hero.allocatedStats;
        }

        sfx.playLevelUp();
        renderMainMenuTab('party');
        updateBattleHUD();
      });
    });

    // Slot selection listeners
    container.querySelectorAll('[data-swap-slot]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.selectedPartySlot = parseInt(btn.getAttribute('data-swap-slot'), 10);
        renderMainMenuTab('party');
      });
    });

    // Render reserve roster — locked until rescued on their dungeon floor
    if (rosterContainer && window.characterRoster) {
      const activeIds = battleEngine.party.map(m => m.id);
      const rescued = window.dungeonState?.rescued || {};
      const reserves = Object.values(window.characterRoster).filter(hero => !activeIds.includes(hero.id));

      if (reserves.length === 0) {
        rosterContainer.innerHTML = '<p style="color: #94a3b8; font-size: 13px;">สมาชิกทุกคนถูกจัดลงในทีมหลัก 4 คนครบแล้ว!</p>';
      } else {
        // Unlock floor info for tooltip
        const unlockFloorLabel = { tifa: 'B3F', vivi: 'B5F', cecil: 'B7F', aeris: 'B9F', chrono: 'B10F' };

        rosterContainer.innerHTML = reserves.map(hero => {
          const isRescued = (hero.id === 'cloud') || !!rescued[hero.id];
          const floorHint = unlockFloorLabel[hero.id] || '';
          return `
          <div class="roster-card" style="${isRescued ? '' : 'opacity:0.55;'}">
            <img src="${hero.portrait}" class="roster-thumb" alt="${hero.name}" style="${isRescued ? '' : 'filter:grayscale(1);'}">
            <div class="roster-info">
              <div class="roster-name">${hero.name} (Lv.${hero.level})</div>
              <div class="roster-job">Class: ${hero.job}</div>
              <div class="roster-stats-mini">
                <span>HP: ${hero.maxHp}</span>
                <span>MP: ${hero.maxMp}</span>
                <span>ATK: ${hero.atk}</span>
                <span>DEF: ${hero.def}</span>
                <span>SPD: ${hero.spd}</span>
              </div>
            </div>
            ${isRescued
              ? `<button class="btn-swap-member" data-add-hero="${hero.id}">➕ สลับเข้าทีม</button>`
              : `<div style="font-size:11px;color:#facc15;text-align:center;padding:8px;background:rgba(0,0,0,0.4);border-radius:6px;">🔒 ล็อค — พบที่ชั้น ${floorHint}</div>`
            }
          </div>
        `;
        }).join('');

        rosterContainer.querySelectorAll('[data-add-hero]').forEach(btn => {
          btn.addEventListener('click', () => {
            const heroId = btn.getAttribute('data-add-hero');
            const newHero = window.characterRoster[heroId];
            if (!newHero) return;
            // Double-check lock
            if (heroId !== 'cloud' && !rescued[heroId]) {
              sfx.playHit();
              return;
            }
            const slot = (window.selectedPartySlot !== undefined && window.selectedPartySlot < battleEngine.party.length)
              ? window.selectedPartySlot
              : battleEngine.party.length - 1;
            battleEngine.party[slot] = newHero;
            sfx.playEquip();
            renderMainMenuTab('party');
            updateBattleHUD();
          });
        });
      }
    }
  } else if (tabName === 'jobs') {
    const container = document.getElementById('menu-jobs-container');
    if (!container) return;
    container.innerHTML = battleEngine.party.map(member => {
      const skills = CHARACTER_SKILLS[member.id] || [];
      return `
        <div class="fft-job-card">
          <div class="fft-job-header">
            <div class="job-name-title">
              <span>${member.avatar}</span>
              <div>
                <div>${member.name}</div>
                <small style="color: #38bdf8;">Class: ${member.job}</small>
              </div>
            </div>
            <div class="job-exp-row">
              <div>Job Level: <b>Lv.${member.jobLevel} / 8</b></div>
              <div>JP (Job Points): <b>${member.jp} JP</b></div>
            </div>
          </div>
          <div class="job-skills-list">
            ${skills.map(s => `
              <div class="job-skill-card">
                <div class="job-skill-top">
                  <span>${s.name}</span>
                  <span style="color: #facc15;">${s.mp} MP</span>
                </div>
                <div class="job-skill-desc">${s.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  } else if (tabName === 'inventory') {
    renderMenuInventory('consumables');
  } else if (tabName === 'equipment') {
    const container = document.getElementById('menu-equipment-container');
    if (!container) return;

    if (!window.selectedEquipHeroId) window.selectedEquipHeroId = battleEngine.party[0]?.id || 'cloud';
    const curHero = window.characterRoster[window.selectedEquipHeroId] || battleEngine.party[0];
    const skills = CHARACTER_SKILLS[curHero.id] || [];
    const matList = window.playerInventory?.materials || {};

    // Hero-specific weapon catalog
    const heroWeapons = WEAPONS_DB.filter(w => w.heroId === curHero.id || !w.heroId);

    // Current equipped Materia array
    if (!curHero.equippedMateria) curHero.equippedMateria = [null, null];

    container.innerHTML = `
      <div class="worldmap-card">
        <div class="location-header" style="margin-bottom: 12px;">
          <span class="loc-badge">LOADOUT &amp; EQUIPMENT</span>
          <h3>ปรับเปลี่ยนอุปกรณ์, สวมใส่มาทีเรีย และสกิลประจำตัว</h3>
        </div>

        <!-- Hero Selector Tabs -->
        <div class="shop-nav-tabs" style="margin-bottom: 14px;">
          ${Object.values(window.characterRoster).map(h => `
            <button class="shop-tab-btn ${h.id === curHero.id ? 'active' : ''}" data-equip-hero="${h.id}">
              ${h.avatar} ${h.name.split(' ')[0]}
            </button>
          `).join('')}
        </div>

        <!-- Hero Loadout Overview -->
        <div style="display: flex; gap: 16px; align-items: center; background: rgba(15, 23, 42, 0.75); padding: 14px; border-radius: 10px; border: 1.5px solid rgba(56, 189, 248, 0.3); margin-bottom: 16px;">
          <img src="${curHero.portrait}" style="width: 64px; height: 64px; border-radius: 10px; border: 2px solid #38bdf8; object-fit: cover;">
          <div style="flex: 1;">
            <div style="font-weight: 800; font-size: 16px; color: #f8fafc;">${curHero.name} <span style="font-size: 12px; color: #38bdf8;">(${curHero.job})</span></div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
              🗡️ อาวุธ: <b style="color: #4ade80;">${curHero.equippedWeapon || 'Standard Weapon'}</b> | 🛡️ เกราะ: <b style="color: #38bdf8;">${curHero.equippedArmor || 'Standard Bangle'}</b>
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 2px;">
              ATK: <b style="color: #facc15;">${curHero.atk}</b> | DEF: <b style="color: #60a5fa;">${curHero.def}</b> | MAG: <b style="color: #f472b6;">${curHero.magic}</b> | SPD: <b style="color: #34d399;">${curHero.spd}</b>
            </div>
          </div>
        </div>

        <!-- Materia Sockets -->
        <h4 style="color: #38bdf8; font-size: 13px; margin: 12px 0 8px 0;">🔮 ช่องสวมใส่มาทีเรีย (MATERIA SOCKETS - 2 SLOTS)</h4>
        <div class="materia-container">
          ${curHero.equippedMateria.map((matId, slotIdx) => {
            const mat = matId ? MATERIA_DB.find(m => m.id === matId) : null;
            if (mat) {
              return `
                <div class="materia-slot-card">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="materia-icon-orb" style="background: ${mat.color};">${mat.icon}</div>
                    <div>
                      <div style="font-weight: 700; font-size: 12px; color: #f8fafc;">${mat.name.split(' ')[0]}</div>
                      <div style="font-size: 10px; color: #38bdf8;">เวท: ${mat.spellName}</div>
                    </div>
                  </div>
                  <button class="btn-materia-action" data-materia-slot="${slotIdx}">
                    ⚡ สลับ
                  </button>
                </div>
              `;
            } else {
              return `
                <div class="materia-slot-card empty">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="materia-icon-orb" style="background: #1e293b; border: 1px dashed #64748b;">⚪</div>
                    <div style="font-size: 11px; color: #94a3b8;">ช่องว่าง (Slot ${slotIdx + 1})</div>
                  </div>
                  <button class="btn-materia-action" data-materia-slot="${slotIdx}">
                    ➕ สวมใส่
                  </button>
                </div>
              `;
            }
          }).join('')}
        </div>

        <!-- Available Weapons to Equip for this Hero -->
        <h4 style="color: #fde047; font-size: 13px; margin: 12px 0 8px 0;">⚔️ คลังอาวุธของ ${curHero.name} (WEAPONS CATALOG)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; margin-bottom: 16px;">
          ${heroWeapons.map(w => {
            const isEquipped = (curHero.equippedWeapon === w.name);
            const isOwned = w.owned;
            return `
              <div class="shop-card ${isEquipped ? 'equipped-card' : ''} ${!isOwned ? 'locked-card' : ''}" style="padding: 10px;">
                <div class="shop-card-info">
                  <div class="shop-card-title-row">
                    <span class="shop-card-title" style="font-size: 12px;">${w.name}</span>
                    <span class="shop-badge ${w.badge}">${w.badgeText}</span>
                  </div>
                  <div class="shop-card-stat" style="font-size: 11px;">+${w.atk} ATK ${w.magic ? `| +${w.magic} MAG` : ''} ${w.def ? `| +${w.def} DEF` : ''} ${w.spd ? `| +${w.spd} SPD` : ''}</div>
                  <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">${w.desc}</div>
                </div>
                ${isEquipped ? `
                  <button class="shop-card-btn btn-equipped" disabled>✓ สวมใส่อยู่</button>
                ` : isOwned ? `
                  <button class="shop-card-btn btn-equip" data-equip-item="${w.id}">⚔️ สวมใส่</button>
                ` : `
                  <button class="shop-card-btn btn-locked" disabled>🔒 ล็อค (หาจากกล่อง/ร้าน)</button>
                `}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Hero Materia & Abilities -->
        <h4 style="color: #38bdf8; font-size: 13px; margin: 12px 0 8px 0;">✨ สกิลประจำอาชีพ (JOB SKILLS)</h4>
        <div class="job-skills-list" style="margin-bottom: 16px;">
          ${skills.map(s => `
            <div class="job-skill-card" style="padding: 8px 12px;">
              <div class="job-skill-top">
                <span style="font-size: 12px;">${s.name}</span>
                <span style="color: #facc15; font-size: 11px;">${s.mp} MP</span>
              </div>
              <div class="job-skill-desc" style="font-size: 11px;">${s.desc}</div>
            </div>
          `).join('')}
        </div>

        <!-- Materials Pouch & Gil Summary -->
        <h4 style="color: #22c55e; font-size: 13px; margin: 12px 0 8px 0;">💎 ถุงเก็บวัตถุดิบ MATERIAL &amp; GIL</h4>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #cbd5e1; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;">
          ${MATERIALS_DB.map(m => `
            <div>${m.name.split(' ')[0]}: <b style="color: #38bdf8;">x${matList[m.id] || 0}</b></div>
          `).join('')}
        </div>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 10px;">💡 คุณสามารถซื้ออาวุธระดับสูงและขายวัตถุดิบเพื่อรับ Gil ได้ที่ร้านค้าของ แม่ค้า Anna (Merchant Anna)</p>
      </div>
    `;

    // Equip hero switch listeners
    container.querySelectorAll('[data-equip-hero]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.selectedEquipHeroId = btn.getAttribute('data-equip-hero');
        renderMainMenuTab('equipment');
      });
    });

    // Materia socket toggle / cycle listeners
    container.querySelectorAll('[data-materia-slot]').forEach(btn => {
      btn.addEventListener('click', () => {
        const slotIdx = parseInt(btn.getAttribute('data-materia-slot'), 10);
        const currentMatId = curHero.equippedMateria[slotIdx];
        const matIds = [null, ...MATERIA_DB.map(m => m.id)];
        const curIdx = matIds.indexOf(currentMatId);
        const nextIdx = (curIdx + 1) % matIds.length;
        curHero.equippedMateria[slotIdx] = matIds[nextIdx];
        sfx.playEquip();
        renderMainMenuTab('equipment');
      });
    });

    // Equip weapon listeners
    container.querySelectorAll('[data-equip-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const weaponId = btn.getAttribute('data-equip-item');
        const weapon = WEAPONS_DB.find(w => w.id === weaponId);
        if (!weapon || !weapon.owned) return;

        curHero.equippedWeapon = weapon.name;
        curHero.atk = (curHero.baseAtk || 50) + (weapon.atk || 0);
        if (weapon.def) curHero.def = (curHero.baseDef || 30) + weapon.def;
        if (weapon.magic) curHero.magic = (curHero.baseMagic || 30) + weapon.magic;
        if (weapon.spd) curHero.spd = (curHero.baseSpd || 35) + weapon.spd;

        if (curHero.id === 'cloud') {
          window.equippedWeapon = weapon;
          updateGilTelemetry();
        }

        const partyMember = battleEngine.party.find(m => m.id === curHero.id);
        if (partyMember) {
          partyMember.atk = curHero.atk;
          if (curHero.def) partyMember.def = curHero.def;
          if (curHero.magic) partyMember.magic = curHero.magic;
          if (curHero.spd) partyMember.spd = curHero.spd;
        }

        sfx.playEquip();
        renderMainMenuTab('equipment');
        updateBattleHUD();
      });
    });
  }
}

function renderMenuInventory(subTab) {
  const container = document.getElementById('menu-inventory-container');
  if (!container) return;

  const btnConsumables = document.getElementById('inv-tab-btn-consumables');
  const btnMaterials = document.getElementById('inv-tab-btn-materials');
  if (btnConsumables && btnMaterials) {
    btnConsumables.classList.toggle('active', subTab === 'consumables');
    btnMaterials.classList.toggle('active', subTab === 'materials');
  }

  if (subTab === 'consumables') {
    container.innerHTML = ITEMS_DB.map(it => {
      const count = window.playerInventory.consumables[it.id] || 0;
      return `
        <div class="inv-card">
          <div class="inv-icon-box">
            <img src="${it.iconFile}" class="inv-icon-img" alt="${it.name}">
          </div>
          <div class="inv-details">
            <div class="inv-name">${it.name}</div>
            <div class="inv-desc">${it.desc}</div>
            <div class="inv-count">จำนวน: x${count}</div>
          </div>
          <button class="inv-action-btn" data-use-item="${it.id}" ${count <= 0 ? 'disabled style="opacity:0.4;"' : ''}>
            ใช้ (USE)
          </button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-use-item]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-use-item');
        if (window.playerInventory.consumables[id] > 0) {
          window.playerInventory.consumables[id]--;
          sfx.playHeal();
          // Heal party
          battleEngine.party.forEach(m => {
            if (id === 'potion') m.hp = Math.min(m.maxHp, m.hp + 250);
            else if (id === 'hi_potion') m.hp = Math.min(m.maxHp, m.hp + 500);
            else if (id === 'ether') m.mp = Math.min(m.maxMp, m.mp + 80);
            else if (id === 'turbo_ether') m.mp = Math.min(m.maxMp, m.mp + 160);
            else if (id === 'elixir') { m.hp = m.maxHp; m.mp = m.maxMp; }
          });
          renderMenuInventory('consumables');
        }
      });
    });
  } else {
    // Materials
    container.innerHTML = MATERIALS_DB.map(mat => {
      const count = window.playerInventory.materials[mat.id] || 0;
      return `
        <div class="inv-card">
          <div class="inv-icon-box">
            <img src="${mat.iconFile}" class="inv-icon-img" alt="${mat.name}">
          </div>
          <div class="inv-details">
            <div class="inv-name">${mat.name}</div>
            <div class="inv-desc">${mat.desc}</div>
            <div class="inv-count">จำนวน: x${count} | ราคาขาย: <b style="color: #facc15;">${mat.sellPrice} Gil</b></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Menu Tab Button Delegations
document.querySelectorAll('.menu-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    renderMainMenuTab(btn.getAttribute('data-tab'));
  });
});

const invSubCons = document.getElementById('inv-tab-btn-consumables');
if (invSubCons) invSubCons.addEventListener('click', () => renderMenuInventory('consumables'));
const invSubMat = document.getElementById('inv-tab-btn-materials');
if (invSubMat) invSubMat.addEventListener('click', () => renderMenuInventory('materials'));

const closeMenuBtn = document.getElementById('btn-close-main-menu');
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMainMenu);

const triggerMenuBtn = document.getElementById('btn-main-menu-trigger');
if (triggerMenuBtn) triggerMenuBtn.addEventListener('click', toggleMainMenu);

// ================= Keyboard Handlers =================
const keyMap = {
  'KeyW': { prop: 'up', elemId: 'key-w' },
  'KeyA': { prop: 'left', elemId: 'key-a' },
  'KeyS': { prop: 'down', elemId: 'key-s' },
  'KeyD': { prop: 'right', elemId: 'key-d' },
  'ArrowUp': { prop: 'up', elemId: 'key-up' },
  'ArrowLeft': { prop: 'left', elemId: 'key-left' },
  'ArrowDown': { prop: 'down', elemId: 'key-down' },
  'ArrowRight': { prop: 'right', elemId: 'key-right' },
  'ShiftLeft': { prop: 'shift', elemId: 'key-shift' },
  'ShiftRight': { prop: 'shift', elemId: 'key-shift' },
  'Space': { prop: 'space', elemId: 'key-space' },
  'KeyF': { prop: 'slash', elemId: 'btn-hud-slash' },
  'KeyJ': { prop: 'slash', elemId: 'btn-hud-slash' }
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM' || e.code === 'Escape') {
    // 1. If shop is open, close it
    const sm = document.getElementById('shop-menu');
    if (sm && sm.style.display === 'block') {
      sm.style.display = 'none';
      const db = document.getElementById('dialog-box');
      if (db) db.style.display = 'none';
      return;
    }
    // 2. If dialog is open, close it
    const db = document.getElementById('dialog-box');
    if (db && db.style.display === 'block') {
      db.style.display = 'none';
      return;
    }
    // 3. If battle result is open, close it
    const brm = document.getElementById('battle-result-modal');
    if (brm && brm.style.display === 'flex') {
      brm.style.display = 'none';
      switchMode('exploration');
      return;
    }
    // 4. Toggle Main Menu in exploration mode
    if (currentMode === 'exploration') {
      toggleMainMenu();
      return;
    }
  }

  const m = keyMap[e.code];
  if (m) {
    keys[m.prop] = true;
    const el = document.getElementById(m.elemId);
    if (el) el.classList.add('pressed');

    if (e.code === 'KeyF' || e.code === 'KeyJ') {
      e.preventDefault();
      if (currentMode === 'exploration') {
        triggerPlayerSlash();
      } else if (currentMode === 'battle') {
        if (battleEngine.turn === 'player') {
          battleEngine.executePhysicalAttack();
        }
      }
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();

      const db = document.getElementById('dialog-box');
      if (db && db.style.display === 'block') {
        db.style.display = 'none';
        const curWorld = getCurrentWorld();
        const shopNpc = curWorld.npcs ? curWorld.npcs.find(n => n.isShop && Math.hypot(playerX - n.x, playerY - n.y) < 80) : null;
        if (shopNpc) {
          openShop();
          return;
        }
        return;
      }

      if (currentMode === 'battle') {
        if (battleEngine.turn === 'player') {
          battleEngine.executePhysicalAttack();
        }
        return;
      }

      if (currentMode === 'exploration') {
        const curWorld = getCurrentWorld();
        let interacted = false;

        // 0. Dungeon Floor Navigation (Stairs Down with Locked Room Check)
        if (!interacted && currentMapId === 'dungeon' && curWorld.stairsDown && Math.hypot(playerX - curWorld.stairsDown.x, playerY - curWorld.stairsDown.y) < 65) {
          interacted = true;
          const isCleared = !!window.dungeonState?.clearedFloors?.[curWorld.floor] || (curWorld.monsters && curWorld.monsters.length > 0 && curWorld.monsters.every(m => m.defeated));
          if (!isCleared) {
            const remaining = curWorld.monsters ? curWorld.monsters.filter(m => !m.defeated).length : 0;
            sfx.playHit();
            triggerScreenFlash();
            combatVfx.addText(`🔒 ประตูถูกผนึกด้วยมนตรา! ต้องกำจัดมอนสเตอร์ในห้องให้หมดก่อน (เหลือ ${remaining} ตัว)`, playerX, playerY - 35, '#ef4444', true);
            return;
          }
          const nextF = (curWorld.floor || 1) + 1;
          goToFloor(nextF);
          return;
        }

        // 0. Dungeon Floor Navigation (Stairs Up - Always Open for Free Travel)
        if (!interacted && currentMapId === 'dungeon' && curWorld.stairsUp && Math.hypot(playerX - curWorld.stairsUp.x, playerY - curWorld.stairsUp.y) < 65) {
          interacted = true;
          const prevF = Math.max(1, (curWorld.floor || 1) - 1);
          goToFloor(prevF);
          return;
        }

        // B2F: Tifa prompt before room cleared
        if (!interacted && currentMapId === 'dungeon' && curWorld.floor === 2 && !window.dungeonState?.rescued?.tifa && Math.hypot(playerX - 450, playerY - 480) < 65) {
          interacted = true;
          const remaining = curWorld.monsters ? curWorld.monsters.filter(m => !m.defeated).length : 0;
          combatVfx.addText(`🥊 Tifa: 'คลาวด์! ช่วยจัดการมอนสเตอร์ในสุสานให้หมดก่อนนะ! (เหลือ ${remaining} ตัว)'`, playerX, playerY - 35, '#f472b6', true);
          return;
        }

        // B3F: Vivi prompt before room cleared
        if (!interacted && currentMapId === 'dungeon' && curWorld.floor === 3 && !window.dungeonState?.rescued?.vivi && Math.hypot(playerX - 750, playerY - 480) < 65) {
          interacted = true;
          const remaining = curWorld.monsters ? curWorld.monsters.filter(m => !m.defeated).length : 0;
          combatVfx.addText(`🧙 Vivi: 'คุณอัศวินครับ! ช่วยปราบมอนสเตอร์ในถ้ำเพื่อสลายบาเรียทีครับ! (เหลือ ${remaining} ตัว)'`, playerX, playerY - 35, '#38bdf8', true);
          return;
        }

        // B7F: Cecil encounter prompt
        if (!interacted && currentMapId === 'dungeon' && curWorld.floor === 7 && !window.dungeonState?.rescued?.cecil && Math.hypot(playerX - 600, playerY - 350) < 65) {
          interacted = true;
          rescueCompanion('cecil');
          return;
        }

        // B9F: Aeris encounter prompt
        if (!interacted && currentMapId === 'dungeon' && curWorld.floor === 9 && !window.dungeonState?.rescued?.aeris && Math.hypot(playerX - 800, playerY - 380) < 65) {
          interacted = true;
          rescueCompanion('aeris');
          return;
        }

        // Campfire Rest in Village Haven (Floor 5)
        if (!interacted && currentMapId === 'village' && Math.hypot(playerX - 760, playerY - 520) < 65) {
          interacted = true;
          restAtCampfire();
          return;
        }

        // Waypoint Crystal in Village Haven (Floor 5)
        if (!interacted && currentMapId === 'village' && Math.hypot(playerX - 960, playerY - 480) < 65) {
          interacted = true;
          openHavenWaypointModal();
          return;
        }

        // Village Portal to Floor 6 (Magma Crucible)
        if (!interacted && currentMapId === 'village' && Math.hypot(playerX - 1600, playerY - 280) < 70) {
          interacted = true;
          goToFloor(6);
          return;
        }

        // 1. NPC interactions
        if (curWorld.npcs) {
          const npc = curWorld.npcs.find(n => Math.hypot(playerX - n.x, playerY - n.y) < 65);
          if (npc) {
            interacted = true;
            const db = document.getElementById('dialog-box');
            if (db.style.display === 'block') {
              db.style.display = 'none';
              if (npc.isShop) {
                renderShopUI();
                updateGilTelemetry();
                document.getElementById('shop-menu').style.display = 'block';
                sfx.playHeal();
              }
            } else {
              db.style.display = 'block';
              document.getElementById('dialog-name').textContent = npc.name;
              document.getElementById('dialog-text').textContent = npc.text;
              const roleBadge = document.getElementById('dialog-role');
              if (roleBadge) roleBadge.textContent = npc.role || 'VILLAGER';
              const pImg = document.getElementById('dialog-portrait');
              if (pImg) {
                if (npc.id === 'shopkeeper') pImg.src = 'portraits/portrait_merchant.jpg';
                else if (npc.id === 'tifa') pImg.src = 'portraits/portrait_tifa.jpg';
                else if (npc.id === 'mayor') pImg.src = 'portraits/portrait_mayor.jpg';
                else pImg.src = 'portraits/portrait_cloud.jpg';
                pImg.style.display = 'block';
              }
              const shopBtn = document.getElementById('btn-dialog-open-shop');
              if (shopBtn) {
                shopBtn.style.display = npc.isShop ? 'inline-flex' : 'none';
              }
              sfx.playTone(520, 'sine', 0.08, 0.08);
            }
          }
        }

        // 2. Village Secret Chest (Unlocks Flame Saber!)
        if (!interacted && curWorld.chest && !curWorld.chest.opened && Math.hypot(playerX - curWorld.chest.x, playerY - curWorld.chest.y) < 55) {
          interacted = true;
          curWorld.chest.opened = true;
          curWorld.chest.openedAt = performance.now();
          sfx.playChest ? sfx.playChest() : sfx.playVictoryFanfare();
          combatVfx.addAnimatedSprite('magic', curWorld.chest.x, curWorld.chest.y, 110, 24);
          combatVfx.addBurst(curWorld.chest.x, curWorld.chest.y, '#facc15', 30, 6);
          combatVfx.addText('🌟 ปลดล็อคอาวุธ Flame Saber ⚔️!', curWorld.chest.x, curWorld.chest.y - 30, '#fde047', true);

          const w = WEAPONS_DB.find(x => x.id === 'flame_saber');
          if (w) w.owned = true;

          window.playerInventory.consumables.hi_potion = (window.playerInventory.consumables.hi_potion || 0) + 1;
          window.playerInventory.materials.mythril_ore = (window.playerInventory.materials.mythril_ore || 0) + 1;
          window.playerGil = (window.playerGil || 500) + 250;
          updateGilTelemetry();
        }

        // 3. Dungeon Vault Chests (Unlocks Thunder Katana & Mythril Sword!)
        if (!interacted && curWorld.chests) {
          const c = curWorld.chests.find(ch => !ch.opened && Math.hypot(playerX - ch.x, playerY - ch.y) < 55);
          if (c) {
            interacted = true;
            c.opened = true;
            sfx.playChest ? sfx.playChest() : sfx.playVictoryFanfare();
            combatVfx.addBurst(c.x, c.y, '#38bdf8', 30, 6);
            combatVfx.addText('🌟 ปลดล็อค Thunder Katana & Mythril Sword ⚔️!', c.x, c.y - 30, '#38bdf8', true);

            const w1 = WEAPONS_DB.find(x => x.id === 'thunder_katana');
            if (w1) w1.owned = true;
            const w2 = WEAPONS_DB.find(x => x.id === 'mythril_sword');
            if (w2) w2.owned = true;

            window.playerInventory.consumables.elixir = (window.playerInventory.consumables.elixir || 0) + 1;
            window.playerInventory.materials.ancient_relic = (window.playerInventory.materials.ancient_relic || 0) + 1;
            window.playerGil = (window.playerGil || 500) + 400;
            updateGilTelemetry();
          }
        }

        // 4. Herb Gathering in Forest
        if (!interacted && curWorld.herbNode && !curWorld.herbNode.gathered && Math.hypot(playerX - curWorld.herbNode.x, playerY - curWorld.herbNode.y) < 55) {
          interacted = true;
          curWorld.herbNode.gathered = true;
          sfx.playHeal();
          combatVfx.addBurst(curWorld.herbNode.x, curWorld.herbNode.y, '#22c55e', 14, 3);
          combatVfx.addText('🌿 +2 FOREST HERBS!', curWorld.herbNode.x, curWorld.herbNode.y - 20, '#4ade80', true);

          window.playerInventory.materials.forest_herb = (window.playerInventory.materials.forest_herb || 0) + 2;
        }

        // 5. Dungeon Entrance from Forest
        if (!interacted && currentMapId === 'forest' && Math.hypot(playerX - 1600, playerY - 280) < 70) {
          interacted = true;
          switchMap('dungeon', 960, 1600);
        }

        // 6. Exit Dungeon to Forest
        if (!interacted && currentMapId === 'dungeon' && Math.hypot(playerX - 960, playerY - 1680) < 70) {
          interacted = true;
          switchMap('forest', 1600, 360);
        }

        // 7. Attack Slash if no interaction
        if (!interacted) {
          triggerPlayerSlash();
        }
      }
    }
  }
});

window.addEventListener('keyup', (e) => {
  const m = keyMap[e.code];
  if (m) {
    keys[m.prop] = false;
    const el = document.getElementById(m.elemId);
    if (el) el.classList.remove('pressed');
  }
});

// Pointer click on canvas to trigger sword slash & combo in exploration mode
canvas.addEventListener('pointerdown', (e) => {
  if (currentMode === 'exploration') {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const curWorld = getCurrentWorld();
    let camX = Math.round(canvas.width / 2 - playerX);
    let camY = Math.round(canvas.height / 2 - playerY);
    if (canvas.width < curWorld.width) {
      camX = Math.min(0, Math.max(canvas.width - curWorld.width, camX));
    } else {
      camX = Math.round((canvas.width - curWorld.width) / 2);
    }
    if (canvas.height < curWorld.height) {
      camY = Math.min(0, Math.max(canvas.height - curWorld.height, camY));
    } else {
      camY = Math.round((canvas.height - curWorld.height) / 2);
    }
    const worldClickX = clickX - camX;
    const worldClickY = clickY - camY;
    const diffX = worldClickX - playerX;
    const diffY = worldClickY - playerY;
    if (Math.hypot(diffX, diffY) > 20) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        playerDir = diffX > 0 ? 'right' : 'left';
      } else {
        playerDir = diffY > 0 ? 'down' : 'up';
      }
    }
    triggerPlayerSlash();
  }
});

// Click on HUD action button for slash
const btnHudSlash = document.getElementById('btn-hud-slash');
if (btnHudSlash) {
  btnHudSlash.addEventListener('click', () => {
    if (currentMode === 'exploration') {
      triggerPlayerSlash();
    } else if (currentMode === 'battle') {
      if (battleEngine.turn === 'player') {
        battleEngine.executePhysicalAttack();
      }
    }
  });
}

// ================= Cached Telemetry DOM References (queried once, not every frame) =================
const _cachedTele = {
  dir: document.getElementById('tele-dir'),
  state: document.getElementById('tele-state'),
  speed: document.getElementById('tele-speed'),
  weapon: document.getElementById('tele-weapon'),
  gil: document.getElementById('tele-gil'),
  level: document.getElementById('tele-level')
};
let _telemetryFrame = 0;

// ================= Field Player Movement Logic =================
function updatePlayerExploration() {
  // Update Attack State & Progress
  if (playerAttackState.isAttacking) {
    const elapsed = Date.now() - playerAttackState.startTime;
    playerAttackState.progress = Math.min(1, elapsed / playerAttackState.duration);
    if (elapsed >= playerAttackState.duration) {
      playerAttackState.isAttacking = false;
      playerAttackState.progress = 0;
    }
  }

  let dx = 0, dy = 0;
  if (keys.up) dy -= 1;
  if (keys.down) dy += 1;
  if (keys.left) dx -= 1;
  if (keys.right) dx += 1;

  if (dx > 0) playerDir = 'right';
  else if (dx < 0) playerDir = 'left';
  else if (dy > 0) playerDir = 'down';
  else if (dy < 0) playerDir = 'up';

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  let speed = keys.shift ? 6.5 : 3.5;
  if (playerAttackState.isAttacking) {
    speed *= 0.25; // deliberate momentum during heavy weapon swings
  }
  playerVx = dx * speed;
  playerVy = dy * speed;

  playerX += playerVx;
  playerY += playerVy;

  const curWorld = getCurrentWorld();

  playerX = Math.max(30, Math.min(curWorld.width - 30, playerX));
  const minY = (currentMapId === 'village') ? 430 : 40;
  playerY = Math.max(minY, Math.min(curWorld.height - 40, playerY));

  // Solid building collision in Village to prevent top screen trap
  if (currentMapId === 'village') {
    const buildings = [
      { x1: 60, x2: 440, y1: 270, y2: 430 },
      { x1: 560, x2: 940, y1: 270, y2: 430 },
      { x1: 1060, x2: 1540, y1: 250, y2: 430 }
    ];
    for (const b of buildings) {
      if (playerX >= b.x1 && playerX <= b.x2 && playerY >= b.y1 && playerY <= b.y2) {
        playerY = b.y2 + 2;
      }
    }
  }

  // Solid Tree Trunk Obstacle Collision across maps (Prevents walking through trees!)
  if (curWorld.pixelTrees) {
    curWorld.pixelTrees.forEach(t => {
      // Tree trunk base is located at (t.x, t.y - 12)
      const trunkX = t.x;
      const trunkY = t.y - 12;
      const dist = Math.hypot(playerX - trunkX, (playerY - trunkY) * 1.3);
      const colRadius = 26;
      if (dist < colRadius) {
        const angle = Math.atan2((playerY - trunkY) * 1.3, playerX - trunkX);
        playerX = trunkX + Math.cos(angle) * colRadius;
        playerY = trunkY + (Math.sin(angle) * colRadius) / 1.3;
      }
    });
  }

  // Tree Stump Obstacle Collision in Village (1150, 700)
  if (currentMapId === 'village') {
    const stumpDist = Math.hypot(playerX - 1150, (playerY - 700) * 1.25);
    if (stumpDist < 26) {
      const angle = Math.atan2((playerY - 700) * 1.25, playerX - 1150);
      playerX = 1150 + Math.cos(angle) * 26;
      playerY = 700 + (Math.sin(angle) * 26) / 1.25;
    }
  }

  // Solid Stone Torch Pillar Collision in Dungeon
  if (curWorld.terrainType === 'dungeon' && curWorld.torches) {
    curWorld.torches.forEach(t => {
      const dist = Math.hypot(playerX - t.x, (playerY - t.y) * 1.25);
      const colRadius = 24;
      if (dist < colRadius) {
        const angle = Math.atan2((playerY - t.y) * 1.25, playerX - t.x);
        playerX = t.x + Math.cos(angle) * colRadius;
        playerY = t.y + (Math.sin(angle) * colRadius) / 1.25;
      }
    });
  }

  // Seamless Map Transitions between Village and Forest
  if (currentMapId === 'village' && playerX > curWorld.width - 45) {
    switchMap('forest', 60, playerY);
  } else if (currentMapId === 'forest' && playerX < 45) {
    switchMap('village', curWorld.width - 60, playerY);
  }

  // Coin Collection in Village
  if (curWorld.coins) {
    curWorld.coins.forEach(c => {
      if (!c.collected && Math.hypot(playerX - c.x, playerY - c.y) < 22) {
        c.collected = true;
        sfx.playCoin();
        combatVfx.addBurst(c.x, c.y, '#fde047', 10, 3);
        combatVfx.addText('+50 GIL 🪙', c.x, c.y - 15, '#fde047');
        window.playerGil = (window.playerGil || 500) + 50;
        updateGilTelemetry();
      }
    });
  }

  if (playerAttackState.isAttacking) {
    playerState = 'attack';
  } else if (dx === 0 && dy === 0) {
    playerState = 'idle';
    animFrame = 0;
  } else {
    playerState = keys.shift ? 'run' : 'walk';
    animFrame += keys.shift ? 0.28 : 0.18;
    if (Math.random() < 0.2) combatVfx.addDust(playerX, playerY);
  }

  // Check collision with roaming monsters on map
  curWorld.monsters.forEach(m => {
    if (!m.defeated) {
      const dist = Math.hypot(playerX - m.x, playerY - m.y);
      if (dist < (m.isBoss ? 55 : 32)) {
        m.defeated = true;
        sfx.playHit();
        switchMode('battle', m.element);
      }
    }
  });

  // Telemetry updates — throttled to every 6 frames (avoid DOM access 60x/sec)
  _telemetryFrame = (_telemetryFrame || 0) + 1;
  if (_telemetryFrame >= 12) { // Throttled: update DOM every 12 frames (~5Hz) to reduce layout cost
    _telemetryFrame = 0;
    const dirNames = { 'down': 'SOUTH (↓)', 'up': 'NORTH (↑)', 'left': 'WEST (←)', 'right': 'EAST (→)' };
    if (_cachedTele.dir) _cachedTele.dir.textContent = dirNames[playerDir] || 'SOUTH (↓)';
    if (_cachedTele.state) _cachedTele.state.textContent = playerState.toUpperCase();
    if (_cachedTele.speed) _cachedTele.speed.textContent = `${Math.round(Math.hypot(playerVx, playerVy) * 60)} px/s`;
    if (_cachedTele.weapon && window.equippedWeapon) _cachedTele.weapon.textContent = `🗡️ ${window.equippedWeapon.name}`;
    if (_cachedTele.gil) _cachedTele.gil.textContent = `${window.playerGil || 500} 🪙`;
    if (_cachedTele.level && battleEngine.party[0]) _cachedTele.level.textContent = battleEngine.party[0].level;
  }
}

// ================= Unified Game Loop (Perf-Optimized) =================
// FPS cap: 60fps target — prevents CPU/GPU spin on high-refresh displays
let _loopLastTime = 0;
const _LOOP_FRAME_MIN = 1000 / 61; // ~16.4ms

function gameLoop(time) {
  // Hard 60fps cap
  const _delta = time - _loopLastTime;
  if (_delta < _LOOP_FRAME_MIN - 0.5) {
    requestAnimationFrame(gameLoop);
    return;
  }
  _loopLastTime = time - (_delta % _LOOP_FRAME_MIN);

  if (currentMode === 'exploration') {
    updatePlayerExploration();
    combatVfx.update();

    const curWorld = getCurrentWorld();
    ctx.fillStyle = (curWorld.terrainType === 'dungeon') ? '#020617' : (curWorld.terrainType === 'isometric' ? '#abd551' : '#278334');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let camX = Math.round(canvas.width / 2 - playerX);
    let camY = Math.round(canvas.height / 2 - playerY);

    if (canvas.width < curWorld.width) {
      camX = Math.min(0, Math.max(canvas.width - curWorld.width, camX));
    } else {
      camX = Math.round((canvas.width - curWorld.width) / 2);
    }

    if (canvas.height < curWorld.height) {
      camY = Math.min(0, Math.max(canvas.height - curWorld.height, camY));
    } else {
      camY = Math.round((canvas.height - curWorld.height) / 2);
    }

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.translate(camX, camY);

    curWorld.draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir);

    combatVfx.draw(ctx);
    ctx.restore();

    // Dungeon lighting — only when in dungeon mode
    if (curWorld.terrainType === 'dungeon') {
      dungeonLightingEngine.renderLighting(ctx, time, curWorld, playerX, playerY, camX, camY);
    }
  } else {
    // Battle Mode
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    combatVfx.update();
    battleEngine.drawArena(ctx);
    combatVfx.draw(ctx);
  }

  requestAnimationFrame(gameLoop);
}

// Expose globally so perf_bgm_patch.js can override if needed
window.gameLoop = gameLoop;
requestAnimationFrame(gameLoop);

// Bulletproof Shop Opener & Controller
function openShop() {
  const sm = document.getElementById('shop-menu');
  if (!sm) return;
  const db = document.getElementById('dialog-box');
  if (db) db.style.display = 'none';
  renderShopUI();
  switchShopTab('items');
  updateGilTelemetry();
  sm.style.display = 'flex';
  sfx.playHeal();
}

const btnOpenShop = document.getElementById('btn-dialog-open-shop');
if (btnOpenShop) {
  btnOpenShop.addEventListener('click', openShop);
}

document.getElementById('btn-close-shop').addEventListener('click', () => {
  document.getElementById('shop-menu').style.display = 'none';
  document.getElementById('dialog-box').style.display = 'none';
});

// ================= Gil & Shop Telemetry System =================
function updateGilTelemetry() {
  const gilEl = document.getElementById('shop-gil-count');
  if (gilEl) gilEl.textContent = window.playerGil || 500;

  const teleGil = document.getElementById('tele-gil');
  if (teleGil) teleGil.textContent = `${window.playerGil || 500} 🪙`;

  const menuGil = document.getElementById('menu-gil-count');
  if (menuGil) menuGil.textContent = window.playerGil || 500;

  const teleWeapon = document.getElementById('tele-weapon');
  if (teleWeapon && window.equippedWeapon) {
    teleWeapon.textContent = `🗡️ ${window.equippedWeapon.name}`;
  }

  const eqName = document.getElementById('shop-equipped-name');
  if (eqName && window.equippedWeapon) {
    eqName.textContent = window.equippedWeapon.name;
  }

  const eqAtk = document.getElementById('shop-equipped-atk');
  if (eqAtk && window.equippedWeapon) {
    eqAtk.textContent = `+${window.equippedWeapon.atk} ATK`;
  }
}

// ================= Dynamic RPG Shop (BUY & SELL System) =================
function renderShopUI() {
  updateGilTelemetry();

  // 1. Render Items Buy Container
  const itemsContainer = document.getElementById('shop-items-container');
  if (itemsContainer) {
    itemsContainer.innerHTML = ITEMS_DB.map(item => {
      const ownedCount = window.playerInventory.consumables[item.id] || 0;
      const canAfford = (window.playerGil || 0) >= item.price;
      return `
        <div class="shop-card">
          <div class="shop-card-icon-box">
            <img src="${item.iconFile}" class="shop-card-icon-img" alt="${item.name}">
          </div>
          <div class="shop-card-info">
            <div class="shop-card-title-row">
              <span class="shop-card-title">${item.name}</span>
            </div>
            <div class="shop-card-desc">${item.desc}</div>
            <div class="shop-card-stat">มีอยู่ในกระเป๋า: <b style="color: #38bdf8;">x${ownedCount}</b></div>
          </div>
          <button class="shop-card-btn" data-shop-action="buy-item" data-item-id="${item.id}" data-price="${item.price}" ${!canAfford ? 'style="opacity: 0.6;"' : ''}>
            🪙 ${item.price} GIL
          </button>
        </div>
      `;
    }).join('');
  }

  // 2. Render Weapons Buy Container
  const weaponsContainer = document.getElementById('shop-weapons-container');
  if (weaponsContainer) {
    weaponsContainer.innerHTML = WEAPONS_DB.map(w => {
      const isEquipped = window.equippedWeapon && window.equippedWeapon.id === w.id;
      const isOwned = w.owned;
      const canAfford = (window.playerGil || 0) >= w.price;

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="shop-card-btn btn-equipped" disabled>✓ สวมใส่อยู่</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="shop-card-btn btn-equip" data-shop-action="equip-weapon" data-weapon-id="${w.id}">⚔️ สวมใส่</button>`;
      } else {
        btnHtml = `<button class="shop-card-btn" data-shop-action="buy-weapon" data-weapon-id="${w.id}" data-price="${w.price}" ${!canAfford ? 'style="opacity: 0.6;"' : ''}>🪙 ${w.price} GIL</button>`;
      }

      return `
        <div class="shop-card ${isEquipped ? 'equipped-card' : ''}">
          <div class="shop-card-icon-box">
            ${w.iconFile ? `<img src="${w.iconFile}" class="shop-card-icon-img" alt="${w.name}">` : `<div class="weapon-sprite-icon" style="background-position: -${w.col * 32}px -${w.row * 32}px;"></div>`}
          </div>
          <div class="shop-card-info">
            <div class="shop-card-title-row">
              <span class="shop-card-title">${w.name}</span>
              <span class="shop-badge ${w.badge}">${w.badgeText}</span>
            </div>
            <div class="shop-card-desc">${w.desc}</div>
            <div class="shop-card-stat">ประเภท: <b>${w.type}</b> | พลังโจมตี: <b style="color: #4ade80;">+${w.atk} ATK</b></div>
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');
  }

  // 3. Render Sell Container (Materials & Surplus Consumables)
  const sellContainer = document.getElementById('shop-sell-container');
  if (sellContainer) {
    const sellMaterials = MATERIALS_DB.map(mat => {
      const count = window.playerInventory.materials[mat.id] || 0;
      return `
        <div class="shop-card">
          <div class="shop-card-icon-box">
            <img src="${mat.iconFile}" class="shop-card-icon-img" alt="${mat.name}">
          </div>
          <div class="shop-card-info">
            <div class="shop-card-title-row">
              <span class="shop-card-title">${mat.name}</span>
              <span class="shop-badge badge-legend">MATERIAL</span>
            </div>
            <div class="shop-card-desc">${mat.desc}</div>
            <div class="shop-card-stat">มีอยู่: <b style="color: #38bdf8;">x${count}</b> | ราคาขาย: <b style="color: #facc15;">${mat.sellPrice} Gil</b></div>
          </div>
          <button class="shop-card-btn btn-sell" data-shop-action="sell-material" data-mat-id="${mat.id}" data-sell-price="${mat.sellPrice}" ${count <= 0 ? 'disabled style="opacity: 0.4;"' : ''}>
            💰 ขาย (${mat.sellPrice} Gil)
          </button>
        </div>
      `;
    }).join('');

    const sellConsumables = ITEMS_DB.map(item => {
      const count = window.playerInventory.consumables[item.id] || 0;
      const sellPrice = Math.round(item.price * 0.5);
      return `
        <div class="shop-card">
          <div class="shop-card-icon-box">
            <img src="${item.iconFile}" class="shop-card-icon-img" alt="${item.name}">
          </div>
          <div class="shop-card-info">
            <div class="shop-card-title-row">
              <span class="shop-card-title">${item.name}</span>
            </div>
            <div class="shop-card-desc">${item.desc}</div>
            <div class="shop-card-stat">มีอยู่: <b style="color: #38bdf8;">x${count}</b> | ราคาขาย: <b style="color: #facc15;">${sellPrice} Gil</b></div>
          </div>
          <button class="shop-card-btn btn-sell" data-shop-action="sell-item" data-item-id="${item.id}" data-sell-price="${sellPrice}" ${count <= 0 ? 'disabled style="opacity: 0.4;"' : ''}>
            💰 ขาย (${sellPrice} Gil)
          </button>
        </div>
      `;
    }).join('');

    sellContainer.innerHTML = sellMaterials + sellConsumables;
  }
}

// Shop Tabs Navigation
const tabBtnItems = document.getElementById('tab-btn-items');
const tabBtnWeapons = document.getElementById('tab-btn-weapons');
const tabBtnSell = document.getElementById('tab-btn-sell');
const shopContentItems = document.getElementById('shop-content-items');
const shopContentWeapons = document.getElementById('shop-content-weapons');
const shopContentSell = document.getElementById('shop-content-sell');

function switchShopTab(tab) {
  if (tabBtnItems) tabBtnItems.classList.toggle('active', tab === 'items');
  if (tabBtnWeapons) tabBtnWeapons.classList.toggle('active', tab === 'weapons');
  if (tabBtnSell) tabBtnSell.classList.toggle('active', tab === 'sell');

  if (shopContentItems) shopContentItems.style.display = tab === 'items' ? 'block' : 'none';
  if (shopContentWeapons) shopContentWeapons.style.display = tab === 'weapons' ? 'block' : 'none';
  if (shopContentSell) shopContentSell.style.display = tab === 'sell' ? 'block' : 'none';
}

if (tabBtnItems) tabBtnItems.addEventListener('click', () => switchShopTab('items'));
if (tabBtnWeapons) tabBtnWeapons.addEventListener('click', () => switchShopTab('weapons'));
if (tabBtnSell) tabBtnSell.addEventListener('click', () => switchShopTab('sell'));

// Shop Action Delegations (Buy items, buy weapons, equip weapons, sell items & materials)
const shopMenuEl = document.getElementById('shop-menu');
if (shopMenuEl) {
  shopMenuEl.addEventListener('click', (e) => {
    const target = e.target.closest('[data-shop-action]');
    if (!target) return;

    const action = target.getAttribute('data-shop-action');

    // 1. Buy Item
    if (action === 'buy-item') {
      const itemId = target.getAttribute('data-item-id');
      const price = parseInt(target.getAttribute('data-price'), 10);
      if ((window.playerGil || 0) >= price) {
        window.playerGil -= price;
        window.playerInventory.consumables[itemId] = (window.playerInventory.consumables[itemId] || 0) + 1;
        sfx.playCoin();
        combatVfx.addBurst(playerX, playerY, '#38bdf8', 16, 4);
        combatVfx.addText(`+1 ${itemId.toUpperCase()}! 🧪`, playerX, playerY - 30, '#38bdf8', true);
        renderShopUI();
      } else {
        sfx.playHit();
        combatVfx.addText('⚠️ GIL ไม่เพียงพอ!', playerX, playerY - 30, '#ef4444', true);
      }
    }

    // 2. Buy Weapon
    else if (action === 'buy-weapon') {
      const weaponId = target.getAttribute('data-weapon-id');
      const price = parseInt(target.getAttribute('data-price'), 10);
      const weapon = WEAPONS_DB.find(w => w.id === weaponId);
      if (weapon && (window.playerGil || 0) >= price) {
        window.playerGil -= price;
        weapon.owned = true;
        window.equippedWeapon = weapon;
        sfx.playWeaknessHit();
        triggerScreenFlash();
        combatVfx.addBurst(playerX, playerY, '#facc15', 25, 6);
        combatVfx.addText(`⚔️ ได้รับ ${weapon.name}!`, playerX, playerY - 30, '#facc15', true);
        renderShopUI();
      } else {
        sfx.playHit();
        combatVfx.addText('⚠️ GIL ไม่เพียงพอสำหรับอาวุธนี้!', playerX, playerY - 30, '#ef4444', true);
      }
    }

    // 3. Equip Weapon
    else if (action === 'equip-weapon') {
      const weaponId = target.getAttribute('data-weapon-id');
      const weapon = WEAPONS_DB.find(w => w.id === weaponId);
      if (weapon && weapon.owned) {
        window.equippedWeapon = weapon;
        sfx.playSlash();
        combatVfx.addBurst(playerX, playerY, '#60a5fa', 14, 4);
        combatVfx.addText(`⚔️ สวมใส่ ${weapon.name}! (+${weapon.atk} ATK)`, playerX, playerY - 30, '#60a5fa', true);
        renderShopUI();
      }
    }

    // 4. Sell Material
    else if (action === 'sell-material') {
      const matId = target.getAttribute('data-mat-id');
      const sellPrice = parseInt(target.getAttribute('data-sell-price'), 10);
      if ((window.playerInventory.materials[matId] || 0) > 0) {
        window.playerInventory.materials[matId]--;
        window.playerGil = (window.playerGil || 500) + sellPrice;
        sfx.playCoin();
        combatVfx.addBurst(playerX, playerY, '#facc15', 14, 4);
        combatVfx.addText(`+${sellPrice} GIL 🪙`, playerX, playerY - 30, '#facc15', true);
        renderShopUI();
      }
    }

    // 5. Sell Item
    else if (action === 'sell-item') {
      const itemId = target.getAttribute('data-item-id');
      const sellPrice = parseInt(target.getAttribute('data-sell-price'), 10);
      if ((window.playerInventory.consumables[itemId] || 0) > 0) {
        window.playerInventory.consumables[itemId]--;
        window.playerGil = (window.playerGil || 500) + sellPrice;
        sfx.playCoin();
        combatVfx.addBurst(playerX, playerY, '#facc15', 14, 4);
        combatVfx.addText(`+${sellPrice} GIL 🪙`, playerX, playerY - 30, '#facc15', true);
        renderShopUI();
      }
    }
  });
}

// Terrain Switcher
document.querySelectorAll('#terrain-selector-hud .terrain-hud-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#terrain-selector-hud .terrain-hud-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const terrain = btn.getAttribute('data-terrain');
    villageWorld.terrainType = terrain;
    forestWorld.terrainType = terrain;
    sfx.playHeal();
    combatVfx.addBurst(playerX, playerY, '#10b981', 20, 5);
    combatVfx.addText(`🗺️ รูปแบบพื้นผิว: ${terrain === 'isometric' ? 'Isometric 2.5D' : 'Harvest 2D'}`, playerX, playerY - 40, '#4ade80', true);
  });
});

// Initial Setup
renderShopUI();
updateGilTelemetry();

// ========================================================
// 10-FLOORS DUNGEON CRAWLER, ROGUELITE REWARDS & PROLOGUE
// ========================================================

window.dungeonState = {
  currentFloor: 1,
  maxUnlockedFloor: 1,
  hasAwakened: false,
  clearedFloors: {}, // Tracks floors cleared of all monsters
  // Tifa: B2F clear | Vivi: B3F clear | Cecil: B7F clear | Aeris: B9F clear | Chrono: B10F enter
  rescued: { tifa: false, vivi: false, cecil: false, aeris: false, chrono: false }
};

const FLOOR_DEFINITIONS = {
  1: {
    name: 'B1F: Cell of Awakening (ห้องขังแห่งการตื่นรู้)',
    shortName: 'B1F: CELL',
    subtitle: 'ห้องขังแห่งการตื่นรู้ (Cloud Solo Start)',
    goal: 'ภารกิจ: สังหารมอนสเตอร์ & หาบันไดลงสู่ชั้น B2F'
  },
  2: {
    name: 'B2F: Crypt of the Fallen (สุสานผู้ถูกลืม)',
    shortName: 'B2F: CRYPT',
    subtitle: 'สุสานโบราณ (กำจัดมอนสเตอร์เพื่อช่วย Tifa Lockhart)',
    goal: 'ภารกิจ: สังหารมอนสเตอร์ทั้งหมดในสุสาน B2F เพื่อช่วย Tifa & เปิดทางลงสู่ชั้น B3F'
  },
  3: {
    name: 'B3F: Subterranean Caverns (ถ้ำหินงอกใต้พิภพ)',
    shortName: 'B3F: CAVERN',
    subtitle: 'ถ้ำผลึกคริสตัล (กำจัดมอนสเตอร์เพื่อสลายบาเรียช่วย Vivi)',
    goal: 'ภารกิจ: กำจัดมอนสเตอร์ในถ้ำ B3F เพื่อช่วย Vivi & มุ่งหน้าสู่ป้อมปราการ B4F'
  },
  4: {
    name: 'B4F: Gate of the Colossus (ป้อมปราการผู้พิทักษ์)',
    shortName: 'B4F: CITADEL',
    subtitle: 'ป้อมปราการผู้พิทักษ์ (Mini-Boss Iron Golem)',
    goal: 'ภารกิจ: โค่นล้ม Mini-Boss Golem เพื่อเปิดทางขึ้นสู่ Safe Haven B5F!'
  },
  5: {
    name: 'B5F: Midgar Edge Haven (หมู่บ้านลี้ภัยใต้พิภพ)',
    shortName: 'B5F: HAVEN',
    subtitle: '⭐ SAFE POINT! (ร้านค้า Anna, กองไฟฟื้นพลัง, แท่นวาร์ป)',
    goal: 'ภารกิจ: พักฟื้นที่กองไฟ, แวะร้านค้า Anna หรือใช้วาร์ปสู่ชั้น B6F'
  },
  6: {
    name: 'B6F: Magma Crucible (เตาหลอมแมกม่า)',
    shortName: 'B6F: MAGMA',
    subtitle: 'เตาหลอมแมกม่าและอสูรเพลิง',
    goal: 'ภารกิจ: ฝ่าธารลาวา & กำจัดอสูรเพลิงเพื่อลงสู่ชั้น B7F'
  },
  7: {
    name: 'B7F: Frostfang Hollows (หุบผาเหมันต์)',
    shortName: 'B7F: FROST',
    subtitle: 'หุบผาเหมันต์และอสูรน้ำแข็ง',
    goal: 'ภารกิจ: ฝ่าหุบเขาเยือกแข็ง & หาบันไดลงสู่ชั้น B8F'
  },
  8: {
    name: 'B8F: Abyssal Vault (สุสานวิญญาณแห่งความมืด)',
    shortName: 'B8F: VAULT',
    subtitle: 'ห้องนิรภัยใต้บาดาลและวิญญาณทมิฬ',
    goal: 'ภารกิจ: เปิดหีบสมบัติโบราณ & ก้าวเข้าสู่รังมังกร B9F'
  },
  9: {
    name: "B9F: Dragon's Maw (รังมังกรบรรพกาล)",
    shortName: "B9F: DRAGON",
    subtitle: 'รังมังกรบรรพกาล (Ancient Red Dragon Elite Boss)',
    goal: 'ภารกิจ: ปราบ Ancient Red Dragon เพื่อเปิดประตูมิติสู่ชั้น B10F!'
  },
  10: {
    name: 'B10F: Throne of the Void (บัลลังก์แห่งความว่างเปล่า)',
    shortName: 'B10F: VOID',
    subtitle: '👑 FINAL BATTLE! (Bahamut Zero)',
    goal: 'ภารกิจ: โค่นล้ม Bahamut Zero เพื่อจบมหาดันเจี้ยนและกอบกู้ชัยชนะ!'
  }
};

function updateFloorBanner(floorNum) {
  const def = FLOOR_DEFINITIONS[floorNum] || FLOOR_DEFINITIONS[1];
  const titleEl = document.getElementById('floor-badge-title');
  const subEl = document.getElementById('floor-badge-sub');
  const questEl = document.getElementById('quest-text');
  const iconEl = document.getElementById('floor-badge-icon');
  const miniTag = document.getElementById('minimap-location-tag');

  const curWorld = (typeof getCurrentWorld === 'function') ? getCurrentWorld() : null;
  const isCleared = !!window.dungeonState?.clearedFloors?.[floorNum];
  const remaining = (curWorld && curWorld.monsters) ? curWorld.monsters.filter(m => !m.defeated).length : 0;

  if (titleEl) titleEl.textContent = def.name;
  if (subEl) subEl.textContent = def.subtitle;
  if (questEl) {
    if (isCleared || remaining === 0) {
      questEl.innerHTML = `<span style="color: #4ade80;">✨ [ROOM CLEARED] เคลียร์ห้องแล้ว! ทางลงเปิดตลอดเวลา (ขึ้น-ลงได้อิสระ)</span>`;
    } else {
      questEl.innerHTML = `${def.goal} — <b style="color: #f87171;">[🔒 ล็อกห้อง: เหลื้อมอนสเตอร์ ${remaining} ตัว]</b>`;
    }
  }
  if (iconEl) iconEl.textContent = (floorNum === 5) ? '🏡' : (floorNum === 10) ? '👑' : '🏰';
  if (miniTag) miniTag.textContent = def.shortName;

  // Highlight active floor in World Map tab
  document.querySelectorAll('#dungeon-floors-list .zone-item').forEach(item => {
    const f = parseInt(item.getAttribute('data-floor'), 10);
    if (f === floorNum) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function goToFloor(floorNum, spawnX = null, spawnY = null) {
  window.dungeonState.currentFloor = floorNum;
  window.dungeonState.maxUnlockedFloor = Math.max(window.dungeonState.maxUnlockedFloor || 1, floorNum);

  if (floorNum === 5) {
    // Village is Floor 5 (Safe Haven)
    switchMap('village', spawnX || 960, spawnY || 560);
  } else {
    // Other floors use dungeonWorld
    dungeonWorld.loadFloor(floorNum);
    switchMap('dungeon', spawnX || dungeonWorld.spawnX, spawnY || dungeonWorld.spawnY);
  }

  updateFloorBanner(floorNum);
  sfx.playDungeonDescend();
  triggerScreenFlash();
  combatVfx.addBurst(playerX, playerY, '#38bdf8', 25, 5);

  // Auto-unlock party members when arriving at specific floors
  checkFloorPartyUnlock(floorNum);
}

function triggerAwakeningPrologue() {
  window.dungeonState.hasAwakened = true;
  // Solo Cloud start
  battleEngine.party = [window.characterRoster.cloud];

  goToFloor(1, 700, 750);

  const db = document.getElementById('dialog-box');
  const dImg = document.getElementById('dialog-portrait');
  const dName = document.getElementById('dialog-name');
  const dRole = document.getElementById('dialog-role');
  const dText = document.getElementById('dialog-text');
  const dShopBtn = document.getElementById('btn-dialog-open-shop');
  const dPrompt = document.getElementById('dialog-prompt-text');

  if (db && dImg && dName && dRole && dText) {
    db.style.display = 'block';
    if (dShopBtn) dShopBtn.style.display = 'none';
    dImg.src = 'portraits/portrait_cloud.jpg';
    dName.textContent = 'Cloud Stif';
    dRole.textContent = 'HERO AWAKENED';
    dText.innerHTML = `
      <b>...อึก... ที่นี่มันที่ไหนกัน...? ทำไมหัวฉันถึงปวดร้าวขนาดนี้...</b><br><br>
      ...เดี๋ยวนะ! ภาพความทรงจำเริ่มวาบเข้ามาในหัว... จำได้แล้ว!<br>
      นี่เราเคยชำนาญเพลงดาบ <b>[Braver]</b>... และยังรู้วิธีร่ายมนตราเพลิง <b>[Fire]</b> ได้นี่นา!<br><br>
      <i>"จำได้แล้วว่าใช้ท่าพวกนี้ได้... เราไม่ได้ไร้ทางสู้สักหน่อย! สัญชาตญาณ SOLDIER ในตัวกำลังตื่นขึ้นมาแล้ว!"</i>
    `;
    if (dPrompt) dPrompt.textContent = '▼ [SPACE] ปลดล็อคท่า [Braver] และเวท [Fire] สำเร็จ! ก้าวสู่ B1F';
  }

  sfx.playDungeonDescend();
  combatVfx.addBurst(playerX, playerY, '#38bdf8', 25, 5);
  combatVfx.addText('⚔️ CLOUD ตื่นขึ้นในห้องขัง B1F!', playerX, playerY - 35, '#38bdf8', true);
}

// Generic companion rescue/unlock function
// Works for tifa, vivi, cecil, aeris, chrono
function rescueCompanion(companionId) {
  if (!window.characterRoster[companionId]) return;
  if (window.dungeonState.rescued[companionId]) return; // already rescued

  window.dungeonState.rescued[companionId] = true;
  const hero = window.characterRoster[companionId];

  // Add to party if < 4 active, otherwise stay in reserve
  const MAX_ACTIVE = 4;
  if (!battleEngine.party.some(m => m.id === companionId)) {
    if (battleEngine.party.length < MAX_ACTIVE) {
      battleEngine.party.push(hero);
    }
    // else they go into reserve (accessible via main menu)
  }

  // Dialog data for each companion
  const companionDialogData = {
    tifa: {
      portrait: 'portraits/portrait_tifa.jpg',
      name: 'Fata Lockhart',
      role: 'MONK — B2F',
      color: '#ec4899',
      text: `<b>คลาวด์! ในที่สุดนายก็มาถึง!</b><br><br>
        ขอบคุณมากนะที่ช่วยกำจัดมอนสเตอร์ในสุสานจนหมด กรงขังถึงยอมเปิดออก!<br>
        ตอนนี้ร่างกายฉันฟื้นพลังเต็มที่แล้ว เราสองคนร่วมมือกันไม่มีอะไรต้องกลัว ลุยกันต่อเลย!`,
      prompt: '▼ [SPACE] Fata Lv.3 เข้าร่วมทีมรบ! (สกิล: Beat Rush + Somersault [พร้อมใช้ทันที])',
      joinText: '🥊 FATA LOCKHART เข้าร่วมทีมรบ!'
    },
    vivi: {
      portrait: 'portraits/portrait_vivi.jpg',
      name: 'Vivi Spellcraft',
      role: 'BLACK MAGE — B3F',
      color: '#38bdf8',
      text: `<b>วะ... ว้าว! ขอบคุณท่านอัศวินมากครับ!</b><br><br>
        บาเรียเวทมนตร์สลายไปแล้วเพราะท่านกำจัดมอนสเตอร์ในถ้ำจนหมด!<br>
        ขอผมร่วมทางไปด้วยนะ ผมมีเวทมนตร์ไฟ น้ำแข็ง และสายฟ้าคอยซัพพอร์ตทีมครับ!`,
      prompt: '▼ [SPACE] Vivi Lv.5 เข้าร่วมทีมรบ! (สกิล: Fire + Blizzard + Thunder)',
      joinText: '🧙 VIVI SPELLCRAFT เข้าร่วมทีมรบ!'
    },
    cecil: {
      portrait: 'portraits/portrait_cecil.jpg',
      name: 'Sir Cecilo',
      role: 'PALADIN — B7F',
      color: '#a78bfa',
      text: `<b>...หยุด! ใครกัน... เพื่อนหรือศัตรู?</b><br><br>
        ข้าชื่อ Sir Cecilo อัศวินแสงผู้พิทักษ์แห่งอาณาจักร...<br>
        ถ้านายตั้งใจสู้เพื่อกอบกู้มิติแห่งนี้จริง ดาบศักดิ์สิทธิ์ของข้าพร้อมปกป้องทีม!`,
      prompt: '▼ [SPACE] Sir Cecilo Lv.7 เข้าร่วมทีมรบ! (สกิล: Holy Blade + Cover [Lv.7])',
      joinText: '🛡️ SIR CECILO เข้าร่วมทีมรบ!'
    },
    aeris: {
      portrait: 'portraits/portrait_aeris.jpg',
      name: 'Aera Starbloom',
      role: 'CETRA HEALER — B9F',
      color: '#34d399',
      text: `<b>ฉันรู้ว่านายจะมา... สายเลือดแห่งดวงดาวบอกฉัน</b><br><br>
        ชั้น B10F มีอะไรบางอย่างที่ยิ่งใหญ่มาก ฉันรู้สึกได้...<br>
        ฉันชื่อ Aera ให้ฉันนำทางและเยียวยาทีม เราต้องไปด้วยกัน!`,
      prompt: '▼ [SPACE] Aera Lv.9 เข้าร่วมทีมรบ! (สกิล: Cura + Seal Evil [Lv.9])',
      joinText: '🌸 AERA STARBLOOM เข้าร่วมทีมรบ!'
    },
    chrono: {
      portrait: 'portraits/portrait_chrono.jpg',
      name: 'Chronos Timekeeper',
      role: 'TIME BLADE HERO — B10F',
      color: '#facc15',
      text: `<b>...เราเจอกันอีกแล้ว ในกาลเวลาอื่น</b><br><br>
        ฉันชื่อ Chronos ผู้พิทักษ์กระแสมิติเวลา ถูกดึงมาที่นี่โดยชะตากรรม...<br>
        Bahamut Zero คือภัยคุกคามต่อทุกมิติ ฉันจะฟาดฟันเคียงข้างพวกนาย!`,
      prompt: '▼ [SPACE] Chronos Lv.10 เข้าร่วมทีมรบ! (ได้ทุกสกิลทันที!)',
      joinText: '⚡ CHRONOS TIMEKEEPER เข้าร่วมทีมรบ!'
    }
  };

  const data = companionDialogData[companionId];
  if (!data) return;

  const db = document.getElementById('dialog-box');
  const dImg = document.getElementById('dialog-portrait');
  const dName = document.getElementById('dialog-name');
  const dRole = document.getElementById('dialog-role');
  const dText = document.getElementById('dialog-text');
  const dShopBtn = document.getElementById('btn-dialog-open-shop');
  const dPrompt = document.getElementById('dialog-prompt-text');

  if (db && dImg && dName && dRole && dText) {
    db.style.display = 'block';
    if (dShopBtn) dShopBtn.style.display = 'none';
    dImg.src = data.portrait;
    dName.textContent = data.name;
    dRole.textContent = data.role;
    dText.innerHTML = data.text;
    if (dPrompt) dPrompt.textContent = data.prompt;
  }

  sfx.playLevelUp();
  combatVfx.addBurst(playerX, playerY, data.color, 30, 6);
  combatVfx.addText(data.joinText, playerX, playerY - 35, data.color, true);

  // Full heal for the new companion
  hero.hp = hero.maxHp;
  hero.mp = hero.maxMp;

  updateBattleHUD();
}

// Central floor clearing logic: checks if all monsters on current floor are defeated
function checkFloorClearStatus() {
  const curWorld = getCurrentWorld();
  if (!curWorld || currentMapId !== 'dungeon') return;
  const floor = curWorld.floor || window.dungeonState?.currentFloor || 1;

  if (window.dungeonState.clearedFloors?.[floor]) {
    return; // Already cleared
  }

  const allDefeated = curWorld.monsters && curWorld.monsters.length > 0 && curWorld.monsters.every(m => m.defeated);
  if (allDefeated) {
    window.dungeonState.clearedFloors[floor] = true;
    window.dungeonState.maxUnlockedFloor = Math.max(window.dungeonState.maxUnlockedFloor || 1, floor + 1);

    sfx.playLevelUp();
    triggerScreenFlash();
    combatVfx.addBurst(playerX, playerY, '#4ade80', 35, 6);
    combatVfx.addText(`✨ ROOM B${floor}F CLEARED! ทางลงเปิดตลอดเวลา (ขึ้น-ลงอิสระ)!`, playerX, playerY - 45, '#4ade80', true);

    // Automatic companion unlocks on room clear:
    if (floor === 2 && !window.dungeonState.rescued?.tifa) {
      setTimeout(() => {
        rescueCompanion('tifa');
      }, 700);
    } else if (floor === 3 && !window.dungeonState.rescued?.vivi) {
      setTimeout(() => {
        rescueCompanion('vivi');
      }, 700);
    } else if (floor === 4) {
      setTimeout(() => {
        showMissionComplete(4);
      }, 1000);
    } else if (floor === 7 && !window.dungeonState.rescued?.cecil) {
      setTimeout(() => {
        rescueCompanion('cecil');
      }, 700);
    } else if (floor === 9 && !window.dungeonState.rescued?.aeris) {
      setTimeout(() => {
        rescueCompanion('aeris');
      }, 700);
    }

    updateFloorBanner(floor);
  }
}

// Check if arriving at a floor should trigger an event (Floor 10 Chrono join)
function checkFloorPartyUnlock(floorNum) {
  if (floorNum === 10 && !window.dungeonState.rescued.chrono) {
    setTimeout(() => {
      rescueCompanion('chrono');
    }, 1500);
  }
}

function restAtCampfire() {
  battleEngine.party.forEach(m => {
    m.hp = m.maxHp;
    m.mp = m.maxMp;
  });
  Object.values(window.characterRoster).forEach(r => {
    r.hp = r.maxHp;
    r.mp = r.maxMp;
  });
  sfx.playFullHeal();
  triggerScreenFlash();
  combatVfx.addBurst(760, 520, '#10b981', 35, 7);
  combatVfx.addText('✨ FULL HEAL! พลังชีวิตและมานาฟื้นฟูเต็ม 100%!', 760, 480, '#4ade80', true);
}

function openHavenWaypointModal() {
  const modal = document.getElementById('haven-waypoint-modal');
  const grid = document.getElementById('waypoint-floors-grid');
  const btnClose = document.getElementById('btn-close-waypoint');
  if (!modal || !grid) return;

  grid.innerHTML = '';
  modal.style.display = 'flex';
  sfx.playOpenMenu();

  const maxF = Math.max(window.dungeonState.maxUnlockedFloor || 1, 6);
  for (let f = 1; f <= 10; f++) {
    const isUnlocked = f <= maxF;
    const isCurrent = f === 5;
    const btn = document.createElement('button');
    btn.className = `wp-floor-btn ${isUnlocked ? '' : 'locked'}`;
    const fNames = {
      1: 'B1F. Cell of Awakening',
      2: 'B2F. Crypt of Fallen',
      3: 'B3F. Subterranean Cavern',
      4: 'B4F. Gate of Colossus',
      5: 'B5F. Midgar Haven [SAFE]',
      6: 'B6F. Magma Crucible',
      7: 'B7F. Frostfang Hollows',
      8: 'B8F. Abyssal Vault',
      9: "B9F. Dragon's Maw",
      10: 'B10F. Throne of Void'
    };
    btn.innerHTML = `
      <b>${fNames[f]}</b>
      <small>${isCurrent ? '📍 ปัจจุบัน' : isUnlocked ? '🟢 พร้อมเดินทาง' : '🔒 ยังไม่ปลดล็อค'}</small>
    `;
    if (isUnlocked && !isCurrent) {
      btn.addEventListener('click', () => {
        modal.style.display = 'none';
        goToFloor(f);
      });
    }
    grid.appendChild(btn);
  }

  if (btnClose) {
    btnClose.onclick = () => { modal.style.display = 'none'; };
  }
}

function openRoguelikeRewardModal(isBoss = false, floorNum = 1) {
  const modal = document.getElementById('roguelike-reward-modal');
  const container = document.getElementById('reward-cards-container');
  if (!modal || !container) return;

  modal.style.display = 'flex';
  sfx.playRewardCard();

  const battleDuration = Math.round((Date.now() - (battleEngine.battleStartTime || Date.now())) / 1000);
  const isSpeedPass = battleDuration <= 60;
  const isWeaknessPass = (battleEngine.weaknessHits || 0) > 0;
  const isFlawlessPass = battleEngine.party.every(m => m.hp > 0);

  const pSpeed = document.getElementById('chal-pill-speed');
  const pElem = document.getElementById('chal-pill-elem');
  const pFlawless = document.getElementById('chal-pill-flawless');

  if (pSpeed) {
    pSpeed.className = `challenge-pill ${isSpeedPass ? 'passed' : ''}`;
    document.getElementById('chal-val-speed').textContent = isSpeedPass ? `+350 GIL 🪙 (${battleDuration}s ผ่าน!)` : `เกิน 60s (${battleDuration}s)`;
  }
  if (pElem) {
    pElem.className = `challenge-pill ${isWeaknessPass ? 'passed' : ''}`;
    document.getElementById('chal-val-elem').textContent = isWeaknessPass ? `+35% EXP ⭐ (${battleEngine.weaknessHits || 1} Hits ผ่าน!)` : 'ไม่ได้ตีจุดอ่อน';
  }
  if (pFlawless) {
    pFlawless.className = `challenge-pill ${isFlawlessPass ? 'passed' : ''}`;
    document.getElementById('chal-val-flawless').textContent = isFlawlessPass ? 'RARITY BOOST! 👑 (ทุกคนรอดชีวิต!)' : 'มีคนล้มลง';
  }

  if (isSpeedPass) {
    window.playerGil = (window.playerGil || 500) + 350;
    updateGilTelemetry();
  }

  // 1. Generate Card 1: Consumable / Relic
  const consumableOptions = [
    { title: 'Elixir of Immortality Pack', icon: '🧪', type: 'ITEM', desc: 'ฟื้นฟู HP/MP 100% ให้สมาชิกทุกคนในการรบ', perk: '+2 Elixir & +3 Hi-Potion', apply: () => {
      window.playerInventory.consumables.elixir = (window.playerInventory.consumables.elixir || 0) + 2;
      window.playerInventory.consumables.hi_potion = (window.playerInventory.consumables.hi_potion || 0) + 3;
    }},
    { title: 'Sacred Phoenix Feather & Megalixir', icon: '✨', type: 'RELIC', desc: 'ชุบชีวิตเพื่อนร่วมทีมด้วยพลังศักดิ์สิทธิ์', perk: '+2 Phoenix Down & +1 Megalixir', apply: () => {
      window.playerInventory.consumables.phoenix_down = (window.playerInventory.consumables.phoenix_down || 0) + 2;
      window.playerInventory.consumables.elixir = (window.playerInventory.consumables.elixir || 0) + 1;
    }},
    { title: 'Ancient Treasure Cache', icon: '🪙', type: 'TREASURE', desc: 'หีบสมบัติโบราณอัดแน่นด้วยทองคำและแร่ล้ำค่า', perk: '+800 GIL & +2 Ancient Relics', apply: () => {
      window.playerGil = (window.playerGil || 500) + 800;
      window.playerInventory.materials.ancient_relic = (window.playerInventory.materials.ancient_relic || 0) + 2;
      updateGilTelemetry();
    }}
  ];
  const card1Data = consumableOptions[Math.floor(Math.random() * consumableOptions.length)];

  // 2. Generate Card 2: Permanent Stat Perk
  const statOptions = [
    { title: 'Titan Fortitude (กายาไททัน)', icon: '❤️', type: 'STATS', desc: 'เสริมพลังชีวิตสูงสุดให้สมาชิกทุกคนในปาร์ตี้อย่างถาวร', perk: 'Party Max HP +150 & Full Heal', apply: () => {
      battleEngine.party.forEach(m => { m.maxHp += 150; m.hp = m.maxHp; });
      Object.values(window.characterRoster).forEach(r => { r.maxHp += 150; r.hp = r.maxHp; });
    }},
    { title: 'Blade Mastery (วิชาเพลงดาบ)', icon: '⚔️', type: 'STATS', desc: 'ขัดเกลาพลังการโจมตีทางกายภาพให้รุนแรงยิ่งขึ้น', perk: 'Party ATK +15 ถาวร', apply: () => {
      battleEngine.party.forEach(m => { m.atk += 15; m.baseAtk = (m.baseAtk || m.atk) + 15; });
      Object.values(window.characterRoster).forEach(r => { r.atk += 15; r.baseAtk = (r.baseAtk || r.atk) + 15; });
    }},
    { title: 'Gale Instinct (สัญชาตญาณวายุ)', icon: '⚡', type: 'STATS', desc: 'เพิ่มความคล่องตัวและอัตราคริติคอลให้ทั้งทีม', perk: 'Party SPD +8 & Crit +15%', apply: () => {
      battleEngine.party.forEach(m => { m.spd += 8; m.baseSpd = (m.baseSpd || m.spd) + 8; });
      Object.values(window.characterRoster).forEach(r => { r.spd += 8; r.baseSpd = (r.baseSpd || r.spd) + 8; });
    }},
    { title: 'Arcane Transcendence (พลังเวททิพย์)', icon: '🧙', type: 'STATS', desc: 'ขยายขีดจำกัดพลังเวทมนตร์และมานาสูงสุด', perk: 'Party Magic +20 & Max MP +60', apply: () => {
      battleEngine.party.forEach(m => { m.magic += 20; m.baseMagic = (m.baseMagic || m.magic) + 20; m.maxMp += 60; m.mp = m.maxMp; });
      Object.values(window.characterRoster).forEach(r => { r.magic += 20; r.baseMagic = (r.baseMagic || r.magic) + 20; r.maxMp += 60; r.mp = r.maxMp; });
    }}
  ];
  const card2Data = statOptions[Math.floor(Math.random() * statOptions.length)];

  // 3. Generate Card 3: Rare Weapon / Gear / Materia
  const rarity = (isFlawlessPass || isBoss) ? (Math.random() > 0.4 ? 'legendary' : 'epic') : (Math.random() > 0.5 ? 'epic' : 'rare');
  let card3Data;
  if (rarity === 'legendary') {
    card3Data = {
      title: 'Ultima Greatsword (ดาบอัลทิมา)', icon: '💎', type: 'WEAPON', rarity: 'legendary',
      desc: 'มหาศาสตราโบราณแห่งแสง ปลดปล่อยอานุภาพธาตุรอบด้าน', perk: 'ATK +95, Rainbow 2.0x DMG',
      apply: () => {
        let w = WEAPONS_DB.find(x => x.id === 'ultima_blade');
        if (!w) {
          w = { id: 'ultima_blade', name: 'Ultima Greatsword', atk: 95, elem: 'none', sprite: { x: 384, y: 192, w: 32, h: 32 }, price: 9999, owned: true };
          WEAPONS_DB.push(w);
        }
        w.owned = true;
        window.equippedWeapon = w;
      }
    };
  } else if (rarity === 'epic') {
    card3Data = {
      title: 'Muramasa Katana (ดาบมุรามาสะ)', icon: '⚔️', type: 'WEAPON', rarity: 'epic',
      desc: 'ดาบมารอัสนีบาต ฟันแหวกอากาศด้วยความเร็วดุจสายฟ้า', perk: 'ATK +68, Thunder, Crit +25%',
      apply: () => {
        let w = WEAPONS_DB.find(x => x.id === 'muramasa');
        if (!w) {
          w = { id: 'muramasa', name: 'Muramasa Blade', atk: 68, elem: 'thunder', sprite: { x: 320, y: 192, w: 32, h: 32 }, price: 4000, owned: true };
          WEAPONS_DB.push(w);
        }
        w.owned = true;
        window.equippedWeapon = w;
      }
    };
  } else {
    card3Data = {
      title: 'Flame Edge (ดาบเพลิงพิฆาต)', icon: '🗡️', type: 'WEAPON', rarity: 'rare',
      desc: 'ดาบเคลือบเปลวเพลิงแผดเผา ชนะทางธาตุดิน 2.0x', perk: 'ATK +45, Fire Element',
      apply: () => {
        const w = WEAPONS_DB.find(x => x.id === 'flame_saber') || WEAPONS_DB[2];
        if (w) { w.owned = true; window.equippedWeapon = w; }
      }
    };
  }

  const cards = [
    { ...card1Data, rarity: 'rare' },
    { ...card2Data, rarity: 'epic' },
    card3Data
  ];

  container.innerHTML = cards.map((c, i) => `
    <div class="reward-card rarity-${c.rarity}" data-card-idx="${i}">
      <span class="rc-type-tag" style="background: ${c.rarity === 'legendary' ? '#ca8a04' : c.rarity === 'epic' ? '#7e22ce' : '#0284c7'}; color: #fff;">${c.rarity.toUpperCase()} • ${c.type}</span>
      <div class="rc-icon-thumb">${c.icon}</div>
      <h3 class="rc-name">${c.title}</h3>
      <p class="rc-desc">${c.desc}</p>
      <div class="rc-perk-badge">${c.perk}</div>
      <button class="rc-btn-claim">เลือกการ์ดใบนี้ (SELECT)</button>
    </div>
  `).join('');

  container.querySelectorAll('.reward-card').forEach((cardEl, idx) => {
    cardEl.addEventListener('click', () => {
      const chosen = cards[idx];
      chosen.apply();
      sfx.playWeaknessHit();
      triggerScreenFlash();
      combatVfx.addBurst(playerX, playerY, '#facc15', 30, 6);
      combatVfx.addText(`🎉 ได้รับ: ${chosen.title}!`, playerX, playerY - 40, '#facc15', true);
      modal.style.display = 'none';
      renderShopUI();
    });
  });
}

function initTitleScreen() {
  const overlay = document.getElementById('title-screen-overlay');
  const btnStart = document.getElementById('btn-title-start');
  const btnStory = document.getElementById('btn-title-story');
  const btnSettings = document.getElementById('btn-title-settings');
  const btnGuide = document.getElementById('btn-title-guide');
  const btnReturn = document.getElementById('btn-return-title');

  const storyModal = document.getElementById('title-story-modal');
  const btnCloseStory = document.getElementById('btn-close-story');
  const btnStartFromStory = document.getElementById('btn-start-from-story');

  const settingsModal = document.getElementById('title-settings-modal');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const btnToggleSfxModal = document.getElementById('btn-toggle-sfx-modal');
  const btnToggleBgmModal = document.getElementById('btn-toggle-bgm-modal');

  const guideModal = document.getElementById('title-guide-modal');
  const btnCloseGuide = document.getElementById('btn-close-guide');

  const startGame = () => {
    sfx.playOpenMenu();
    if (overlay) overlay.style.display = 'none';
    if (storyModal) storyModal.style.display = 'none';

    if (!window.dungeonState.hasAwakened) {
      triggerAwakeningPrologue();
    }
  };

  if (btnStart) btnStart.addEventListener('click', startGame);
  if (btnStartFromStory) btnStartFromStory.addEventListener('click', startGame);

  if (btnStory) btnStory.addEventListener('click', () => {
    sfx.playOpenMenu();
    if (storyModal) storyModal.style.display = 'flex';
  });
  if (btnCloseStory) btnCloseStory.addEventListener('click', () => {
    if (storyModal) storyModal.style.display = 'none';
  });

  if (btnSettings) btnSettings.addEventListener('click', () => {
    sfx.playOpenMenu();
    if (settingsModal) settingsModal.style.display = 'flex';
  });
  if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => {
    if (settingsModal) settingsModal.style.display = 'none';
  });

  if (btnGuide) btnGuide.addEventListener('click', () => {
    sfx.playOpenMenu();
    if (guideModal) guideModal.style.display = 'flex';
  });
  if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => {
    if (guideModal) guideModal.style.display = 'none';
  });

  if (btnReturn) btnReturn.addEventListener('click', () => {
    sfx.playOpenMenu();
    if (overlay) overlay.style.display = 'flex';
  });

  if (btnToggleSfxModal) {
    btnToggleSfxModal.addEventListener('click', () => {
      const on = sfx.toggle();
      btnToggleSfxModal.className = `modal-pill-btn ${on ? 'active' : 'off'}`;
      btnToggleSfxModal.textContent = on ? '🔊 เปิดใช้งาน (ENABLED)' : '🔇 ปิดเสียง (MUTED)';
      const topIcon = document.getElementById('sound-icon');
      const topText = document.getElementById('sound-text');
      if (topIcon) topIcon.textContent = on ? '🔊' : '🔇';
      if (topText) topText.textContent = on ? 'SOUND ON' : 'MUTED';
    });
  }

  if (btnToggleBgmModal) {
    btnToggleBgmModal.addEventListener('click', () => {
      window.bgmEnabled = !window.bgmEnabled;
      btnToggleBgmModal.className = `modal-pill-btn ${window.bgmEnabled ? 'active' : 'off'}`;
      btnToggleBgmModal.textContent = window.bgmEnabled ? '🎵 เปิดใช้งาน (ENABLED)' : '🔇 ปิดเพลง (MUTED)';
    });
  }
}

// Initialize Title Screen & Floor 1 Banner
initTitleScreen();
updateFloorBanner(1);

// ================= Quest System (Floor-based Objectives) =================
const FLOOR_QUESTS = {
  1: { name: '\u0e15\u0e37\u0e48\u0e19\u0e43\u0e19\u0e04\u0e27\u0e32\u0e21\u0e21\u0e37\u0e14', objective: '\u0e2a\u0e31\u0e07\u0e2b\u0e32\u0e23\u0e21\u0e2d\u0e19\u0e2a\u0e40\u0e15\u0e2d\u0e23\u0e4c 3 \u0e15\u0e31\u0e27 \u0026 \u0e2b\u0e32\u0e1a\u0e31\u0e19\u0e44\u0e14\u0e25\u0e07\u0e0a\u0e31\u0e49\u0e19 B2F', reward: '150 EXP, 30 GIL, Potion x2' },
  2: { name: '\u0e40\u0e2a\u0e35\u0e22\u0e07\u0e23\u0e49\u0e2d\u0e07\u0e43\u0e19\u0e2a\u0e38\u0e2a\u0e32\u0e19', objective: '\u0e2a\u0e33\u0e23\u0e27\u0e08\u0e2a\u0e38\u0e2a\u0e32\u0e19 \u0026 \u0e2a\u0e31\u0e07\u0e2b\u0e32\u0e23 Skeleton 5 \u0e15\u0e31\u0e27', reward: '200 EXP, 50 GIL, Hi-Potion' },
  3: { name: '\u0e0a\u0e48\u0e27\u0e22\u0e40\u0e2b\u0e25\u0e37\u0e2d Tifa', objective: '\u0e40\u0e02\u0e49\u0e32\u0e16\u0e36\u0e07\u0e01\u0e23\u0e07 Tifa \u0026 \u0e0a\u0e19\u0e30 Cave Guard', reward: '\u0e1b\u0e25\u0e14\u0e25\u0e47\u0e2d\u0e04 Tifa Lockhart, 300 EXP' },
  4: { name: '\u0e1c\u0e39\u0e49\u0e1e\u0e34\u0e17\u0e31\u0e01\u0e29\u0e4c\u0e40\u0e2b\u0e25\u0e47\u0e01\u0e01\u0e25\u0e49\u0e32', objective: '\u0e0a\u0e19\u0e30 Iron Sentinel Golem (Mini-Boss)\u0e17\u0e35\u0e48\u0e17\u0e32\u0e07\u0e02\u0e31\u0e49\u0e19 B5F!', reward: 'Roguelite Card 3 \u0e15\u0e31\u0e27\u0e40\u0e25\u0e37\u0e2d\u0e01' },
  5: { name: '\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19\u0e25\u0e35\u0e49\u0e20\u0e31\u0e22', objective: '\u0e04\u0e38\u0e22\u0e01\u0e31\u0e1a NPC \u0e43\u0e19\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19 \u0026 \u0e1e\u0e1a Vivi', reward: '\u0e1b\u0e25\u0e14\u0e25\u0e47\u0e2d\u0e04 Vivi Ornitier, Ether x2' },
  6: { name: '\u0e40\u0e1b\u0e25\u0e27\u0e40\u0e1e\u0e25\u0e34\u0e07\u0e41\u0e2b\u0e48\u0e07\u0e19\u0e23\u0e01', objective: '\u0e1c\u0e48\u0e32\u0e19\u0e2d\u0e2a\u0e39\u0e23\u0e44\u0e1f 4 \u0e15\u0e31\u0e27 \u0026 \u0e2b\u0e32\u0e1a\u0e31\u0e19\u0e44\u0e14\u0e25\u0e07 B7F', reward: '450 EXP, 200 GIL, Flame Bangle' },
  7: { name: '\u0e19\u0e49\u0e33\u0e41\u0e02\u0e47\u0e07\u0e41\u0e2b\u0e48\u0e07\u0e04\u0e27\u0e32\u0e21\u0e15\u0e32\u0e22', objective: '\u0e0a\u0e48\u0e27\u0e22 Cecil \u0026 \u0e0a\u0e19\u0e30 Frost Wendigo', reward: '\u0e1b\u0e25\u0e14\u0e25\u0e47\u0e2d\u0e04 Cecil Harvey, Ice Blade' },
  8: { name: '\u0e2a\u0e38\u0e2a\u0e32\u0e19\u0e27\u0e34\u0e0d\u0e0d\u0e32\u0e13', objective: '\u0e40\u0e1b\u0e34\u0e14\u0e2b\u0e35\u0e1a Diamond \u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14 \u0026 \u0e25\u0e07 B9F', reward: 'Turbo Ether x2, 500 GIL' },
  9: { name: '\u0e21\u0e31\u0e07\u0e01\u0e23\u0e1a\u0e23\u0e23\u0e1e\u0e01\u0e32\u0e25', objective: '\u0e0a\u0e19\u0e30 Ancient Red Dragon (Elite Boss)!', reward: 'Roguelite Card, \u0e1b\u0e25\u0e14\u0e25\u0e47\u0e2d\u0e04 Aeris' },
  10: { name: '\u0e0a\u0e30\u0e15\u0e32\u0e01\u0e23\u0e23\u0e21\u0e04\u0e23\u0e31\u0e49\u0e07\u0e2a\u0e38\u0e14\u0e17\u0e49\u0e32\u0e22', objective: '\u0e2a\u0e39\u0e49 Bahamut Zero (Final Boss)!', reward: '\ud83c\udfc6 ENDING — Victory!' }
};

// Show current floor quest in HUD
function updateQuestHUD() {
  const floor = window.dungeonState?.currentFloor || 1;
  const quest = FLOOR_QUESTS[floor];
  if (!quest) return;

  let questEl = document.getElementById('quest-hud-display');
  if (!questEl) {
    // Create quest display if not exists
    questEl = document.createElement('div');
    questEl.id = 'quest-hud-display';
    questEl.style.cssText = `
      position: fixed; bottom: 14px; left: 14px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(250, 204, 21, 0.4);
      border-radius: 8px; padding: 8px 12px;
      font-size: 11px; color: #f8fafc;
      z-index: 100; max-width: 260px;
      backdrop-filter: blur(8px);
    `;
    document.body.appendChild(questEl);
  }

  questEl.innerHTML = `
    <div style="color: #facc15; font-weight: 700; font-size: 10px; margin-bottom: 3px;">
      \ud83d\udccd B${floor}F QUEST: ${quest.name}
    </div>
    <div style="color: #cbd5e1; font-size: 10px;">${quest.objective}</div>
    <div style="color: #4ade80; font-size: 9px; margin-top: 2px;">\ud83c\udfc6 ${quest.reward}</div>
  `;
}

// Update quest HUD when floor changes (call after updateFloorBanner)
const _origUpdateFloorBanner = updateFloorBanner;
window.updateFloorBanner = function(floorNum) {
  _origUpdateFloorBanner(floorNum);
  setTimeout(updateQuestHUD, 100);
};

// Also show initial quest
setTimeout(updateQuestHUD, 500);
