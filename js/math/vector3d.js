export default class Vector3D extends THREE.Vector3 {

    constructor(x,y,z) {
        super(x,y,z);
    }

    static right() {
        return new THREE.Vector3(1,0,0);
    }
    
    static up() {
        return new THREE.Vector3(0,1,0);
    }

    static forward() {
        return new THREE.Vector3(0,0,1);
    }

}