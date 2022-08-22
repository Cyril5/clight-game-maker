import * as THREE from "three";
import Renderer from '@renderer/components/Renderer.vue';

import Editor from '@renderer/components/Editor.vue';
import { GameObject } from "./gameObject";
import { Car } from "@renderer/gameProjects/runTraffic/Assets/Prefabs/car";

export class Game {
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

    static deltaTime = 0;

    constructor() {
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

          const playerCarGO = new GameObject('Player Car');
          const car: Car = new Car();

          playerCarGO.addFSM('PlayerCar State Machine');
          playerCarGO.finiteStateMachines[0].addState("StateA");

          
          Renderer.getMainScene().add(car);
          
          car.scale.set(0.025, 0.025, 0.025);
          
          playerCarGO.attach(car);
          
          Renderer.getMainScene().add(playerCarGO);
          
          Editor.methods.setObjARef(playerCarGO);
          

          // Editor.methods.getObjBRef().value = car;

          //Editor.methods.selectObjectA();

    }
}