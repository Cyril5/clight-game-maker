
import * as THREE from 'three';
import { FiniteStateMachine } from './statesmachine/fsm';
// import { RendererManager } from '../renderer/src/rendererManager'; 
import {v4 as uuidv4} from 'uuid';
import { RendererManager } from '../renderer/src/rendererManager';

export class GameObject {
    
    static gameObjects = new Map<string,GameObject>(); // private map(uuid, GameObject)
    
    private id : string;
    
    enabled = true;

    transform: THREE.Object3D = new THREE.Object3D();

    parentID : string = "" //uuid du parent 

    initTransform = {
        'position': new THREE.Vector3(0, 0, 0),
        'rotation': new THREE.Euler(),
        'scale': new THREE.Vector3(0, 0, 0)
    }; // la position,rotation et scale de l'objet avant que le jeu démarre

    Space = {
        Local: 0,
        World: 1
    }

    SerializedGameObject = {
            "version": 0.1,
            "data": {
                "id": "", // uuid
                "name": "New Game Object",
                "transformId": "", // A quel uuid d'un THREE.Object est t'il rattaché 
                "statesmachines": [],
            }
    };


    private worldPosition = new THREE.Vector3();


    // Peut contenir plusieurs FSM
    finiteStateMachines: Array<FiniteStateMachine> = [];

    constructor(name: string) {

        this.id = uuidv4();

        if (!GameObject.gameObjects.has(this.id))
            GameObject.gameObjects.set(this.id, this);
        else
            alert("GameObject id already exists in gameObjects map");
        
        // ses propriétées seront ajoutés dans l'objet3D
        this.transform.name = name;
        this.transform.type = "GameObject";
        this.transform.userData.gameObjectId = this.id;
        this.transform.userData.parentGameObjectId = this.parentID; // TODO : a changer lorsque le parent du transform change

        // this.group.name = 'Group';

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x119999 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        this.transform.add(cube);


        // this.add(this.group);

    }

    getChild(index : number) : GameObject | undefined {
      return GameObject.gameObjects.get(this.transform.children[index].userData.gameObjectId);
    }

    setParent(gameObject : GameObject) {

            gameObject.transform.attach(this.transform);
            this.transform.userData.parentGameObjectId = gameObject.id;
        
    }

    resetTransform() {
        console.log(this.initTransform.position);
        this.transform.position.copy(this.initTransform.position);
        this.transform.rotation.copy(this.initTransform.rotation);
        this.transform.scale.copy(this.initTransform.scale);
    }

    saveTransform() {
        this.initTransform.position = this.transform.position.clone();
        this.initTransform.rotation = this.transform.rotation.clone();
        this.initTransform.scale = this.transform.scale.clone();
    }

    addFSM(name: string) {
        const fsm = new FiniteStateMachine(name, this);
        this.finiteStateMachines.push(fsm);
    }

    static getById(id: number) {
        return this.gameObjects.get(id);
    }

    getWorldPos(): THREE.Vector3 {

        return this.transform.getWorldPosition(this.worldPosition);
    }

    serialize() {
        let fsmsJSON: Array<any> = [];
        for (const fsm of this.finiteStateMachines) {
            fsmsJSON.push(fsm.serialize());
        }

        this.SerializedGameObject.data.id = this.id;
        this.SerializedGameObject.data.name = this.transform.name;
        this.SerializedGameObject.data.transformId = this.transform.uuid;
        this.SerializedGameObject.data.statesmachines = fsmsJSON;

        return this.SerializedGameObject;
    }

    fromJSON(json) {

        console.log(json);

        if(json.id === undefined || json.transformId === undefined || json.statesmachines == undefined) {
            console.error("Invalid GameObject JSON \n"+JSON.stringify(json));
            return;
        }

        this.id = json.id;
        // chercher le Object3D dans la scene ayant l'id de transformId puis l'affecter au transform
        // du gameObject
        const result = RendererManager.getInstance().scene.getObjectByProperty("uuid",json.transformId);

        if(result===undefined) {
            alert("THREE.Object3D "+json.transformId+" was not found ");
            return;
        }

        this.transform = result;

        this.finiteStateMachines = json.statesmachines;

        GameObject.gameObjects.set(this.id,this);
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
