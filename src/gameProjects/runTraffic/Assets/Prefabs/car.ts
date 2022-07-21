import {GameObject} from "../../../../gameObject";
import { Mathf } from "../../../../math/mathf";
import { Random } from "../../../../math/random.js";
import { Wheel } from "./wheel.js";
import * as THREE from "three";

class Car extends GameObject {

    constructor() {
        super('Car Group');
        const color = Random.pickElementFromArray([
            0xa52523,
            0xef2d56,
            0x0ad3ff,
            0xff9f1c /*0xa52523, 0xbdb638, 0x78b14b*/
        ]
        );

        let main = new THREE.Mesh(
            new THREE.BoxBufferGeometry(60, 30, 15),
            new THREE.MeshLambertMaterial({ color })
        );
        main.position.z = 12;
        main.castShadow = true;
        main.receiveShadow = true;
        this.group.add(main);

        let carFrontTexture = this.getFrontTexture("ft");
        carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
        carFrontTexture.rotation = Math.PI / 2;

        // let carBackTexture = this.getFrontTexture("bt");
        // carBackTexture.center = new THREE.Vector2(0.5, 0.5);
        // carBackTexture.rotation = -Math.PI / 2;

        // let carLeftSideTexture = this.getSideTexture("lt");
        // carLeftSideTexture.flipY = false;
        // let carRightSideTexture = this.getSideTexture("rt");


        let cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33,24,12),
            new THREE.MeshLambertMaterial({color: 0xffffff})
        );

        cabin.position.x = -6;
        cabin.position.z = 25.5;
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        this.group.add(cabin);

        const backWheel = new Wheel();
        backWheel.position.x = -18;
        this.group.add(backWheel);

        const frontWheel = new Wheel();
        frontWheel.position.x = 18;
        this.group.add(frontWheel);

        this.group.setRotationFromEuler(new THREE.Euler(Mathf.degToRad(-90), Mathf.degToRad(0), Mathf.degToRad(-90)));
    }


    /**
     * @param {string} name
     */
    // @ts-ignore
    getFrontTexture(name) {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 32;
        const context = canvas.getContext("2d");

        // @ts-ignore
        context.fillStyle = "#ffffff";
        // @ts-ignore
        context.fillRect(0, 0, 64, 32);

        // @ts-ignore
        context.fillStyle = "#666666";
        // @ts-ignore
        context.fillRect(8, 8, 48, 24);

        const texture = new THREE.CanvasTexture(canvas);
        console.log(texture);
        return texture;
    }

    // @ts-ignore
    getSideTexture(name) {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 32;
        const context = canvas.getContext("2d");

        // @ts-ignore
        context.fillStyle = "#ffffff";
        // @ts-ignore
        context.fillRect(0, 0, 128, 32);

        // @ts-ignore
        context.fillStyle = "#666666";
        // @ts-ignore
        context.fillRect(10, 8, 38, 24);
        // @ts-ignore
        context.fillRect(58, 8, 60, 24);

        return new THREE.CanvasTexture(canvas);
    }
}

export { Car };