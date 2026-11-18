const http = require('http');

// Sesuaikan TARGETS dengan komponen sistem kelompok
const TARGETS = [
  { name: 'Gateway', url: 'http://localhost:3000/health' },
  { name: 'Order Service', url: 'http://localhost:3001/health' },
  { name: 'Product Service', url: 'http://localhost:3002/health' }
];

// Tracks the previous state to know when to print ALERT or RECOVERED
const states = {};
TARGETS.forEach(t => states[t.name] = true); // Assume UP initially

function checkService(target) {
  const req = http.get(target.url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const isUp = res.statusCode === 200;
      handleStateChange(target.name, isUp);
    });
  });

  req.on('error', () => {
    handleStateChange(target.name, false);
  });

  req.setTimeout(2000, () => {
    req.destroy();
    handleStateChange(target.name, false);
  });
}

function handleStateChange(name, isCurrentlyUp) {
  const wasUp = states[name];
  
  if (wasUp && !isCurrentlyUp) {
    console.log(`[${new Date().toISOString()}] 🔴 ALERT: ${name} is DOWN!`);
  } else if (!wasUp && isCurrentlyUp) {
    console.log(`[${new Date().toISOString()}] 🟢 RECOVERED: ${name} is back UP!`);
  }
  
  states[name] = isCurrentlyUp;
}

console.log('Starting system monitor...');
setInterval(() => {
  TARGETS.forEach(checkService);
}, 3000); // Checks every 3 seconds
