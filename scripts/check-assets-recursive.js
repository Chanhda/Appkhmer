const fs = require('fs');
const path = require('path');

function checkDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      checkDir(filePath);
    } else if (file.endsWith('.png')) {
      const buffer = Buffer.alloc(8);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 8, 0);
      fs.closeSync(fd);
      
      let type = 'unknown';
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        type = 'PNG';
      } else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        type = 'JPEG';
      } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer[8] === 0x57 && buffer[9] === 0x45) {
        type = 'WEBP/RIFF';
      }
      
      if (type !== 'PNG') {
        console.log(`[MISMATCH] ${path.relative(path.join(__dirname, '..'), filePath)}: Real format = ${type}`);
      }
    }
  });
}

checkDir(path.join(__dirname, '../assets'));
console.log('Scan completed.');
