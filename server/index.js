const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || null; // set in env for shared-secret validation

// Basic admin credentials (set via env)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Database (SQLite)
const DB_FILE = path.join(__dirname, 'submissions.db');
const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    received_at TEXT,
    ip TEXT,
    payload TEXT
  )`);
});

function appendLogFile(entry) {
  const LOG_FILE = path.join(__dirname, 'submissions.log');
  const line = JSON.stringify(entry) + '\n';
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}

app.get('/', (req, res) => {
  res.send('Kivasa Webhook Receiver — POST /webhook');
});

// Require Basic Auth middleware for admin endpoints
function requireAuth(req, res, next) {
  const auth = req.get('authorization');
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Kivasa Admin"');
    return res.status(401).send('Authentication required');
  }
  const token = auth.split(' ')[1] || '';
  const creds = Buffer.from(token, 'base64').toString().split(':');
  const user = creds[0] || '';
  const pass = creds[1] || '';
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="Kivasa Admin"');
    return res.status(401).send('Invalid credentials');
  }
  next();
}

app.post('/webhook', (req, res) => {
  // Optional shared-secret header check
  if (WEBHOOK_SECRET) {
    const provided = req.get('x-webhook-secret') || req.query.secret || null;
    if (!provided || provided !== WEBHOOK_SECRET) {
      return res.status(401).json({ success: false, message: 'Invalid webhook secret' });
    }
  }

  const payload = {
    received_at: new Date().toISOString(),
    ip: req.ip,
    headers: req.headers,
    body: req.body
  };

  // Write to log file
  appendLogFile(payload);

  // Store in SQLite
  const stmt = db.prepare('INSERT INTO submissions (received_at, ip, payload) VALUES (?, ?, ?)');
  stmt.run(payload.received_at, payload.ip, JSON.stringify(req.body || {}), function (err) {
    if (err) {
      console.error('DB insert error:', err);
    }
  });
  stmt.finalize();

  // Also keep a human-readable last submission file
  const backupFile = path.join(__dirname, 'last-submission.json');
  fs.writeFile(backupFile, JSON.stringify(payload, null, 2), () => {});

  res.json({ success: true });
});

// Admin API: list submissions (protected)
app.get('/api/submissions', requireAuth, (req, res) => {
  db.all('SELECT id, received_at, ip, payload FROM submissions ORDER BY id DESC LIMIT 1000', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    // Parse JSON payload for convenience
    const parsed = rows.map(r => ({ id: r.id, received_at: r.received_at, ip: r.ip, data: (() => { try { return JSON.parse(r.payload); } catch(e){ return r.payload; } })() }));
    res.json({ success: true, submissions: parsed });
  });
});

// Simple admin UI
app.get('/admin', (req, res) => {
  res.send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Submissions — Admin</title></head><body style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:1rem;">
  <h1>Kivasa Submissions (Admin)</h1>
  <p>Enter admin credentials to load recent submissions.</p>
  <div>
    <label>Username: <input id="u" type="text" value="${ADMIN_USER}"></label>
    <label style="margin-left:1rem">Password: <input id="p" type="password"></label>
    <button id="load">Load Submissions</button>
    <button id="csv">Export CSV</button>
  </div>
  <div id="result" style="margin-top:1rem;font-size:0.9rem;"></div>
  <script>
    function toCSV(rows){
      if(!rows || !rows.length) return '';
      const keys = Object.keys(rows[0]);
      const lines = [keys.join(',')];
      rows.forEach(r=>{
        const vals = keys.map(k=>{
          const v = r[k];
          if(typeof v === 'object') return '"'+JSON.stringify(v).replace(/"/g,'""')+'"';
          return '"'+String(v).replace(/"/g,'""')+'"';
        });
        lines.push(vals.join(','));
      });
      return lines.join('\n');
    }
    let lastRows = [];
    document.getElementById('load').addEventListener('click', async ()=>{
      const u = document.getElementById('u').value;
      const p = document.getElementById('p').value;
      const token = btoa(u+':'+p);
      try{
        const r = await fetch('/api/submissions', { headers: { 'Authorization': 'Basic '+token } });
        if(r.status === 401) { document.getElementById('result').textContent = 'Unauthorized'; return; }
        const j = await r.json();
        if(!j.success) { document.getElementById('result').textContent = 'Error: '+(j.error||'unknown'); return; }
        const table = document.createElement('div');
        table.innerHTML = '<pre style="white-space:pre-wrap;">'+JSON.stringify(j.submissions, null, 2)+'</pre>';
        document.getElementById('result').innerHTML = '';
        document.getElementById('result').appendChild(table);
        lastRows = j.submissions;
      }catch(e){ document.getElementById('result').textContent = 'Fetch error: '+e.message }
    });
    document.getElementById('csv').addEventListener('click', ()=>{
      if(!lastRows.length) return alert('Load submissions first');
      const csv = toCSV(lastRows.map(r=>({ id:r.id, received_at:r.received_at, ip:r.ip, data: r.data }))); 
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'submissions.csv'; a.click(); URL.revokeObjectURL(url);
    });
  </script>
</body></html>`);
});

app.listen(PORT, () => console.log(`Webhook receiver listening on http://localhost:${PORT}/webhook`));
