import * as THREE from "three";
import Editor from '@renderer/components/Editor.vue';
import { GameObject } from "./gameObject";
import { Mathf } from "./math/mathf";
import { ProgrammableGO } from "./entities/programmablego";
import { Model } from "./entities/model";
import { WaterGO } from "./entities/watergo";
import { SkyGO } from "./entities/skygo";
import { Debug } from "./debug";
import { RendererManager } from "../renderer/src/rendererManager";

export class Game {

  static instance : Game;

  static getInstance() {
    if(this.instance===undefined) {
      this.instance = new Game();
    }
    return this.instance;
  }

  static time = 0;
  static deltaTime = 0;

    static getVarClassName() {
      return Game.name;
    }

    private constructor() {

      //try {
      //   // Importation des classes en dev pour l'execution des codes en temps réel
      //   const classes = [Debug,GameObject,Game,Mathf];
      //   let t = 2000;
      //   for (const cls of classes) {
  
      //     //if (typeof (cls) === 'undefined') {
      //       setTimeout(cls.toString(),t);
      //     t+=1000;
      //     //}
      //   }
      // } catch (error) {
      //   alert("Erreur lors de l'importation d'une classe. \n" + error);
      // }

          // ground
          const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
          mesh.rotation.x = - Math.PI / 2;
          mesh.receiveShadow = true;

          const scene = RendererManager.getInstance().scene;

          console.warn(scene);

          scene.add(mesh);


          const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
          hemiLight.position.set(0, 200, 0);
          scene.add(hemiLight);

          const dirLight = new THREE.DirectionalLight(0xffffff);
          dirLight.position.set(0, 200, 100);
          dirLight.castShadow = true;
          dirLight.shadow.camera.top = 180;
          dirLight.shadow.camera.bottom = - 100;
          dirLight.shadow.camera.left = - 120;
          dirLight.shadow.camera.right = 120;
          scene.add(dirLight);

          //Water
          // const water = new WaterGO();
          // Renderer.getMainScene().add(water);

          // // Sky
          // const sky = new SkyGO();
          // Renderer.getMainScene().add(sky);

          const playerCarGO = new ProgrammableGO();
          const carModel: Model = new Model();
          // carModel.import();

          playerCarGO.addFSM('PlayerCar State Machine');
          //le premier état est créer automatiquement
          playerCarGO.finiteStateMachines[0].getBaseState().name = "State A";

          
          scene.add(carModel.transform);
          
          // car.scale.set(0.025, 0.025, 0.025);
          
          // playerCarGO.transform.attach(carModel.transform);

          carModel.setParent(playerCarGO);

          scene.add(playerCarGO.transform);

          console.log(GameObject.gameObjects);
          

    }
}
module.exports = {Game: Game};