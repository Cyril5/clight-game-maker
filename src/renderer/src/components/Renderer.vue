<template>
    <div id="renderer"></div>
</template>

<script lang="ts">

import * as THREE from 'three';
import { onMounted } from 'vue';

import { GameObject } from '@engine/gameObject';
import Stats from '@engine/jsm/libs/stats.module';
import { ProgrammableGO } from '@engine/entities/programmablego';
import { Game } from '@engine/game';
import { RendererManager } from '@renderer/rendererManager';


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
    components: {

    },
    updateRender(): void {
        render();
    },
    setup() {
        onMounted(initialize)
    },
    stopGame() {
        console.log("Engine game stoped");
        clock.stop();
        gameIsRunning = false;
    },
    startGame() {
        console.log("Engine game is running");


        for (const go of GameObject.gameObjects) {

            const value = go[1]; // map value

            // if(!value.enabled)
            //     continue; // passer à l'objet suivant

            console.log(value);

            if (value.enabled) { // si l'objet est actif
                value.saveTransform();

                if (value.finiteStateMachines.length > 0) {
                    for (const fsm of value.finiteStateMachines) {
                        console.log(fsm);
                        if (fsm.enabled) {
                            fsm.start();
                        } else {
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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.shadowMap.enabled = true;

    console.log(renderer.domElement);



    camera.position.y = 10;
    camera.position.z = 5;


    const rendererDom = document.getElementById('renderer');

    if (rendererDom) {
        rendererDom.appendChild(stats.dom);
        stats.dom.id = 'stats';
        stats.dom.style = '';
        rendererDom.appendChild(renderer.domElement);
    } else {
        console.error('renderer dom id not found');
    }
    window.addEventListener('resize', onWindowResize);

    animate(undefined);

    new RendererManager(renderer,camera,scene);


}

let then = 0;
const render = () => {

    if (renderer === undefined) {
        console.error('renderer is undefined');
        return;
    }

    renderer.render(scene, camera);

}


const animate = (now) => {

    render();
    stats.update();

    if (gameIsRunning) {
        Game.time = now * 0.001; // convert to seconds
        // make sure delta time isn't too big.
        Game.deltaTime = Math.min(Game.time - then, 1 / 20);

        then = now;
        gameLoop();
    }


    requestAnimationFrame(animate);
}

const gameLoop = () => {
    for (const go of GameObject.gameObjects) {
        const value = go[1]; // map value

        if (value.enabled) { // si l'objet est actif
            if (value.finiteStateMachines.length > 0) {
                for (const fsm of value.finiteStateMachines) {
                    if (fsm.enabled) {
                        fsm.update();
                    } else {
                        // TODO : callback qui lancera la fonction fsm.start quand la case enabled du fsm sera actif

                    }
                }
            }
        }
    }
}

function onWindowResize() {
    camera.aspect = 600 / 480;
    camera.updateProjectionMatrix();
    renderer.setSize(600, 480);
}


</script>
<style lang="scss">
#renderer {
    position: relative;

    #stats {
        position: absolute;
        margin: 1px;
    }
}
</style>