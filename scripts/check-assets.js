const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../assets/heritages');
const files = fs.readdirSync(dir);

files.forEach(file => {
  const filePath = path.join(dir, file);
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
    // RIFF .... WE
    type = 'WEBP/RIFF';
  }
  
  console.log(`${file}: Detected real format = ${type} (Hex: ${buffer.toString('hex')})`);
});
