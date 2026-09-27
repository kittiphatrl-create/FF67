const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// 1. Load the 4 palettes from Textures
function loadPalettes() {
  const palettes = {};
  ['Normal', 'Fall', 'Cold', 'Dry'].forEach(season => {
    const buf = fs.readFileSync(path.join(__dirname, 'Models', 'Textures', `Colorsheet Tree ${season}.png`));
    let offset = 8, chunks = [];
    while (offset < buf.length) {
      const len = buf.readUInt32BE(offset);
      const type = buf.toString('ascii', offset + 4, offset + 8);
      if (type === 'IDAT') chunks.push(buf.slice(offset + 8, offset + 8 + len));
      offset += 12 + len;
    }
    const dec = zlib.inflateSync(Buffer.concat(chunks));
    const bpp = 3;
    const grid = [];
    for (let by = 0; by < 4; by++) {
      const y = by * 4;
      const row = [];
      for (let bx = 0; bx < 4; bx++) {
        const x = bx * 4;
        const p = y * (1 + 16 * bpp) + 1 + x * bpp;
        row.push([dec[p], dec[p+1], dec[p+2]]);
      }
      grid.push(row);
    }
    palettes[season] = grid;
  });

  // Ensure Normal palette has lush fantasy foliage colors for all leaf blocks
  palettes['Normal'][1][1] = [45, 135, 55]; // lush leaf
  palettes['Normal'][1][2] = [68, 168, 62]; // bright canopy
  palettes['Normal'][2][1] = [28, 88, 38];  // deep pine
  palettes['Normal'][2][2] = [40, 120, 48]; // forest green
  palettes['Normal'][2][3] = [55, 155, 65]; // rich green
  palettes['Normal'][3][0] = [220, 38, 38]; // apple red
  palettes['Normal'][3][3] = [48, 160, 58]; // meadow leaf

  return palettes;
}

const palettes = loadPalettes();

// 2. Select 16 diverse 3D tree models across all 8 tree families
const selectedModels = [
  { id: 'type0_01', file: 'Tree Type0 01.dae', family: 'Oak (ต้นโอ๊ค)', name: 'Oak Tree (ต้นโอ๊คพุ่มใหญ่)', type: 0, scale: 1.0, trunkRadius: 16 },
  { id: 'type0_02', file: 'Tree Type0 02.dae', family: 'Oak (ต้นโอ๊ค)', name: 'Twin Oak (ต้นโอ๊คพุ่มคู่)', type: 0, scale: 0.95, trunkRadius: 15 },
  { id: 'type1_01', file: 'Tree Type1 01.dae', family: 'Pine (ต้นสน)', name: 'Mountain Pine (ต้นสนภูเขา)', type: 1, scale: 1.1, trunkRadius: 12 },
  { id: 'type1_02', file: 'Tree Type1 02.dae', family: 'Pine (ต้นสน)', name: 'Tall Pine (ต้นสนสูงเพรียว)', type: 1, scale: 1.15, trunkRadius: 12 },
  { id: 'type2_01', file: 'Tree Type2 01.dae', family: 'Birch (ต้นเบิร์ช)', name: 'Birch Tree (ต้นเบิร์ชเรียวสูง)', type: 2, scale: 1.05, trunkRadius: 12 },
  { id: 'type2_02', file: 'Tree Type2 02.dae', family: 'Birch (ต้นเบิร์ช)', name: 'Twin Birch (ต้นเบิร์ชคู่งาม)', type: 2, scale: 1.0, trunkRadius: 14 },
  { id: 'type3_01', file: 'Tree Type3 01.dae', family: 'Apple (ต้นแอปเปิล)', name: 'Apple Tree (ต้นแอปเปิลผลดก)', type: 3, scale: 1.0, trunkRadius: 15 },
  { id: 'type3_02', file: 'Tree Type3 02.dae', family: 'Bush (ต้นไม้พุ่ม)', name: 'Round Bush Tree (ต้นไม้พุ่มกลม)', type: 3, scale: 0.9, trunkRadius: 14 },
  { id: 'type4_01', file: 'Tree Type4 01.dae', family: 'Spruce (ต้นสปรูซ)', name: 'Spruce Tree (ต้นสปรูซป่าทึบ)', type: 4, scale: 1.1, trunkRadius: 14 },
  { id: 'type4_02', file: 'Tree Type4 02.dae', family: 'Spruce (ต้นสปรูซ)', name: 'Giant Spruce (ต้นสปรูซยักษ์)', type: 4, scale: 1.25, trunkRadius: 18 },
  { id: 'type5_01', file: 'Tree Type5 01.dae', family: 'Willow (ต้นหลิว)', name: 'Weeping Willow (ต้นหลิวลู่ลม)', type: 5, scale: 1.05, trunkRadius: 16 },
  { id: 'type5_02', file: 'Tree Type5 02.dae', family: 'Willow (ต้นหลิว)', name: 'Ancient Willow (ต้นหลิวโบราณ)', type: 5, scale: 1.2, trunkRadius: 20 },
  { id: 'type6_01', file: 'Tree Type6 01.dae', family: 'Acacia (ต้นอะเคเชีย)', name: 'Acacia Tree (ต้นอะเคเชียสะวันนา)', type: 6, scale: 1.0, trunkRadius: 15 },
  { id: 'type6_02', file: 'Tree Type6 02.dae', family: 'Acacia (ต้นอะเคเชีย)', name: 'Flat-Top Acacia (ต้นอะเคเชียทรงร่ม)', type: 6, scale: 1.1, trunkRadius: 16 },
  { id: 'type7_01', file: 'Tree Type7 01.dae', family: 'Palm (ต้นปาล์ม)', name: 'Coconut Palm (ต้นมะพร้าวชายหาด)', type: 7, scale: 1.1, trunkRadius: 12 },
  { id: 'type7_02', file: 'Tree Type7 02.dae', family: 'Palm (ต้นปาล์ม)', name: 'Fan Palm (ต้นปาล์มใบพัด)', type: 7, scale: 1.05, trunkRadius: 14 }
];

const modelsDir = path.join(__dirname, 'Models', 'Models');
const modelsData = {};

selectedModels.forEach(m => {
  const filePath = path.join(modelsDir, m.file);
  const xml = fs.readFileSync(filePath, 'utf8');

  const posMatch = xml.match(/<source id="[^"]+-positions">\s*<float_array [^>]*>([\s\S]*?)<\/float_array>/);
  const rawPos = posMatch[1].trim().split(/\s+/).map(Number);
  const positions = [];
  for (let i = 0; i < rawPos.length; i += 3) {
    positions.push([+rawPos[i].toFixed(2), +rawPos[i+1].toFixed(2), +rawPos[i+2].toFixed(2)]);
  }

  const uvMatch = xml.match(/<source id="[^"]+-map-0">\s*<float_array [^>]*>([\s\S]*?)<\/float_array>/);
  const rawUV = uvMatch ? uvMatch[1].trim().split(/\s+/).map(Number) : [];
  const uvs = [];
  for (let i = 0; i < rawUV.length; i += 2) {
    uvs.push([+rawUV[i].toFixed(3), +rawUV[i+1].toFixed(3)]);
  }

  const polyMatch = xml.match(/<polylist [^>]*count="(\d+)"[\s\S]*?<vcount>([\s\S]*?)<\/vcount>\s*<p>([\s\S]*?)<\/p>/);
  const vcounts = polyMatch[2].trim().split(/\s+/).map(Number);
  const rawP = polyMatch[3].trim().split(/\s+/).map(Number);

  let pIdx = 0;
  const triangles = [];

  for (let poly = 0; poly < vcounts.length; poly++) {
    const vc = vcounts[poly];
    const polyVerts = [];
    for (let v = 0; v < vc; v++) {
      const vIdx = rawP[pIdx];
      const uvIdx = rawP[pIdx + 2];
      pIdx += 3;
      polyVerts.push({
        p: positions[vIdx],
        uv: uvs[uvIdx] || [0.5, 0.5]
      });
    }

    for (let i = 1; i < polyVerts.length - 1; i++) {
      const v0 = polyVerts[0], v1 = polyVerts[i], v2 = polyVerts[i + 1];

      // Calculate normal
      const ax = v1.p[0] - v0.p[0], ay = v1.p[1] - v0.p[1], az = v1.p[2] - v0.p[2];
      const bx = v2.p[0] - v0.p[0], by = v2.p[1] - v0.p[1], bz = v2.p[2] - v0.p[2];
      let nx = ay * bz - az * by;
      let ny = az * bx - ax * bz;
      let nz = ax * by - ay * bx;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx = +(nx / len).toFixed(2);
      ny = +(ny / len).toFixed(2);
      nz = +(nz / len).toFixed(2);

      const avgU = +((v0.uv[0] + v1.uv[0] + v2.uv[0]) / 3).toFixed(3);
      const avgV = +((v0.uv[1] + v1.uv[1] + v2.uv[1]) / 3).toFixed(3);

      const bxCol = Math.min(3, Math.max(0, Math.floor(avgU * 4)));
      const byCol = Math.min(3, Math.max(0, 3 - Math.floor(avgV * 4)));

      triangles.push({
        p0: v0.p,
        p1: v1.p,
        p2: v2.p,
        n: [nx, ny, nz],
        c: [bxCol, byCol]
      });
    }
  }

  let minY = Infinity, maxY = -Infinity;
  positions.forEach(p => {
    if (p[1] < minY) minY = p[1];
    if (p[1] > maxY) maxY = p[1];
  });

  modelsData[m.id] = {
    id: m.id,
    file: m.file,
    name: m.name,
    family: m.family,
    type: m.type,
    scale: m.scale,
    trunkRadius: m.trunkRadius,
    height: +(maxY - minY).toFixed(2),
    triangles: triangles
  };
});

const outputCode = `/**
 * Pre-compiled 3D Tree Models Data from Broken Vector Low Poly Tree Pack
 * Includes 3D geometry (vertices, normals, UV palette blocks) and seasonal palettes
 */
const TREE_PALETTES = ${JSON.stringify(palettes, null, 2)};

const TREE_MODELS = ${JSON.stringify(modelsData)};
`;

fs.writeFileSync(path.join(__dirname, 'treeData.js'), outputCode);
console.log('Successfully generated treeData.js, size:', (outputCode.length / 1024).toFixed(1), 'KB');
