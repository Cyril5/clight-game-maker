
import * as THREE from 'three';
import { FiniteStateMachine } from './statesmachine/fsm';
// import { RendererManager } from '../renderer/src/rendererManager'; 
import { v4 as uuidv4 } from 'uuid';
import { RendererManager } from '../renderer/src/rendererManager';
import {Component} from '@engine/entities/component';
import Utils from './utils';

export class GameObject {

    static gameObjects = new Map<string, GameObject>(); // private map(uuid, GameObject)

    private id: string;

    enabled = true;

    transform: THREE.Object3D = new THREE.Object3D();
    
    type:string = "GameObject";

    parentID: string = "" //uuid du parent 

    initTransform = {
        'position': new THREE.Vector3(0, 0, 0),
        'rotation': new THREE.Euler(),
        'scale': new THREE.Vector3(0, 0, 0)
    }; // la position,rotation et scale de l'objet avant que le jeu démarre

    Space = {
        Local: 0,
        World: 1
    }

    private worldPosition = new THREE.Vector3();


    // Peut contenir plusieurs FSM
    finiteStateMachines: Array<FiniteStateMachine> = [];

    private _components : Array<Component> = [];

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

    addComponent(ComponentType, ...args) {
        const component = new ComponentType(this, ...args);
        this._components.push(component);
        return component;
      }

    getChild(index: number): GameObject | undefined {
        return GameObject.gameObjects.get(this.transform.children[index].userData.gameObject.Id);
    }

    removeComponent(component : Component) {
        Utils.removeElementInArray(this._components,component);
      }

      getComponent(ComponentType) {
        return this._components.find(c => c instanceof ComponentType);
      }

    setParent(gameObject: GameObject) {

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

        this.transform.userData.gameObject.id = this.id;
        this.transform.userData.gameObject.type = this.type;
        this.transform.userData.gameObject.statesmachines = fsmsJSON;
    }

    setId(id : string) {
        this.id = id;
    }

    setTransform(id) {

        // chercher le Object3D dans la scene ayant l'id de transformId puis l'affecter au transform
        // du gameObject
        const result = RendererManager.getInstance().scene?.getObjectByProperty("uuid", id);

        if (result === undefined) {
            alert("THREE.Object3D " + id + " was not found ");
            return;
        }
        // RendererManager.getInstance().scene?.remove(this.transform);

        this.transform = result;

        // this.finiteStateMachines = json.statesmachines;
        // GameObject.gameObjects.set(json.id,this);
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
