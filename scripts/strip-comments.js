const fs = require('fs').promises;
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ALLOWED_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      await walk(full);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) continue;
      await processFile(full);
    }
  }
}

function hasPreserveHeader(text) {
  // detect SPDX or copyright or license keywords in the first comment block
  const m = text.match(/^\s*(\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)/);
  if (!m) return false;
  const header = m[0].toLowerCase();
  return header.includes('spdx') || header.includes('copyright') || header.includes('license');
}

async function processFile(filePath) {
  try {
    let text = await fs.readFile(filePath, 'utf8');
    if (!text) return;

    const preserve = hasPreserveHeader(text);
    let header = '';
    if (preserve) {
      const m = text.match(/^\s*(\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)/);
      header = m ? m[0] : '';
      text = text.slice(header.length);
    }

    // Remove block comments 
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove single-line comments // ... (but not inside strings)
    // A simple approach: remove // comments that start at line or after whitespace
    text = text.replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, '$1');
    // Remove JSX comments {}
    text = text.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

    // Trim extra blank lines
    text = text.replace(/\n{3,}/g, '\n\n');

    const out = preserve ? header + text : text;
    await fs.writeFile(filePath, out, 'utf8');
    console.log('Processed', path.relative(ROOT, filePath));
  } catch (err) {
    console.error('Failed to process', filePath, err.message || err);
  }
}

(async () => {
  const target = path.join(ROOT, 'src');
  console.log('Stripping comments under', target);
  await walk(ROOT);
  console.log('Done');
})();
