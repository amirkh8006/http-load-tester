const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;
let ssrProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // Load SSR frontend served at localhost
  mainWindow.loadURL('http://localhost:4002'); // or whatever your SSR port is

  mainWindow.on('closed', function () {
    mainWindow = null;
    if (backendProcess) backendProcess.kill();
    if (ssrProcess) ssrProcess.kill();
  });
}

function startBackend() {
  backendProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, '../backend'),
    shell: true,
  });

  backendProcess.stdout.on('data', data => {
    console.log(`[Backend] ${data}`);
  });

  backendProcess.stderr.on('data', data => {
    console.error(`[Backend Error] ${data}`);
  });
}

function startSSR() {
  ssrProcess = spawn('node', ['dist/hey-front/server/server.mjs'], {
    cwd: path.join(__dirname, '../frontend'),
    shell: true,
  });

  ssrProcess.stdout.on('data', data => {
    console.log(`[SSR] ${data}`);
  });

  ssrProcess.stderr.on('data', data => {
    console.error(`[SSR Error] ${data}`);
  });
}

app.on('ready', () => {
  startBackend();
  startSSR();
  setTimeout(createWindow, 3000); // wait for SSR server to boot up
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
