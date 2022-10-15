import { Model } from '@engine/entities/model';
import Renderer from '@renderer/components/Renderer.vue';
import Editor from '@renderer/components/Editor.vue';
import { Project } from './project';
import { RendererManager } from './rendererManager';

export default class {
    
    constructor() {
        const { ipcRenderer } = require('electron');

        // réponse lors de  mainWindow.webContents.send("saveProject")
        ipcRenderer.on("saveProject",()=>{
            Project.save();
        });

        ipcRenderer.on("setDevMode",()=>{
            alert("Mode développeur");
        });

        ipcRenderer.on("addObjectOfType",(event,message)=>{
            switch (message) {
                case "3D_MODEL":
                    const test = new Model();
                    RendererManager.getInstance().scene?.add(test);
                    Editor.methods.selectObject(test);
                    break;
            
                default:
                    break;
            }
        });


    }
}
