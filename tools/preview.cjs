#!/usr/bin/env node
// Serves this folder over HTTPS on the local network, so a branch can be played on the Quest before it
// goes live. Nothing is uploaded: the headset loads the files straight from this computer.
//
//   node tools/preview.cjs <pem-with-key-and-certificate> [port]
//
// The Quest must be on the same Wi-Fi. Open https://<this computer's address>:<port>/ in the Quest Browser
// and accept the certificate warning once (the certificate is self-signed). WebXR needs HTTPS.
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const pem = process.argv[2];
const port = Number(process.argv[3] || 8443);
if (!pem) {
  console.error('usage: node tools/preview.cjs <pem> [port]');
  process.exit(1);
}
const both = fs.readFileSync(pem, 'utf8');
const ROOT = path.resolve(__dirname, '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.ogg': 'audio/ogg', '.glb': 'model/gltf-binary', '.ktx2': 'image/ktx2',
  '.uikitml': 'text/plain; charset=utf-8', '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8',
};

https
  .createServer({ key: both, cert: both }, (req, res) => {
    const url = new URL(req.url, 'https://x');
    let file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT) || /[\\/]\.git([\\/]|$)/.test(file)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { Location: url.pathname + '/' + url.search }).end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(ROOT, '404.html')));
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  })
  .listen(port, '0.0.0.0', () => {
    const ips = Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
    for (const ip of ips) console.log(`preview: https://${ip}:${port}/`);
  });
