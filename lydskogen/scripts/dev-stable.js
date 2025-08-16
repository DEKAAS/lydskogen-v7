#!/usr/bin/env node

const { spawn } = require('child_process');
const { rmSync } = require('fs');
const path = require('path');

console.log('🚀 Starting stable dev server...');

let restartCount = 0;
const maxRestarts = 3;

function cleanCache() {
  try {
    rmSync(path.join(__dirname, '../.next'), { recursive: true, force: true });
    console.log('✅ Cleaned .next cache');
  } catch (error) {
    // Cache might not exist
  }
}

function startDev() {
  cleanCache();
  
  const devProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  devProcess.on('error', (error) => {
    console.error('❌ Dev process error:', error);
    handleRestart();
  });

  devProcess.on('exit', (code) => {
    if (code !== 0) {
      console.log(`⚠️  Dev process exited with code ${code}`);
      handleRestart();
    }
  });

  // Listen for manual restart trigger
  process.on('SIGUSR1', () => {
    console.log('🔄 Manual restart triggered');
    devProcess.kill();
    setTimeout(startDev, 1000);
  });
}

function handleRestart() {
  if (restartCount < maxRestarts) {
    restartCount++;
    console.log(`🔄 Restarting dev server (attempt ${restartCount}/${maxRestarts})...`);
    setTimeout(startDev, 2000);
  } else {
    console.log('❌ Max restarts reached. Please check your code and run manually.');
    process.exit(1);
  }
}

// Start the dev server
startDev();

// Reset restart count after successful run (5 minutes)
setTimeout(() => {
  restartCount = 0;
  console.log('✅ Reset restart counter');
}, 300000);