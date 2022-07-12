const { app, BrowserWindow } = require('electron');
const Blockly = require('blockly');

const path = require('path');

const prod = false; 


const createWindow = () => {
    const win = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        devTools: !prod, // disable devtools
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js'),
      }
    });

    if(prod)
      win.setMenu(null);
  
    win.loadFile('index.html');

  }

  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })