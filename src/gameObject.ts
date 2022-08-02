
import * as THREE from 'three';
import {FiniteStateMachine} from './statesmachine/fsm';

export class GameObject extends THREE.Object3D {
    
        initTransform = {
            'position': new THREE.Vector3(0,0,0),
            'rotation': new THREE.Euler(),
            'scale': new THREE.Vector3(0,0,0)
        }; // la position,rotation et scale de l'objet avant que le jeu démarre
        
        Space = {
            Local: 0,
            World: 1
        }
        
        group = new THREE.Group();
        private worldPosition  = new THREE.Vector3();

        static gameObjects = new Map(); // private map(int, GameObject)
        
        // Peut contenir plusieurs FSM
        finiteStateMachines: Array<FiniteStateMachine> = [];
        
        constructor(name : string) {
            super();
            
            if(!GameObject.gameObjects.has(this.id))
                GameObject.gameObjects.set(this.id,this);
            else
                alert("GameObject id already exists in gameObjects map");
            
            this.name = name;
            
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x119999 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.y = 0.5;
            this.group.add(cube);
            
    
            this.add(this.group);
    
        }

        static getVarClassName() : string {return '__'+GameObject.name};
        static getDistClassFilePath() : string {return '../../../dist/src/gameObject.js'};

    
        resetTransform() {
            console.log(this.initTransform.position);
            this.position.copy(this.initTransform.position);
            this.rotation.copy(this.initTransform.rotation);
            this.scale.copy(this.initTransform.scale);
        }
    
        saveTransform() {
            this.initTransform.position = this.position.clone();
            this.initTransform.rotation = this.rotation.clone();
            this.initTransform.scale = this.scale.clone();
            console.log(this.initTransform.position);
        }
    
        addFSM(name : string) {
            const fsm = new FiniteStateMachine(name, this);
            this.finiteStateMachines.push(fsm);
        }
    
        static getById(id : number) {
            return this.gameObjects.get(id);
        }

        getWorldPos() : THREE.Vector3 {

            return this.getWorldPosition(this.worldPosition);
        }
    
        // static findById(id) {
        //     let result = null;
        //     GameObject.gameObjects.forEach(go => {
    
        //         if (go.id == id) {
        //             result = go;
        //         }
        //     });
    
        //     if (result == null)
        //         window.alert("GameObject id : " + id + " wasn't found");
    
        //     return result;
        // }
    
    
    }
    //module.exports = {GameObject: GameObject};




