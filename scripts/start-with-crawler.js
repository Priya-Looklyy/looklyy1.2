#!/usr/bin/env node

// Looklyy - Start React Frontend with Crawler Backend

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Looklyy with Fashion Crawler...\n');

// Start the Python crawler API
console.log('📡 Starting Fashion Crawler API...');
const crawlerProcess = spawn('python', ['-m', 'uvicorn', 'api.trending_api:app', '--reload', '--port', '8000'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'pipe'
});

crawlerProcess.stdout.on('data', (data) => {
  console.log(`[Crawler API] ${data.toString().trim()}`);
});

crawlerProcess.stderr.on('data', (data) => {
  console.log(`[Crawler API] ${data.toString().trim()}`);
});

// Give the API a moment to start
setTimeout(() => {
  console.log('\n⚛️  Starting React Frontend...');
  
  // Start the React development server
  const reactProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });

  reactProcess.on('close', (code) => {
    console.log(`\n🛑 React app exited with code ${code}`);
    crawlerProcess.kill();
  });

}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Looklyy...');
  crawlerProcess.kill();
  process.exit();
});

crawlerProcess.on('close', (code) => {
  console.log(`\n🛑 Crawler API exited with code ${code}`);
});
