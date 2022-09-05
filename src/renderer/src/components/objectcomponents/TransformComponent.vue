<template>
    <div class="component">
        <h3>Position : </h3>
        <div class="position" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="posx">X : </label>
                <input type="number" step="0.1" id="posx" v-model="store.editorRtv.selectedObj.position.x">
                <label for="posxy">Y :</label>
                <input type="number" step="0.1" id="posy" v-model="store.editorRtv.selectedObj.position.y">
                <label for="posez">Z : </label>
                <input type="number" step="0.1" id="posz" v-model="store.editorRtv.selectedObj.position.z">
                <h4>Position dans le monde</h4>
                <p>X : {{store.editorRtv.selectedObj.getWorldPos().x}} Y : {{store.editorRtv.selectedObj.getWorldPos().x}} Z : {{store.editorRtv.selectedObj.getWorldPos().x}}</p>
                <!-- <p>{{obj.getWorldPos()}}</p> -->
            </div>
        </div>
        <h3>Rotation</h3>
                <div class="rotation" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="rotx">X : </label>
                <input type="number" step="0.1" id="rotx" v-model="store.editorRtv.selectedObj.rotation.x">
                <label for="roty">Y :</label>
                <input type="number" step="0.1" id="roty" v-model="store.editorRtv.selectedObj.rotation.y">
                <label for="rotz">Z : </label>
                <input type="number" step="0.1" id="rotz" v-model="store.editorRtv.selectedObj.rotation.z">
                <p>{{}}</p>
            </div>
        </div>
                <h3>Echelle</h3>
                <div class="rotation" style="display: flex; justify-content: space-between;">
            <div class="content">
                <label for="scalex">X : </label>
                <input type="number" step="0.01" id="scalex" v-model="store.editorRtv.selectedObj.scale.x">
                <label for="scaley">Y :</label>
                <input type="number" step="0.01" id="scaley" v-model="store.editorRtv.selectedObj.scale.y">
                <label for="scalez">Z : </label>
                <input type="number" step="0.01" id="scalez" v-model="store.editorRtv.selectedObj.scale.z">
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

        const setPosX = (event)=>{
            console.log(event.target.value);
        };

        const setPosY = (event)=>{
            store.editorRtv.selectedObj.position.y = event.target.value;
        }

        return {
            store,
            setPosX,
            setPosY
        }
    },
    methods: {
        
    },
    mounted() {
    },

}


</script>