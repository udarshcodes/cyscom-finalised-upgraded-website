const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fileName = path.basename(file).replace(/[./\\]/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
const fullPath = path.join(dir, fileName);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else {
      if (/\.(png|jpe?g|gif|svg|webp)$/i.test(file)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const publicDir = path.join(__dirname, 'public');
const writeupsDir = path.join(publicDir, 'writeups');
const imgDir = path.join(publicDir, 'img');

let allFiles = [];
allFiles = getFiles(writeupsDir, allFiles);
allFiles = getFiles(imgDir, allFiles);

const map = {};
for (const file of allFiles) {
    const basename = path.basename(file);
    const relPath = path.relative(publicDir, file).replace(/\\/g, '/');
    
    // map "binwalk.png" -> "writeups/Zypher_2023/..."
    map[basename] = relPath;
    
    // Also map "level7/2.png" -> "writeups/Zypher_2023/writeupfiles/level7/2.png"
    const parts = relPath.split('/');
    for(let i=0; i<parts.length; i++) {
        const partialPath = parts.slice(i).join('/');
        map[partialPath] = relPath;
    }
}

fs.writeFileSync(path.join(__dirname, 'src', 'modules', 'writeups', 'image_map.json'), JSON.stringify(map, null, 2));
console.log('Image map generated with ' + Object.keys(map).length + ' keys.');
