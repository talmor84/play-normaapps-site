// Writes the QR codes the pages show. Run after changing a URL: node tools/make-qr.cjs
// Uses qrcode-generator 1.4.4 (MIT, Kazuhiko Arase), vendored in tools/.
const fs = require('fs');
const path = require('path');
const qrcode = require('./qrcode-generator.js');
const codes = { 'qr-home.svg': 'https://play.normaapps.com/', 'qr-kaito.svg': 'https://play.normaapps.com/kaito/' };
for (const [file, url] of Object.entries(codes)) {
  const q = qrcode(0, 'M');
  q.addData(url);
  q.make();
  const svg = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true })
    .replace('fill="white"', 'fill="#efe4cd"')
    .replace(/fill="black"/g, 'fill="#0c0a09"');
  fs.writeFileSync(path.join(__dirname, '..', 'img', file), svg + '\n');
  console.log(file, url);
}
