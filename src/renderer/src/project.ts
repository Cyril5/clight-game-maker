const fs = require('fs');

import { Game } from '../../engine/game';
import * as THREE from 'three';
import { GameObject } from '../../engine/gameObject';
import baseStateFile from './assets/baseStateFile.json';
import { RendererManager } from './rendererManager';

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
        
        Game.getInstance();

        // const sceneChildren = scene.children;
        // // TEST : i=2 pour enlever seulement les gameObjects
        // for (let i = 2; i < sceneChildren.length; i++) {
        //     const child = sceneChildren[i];
        //     scene.remove(child);
        // }
        // GameObject.gameObjects.clear();


        //Lire le json du jeu
        //return;

        fs.readFile(this.path.join(this.directory,"Game"), 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const test = JSON.parse(data);
            // console.log(test.objects[3].data.object);
            const loader = new THREE.ObjectLoader();

            let i = 0;
            for (const iterator of test.objects) {
                const loadedObject = iterator;
                const loadedMesh : THREE.Object3D = loader.parse(loadedObject);
                
                loadedMesh.position.x -= 50;
                scene.add(loadedMesh);            
                i++;
            }

            for(const gameObject of test.gameObjects) {
                const go : GameObject = new GameObject("New Game Object");
                go.fromJSON(gameObject.data);
                scene.add(go.transform);
            }


        });




    }

    static save() {


        // Récupérer tous les gameObjects de la scene
        let transformsJSON : Array<any>  = [];
        let gameObjectsJSON : Array<any> = [];

        for (const go of GameObject.gameObjects) {
            const value = go[1];
            transformsJSON.push(value.transform.toJSON()); // THREE.Object3D
            gameObjectsJSON.push(value.serialize());
        }

        const json = {
            "version": 0.1,
            "gameObjects": gameObjectsJSON,
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