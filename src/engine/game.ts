import * as THREE from "three";
import Renderer from '@renderer/components/Renderer.vue';

import Editor from '@renderer/components/Editor.vue';
import { GameObject } from "./gameObject";
import { Car } from "../gameProjects/runTraffic/Assets/Prefabs/car";
import { Mathf } from "./math/mathf";
import { ProgrammableGO } from "./entities/programmablego";
import { Model } from "./entities/model";

export class Game {

  static instance : Game;

  static getInstance() {
    if(this.instance===undefined) {
      this.instance = new Game();
    }
    return this.instance;
  }

  static deltaTime = 0;

    static getVarClassName() {
      return Game.name;
    }

    static createGOTest() {
      alert('dfd');
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
      mesh.rotation.x = - Math.PI / 2;
      mesh.receiveShadow = true;
      Renderer.getMainScene().add(mesh);
    }



    private constructor() {

      try {
        // Importation des classes en dev pour l'execution des codes en temps réel
        const classes = [];
        let t = 2000;
        for (const cls of classes) {
  
          //if (typeof (cls) === 'undefined') {
            setTimeout(cls.toString(),t);
          t+=1000;
          //}
        }
      } catch (error) {
        alert("Erreur lors de l'importation d'une classe. \n" + error);
      }

          // ground
          const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
          mesh.rotation.x = - Math.PI / 2;
          mesh.receiveShadow = true;

          console.warn(Renderer.getMainScene());

          Renderer.getMainScene().add(mesh);


          const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
          hemiLight.position.set(0, 200, 0);
          Renderer.getMainScene().add(hemiLight);

          const dirLight = new THREE.DirectionalLight(0xffffff);
          dirLight.position.set(0, 200, 100);
          dirLight.castShadow = true;
          dirLight.shadow.camera.top = 180;
          dirLight.shadow.camera.bottom = - 100;
          dirLight.shadow.camera.left = - 120;
          dirLight.shadow.camera.right = 120;
          Renderer.getMainScene().add(dirLight);

          const playerCarGO = new ProgrammableGO('Programmable Object');
          const carModel: Model = new Model();

          playerCarGO.addFSM('PlayerCar State Machine');
          // le premier état est créer automatiquement
          playerCarGO.finiteStateMachines[0].getBaseState().name = "State A";

          
          Renderer.getMainScene().add(carModel);
          
          // car.scale.set(0.025, 0.025, 0.025);
          
          playerCarGO.attach(carModel);
          
          Renderer.getMainScene().add(playerCarGO);
          
          //Editor.methods.setObjARef(playerCarGO);
          

          // Editor.methods.getObjBRef().value = car;

          //Editor.methods.selectObjectA();

    }
}
module.exports = {Game: Game};