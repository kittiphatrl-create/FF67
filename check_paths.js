const fs = require('fs');
const path = require('path');

function checkExactCase(relPath) {
  let clean = relPath.replace(/^\.?\//, '');
  const parts = clean.split('/');
  let curr = '.';
  for (const part of parts) {
    if (!part) continue;
    if (!fs.existsSync(curr)) return { ok: false, reason: 'Parent not found: ' + curr };
    const list = fs.readdirSync(curr);
    if (!list.includes(part)) {
      const match = list.find(x => x.toLowerCase() === part.toLowerCase());
      return { ok: false, part, expected: part, found: match, curr };
    }
    curr = path.join(curr, part);
  }
  return { ok: true };
}

const files = ['index.html', 'style.css', 'main.js'];
const allRefs = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf-8');
  const regex = /['"]([^'"]+?\.(?:png|jpg|jpeg|gif|PNG|JPG))['"]/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    if (!m[1].startsWith('http') && !m[1].startsWith('data:')) {
      allRefs.push({ file: f, path: m[1] });
    }
  }
}

console.log('Total references to test:', allRefs.length);
const failed = [];
for (const item of allRefs) {
  let decoded = item.path;
  try { decoded = decodeURIComponent(item.path); } catch(e){}
  const res = checkExactCase(decoded);
  if (!res.ok) {
    failed.push({ file: item.file, path: item.path, res });
  }
}

console.log('Failed count:', failed.length);
console.log(JSON.stringify(failed, null, 2));
