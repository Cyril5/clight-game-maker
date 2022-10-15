const fs = require('fs');

import { Game } from '@engine/game';
import * as THREE from 'three';
import { GameObject } from '@engine/gameObject';
import baseStateFile from './assets/baseStateFile.json';
import { RendererManager } from './rendererManager';
import { ProgrammableGO } from '@engine/entities/programmablego';

export class Project {

    static lastStateFileId = 0;

    private static directory = '';
    private static assetsFolder = '';
    private static statesFolder = '';
    private static modelsFolder = '';
    private static prefabsFolder = '';

    private static path = require("path");

    static open() {

        const scene = RendererManager.getInstance().scene;
        
        // Game.getInstance();
        //TEST : i=2 pour enlever seulement les gameObjects et garder le sol, la lumiere
        for (let i = 5; i < scene?.children.length; i++) {
            const child = scene?.children[i];
            scene?.remove(child);
        }
        
        GameObject.gameObjects.clear();


        //Lire le json du jeu
        // return;

        fs.readFile(this.path.join(this.directory,"Game"), 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const test = JSON.parse(data);
            // console.log(test.objects[3].data.object);
            const loader = new THREE.ObjectLoader();


            let pos = 0;

            for (const object of test.objects) {
                const loadedMesh : THREE.Object3D = loader.parse(object);
                
                loadedMesh.position.x = pos;
                scene?.add(loadedMesh);

                makeGameObjectsForObject(object.object);

                function makeGameObjectsForObject(object: { userData: { gameObject: { type: any; id: any; } | undefined; } | undefined; uuid: any; }) {

                    if(object.userData === undefined || object.userData.gameObject===undefined) {
                        return;
                    }
    
                    const goType = object.userData.gameObject.type;
                    let go: GameObject;
                    switch (goType) {
                        case "ProgrammableGO":
                            go = new ProgrammableGO();
                            break;
                    
                        default:
                            go = new GameObject("New Game Object");
                            break;
                    }
                    console.log(go);
                    go.setId(object.userData.gameObject.id);
                    go.setTransform(object.uuid);

                    // for (const child of object.children) {
                    //     makeGameObjectsForObject(child);
                    // }
                }
                
            }
        

        });




    }

    static save() {


        // Récupérer tous les gameObjects de la scene
        let transformsJSON : Array<any>  = [];

        for (const go of GameObject.gameObjects) {

            const value : GameObject  = go[1];
            
            //if(index > 4) { // Eviter de sauvegarder les objets de l'éditeur
                if(value.transform.userData.gameObject) {
                    value.serialize();
                }

                if(value.transform.parent?.type=="Scene") {
                    transformsJSON.push(value.transform.toJSON()); // THREE.Object3D
                }
            //}
        }

        const json = {
            "version": 0.1,
            // "gameObjects": gameObjectsJSON,
            "objects": transformsJSON,
        }

        console.log(json);

        // Créer le fichier game.scene
        this.createFile(this.path.join(this.directory,"Game"),JSON.stringify(json));
    }

    static setDir(dir) {

        this.directory = dir;
        this.assetsFolder = this.path.join(dir,"Assets");
        this.statesFolder = this.path.join(this.assetsFolder,"FSM States");
        this.prefabsFolder = this.path.join(this.assetsFolder,"Prefabs");
        this.modelsFolder = this.path.join(this.assetsFolder,"Models"); 

    }

    static getAssetsDir() {
        return this.assetsFolder;
    }

    static getStatesDir() {
        return this.statesFolder;
    }

    static getModelsDir() {
        return this.modelsFolder;
    }

    static makeProjectAssets() { // Appelé depuis le main process d'electron

        fs.mkdirSync(this.directory);
        fs.mkdirSync(this.assetsFolder); 
        fs.mkdirSync(this.statesFolder);
        fs.mkdirSync(this.prefabsFolder);
        fs.mkdirSync(this.modelsFolder);

        this.createStateFile('StateA.json');

        // Copy state file
        //fs.copyFile(stateA,statesFolder)
    }

    static createStateFile(filename,data=JSON.stringify(baseStateFile)) {
        this.lastStateFileId++;
        this.createFile(this.path.join(this.statesFolder,filename),data);
    }

    static createFile(filename,data) {
        fs.writeFile(filename,data,(err,content)=>{
            if(err) throw err;
            return;
        });
    }
}