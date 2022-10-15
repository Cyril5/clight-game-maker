import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import * as path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils';

import { Project } from '../renderer/src/project';

let mainWindow;

const ProgressBar = require('electron-progressbar');
const prompt = require('electron-prompt');

let projectDirectory = '';

ipcMain.handle("createProject", async (event, message) => {
  return await createProject(event);
});

ipcMain.handle("openProject", async(event)=>{
  return await openProject(event);
});

ipcMain.handle("exitApp",(event)=>{
  app.quit();
});

const openProject = (event: any) =>{
  return new Promise<void>((resolve)=>{

    dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
      
      if(result.canceled)
      {
        console.log('user cancelled');
        return;
      }
      projectDirectory = result.filePaths[0];

      // Checker si c'est un projet valid

      event.sender.send('projectOpenedReply', projectDirectory);
      mainWindow.setTitle('Lusine Game Maker 3D Alpha 0.1 - '+projectDirectory);
      resolve();
    }).catch((err)=>{
        console.error(err);
        dialog.showErrorBox('Erreur', err.message);
    })
  });
}


const createProject = (event : any) => {
  return new Promise<void>((resolve) => {
    let progressBar;

    prompt({
      title: 'Créer un nouveau projet',
      label: 'Nom du Projet',
      value: 'Mon Nouveau Projet',
      inputAttrs: {
        type: 'input',
        required: true
      },
      type: 'input',
      useHtmlLabel: true,
    }).then((r) => {
      if (r === null) {
        console.log('user cancelled');
      } else {

        dialog.showMessageBoxSync(mainWindow, {
          'title': 'Créer un nouveau projet',
          'type': 'info',
          'message': 'Veuillez selectionner un répertoire lequel sera stocké le contenu de votre projet. \n'
            + 'Lusine créera un sous répertoire avec le nom du projet',
        });

        dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {

          let currDir = result.filePaths[0];

          if (result.canceled)
            return;

          progressBar = new ProgressBar({
            text: 'Création du projet',
            detail: 'Veuillez patientez...'
          }, app);

          progressBar
            .on('completed', function () {
              console.info(`completed...`);
              progressBar.detail = 'Task completed. Exiting...';
            })
            .on('aborted', function () {
              console.info(`aborted...`);
            });

          projectDirectory = path.join(currDir,r);
          
          // BUG : [rollup-plugin-dynamic-import-variables] Unexpected token (1:0)
          // Project.setDir(projectDirectory);
          // Project.makeProjectAssets();

          progressBar.setCompleted();

          dialog.showMessageBoxSync({
            'message': 'Le projet a été crée avec succès !',
            'type': 'info'
          });


          event.sender.send('projectCreatedReply', projectDirectory);
          mainWindow.setTitle('Lusine Game Maker 3D Alpha 0.1 - '+projectDirectory);

          resolve();


        }).catch(err => {
          console.error(err);
          dialog.showErrorBox('Erreur', err.message);
          progressBar.close();
        });
      }
    })
      .catch(console.error);
  });
};





function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux'
      ? {
        icon: path.join(__dirname, '../../build/icon.png')
      }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule:true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const menu = Menu.buildFromTemplate([
  {
    label: "Fichier",
    submenu: [
      {
        label: "Nouveau Projet",
        click: ()=>{

        },
      },
      {
        label: "Ouvrir Projet",
        click: ()=>{
          mainWindow.webContents.send("openProject");
        },
        accelerator: "CmdOrCtrl+O"
      },
      {
        label: "Enregistrer Projet",
        click: ()=>{
          mainWindow.webContents.send("saveProject");
        },
        accelerator: "CmdOrCtrl+S"
      }
    ]
  },
  {
    label: "Ajouter un objet",
    submenu: [
      {
        label: "Model 3D",
        click: ()=>{
          mainWindow.webContents.send("addObjectOfType","3D_MODEL");
        },
      },
      {
        label: "Programmable",
        click: ()=>{

        },
      }
    ]
  },
  {
    label: "Debug",
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
]);

Menu.setApplicationMenu(menu);