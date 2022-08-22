const fs = require('fs');

import stateA from '../../renderer/src/gameProjects/runTraffic/Assets/FSM States/stateA.json';

export class Project {

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

        fs.writeFile(dir + '/Assets/FSM States/StateA.json', JSON.stringify(stateA), (err, content) => {
            if (err) throw err;
        });


        // Copy state file
        //fs.copyFile(stateA,statesFolder)
    }
}