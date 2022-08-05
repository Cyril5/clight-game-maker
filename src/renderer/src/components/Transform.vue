<template>
    <div class="component">
        <h3>Position : </h3>
        <div class="position" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.1" id="posx" v-model="position.x">
                <label for="posxy">Y :</label>
                <input type="number" step="0.1" id="posy" v-model="position.y">
                <label for="posez">Z : </label>
                <input type="number" step="0.1" id="posz" v-model="position.z">
                <p>{{position}}</p>
                <h4>Position dans le monde</h4>
                <!-- <p>{{obj.getWorldPos()}}</p> -->
            </div>
        </div>
        <h3>Rotation</h3>
                <div class="rotation" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.1" id="posx" v-model="rotation.x">
                <label for="posx">Y :</label>
                <input type="number" step="0.1" id="posy" v-model="rotation.y">
                <label for="posx">Z : </label>
                <input type="number" step="0.1" id="posz" v-model="rotation.z">
                <p>{{rotation}}</p>
            </div>
        </div>
                <h3>Echelle</h3>
                <div class="rotation" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.01" id="posx" v-model="scale.x">
                <label for="posx">Y :</label>
                <input type="number" step="0.01" id="posy" v-model="scale.y">
                <label for="posx">Z : </label>
                <input type="number" step="0.01" id="posz" v-model="scale.z">
                <p>{{scale}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import GameObject from '../../../engine/gameObject';
import * as THREE from 'three';

export default {

    name: 'Editor',
    components: {
    },

    setup() {
    },
    data() {
        return {
            }
    },
    props:{
        obj: GameObject,
        position: new THREE.Vector3(0,0,0),
        rotation: new THREE.Vector3(0,0,0),
        scale: new THREE.Vector3(1,1,1)
    },
    methods: {
        
    },
    mounted() {
    },

}


</script>