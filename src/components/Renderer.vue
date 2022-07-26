<template>
    <div id="renderer"></div>
</template>

<script lang="ts">

import * as THREE from 'three';
import { onMounted } from 'vue';
import { GameObject } from '../gameObject';
import { OrbitControls } from '../jsm/controls/OrbitControls';
import { TransformControls } from '../jsm/controls/TransformControls';
import Stats from '../jsm/libs/stats.module';

// var renderer, camera, scene;
// var control;
// var selectedObject;
const sizeX = 600;
const sizeY = 480;
const fov = 75;
const nearPlane = 0.1;
const farPlane = 1000;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, sizeX / sizeY, nearPlane, farPlane);
var control;
const stats = Stats();

export default {
    name: "Renderer",
    data() {
        return {
            monKebab: 8695,
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
    updateRender():void {
        render();
    },
    monAutreKebab: 555,
    setup() {
        onMounted(initialize)
    },

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

    //if (gameIsRunning) {
    // Game.deltaTime = this.clock.getDelta();
    //  this.gameLoop();
    //}
}

function onWindowResize() {
    camera.aspect = 600 / 480;
    camera.updateProjectionMatrix();
    renderer.setSize(600, 480);
}

function getRenderer() {
    return renderer;
}

function getCamera() {
    return camera;
}

function getMainScene() {
    return scene;
}

</script>