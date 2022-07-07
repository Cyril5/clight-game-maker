import GameObject from "../../../../../gameObject.js";
import Mathf from "../../../../../math/mathf.js";
import { Random } from "../../../../../math/random.js";
import { Wheel } from "../../../wheel.js";

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
        const body = new THREE.Mesh(new THREE.BoxBufferGeometry(60, 30, 15), new THREE.MeshLambertMaterial({ color }));
        body.position.z = 12;
        body.castShadow = true;
        body.receiveShadow = true;
        this.add(body);

        const frontTexture = this.getFrontTexture();
        frontTexture.center = new THREE.Vector2(0.5, 0.5);
        frontTexture.rotation = Math.PI / 2;

        const backTexture = this.getFrontTexture();
        backTexture.center = new THREE.Vector2(0.5, 0.5);
        backTexture.rotation = -Math.PI / 2;

        const leftSideTexture = this.getSideTexture();
        leftSideTexture.flipY = false;

        const rightSideTexture = this.getSideTexture();

        // const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 24, 12), [
        //     new THREE.MeshLambertMaterial({ map: frontTexture }),
        //     new THREE.MeshLambertMaterial({ map: backTexture }),
        //     new THREE.MeshLambertMaterial({ map: leftSideTexture }),
        //     new THREE.MeshLambertMaterial({ map: rightSideTexture }),
        //     new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
        //     new THREE.MeshLambertMaterial({ color: 0xffffff }) // bottom
        //   ]);

        const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 24, 12));
        cabin.position.x = -6;
        cabin.position.z = 25.5;
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        this.add(cabin);

        const backWheel = new Wheel();
        backWheel.position.x = -18;
        this.add(backWheel);

        const frontWheel = new Wheel();
        frontWheel.position.x = 18;
        this.add(frontWheel);

       this.setRotationFromEuler(new THREE.Euler(Mathf.degToRad(-90),Mathf.degToRad(0),Mathf.degToRad(-90)));
    }


    getFrontTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 32;
        const context = canvas.getContext("2d");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 64, 32);

        context.fillStyle = "#666666";
        context.fillRect(8, 8, 48, 24);

        return new THREE.CanvasTexture(canvas);
    }

    getSideTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 32;
        const context = canvas.getContext("2d");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 128, 32);

        context.fillStyle = "#666666";
        context.fillRect(10, 8, 38, 24);
        context.fillRect(58, 8, 60, 24);

        return new THREE.CanvasTexture(canvas);
    }
}

export { Car };