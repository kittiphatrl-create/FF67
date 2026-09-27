/**
 * First Fantasy 67 — 3D Tree Renderer & Ecosystem Engine
 * Features:
 * 1. 2.5D Isometric 3D Projection & Offscreen Sprite Caching (60 FPS Performance)
 * 2. Dynamic Wind Sway & Spring-Damped Elastic Wobble
 * 3. Interactive Tree Shaking (Drops Apples, Ether Blossoms, Gil with Leaf Bursts)
 * 4. 4 Seasonal Palettes (Normal 🌿, Fall 🍂, Cold ❄️, Dry 🌾)
 * 5. Full 3D WebGL Model Viewer powered by Three.js & OrbitControls
 * 6. Battle Arena Thematic Tree Framing
 * 7. Seasonal Atmospheric Weather Particles
 */

// ================= 1. Tree Cache & Projection Manager =================
class TreeCacheManager {
  constructor() {
    this.cache = {}; // key: `${modelId}_${season}` -> { canvas, width, height, anchorX, anchorY, shadowRadiusX, shadowRadiusY }
    this.currentSeason = 'Normal'; // 'Normal', 'Fall', 'Cold', 'Dry'
    this.textureCanvases = {}; // 16x16 canvas for Three.js WebGL textures
    this.initTexturePalettes();
  }

  initTexturePalettes() {
    ['Normal', 'Fall', 'Cold', 'Dry'].forEach(season => {
      const cvs = document.createElement('canvas');
      cvs.width = 16;
      cvs.height = 16;
      const ctx = cvs.getContext('2d');
      const palette = TREE_PALETTES[season];
      for (let by = 0; by < 4; by++) {
        for (let bx = 0; bx < 4; bx++) {
          const col = palette[by][bx];
          ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
          ctx.fillRect(bx * 4, by * 4, 4, 4);
        }
      }
      this.textureCanvases[season] = cvs;
    });
  }

  setSeason(season) {
    if (['Normal', 'Fall', 'Cold', 'Dry'].includes(season)) {
      this.currentSeason = season;
    }
  }

  getSprite(modelId, season = null) {
    const s = season || this.currentSeason;
    const key = `${modelId}_${s}`;
    if (this.cache[key]) return this.cache[key];

    const model = TREE_MODELS[modelId];
    if (!model) return null;

    const sprite = this.renderModelOffscreen(model, s);
    this.cache[key] = sprite;
    return sprite;
  }

  renderModelOffscreen(model, season) {
    // 2.5D Isometric Dimetric Projection: pitch = 26 deg, yaw = 35 deg
    const pitch = 26 * Math.PI / 180;
    const yaw = 35 * Math.PI / 180;
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

    // Directional Sunlight from top-front-left
    const light = [-0.45, 0.85, 0.4];
    const lLen = Math.hypot(...light);
    const lx = light[0] / lLen, ly = light[1] / lLen, lz = light[2] / lLen;

    const palette = TREE_PALETTES[season];
    const projectedTris = [];

    model.triangles.forEach(tri => {
      // Normal shading
      const nx = tri.n[0], ny = tri.n[1], nz = tri.n[2];
      const dot = nx * lx + ny * ly + nz * lz;
      const diff = Math.max(0, dot);
      const shade = 0.48 + 0.52 * diff;

      // Palette block color
      const bx = tri.c[0], by = tri.c[1];
      const rgb = palette[by] ? palette[by][bx] : [45, 135, 55];
      const r = Math.min(255, Math.round(rgb[0] * shade));
      const g = Math.min(255, Math.round(rgb[1] * shade));
      const b = Math.min(255, Math.round(rgb[2] * shade));

      // 3D -> 2D Projection
      const pts2d = [tri.p0, tri.p1, tri.p2].map(p => {
        const rx = p[0] * cosY - p[2] * sinY;
        const rz = p[0] * sinY + p[2] * cosY;
        const ry = p[1] * cosP - rz * sinP;
        const depth = p[1] * sinP + rz * cosP;
        return { x: rx, y: -ry, z: depth };
      });

      const avgDepth = (pts2d[0].z + pts2d[1].z + pts2d[2].z) / 3;
      projectedTris.push({
        pts: pts2d,
        depth: avgDepth,
        color: `rgb(${r},${g},${b})`
      });
    });

    // Sort back-to-front (painter's algorithm)
    projectedTris.sort((a, b) => a.depth - b.depth);

    // Compute bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    projectedTris.forEach(t => t.pts.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }));

    const scale = 36;
    const pad = 12;
    const width = Math.ceil((maxX - minX) * scale) + pad * 2;
    const height = Math.ceil((maxY - minY) * scale) + pad * 2;
    const offsetX = -minX * scale + pad;
    const offsetY = -minY * scale + pad;

    // Anchor point is the bottom center of the trunk
    // Since Y is flipped (-ry), ground level (p[1] ~ 0) maps to near maxY
    const anchorX = 0 * cosY * scale + offsetX;
    const anchorY = offsetY + (-0 * cosP * scale);

    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d');

    // Draw polygons
    projectedTris.forEach(t => {
      ctx.fillStyle = t.color;
      ctx.strokeStyle = t.color;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(t.pts[0].x * scale + offsetX, t.pts[0].y * scale + offsetY);
      ctx.lineTo(t.pts[1].x * scale + offsetX, t.pts[1].y * scale + offsetY);
      ctx.lineTo(t.pts[2].x * scale + offsetX, t.pts[2].y * scale + offsetY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    return {
      canvas: cvs,
      width,
      height,
      anchorX,
      anchorY,
      shadowRadiusX: Math.round(width * 0.28),
      shadowRadiusY: Math.round(width * 0.14)
    };
  }
}

// Global Tree Cache Instance
const treeCache = new TreeCacheManager();

// ================= 2. Tree Instance in Field World =================
class TreeInstance {
  constructor(x, y, modelId, scale = 1.0, season = null) {
    this.x = x;
    this.y = y;
    this.modelId = modelId;
    this.scale = scale;
    this.customSeason = season;

    const m = TREE_MODELS[modelId] || TREE_MODELS['type0_01'];
    this.name = m.name;
    this.trunkRadius = (m.trunkRadius || 15) * scale;

    // Elastic wobble physics
    this.wobbleAngle = 0;
    this.wobbleVel = 0;
    this.swayPhase = Math.random() * Math.PI * 2;
    this.lastShaken = 0;
    this.dropsRemaining = 2; // Can drop 2 items when shaken
  }

  update(dt = 0.016) {
    // Spring physics: Damped Harmonic Oscillator (F = -k*x - c*v)
    const k = 18.0; // Spring stiffness
    const c = 2.8;  // Damping coefficient
    const force = -k * this.wobbleAngle - c * this.wobbleVel;
    this.wobbleVel += force * dt;
    this.wobbleAngle += this.wobbleVel * dt;

    if (Math.abs(this.wobbleAngle) < 0.001 && Math.abs(this.wobbleVel) < 0.001) {
      this.wobbleAngle = 0;
      this.wobbleVel = 0;
    }
  }

  drawShadow(ctx) {
    const sprite = treeCache.getSprite(this.modelId, this.customSeason);
    if (!sprite) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    const radX = sprite.shadowRadiusX * this.scale;
    const radY = sprite.shadowRadiusY * this.scale;

    // Soft blurred radial drop shadow
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radX);
    grad.addColorStop(0, 'rgba(10, 25, 15, 0.42)');
    grad.addColorStop(0.7, 'rgba(10, 25, 15, 0.22)');
    grad.addColorStop(1, 'rgba(10, 25, 15, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 4, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  draw(ctx, time) {
    const sprite = treeCache.getSprite(this.modelId, this.customSeason);
    if (!sprite) return;

    // Wind sway calculation
    const windSway = Math.sin(time / 1200 + this.swayPhase) * 0.01;
    const totalRotation = windSway + this.wobbleAngle;

    ctx.save();
    // Translate to tree root position
    ctx.translate(this.x, this.y);

    // Apply scale and rotation from tree base
    ctx.rotate(totalRotation);
    ctx.scale(this.scale, this.scale);

    // Draw pre-rendered 3D tree sprite aligned at trunk anchor
    ctx.drawImage(
      sprite.canvas,
      -sprite.anchorX,
      -sprite.anchorY
    );
    ctx.restore();
  }

  drawPrompt(ctx, px, py) {
    const dist = Math.hypot(this.x - px, this.y - py);
    if (dist < 55) {
      ctx.save();
      ctx.translate(this.x, this.y - 110 * this.scale);

      // Floating prompt badge
      const bob = Math.sin(Date.now() / 200) * 3;
      ctx.translate(0, bob);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-58, -14, 116, 28, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[SPACE] เขย่าต้นไม้', 0, 0);
      ctx.restore();
    }
  }

  shake(combatVfx, sfxEngine) {
    const now = Date.now();
    if (now - this.lastShaken < 600) return null; // Cooldown
    this.lastShaken = now;

    // Apply sudden impulse to spring
    this.wobbleVel = (Math.random() > 0.5 ? 1 : -1) * 2.8;

    // Play rustle SFX
    if (sfxEngine) {
      sfxEngine.playTone(180, 'triangle', 0.15, 0.15, 60);
      setTimeout(() => sfxEngine.playTone(260, 'sine', 0.12, 0.1, 90), 50);
    }

    // Leaf particle explosion
    const season = this.customSeason || treeCache.currentSeason;
    const leafColors = {
      'Normal': ['#4ade80', '#22c55e', '#a3e635', '#16a34a'],
      'Fall': ['#f97316', '#ea580c', '#eab308', '#dc2626'],
      'Cold': ['#38bdf8', '#bae6fd', '#ffffff', '#7dd3fc'],
      'Dry': ['#fde047', '#ca8a04', '#d97706', '#a16207']
    };
    const palette = leafColors[season] || leafColors['Normal'];

    if (combatVfx) {
      const topY = this.y - 65 * this.scale;
      for (let i = 0; i < 18; i++) {
        const col = palette[Math.floor(Math.random() * palette.length)];
        combatVfx.particles.push({
          x: this.x + (Math.random() - 0.5) * 40 * this.scale,
          y: topY + (Math.random() - 0.5) * 40 * this.scale,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 2 + 1,
          radius: Math.random() * 3.5 + 2,
          color: col,
          alpha: 1,
          life: 0.02
        });
      }
    }

    // Chance of dropping items
    let dropResult = null;
    if (this.dropsRemaining > 0 && Math.random() < 0.65) {
      this.dropsRemaining--;
      const roll = Math.random();
      if (roll < 0.40) {
        dropResult = { type: 'apple', name: 'Red Apple 🍎', hp: 80, text: '+80 HP (แอปเปิลแดง) 🍎', color: '#ef4444' };
      } else if (roll < 0.70) {
        dropResult = { type: 'ether_flower', name: 'Ether Blossom 🌿', mp: 35, text: '+35 MP (เกสรเอเธอร์) 🌿', color: '#06b6d4' };
      } else if (roll < 0.90) {
        dropResult = { type: 'gold_nut', name: 'Golden Nut 🌰', gil: 60, text: '+60 Gil (ถั่วทองคำ) 🪙', color: '#eab308' };
      } else {
        dropResult = { type: 'golden_apple', name: 'Golden Apple 🍏', hp: 150, mp: 40, text: '+150 HP +40 MP (แอปเปิลทองคำ!) ✨', color: '#fde047' };
      }

      if (combatVfx && dropResult) {
        combatVfx.addText(dropResult.text, this.x, this.y - 70 * this.scale, dropResult.color, true);
        if (sfxEngine) sfxEngine.playTone(523.25, 'triangle', 0.2, 0.12, 659.25);
      }
    }

    return dropResult;
  }
}

// ================= 3. Seasonal Weather Particles =================
class SeasonalWeatherSystem {
  constructor(worldWidth = 1600, worldHeight = 1200) {
    this.width = worldWidth;
    this.height = worldHeight;
    this.particles = [];
    this.init(55);
  }

  init(count = 50) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomY = false) {
    const season = treeCache.currentSeason;
    let color, size, vx, vy, isSnow = false;

    if (season === 'Fall') {
      const colors = ['#f97316', '#ea580c', '#eab308', '#dc2626', '#b45309'];
      color = colors[Math.floor(Math.random() * colors.length)];
      size = Math.random() * 4 + 3;
      vx = Math.random() * 1.5 + 0.8;
      vy = Math.random() * 1.2 + 0.6;
    } else if (season === 'Cold') {
      color = '#ffffff';
      size = Math.random() * 3 + 1.5;
      vx = (Math.random() - 0.5) * 0.8;
      vy = Math.random() * 1.4 + 0.8;
      isSnow = true;
    } else if (season === 'Dry') {
      const colors = ['#fde047', '#ca8a04', '#e2e8f0', '#d97706'];
      color = colors[Math.floor(Math.random() * colors.length)];
      size = Math.random() * 2.5 + 1;
      vx = Math.random() * 2.2 + 1.2;
      vy = (Math.random() - 0.5) * 0.4;
    } else {
      // Normal: gentle green spring petals & leaves
      const colors = ['#4ade80', '#86efac', '#fbcfe8', '#34d399'];
      color = colors[Math.floor(Math.random() * colors.length)];
      size = Math.random() * 3.5 + 2;
      vx = Math.random() * 1.0 + 0.3;
      vy = Math.random() * 0.8 + 0.4;
    }

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -10,
      vx, vy,
      size,
      color,
      isSnow,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.08,
      wobblePhase: Math.random() * Math.PI * 2
    };
  }

  update() {
    this.particles.forEach(p => {
      p.x += p.vx + Math.sin(p.y / 35 + p.wobblePhase) * 0.6;
      p.y += p.vy;
      p.rot += p.vRot;

      if (p.y > this.height + 15 || p.x > this.width + 20) {
        Object.assign(p, this.createParticle(false));
      }
    });
  }

  draw(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.isSnow) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (window.harvestAssets && window.harvestAssets.leaves && window.harvestAssets.leaves.complete && window.harvestAssets.leaves.naturalWidth > 0) {
        // Pixel art animated falling leaf from Harvest Sumer pack (8 frames of 16x16)
        const frame = Math.floor(Math.abs(p.rot * 3 + (p.y / 20))) % 8;
        const leafSz = Math.max(12, Math.round(p.size * 3.5));
        ctx.drawImage(
          window.harvestAssets.leaves,
          frame * 16, 0, 16, 16,
          -leafSz / 2, -leafSz / 2, leafSz, leafSz
        );
      } else {
        // Oval leaf shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    ctx.restore();
  }
}

// ================= 4. Interactive 3D Tree Inspector (Three.js WebGL) =================
class TreeInspector3D {
  constructor() {
    this.active = false;
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.currentMesh = null;
    this.groundGrid = null;
    this.autoRotate = true;
    this.isWireframe = false;
    this.selectedModelId = 'type0_01';
    this.inspectorSeason = 'Normal';
    this.animReq = null;
  }

  init() {
    this.createModalDOM();
  }

  createModalDOM() {
    const modal = document.createElement('div');
    modal.id = 'tree-inspector-modal';
    modal.className = 'tree-inspector-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="tree-inspector-window">
        <!-- Window Top Header -->
        <div class="inspector-header">
          <div class="inspector-title">
            <span class="inspector-badge">🌲</span>
            <div>
              <h3>3D TREE INSPECTOR (BROKEN VECTOR TREE PACK)</h3>
              <p>ชมและตรวจสอบโมเดล 3 มิติ 360° | หมุน ซูม ปรับฤดูกาล และปลูกลงแผนที่</p>
            </div>
          </div>
          <button class="modal-close-btn" id="btn-close-inspector">✕ ปิด</button>
        </div>

        <!-- Main Body: 3D Viewport on Left, Control Panel on Right -->
        <div class="inspector-body">
          <!-- 3D WebGL Canvas Container -->
          <div class="viewport-3d-wrapper" id="viewport-3d-container">
            <div class="viewport-loading" id="inspector-loading">กำลังโหลด 3D Engine...</div>
            <div class="viewport-hint">
              <span>🖱️ ซ้าย: หมุน 360° | ลูกกลิ้ง: ซูม | ขวา: เลื่อนมุมมอง</span>
            </div>
          </div>

          <!-- Controls & Info Panel -->
          <div class="inspector-controls-panel">
            <!-- Season Switcher -->
            <div class="panel-section">
              <label class="section-label">🍂 เลือกฤดูกาล (SEASON PALETTE)</label>
              <div class="season-pill-group">
                <button class="season-pill active" data-season="Normal">🌿 Normal</button>
                <button class="season-pill" data-season="Fall">🍂 Fall</button>
                <button class="season-pill" data-season="Cold">❄️ Cold</button>
                <button class="season-pill" data-season="Dry">🌾 Dry</button>
              </div>
            </div>

            <!-- Tree Family & Model Dropdown -->
            <div class="panel-section">
              <label class="section-label">🌳 เลือกโมเดลต้นไม้ (3D MODEL)</label>
              <select class="inspector-select" id="inspector-model-select">
                <optgroup label="Oak (ต้นโอ๊คพุ่มใหญ่)">
                  <option value="type0_01">Tree Type0 01 — Oak Tree (โอ๊คใหญ่)</option>
                  <option value="type0_02">Tree Type0 02 — Twin Oak (โอ๊คพุ่มคู่)</option>
                </optgroup>
                <optgroup label="Pine (ต้นสนภูเขา)">
                  <option value="type1_01">Tree Type1 01 — Mountain Pine (สนภูเขา)</option>
                  <option value="type1_02">Tree Type1 02 — Tall Pine (สนสูงเพรียว)</option>
                </optgroup>
                <optgroup label="Birch (ต้นเบิร์ช)">
                  <option value="type2_01">Tree Type2 01 — Birch Tree (เบิร์ชเรียว)</option>
                  <option value="type2_02">Tree Type2 02 — Twin Birch (เบิร์ชคู่งาม)</option>
                </optgroup>
                <optgroup label="Fruit / Bush (ต้นแอปเปิล/พุ่มไม้)">
                  <option value="type3_01">Tree Type3 01 — Apple Tree (แอปเปิลผลดก)</option>
                  <option value="type3_02">Tree Type3 02 — Round Bush (พุ่มไม้กลม)</option>
                </optgroup>
                <optgroup label="Spruce (ต้นสปรูซป่าทึบ)">
                  <option value="type4_01">Tree Type4 01 — Spruce Tree (สปรูซป่าทึบ)</option>
                  <option value="type4_02">Tree Type4 02 — Giant Spruce (สปรูซยักษ์)</option>
                </optgroup>
                <optgroup label="Willow (ต้นหลิวโบราณ)">
                  <option value="type5_01">Tree Type5 01 — Weeping Willow (หลิวลู่ลม)</option>
                  <option value="type5_02">Tree Type5 02 — Ancient Willow (หลิวโบราณ)</option>
                </optgroup>
                <optgroup label="Acacia (ต้นอะเคเชียสะวันนา)">
                  <option value="type6_01">Tree Type6 01 — Acacia Tree (อะเคเชีย)</option>
                  <option value="type6_02">Tree Type6 02 — Flat-Top Acacia (อะเคเชียร่ม)</option>
                </optgroup>
                <optgroup label="Palm (ต้นปาล์ม/มะพร้าวชายหาด)">
                  <option value="type7_01">Tree Type7 01 — Coconut Palm (มะพร้าว)</option>
                  <option value="type7_02">Tree Type7 02 — Fan Palm (ปาล์มใบพัด)</option>
                </optgroup>
              </select>
            </div>

            <!-- 3D View Toggles -->
            <div class="panel-section">
              <label class="section-label">⚙️ ตั้งค่ามุมมอง 3D</label>
              <div class="toggles-grid">
                <button class="toggle-btn active" id="btn-toggle-autorotate">🔄 หมุนอัตโนมัติ (ON)</button>
                <button class="toggle-btn" id="btn-toggle-wireframe">🕸️ Wireframe (OFF)</button>
              </div>
            </div>

            <!-- Model Telemetry Details -->
            <div class="panel-section">
              <label class="section-label">📊 ข้อมูลโมเดล (SPECIFICATIONS)</label>
              <div class="model-stats-card">
                <div class="stat-line"><span>ชื่อโมเดล:</span><b id="spec-name">Oak Tree</b></div>
                <div class="stat-line"><span>ตระกูล:</span><b id="spec-family">Oak / Deciduous</b></div>
                <div class="stat-line"><span>ความสูง 3D:</span><b id="spec-height">3.8 m</b></div>
                <div class="stat-line"><span>โพลีกอน (Polys):</span><b id="spec-polys">924 tris</b></div>
                <div class="stat-line"><span>เท็กซ์เจอร์:</span><b id="spec-tex">4x4 Color Palette</b></div>
              </div>
            </div>

            <!-- Action: Plant this Tree in Field -->
            <div class="panel-actions">
              <button class="plant-btn" id="btn-plant-tree">
                <span>🌱</span> ปลูกต้นไม้นี้ลงแผนที่ (PLANT IN FIELD)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event Bindings
    document.getElementById('btn-close-inspector').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // Model Selector change
    document.getElementById('inspector-model-select').addEventListener('change', (e) => {
      this.selectedModelId = e.target.value;
      this.loadModelIn3D(this.selectedModelId, this.inspectorSeason);
      this.updateSpecs();
    });

    // Season Pills click
    modal.querySelectorAll('.season-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.season-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.inspectorSeason = btn.getAttribute('data-season');
        this.loadModelIn3D(this.selectedModelId, this.inspectorSeason);
      });
    });

    // Auto rotate toggle
    const rotBtn = document.getElementById('btn-toggle-autorotate');
    rotBtn.addEventListener('click', () => {
      this.autoRotate = !this.autoRotate;
      rotBtn.classList.toggle('active', this.autoRotate);
      rotBtn.textContent = this.autoRotate ? '🔄 หมุนอัตโนมัติ (ON)' : '🔄 หมุนอัตโนมัติ (OFF)';
      if (this.controls) this.controls.autoRotate = this.autoRotate;
    });

    // Wireframe toggle
    const wireBtn = document.getElementById('btn-toggle-wireframe');
    wireBtn.addEventListener('click', () => {
      this.isWireframe = !this.isWireframe;
      wireBtn.classList.toggle('active', this.isWireframe);
      wireBtn.textContent = this.isWireframe ? '🕸️ Wireframe (ON)' : '🕸️ Wireframe (OFF)';
      if (this.currentMesh && this.currentMesh.material) {
        this.currentMesh.material.wireframe = this.isWireframe;
      }
    });

    // Plant in map button
    document.getElementById('btn-plant-tree').addEventListener('click', () => {
      if (window.plantTreeAtHero) {
        window.plantTreeAtHero(this.selectedModelId, this.inspectorSeason);
      }
    });
  }

  setupThreeScene() {
    if (this.renderer) return;

    const container = document.getElementById('viewport-3d-container');
    const w = container.clientWidth || 580;
    const h = container.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090e1a);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 3.5, 6.5);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = 2.0;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
      this.controls.minDistance = 2.5;
      this.controls.maxDistance = 14;
      this.controls.target.set(0, 1.6, 0);
    }

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    sunLight.position.set(4, 8, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    fillLight.position.set(-5, 4, -4);
    this.scene.add(fillLight);

    // 6. Ground Grid & Shadow Platform
    const grid = new THREE.GridHelper(10, 10, 0x38bdf8, 0x1e293b);
    grid.position.y = -0.01;
    this.scene.add(grid);

    const groundGeo = new THREE.CircleGeometry(3.6, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    document.getElementById('inspector-loading').style.display = 'none';

    // Animation Loop
    const animate = () => {
      if (!this.active) return;
      this.animReq = requestAnimationFrame(animate);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  loadModelIn3D(modelId, season = 'Normal') {
    if (!this.scene) return;
    const model = TREE_MODELS[modelId];
    if (!model) return;

    // Remove previous mesh
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
      if (this.currentMesh.geometry) this.currentMesh.geometry.dispose();
      if (this.currentMesh.material) this.currentMesh.material.dispose();
      this.currentMesh = null;
    }

    // Build THREE.BufferGeometry from model.triangles
    const positions = [];
    const normals = [];
    const uvs = [];

    model.triangles.forEach(tri => {
      positions.push(...tri.p0, ...tri.p1, ...tri.p2);
      normals.push(...tri.n, ...tri.n, ...tri.n);

      const u = (tri.c[0] + 0.5) / 4;
      const v = 1 - (tri.c[1] + 0.5) / 4;
      uvs.push(u, v, u, v, u, v);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    // Create Three.js Texture from 16x16 canvas
    const cvs = treeCache.textureCanvases[season];
    const texture = new THREE.CanvasTexture(cvs);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
      metalness: 0.05,
      wireframe: this.isWireframe,
      side: THREE.DoubleSide
    });

    this.currentMesh = new THREE.Mesh(geometry, material);
    this.currentMesh.castShadow = true;
    this.currentMesh.receiveShadow = true;
    this.scene.add(this.currentMesh);

    // Adjust camera target to center of tree
    if (this.controls) {
      this.controls.target.set(0, model.height * 0.45, 0);
    }
  }

  updateSpecs() {
    const model = TREE_MODELS[this.selectedModelId];
    if (!model) return;
    document.getElementById('spec-name').textContent = model.name;
    document.getElementById('spec-family').textContent = model.family;
    document.getElementById('spec-height').textContent = `${model.height} m`;
    document.getElementById('spec-polys').textContent = `${model.triangles.length} tris`;
  }

  open() {
    this.active = true;
    const modal = document.getElementById('tree-inspector-modal');
    modal.style.display = 'flex';

    setTimeout(() => {
      this.setupThreeScene();
      this.loadModelIn3D(this.selectedModelId, this.inspectorSeason);
      this.updateSpecs();

      // Trigger resize for Three renderer
      const container = document.getElementById('viewport-3d-container');
      if (this.renderer && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    }, 50);
  }

  close() {
    this.active = false;
    if (this.animReq) cancelAnimationFrame(this.animReq);
    const modal = document.getElementById('tree-inspector-modal');
    modal.style.display = 'none';
  }
}

// Global Inspector Instance
const treeInspector = new TreeInspector3D();
window.addEventListener('DOMContentLoaded', () => {
  treeInspector.init();
});
