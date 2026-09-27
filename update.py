import re

with open("treeRenderer.js", "r", encoding="utf-8") as f:
    tr = f.read()

# Make trees perfectly vertical by eliminating pitch/yaw distortion (use orthogonal or tweak anchor)
# Wait, let's just zero out the windSway to stop it from moving so much, or tweak rotation.
tr = tr.replace("const windSway = Math.sin(time / 1200 + this.swayPhase) * 0.035;", "const windSway = Math.sin(time / 1200 + this.swayPhase) * 0.01;")
with open("treeRenderer.js", "w", encoding="utf-8") as f:
    f.write(tr)


with open("main.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add TifaRenderer
tifa_class = """
class TifaRenderer {
  px(ctx, color, x, y, w, h) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
  draw(ctx, x, y, direction, frame, state = 'idle', scale = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    let bobY = (state === 'walk' || state === 'run') ? Math.sin(frame * Math.PI) * 2.5 : Math.sin(Date.now() / 380) * 0.9;
    ctx.translate(0, bobY);
    
    // Base body parts
    this.px(ctx, '#f8fafc', -7, -2, 14, 10);
    this.px(ctx, '#18181b', -8, 6, 16, 4);
    this.px(ctx, '#18181b', -5, -2, 2, 8);
    this.px(ctx, '#18181b', 3, -2, 2, 8);
    this.px(ctx, '#fed7aa', -6, -14, 12, 12);
    this.px(ctx, '#18181b', -4, -6, 8, 2);
    this.px(ctx, '#dc2626', -4, -9, 2, 2);
    this.px(ctx, '#dc2626', 2, -9, 2, 2);
    this.px(ctx, '#18181b', -8, -16, 16, 4);
    this.px(ctx, '#27272a', -7, -18, 14, 3);
    this.px(ctx, '#18181b', -9, -14, 4, 16);
    this.px(ctx, '#18181b', 5, -14, 4, 16);

    if (direction === 'battle') {
      this.px(ctx, '#18181b', -8, 8, 6, 8);
      this.px(ctx, '#09090b', -8, 15, 6, 5);
      this.px(ctx, '#18181b', 4, 8, 6, 8);
      this.px(ctx, '#09090b', 4, 15, 6, 5);
      this.px(ctx, '#ef4444', -12, 0, 5, 5);
      this.px(ctx, '#ef4444', 10, -4, 5, 5);
      this.px(ctx, '#18181b', -4, -2, 8, 18);
    }
    ctx.restore();
  }
}
"""
content = content.replace("class BlackMageRenderer {", tifa_class + "\n// Black Mage Companion Sprite\nclass BlackMageRenderer {")

# 2. Add Slime to EnemyRenderer
slime_render = """
    if (enemy.name.includes('Slime')) {
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
    } else if (enemy.element === 'fire') {"""
content = content.replace("if (enemy.element === 'fire') {", slime_render)


# 3. Remove Giant Spruce from FieldWorld
content = re.sub(r"\s*new TreeInstance\([^,]+,\s*[^,]+,\s*'type4_02'.*?,", "", content)


# 4. Add Tifa to party
tifa_party = """
      {
        id: 'tifa', name: 'Tifa', job: 'Monk', avatar: '🥊',
        hp: 420, maxHp: 420, mp: 50, maxMp: 50, limit: 10, maxLimit: 100, atk: 75, magic: 30
      }
"""
content = content.replace("id: 'cloud',", "id: 'cloud',")
party_str = """      {
        id: 'vivi',"""
content = content.replace(party_str, tifa_party + ",\n" + party_str)

# 5. Add Tifa to drawing in Arena
draw_tifa = """
    this.cloudRenderer.draw(ctx, partyBaseX - 30, partyBaseY + 20, 'battle', 0, 'idle', 1.4);
    this.tifaRenderer = this.tifaRenderer || new TifaRenderer();
    this.tifaRenderer.draw(ctx, partyBaseX - 45, partyBaseY - 20, 'battle', 0, 'idle', 1.35);
    this.mageRenderer.draw(ctx, partyBaseX - 80, partyBaseY - 60, 1.3);
"""
content = content.replace("""    this.cloudRenderer.draw(ctx, partyBaseX - 30, partyBaseY + 20, 'battle', 0, 'idle', 1.4);
    this.mageRenderer.draw(ctx, partyBaseX - 70, partyBaseY - 30, 1.3);""", draw_tifa)


# 6. Change cursor to glowing selection
cursor_str = """
        // Highlight ring around selected enemy
        if (idx === this.selectedEnemyIdx) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(enemyBaseX + idx * 40, ey + 24, 28, 12, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
"""
glowing_cursor = """
        if (idx === this.selectedEnemyIdx) {
          const time = Date.now();
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#38bdf8';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.beginPath();
          ctx.ellipse(enemyBaseX + idx * 40, ey + 24, 28 + Math.sin(time/150)*4, 12 + Math.sin(time/150)*2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          const pY = ey - 40 + Math.sin(time/100)*5;
          ctx.moveTo(enemyBaseX + idx * 40 - 10, pY - 15);
          ctx.lineTo(enemyBaseX + idx * 40 + 10, pY - 15);
          ctx.lineTo(enemyBaseX + idx * 40, pY);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
"""
content = content.replace(cursor_str, glowing_cursor)

# 7. Add City Map transition in updatePlayerExploration
city_transition = """
  if (playerX > world.width - 40 && currentMapId === 'forest') {
    switchMap('city');
    playerX = 50;
  } else if (playerX < 40 && currentMapId === 'city') {
    switchMap('forest');
    playerX = world.width - 50;
  }
"""
content = content.replace("if (dx === 0 && dy === 0) {", city_transition + "\n  if (dx === 0 && dy === 0) {")

# 8. Add CityMap Class and NPC/Shop logic
city_map_class = """
class CityMap {
  constructor(w = 1600, h = 1200) {
    this.width = w; this.height = h;
    this.npcs = [
      { x: 400, y: 400, name: 'Mayor', text: 'Welcome to Midgar Edge! We have a shop nearby.' },
      { x: 700, y: 350, name: 'Shopkeeper', text: 'I sell potions!', isShop: true }
    ];
    this.trees = [];
    this.monsters = [];
    this.weather = new SeasonalWeatherSystem(w, h);
  }
  draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir) {
    ctx.fillStyle = '#64748b'; // stone ground
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw buildings (simple blocks)
    ctx.fillStyle = '#334155';
    ctx.fillRect(200, 100, 300, 200);
    ctx.fillRect(600, 100, 300, 200);
    ctx.fillStyle = '#f59e0b'; // windows
    ctx.fillRect(250, 150, 40, 40);
    ctx.fillRect(650, 150, 40, 40);

    // Draw NPCs
    this.npcs.forEach(npc => {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(npc.x - 10, npc.y - 20, 20, 20);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(npc.name, npc.x - 10, npc.y - 25);
    });

    cloudFieldRenderer.draw(ctx, playerX, playerY, playerDir, animFrame, playerState, 1.1);
    this.weather.update();
    this.weather.draw(ctx);
  }
}
let currentMapId = 'forest';
const cityWorld = new CityMap();
function switchMap(mapId) {
  currentMapId = mapId;
}
"""
content = content.replace("class FieldWorld {", city_map_class + "\nclass FieldWorld {")

# Update render call in gameLoop to use currentMap
content = content.replace("world.draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir);", 
"""
    if (currentMapId === 'forest') {
      world.draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir);
    } else {
      cityWorld.draw(ctx, time, playerX, playerY, cloudFieldRenderer, animFrame, playerState, playerDir);
    }
""")

# Also in collision updates
update_coll = """
  const curWorld = currentMapId === 'forest' ? world : cityWorld;
  // Solid tree trunk collision
  curWorld.trees.forEach(t => {
"""
content = content.replace("""  // Solid tree trunk collision
  world.trees.forEach(t => {""", update_coll)

update_mon = """
  // Check collision with roaming monsters on map
  curWorld.monsters.forEach(m => {
"""
content = content.replace("""  // Check collision with roaming monsters on map
  world.monsters.forEach(m => {""", update_mon)


# Dialog trigger logic
dialog_logic = """
      if (currentMode === 'exploration') {
        let npcFound = false;
        if (currentMapId === 'city') {
          const npc = cityWorld.npcs.find(n => Math.hypot(playerX - n.x, playerY - n.y) < 60);
          if (npc) {
            npcFound = true;
            const db = document.getElementById('dialog-box');
            if (db.style.display === 'block') {
              db.style.display = 'none';
              if (npc.isShop) document.getElementById('shop-menu').style.display = 'block';
            } else {
              db.style.display = 'block';
              document.getElementById('dialog-name').textContent = npc.name;
              document.getElementById('dialog-text').textContent = npc.text;
            }
          }
        }
        if (!npcFound && currentMapId === 'forest') {
          const nearTree = world.trees.find(t => Math.hypot(playerX - t.x, playerY - t.y) < 60);
"""
content = content.replace("""      if (currentMode === 'exploration') {
        // Check if player is near any tree to shake it
        const nearTree = world.trees.find(t => Math.hypot(playerX - t.x, playerY - t.y) < 60);""", dialog_logic)

content = content.replace("""            updateBattleHUD();
          }
        }
      }""", """            updateBattleHUD();
          }
        }
      }
      }""") # Balance braces

# Add Slime encounter
slime_enc = """
    if (encounterType === 'water') {
      this.enemies = [
        { name: 'Water Slime A', element: 'water', hp: 350, maxHp: 350, atk: 45 },
        { name: 'Water Slime B', element: 'water', hp: 260, maxHp: 260, atk: 38 }
      ];
    }
"""
content = re.sub(r"if \(encounterType === 'water'\) \{.*?\}", slime_enc.strip(), content, flags=re.DOTALL)


# Fix the slashing effect visual
slash_fx = """
    // VFX
    const enemyY = canvas.height * 0.38 + this.selectedEnemyIdx * 60;
    const enemyX = canvas.width * 0.68;
    
    // Slash Animation
    ctx.save();
    combatVfx.addBurst(enemyX, enemyY, '#cbd5e1', 12, 5);
    combatVfx.addText(`${damage}`, enemyX, enemyY - 10, '#ffffff');
    // Add Slash Lines
    for(let i=0; i<3; i++) {
        combatVfx.addText('╱', enemyX + (Math.random()-0.5)*40, enemyY + (Math.random()-0.5)*40, '#f8fafc', true);
    }
    ctx.restore();
"""
content = re.sub(r"// VFX\s*combatVfx\.addBurst\(canvas\.width \* 0\.68, canvas\.height \* 0\.38 \+ this\.selectedEnemyIdx \* 60, '#cbd5e1', 12\);\s*combatVfx\.addText\(`\$\{damage\}`.*?\);", slash_fx.strip(), content, flags=re.DOTALL)


# Burn Status
burn_logic = """
    this.enemyTurn();
"""
burn_logic_new = """
    // Burn Status Damage
    this.enemies.forEach((e, i) => {
      if (e.hp > 0 && e.burn > 0) {
        const bdmg = 20;
        e.hp = Math.max(0, e.hp - bdmg);
        e.burn--;
        combatVfx.addText(`🔥 -${bdmg}`, canvas.width * 0.68, canvas.height * 0.38 + i * 60, '#f97316');
        setCombatLog(`🔥 ${e.name} โดนเผาไหม้ทำดาเมจ -${bdmg}! (เหลืออีก ${e.burn} เทิร์น)`);
      }
    });
    setTimeout(() => this.enemyTurn(), 800);
"""
content = content.replace(burn_logic, burn_logic_new)

# Apply Burn when using fire magic
fire_burn = """
    if (element === 'fire') {
      target.burn = 2; // 2 turns of burn
    }
"""
content = content.replace("target.hp = Math.max(0, target.hp - damage);", "target.hp = Math.max(0, target.hp - damage);\n" + fire_burn)


with open("main.js", "w", encoding="utf-8") as f:
    f.write(content)
