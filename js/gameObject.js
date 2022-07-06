
import FiniteStateMachine from './statesmachine/fsm.js';
import Math from './math/mathf.js';

export default class GameObject extends THREE.Object3D {

    Space = {
        Local: 0,
        World: 1
    }

    static gameObjects = []; // private

    // Peut contenir plusieurs FSM
    finiteStateMachines = [];

    constructor(name) {
        super();

        GameObject.gameObjects.push(this);

        this.name = name;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x119999 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        this.add(cube);
    }


    addFSM(name) {
        const fsm = new FiniteStateMachine(name, this);
        this.finiteStateMachines.push(fsm);
    }

    static findById(id) {
        let result = null;
        GameObject.gameObjects.forEach(go => {

            console.log('ID TO SEARCH : ' + id);
            console.log(go.id == id);

            if (go.id == id) {
                window.alert("GameObject id : " + id + " found !");
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
