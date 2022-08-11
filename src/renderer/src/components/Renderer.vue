<template>
    <div id="renderer"></div>
</template>

<script lang="ts">

import { Debug } from '../../../engine/debug';
import * as THREE from 'three';
import { onMounted } from 'vue';
import {GameObject} from '../../../engine/gameObject';

import Stats from '../../../engine/jsm/libs/stats.module';

let gameIsRunning = false;

const clock = new THREE.Clock();
const sizeX = 600;
const sizeY = 480;
const fov = 75;
const nearPlane = 0.1;
const farPlane = 1000;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, sizeX / sizeY, nearPlane, farPlane);
const stats = Stats();

export default {
    name: "Renderer",
    data() {
        return {
        }
    },
    getCamera() {
        return camera;
    },
    getRenderer(): THREE.WebGLRenderer {
        return renderer;
    },
    getMainScene(): THREE.Scene {
        return scene;
    },
    updateRender(): void {
        render();
    },
    setup() {
        onMounted(initialize)
    },
    startGame() {
        console.log("Engine game starts");

        for (const go of GameObject.gameObjects) {
            const value = go[1]; // map value

            // if(!value.enabled)
            //     continue; // passer à l'objet suivant

            console.log(value);

            if(value.enabled) { // si l'objet est actif
                value.saveTransform();
    
                if (value.finiteStateMachines.length > 0) {
                    for (const fsm of value.finiteStateMachines) {
                        console.log(fsm);
                        if (fsm.enabled) {
                            fsm.start();
                            console.log(fsm.getCurrState().code);
                        }else{
                            // TODO : callback qui lancera la fonction fsm.start quand la case enabled du fsm sera actif
                            
                        }
                    }
                }
            }
        }

        clock.start();
        gameIsRunning = true;
    }

}

function initialize() {

    console.log("renderer mounted");



    // quand le composant est prêt

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sizeX, sizeY);
    renderer.shadowMap.enabled = true;

    console.log(renderer.domElement);



    camera.position.y = 10;
    camera.position.z = 5;


    const rendererDom = document.getElementById('renderer');

    if (rendererDom) {
        rendererDom.appendChild(stats.dom);
        rendererDom.appendChild(renderer.domElement);
    } else {
        console.error('renderer dom id not found');
    }
    window.addEventListener('resize', onWindowResize);


    animate(undefined);

}



function render() {

    if (renderer === undefined) {
        console.error('renderer is undefined');
        return;
    }
    // console.log('render');
    renderer.render(scene, camera);
}


function animate(timestamp: any): void {

    requestAnimationFrame(animate);

    stats.update();
    render();

    // if (gameIsRunning) {
    //     Game.deltaTime = this.clock.getDelta();
    //     this.gameLoop();
    // }
}

function onWindowResize() {
    camera.aspect = 600 / 480;
    camera.updateProjectionMatrix();
    renderer.setSize(600, 480);
}


</script>