import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  let fullPath = path.join(dist, urlPath);

  try {
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const indexFile = path.join(fullPath, 'index.html');
        if (fs.existsSync(indexFile)) {
          fullPath = indexFile;
        } else {
          fullPath = path.join(dist, '404.html');
        }
      }
    } else {
      if (fs.existsSync(fullPath + '.html')) {
        fullPath = fullPath + '.html';
      } else {
        fullPath = path.join(dist, '404.html');
      }
    }

    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(dist, '404.html');
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mime[ext] || 'application/octet-stream';
    const content = fs.readFileSync(fullPath);

    res.writeHead(fullPath.endsWith('404.html') ? 404 : 200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error: ' + err.message);
  }
});

const PORT = 4321;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
