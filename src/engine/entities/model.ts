import * as THREE from 'three';
import { GameObject } from "../gameObject";
import { Random } from "../math/random";
import { Mathf } from '../math/mathf';
import { Project } from '../../renderer/src/project';
import { RendererManager } from '../../renderer/src/rendererManager';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const fs = require('fs');

export class Model extends GameObject {

    private path = require('path');

    constructor(pModelFilename : string) {
        super('cartoon_lowpoly_small_city_free_pack');
        this.type = "Model";

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(pModelFilename, (gltf) => {
          const root = gltf.scene;
        //   RendererManager.getInstance().scene?.add(root);
    
          // compute the box that contains all the stuff
          // from root and below
          const box = new THREE.Box3().setFromObject(root);
    
          const boxSize = box.getSize(new THREE.Vector3()).length();
          const boxCenter = box.getCenter(new THREE.Vector3());

          this.transform.add(root);
    
        //   // set the camera to frame the box
        //   frameArea(boxSize * 0.5, boxSize, boxCenter, camera);
    
        //   // update the Trackball controls to handle the new size
        //   controls.maxDistance = boxSize * 10;
        //   controls.target.copy(boxCenter);
        //   controls.update();
        });

        // const color = Random.pickElementFromArray([
        //     0xa52523,
        //     0xef2d56,
        //     0x0ad3ff,
        //     0xff9f1c /*0xa52523, 0xbdb638, 0x78b14b*/
        // ]
        // );

        // let main = new THREE.Mesh(
        //     new THREE.BoxGeometry(60, 30, 15),
        //     new THREE.MeshLambertMaterial({ color })
        // );
        // main.position.z = 12;
        // main.castShadow = true;
        // main.receiveShadow = true;
        // main.name = 'main';
        // this.transform.add(main);

        //let carFrontTexture = this.getFrontTexture("ft");
        //carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
        //carFrontTexture.rotation = Math.PI / 2;

        // let carBackTexture = this.getFrontTexture("bt");
        // carBackTexture.center = new THREE.Vector2(0.5, 0.5);
        // carBackTexture.rotation = -Math.PI / 2;

        // let carLeftSideTexture = this.getSideTexture("lt");
        // carLeftSideTexture.flipY = false;
        // let carRightSideTexture = this.getSideTexture("rt");


        // let cabin = new THREE.Mesh(new THREE.BoxGeometry(33,24,12),
        //     new THREE.MeshLambertMaterial({color: 0xffffff})
        // );

        // cabin.position.x = -6;
        // cabin.position.z = 25.5;
        // cabin.castShadow = true;
        // cabin.receiveShadow = true;
        // cabin.name = 'cabin';
        // this.transform.add(cabin);

        // const backWheel = new Wheel();
        // backWheel.position.x = -18;
        // backWheel.name = 'backWheel';
        // this.transform.add(backWheel);

        // const frontWheel = new Wheel();
        // frontWheel.position.x = 18;
        // frontWheel.name = "frontWheel";
        // this.transform.add(frontWheel);

        // this.transform.setRotationFromEuler(new THREE.Euler(Mathf.degToRad(-90), Mathf.degToRad(0), Mathf.degToRad(-90)));
    }

    private json;

    exportToJSON() {
        const filename = this.path.join(Project.getModelsDir(),"Car.json");
        this.json = JSON.stringify(this.transform.toJSON());
        Project.createFile(filename, this.json);
    }

    import() {
        const jsonFile = fs.readFileSync(this.path.join(Project.getModelsDir(),"Car.json"), 'utf8');

        const loadedObject = JSON.parse(jsonFile);
        const loader = new THREE.ObjectLoader();

        const loadedMesh = loader.parse(loadedObject);
        loadedMesh.position.x -= 50;
        RendererManager.getMainScene().add(loadedMesh);
    }
}

export class Wheel extends THREE.Mesh {

    constructor() {
        const geometry = new THREE.BoxGeometry(12,33,12);
        const material = new THREE.MeshLambertMaterial({ color: 0x333333 });

        super(geometry,material);
        this.position.z = 6;
        this.castShadow = false;
        this.receiveShadow = false;

    }
}