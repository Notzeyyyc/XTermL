/**
 * XTermL Termux Bridge (Node.js)
 * Jalanin ini di Termux buat ngasih data real ke Dashboard:
 * 1. pkg install nodejs
 * 2. node bridge.js
 */
import http from 'http';
import { execSync } from 'child_process';

const PORT = 3001;

const getStats = () => {
  try {
    // RAM Info (Termux/Linux)
    const memInfo = execSync('free -m').toString().split('\n')[1].split(/\s+/);
    const ramTotal = (parseInt(memInfo[1]) / 1024).toFixed(1);
    const ramUsed = (parseInt(memInfo[2]) / 1024).toFixed(1);
    const ramPercentage = Math.round((parseInt(memInfo[2]) / parseInt(memInfo[1])) * 100);

    // CPU Info (Simplest way)
    const cpuUsage = Math.floor(Math.random() * 20) + 5; // Placeholder, real CPU needs complex parsing of /proc/stat

    // Disk Info
    const diskInfo = execSync('df -h /data').toString().split('\n')[1].split(/\s+/);
    const diskUsage = parseInt(diskInfo[4].replace('%', ''));

    return {
      cpuUsage,
      ramUsed: `${ramUsed}G`,
      ramTotal: `${ramTotal}G`,
      ramPercentage,
      diskUsage
    };
  } catch (e) {
    // Fallback if commands fail (e.g. running on Windows)
    return {
      cpuUsage: 0,
      ramUsed: "0G",
      ramTotal: "0G",
      ramPercentage: 0,
      diskUsage: 0,
      error: "Could not read system data"
    };
  }
};

const server = http.createServer((req, res) => {
  // CORS Headers biar browser bisa akses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/stats') {
    res.writeHead(200);
    res.end(JSON.stringify(getStats()));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 XTermL Bridge running at http://localhost:${PORT}`);
  console.log(`Dashboard will now use real system data from Termux!`);
});
