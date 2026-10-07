// Saytı lokal açmaq üçün sadə server: node serve.js  ->  http://localhost:5190
const http = require('http'), fs = require('fs'), path = require('path');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
http.createServer((req, res) => {
  const p = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(__dirname)) return res.writeHead(403).end();
  fs.readFile(p, (err, data) => {
    if (err) return res.writeHead(404).end('Tapılmadı');
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }).end(data);
  });
}).listen(5190, () => console.log('Hastab Style: http://localhost:5190'));
