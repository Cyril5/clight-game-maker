import * as THREE from "three";

export class Wheel extends THREE.Mesh {

    constructor() {
        const geometry = new THREE.BoxBufferGeometry(12,33,12);
        const material = new THREE.MeshLambertMaterial({ color: 0x333333 });

        super(geometry,material);
        this.position.z = 6;
        this.castShadow = false;
        this.receiveShadow = false;

    }
}