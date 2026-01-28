/**
 * XTermL Termux Bridge (Node.js)
 * Jalanin ini di Termux buat ngasih data real ke Dashboard:
 * 1. pkg install nodejs
 * 2. node bridge.js
 */
import http from 'http';
import { exec, spawn } from 'child_process';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// Function to get system metrics
const getStats = () => {
  return new Promise((resolve) => {
    try {
      // RAM Info (Linux/Termux)
      exec('free -m', (err, stdout) => {
        if (err) return resolve({ error: 'Failed' });
        const lines = stdout.split('\n');
        const memLine = lines[1].split(/\s+/);
        const ramTotal = (parseInt(memLine[1]) / 1024).toFixed(1);
        const ramUsed = (parseInt(memLine[2]) / 1024).toFixed(1);
        const ramPercentage = Math.round((parseInt(memLine[2]) / parseInt(memLine[1])) * 100);

        // Disk Info
        exec('df -h /data', (err2, stdout2) => {
          const diskLine = stdout2 ? stdout2.split('\n')[1].split(/\s+/) : [];
          const diskUsage = diskLine[4] ? parseInt(diskLine[4].replace('%', '')) : 0;

          // CPU Info (Mock for now, needs /proc/stat parsing for real)
          const cpuUsage = Math.floor(Math.random() * 20) + 5;

          resolve({
            cpuUsage,
            ramUsed: `${ramUsed}G`,
            ramTotal: `${ramTotal}G`,
            ramPercentage,
            diskUsage,
            platform: 'android'
          });
        });
      });
    } catch (e) {
      resolve({ error: "Could not read system data" });
    }
  });
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/stats') {
    const stats = await getStats();
    res.writeHead(200);
    res.end(JSON.stringify(stats));
  } 
  else if (url.pathname === '/api/exec' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { command } = JSON.parse(body);
      console.log(`Executing: ${command}`);
      exec(command, (err, stdout, stderr) => {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: !err,
          stdout: stdout,
          stderr: stderr,
          error: err ? err.message : null
        }));
      });
    });
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// WebSocket for Terminal
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Terminal: Client connected');

  // Default to bash, fallback to sh
  const shell = spawn('bash', ['-l'], {
    env: { ...process.env, TERM: 'xterm-256color' }
  });

  shell.stdout.on('data', (data) => ws.send(data.toString()));
  shell.stderr.on('data', (data) => ws.send(data.toString()));

  ws.on('message', (message) => {
    shell.stdin.write(message.toString());
  });

  shell.on('close', () => {
    console.log('Terminal: Shell closed');
    ws.close();
  });

  ws.on('close', () => {
    shell.kill();
  });
});

server.listen(PORT, () => {
  console.log(`🚀 XTermL Bridge running at http://localhost:${PORT}`);
  console.log(`Dashboard metrics and Terminal are now LIVE!`);
});
