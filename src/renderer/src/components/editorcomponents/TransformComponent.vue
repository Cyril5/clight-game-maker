<template>
    <div class="component">
        <h3>Position : </h3>
        <div class="position" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.1" id="posx" v-model="store.editorRtv.selectedObj.position.x">
                <label for="posxy">Y :</label>
                <input type="number" step="0.1" id="posy" @change="setPosX()"  v-model="store.editorRtv.selectedObj.position.y">
                <label for="posez">Z : </label>
                <input type="number" step="0.1" id="posz" v-model="store.editorRtv.selectedObj.position.z">
                <h4>Position dans le monde</h4>
                <p>{{store.editorRtv.selectedObj.getWorldPos()}}</p>
                <!-- <p>{{obj.getWorldPos()}}</p> -->
            </div>
        </div>
        <h3>Rotation</h3>
                <div class="rotation" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.1" id="posx">
                <label for="posx">Y :</label>
                <input type="number" step="0.1" id="posy">
                <label for="posx">Z : </label>
                <input type="number" step="0.1" id="posz">
                <p>{{}}</p>
            </div>
        </div>
                <h3>Echelle</h3>
                <div class="rotation" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.01" id="posx">
                <label for="posx">Y :</label>
                <input type="number" step="0.01" id="posy">
                <label for="posx">Z : </label>
                <input type="number" step="0.01" id="posz">
                <p>{{}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { inject } from 'vue';

export default {

    
    name: 'TransformComponent',
    components: {
    },
    
    setup() {
        const store = inject('store');

        return {
            store,
        }
    },
    data() {
        return {
            }
    },
    methods: {
        
    },
    mounted() {
    },

}


</script>