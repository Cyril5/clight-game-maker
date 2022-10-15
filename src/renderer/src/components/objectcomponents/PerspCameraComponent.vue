<template>
    <div class="component">
        <h3>Perspective Camera</h3>
    </div>
</template>

<script lang="ts">
import * as THREE from 'three';
import { inject } from 'vue';

export default {

    name: 'PerspCameraComponent',
    components: {
    },
    
    setup() {
        const store = inject('store');

        // const selectTransform = (THREE.Object3D)=>{
        //     //;
        // };

        return {
            store,
        }
    },
    methods: {
        
    },
    mounted() {
    },

}


</script>