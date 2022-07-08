
import FiniteStateMachine from './statesmachine/fsm.js';
import Math from './math/mathf.js';

export default class GameObject extends THREE.Object3D {

    initTransform = {
        'position': new THREE.Vector3(0,0,0),
        'rotation': new THREE.Quaternion(),
        'scale': new THREE.Vector3(0,0,0)
    }; // la position,rotation et scale de l'objet avant que le jeu démarre
    
    Space = {
        Local: 0,
        World: 1
    }
    
    group = new THREE.Group();
    
    static gameObjects = []; // private
    
    // Peut contenir plusieurs FSM
    finiteStateMachines = [];
    
    constructor(name) {
        super();
        
        GameObject.gameObjects.push(this);
        
        this.name = name;
        
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshPhongMaterial({ color: 0x119999 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        this.group.add(cube);
        

        this.add(this.group);

    }

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

    addFSM(name) {
        const fsm = new FiniteStateMachine(name, this);
        this.finiteStateMachines.push(fsm);
    }

    static findById(id) {
        let result = null;
        GameObject.gameObjects.forEach(go => {

            if (go.id == id) {
                result = go;
            }
        });

        if (result == null)
            window.alert("GameObject id : " + id + " wasn't found");

        return result;
    }



    move(axis, space = this.Space.Local) {
        //this.translateOnAxis(axis,);
    }

    moveZ(distance, space = this.Space.Local) {
        switch (space) {
            case this.Space.World:

                break;

            default:
                this.translateZ(distance);
                break;
        }
    }

    pivoter(degX, degY, degZ, space = Space.Local) {

        const xRad = Math.degToRad(degX);
        const yRad = Math.degToRad(degY);
        const zRad = Math.degToRad(degZ);

        switch (space) {
            case this.Space.Local:
                this.rotateX(xRad); // deg to radians
                this.rotateY(yRad);
                this.rotateZ(zRad);
                break;

            case this.Space.World:
                rotateOnWorldAxis(Vector3.right, xRad);
                rotateOnWorldAxis(Vector3.up, yRad);
                rotateOnWorldAxis(Vector3.forward, zRad);
                break;
        }
    }
}
