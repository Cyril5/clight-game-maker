const fs = require('fs');

import stateA from '../../gameProjects/runTraffic/Assets/FSM States/stateA.json';
import baseStateFile from './assets/baseStateFile.json';

export class Project {

    static lastStateFileId = 0;

    private static directory = '';
    private static assetsFolder = '';
    private static statesFolder = '';
    private static prefabsFolder = '';

    private static path = require("path");

    static setDir(dir) {

        this.directory = dir;
        this.assetsFolder = this.path.join(dir,"Assets");
        this.statesFolder = this.path.join(this.assetsFolder,"FSM States");
        this.prefabsFolder = this.path.join(this.assetsFolder,"Prefabs");

    }

    static getAssetsDir() {
        return this.assetsFolder;
    }

    static getStatesDir() {
        return this.statesFolder;
    }

    static makeProjectAssets() { // Appelé depuis le main process d'electron

        fs.mkdirSync(this.directory);
        fs.mkdirSync(this.assetsFolder); 
        fs.mkdirSync(this.statesFolder);
        fs.mkdirSync(this.prefabsFolder);

        this.createStateFile('StateA.json');

        // Copy state file
        //fs.copyFile(stateA,statesFolder)
    }

    static createStateFile(filename,data=JSON.stringify(baseStateFile)) {
        this.lastStateFileId++;
        fs.writeFile(this.path.join(this.statesFolder,filename),data,(err,content)=>{
            if(err) throw err;
            return;
        });
    }
}