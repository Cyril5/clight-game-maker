// preload.ts
import {ipcRenderer, ContextBridge, contextBridge} from 'electron';
import {cpus} from 'os';

// contextBridge.exposeInMainWorld('api', {
//   threads: cpus().length
// });


// Toutes les APIs Node.js sont disponibles dans le processus de préchargement.
// Il a la même sandbox qu'une extension Chrome.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string | undefined) => {
      var element  = document.getElementById(selector);
      if (element && text) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

