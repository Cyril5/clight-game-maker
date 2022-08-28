const fs = require('fs');

import stateA from './gameProjects/runTraffic/Assets/FSM States/stateA.json';
import baseStateFile from './assets/baseStateFile.json';

export class Project {

    static lastStateFileId = 0;

    private static directory = '';
    private static assetsFolder = '';
    private static statesFolder = '';
    private static prefabsFolder = '';

    static setDir(dir) {
        this.directory = dir;
        this.assetsFolder = dir+"/Assets";
        this.statesFolder = this.assetsFolder+"/FSM States";
        this.prefabsFolder = this.assetsFolder+"/Prefabs";
    }

    static getAssetsDir() {
        return this.assetsFolder;
    }

    static getStatesDir() {
        return this.statesFolder;
    }

    static makeProjectAssets(dir) { // Appelé depuis le main process d'electron
        fs.mkdirSync(dir);
        fs.mkdirSync(dir+'/Assets');
        fs.mkdirSync(dir+"/Assets/FSM States");
        fs.mkdirSync(dir+"/Assets/Prefabs");

        this.createStateFile('StateA.json');


        // Copy state file
        //fs.copyFile(stateA,statesFolder)
    }

    static createStateFile(name,data=JSON.stringify(baseStateFile)) {
        this.lastStateFileId++;
        fs.writeFile(this.statesFolder+'/'+name+".json",data,(err,content)=>{
            if(err) throw err;
            return;
        });
    }
}