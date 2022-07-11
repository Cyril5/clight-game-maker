const { app, BrowserWindow } = require('electron');
const Blockly = require('blockly');
const ThreeJS = require('three');

const path = require('path');

const prod = false; 


const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: !prod // disable devtools
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