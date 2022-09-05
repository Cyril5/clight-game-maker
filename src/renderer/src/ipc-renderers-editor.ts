import { GameObject } from '@engine/gameObject';
import { Model } from '@engine/entities/model';
import Renderer from '@renderer/components/Renderer.vue';
import Editor from '@renderer/components/Editor.vue';

export default class {
    
    constructor() {
        const { ipcRenderer } = require('electron');

        ipcRenderer.on("addObjectOfType",(event,message)=>{
            switch (message) {
                case "3D_MODEL":
                    const test = new Model();
                    Renderer.getMainScene().add(test);
                    Editor.methods.selectObject(test);
                    break;
            
                default:
                    break;
            }
        
            alert("Ready to create : "+message);
        })
    }
}
