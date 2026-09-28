const fs = require('fs');
const path = require('path');

const srcRoot = 'c:/Users/kitti/Downloads/FF67';
const outDir = 'c:/Users/kitti/Downloads/FF67_itch';

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

const filesToScan = ['index.html', 'style.css', 'main.js', 'treeData.js', 'treeRenderer.js'];

const usedFiles = new Set([
  'index.html',
  'style.css',
  'main.js',
  'treeData.js',
  'treeRenderer.js',
  'File.png',
  'title_bg.jpg',
  'lib/three.min.js',
  'lib/OrbitControls.js'
]);

for (const f of filesToScan) {
  const content = fs.readFileSync(path.join(srcRoot, f), 'utf-8');
  const regex = /['"]([^'"]+?\.(?:png|jpg|jpeg|gif|PNG|JPG|woff2|woff|ttf))['"]/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    let p = m[1];
    if (p.startsWith('http') || p.startsWith('data:')) continue;
    try { p = decodeURIComponent(p); } catch (e) {}
    p = p.replace(/^\.?\//, '');
    
    if (fs.existsSync(path.join(srcRoot, p))) {
      usedFiles.add(p);
    }
  }
}

// 1. Harvest base files
const harvestBase = 'Harvest Sumer Free Ver. Pack';
const harvestFiles = [
  'Harvest BG.png',
  'tilesets/fences and ladders etc.png',
  'Vegetation/Some Objects.png',
  'Vegetation/Trees 3.png',
  'falling leaf/4 frames.png',
  'tilesets/Set 1.0.png'
];
harvestFiles.forEach(hf => usedFiles.add(`${harvestBase}/${hf}`));

// 2. isometric nature pack: grass1..10, dirt1..4, stone1..4
for (let i = 1; i <= 10; i++) usedFiles.add(`isometric-nature-pack/grass${i}.png`);
for (let i = 1; i <= 4; i++) usedFiles.add(`isometric-nature-pack/dirt${i}.png`);
for (let i = 1; i <= 4; i++) usedFiles.add(`isometric-nature-pack/stone${i}.png`);

// 3. Free Pixel Effects Pack
usedFiles.add('Free Pixel Effects Pack/10_weaponhit_spritesheet.png');
usedFiles.add('Free Pixel Effects Pack/11_fire_spritesheet.png');
usedFiles.add('Free Pixel Effects Pack/19_freezing_spritesheet.png');
usedFiles.add('Free Pixel Effects Pack/1_magicspell_spritesheet.png');

// 4. chests
usedFiles.add('oubliette_chests_twg/oubliette_chests/chests.PNG');

// 5. portraits
if (fs.existsSync(path.join(srcRoot, 'portraits'))) {
  for (const pf of fs.readdirSync(path.join(srcRoot, 'portraits'))) {
    usedFiles.add(`portraits/${pf}`);
  }
}

// 6. icons in Icons/
if (fs.existsSync(path.join(srcRoot, 'Icons'))) {
  for (const ic of fs.readdirSync(path.join(srcRoot, 'Icons'))) {
    usedFiles.add(`Icons/${ic}`);
  }
}

console.log('Total files identified:', usedFiles.size);

// Copy each file into outDir
let copiedCount = 0;
let missingCount = 0;

for (const rel of usedFiles) {
  const src = path.join(srcRoot, rel);
  const dest = path.join(outDir, rel);
  
  if (fs.existsSync(src)) {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    fs.copyFileSync(src, dest);
    copiedCount++;
  } else {
    console.warn('[MISSING ON DISK]:', rel);
    missingCount++;
  }
}

console.log(`Copied ${copiedCount} files. Missing: ${missingCount}`);
