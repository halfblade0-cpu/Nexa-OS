const express = require('express');
const path = require('path');

// App server: serves the nexaOS static site (this repo) on port 3000
const app = express();
const root = path.resolve(__dirname);
app.use(express.static(root));

app.get('/health', (req, res) => res.json({ok:true, server: 'nexaOS app'}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`nexaOS app available: http://localhost:${PORT}`));

// Example target server: lightweight site on port 8080 that the in-app browser can load
const target = express();
target.get('/', (req, res) => {
  res.send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local 8080 Demo</title></head><body style="font-family:system-ui,Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f7fb;color:#111;"><div style="text-align:center;"><h1>Local server on port 8080</h1><p>This is a simple demo page served from <strong>http://localhost:8080</strong>. Use the in-app browser in nexaOS to load other sites.</p></div></body></html>`);
});

const TARGET_PORT = 8080;
target.listen(TARGET_PORT, () => console.log(`Example target available: http://localhost:${TARGET_PORT}`));
