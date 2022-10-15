<template>
    <div class="properties-bar" v-if="store.editorRtv.selectedObj">

        <h2>{{store.editorRtv.selectedObj.transform.name}}</h2>
        
        <div class="components">
            <input type="checkbox" name="" checked id="">Actif
            <p>ID : {{store.editorRtv.selectedObj.id}}</p>
            <!-- <input type="number" step="1" id="parentid" @change="setParentId($event)">
            <label for="parentid">Parent ID :</label> -->
            <TransformComponent/> 

            <FSMComponent v-for="(item, index) in store.editorRtv.selectedObj.finiteStateMachines" :fsm="item" :index="index"/>
            
            <PerspCameraComponent/>

            <button v-if="store.editorRtv.selectedObj.constructor.name=='ProgrammableGO'" id="addFSMBtn" @click="addFSM">Ajouter une machine d'Etat sur l'objet</button>
            <!-- <button @click="addFSM">Ajouter une machine d'Etat sur l'objet</button> -->
        </div>

    </div>
    <div v-else>
        <h2>Aucun objet sélectionné</h2>
        <p>Sélectionnez un objet dans la liste à gauche de l'écran</p>
    </div>
</template>

<script lang="ts">
import TransformComponent from "./objectcomponents/TransformComponent.vue";
import FSMComponent from "./objectcomponents/FSMComponent.vue";
import { inject } from "vue";
import store from "@renderer/store/store";
import PerspCameraComponent from "./objectcomponents/PerspCameraComponent.vue";
// import { GameObject } from "@engine/gameObject";

export default {

    name: 'PropertiesBar',
    components: {
    TransformComponent,
    FSMComponent,
    PerspCameraComponent
},
    setup() {
        const store = inject('store');
        
        const addFSM = ()=> {
            store.editorRtv.selectedObj.addFSM('Nouvel Automate Fini');
        }

        // const setParentId = (event)=>{
        //     const id : number = event.target.value;
        //     console.log(id);
        //     const parent = GameObject.getById(id);
        //     console.log(parent);
        //     if(id > 0 && parent) {
        //         Editor.methods.setParentToObject(store.editorRtv.selectedObj,parent);
        //     }else{
        //         store.editorRtv.selectedObj.parent = Renderer.getMainScene();
        //     }

        // }

        return {
            store,
            addFSM,
            // setParentId,
        }
    },
}
</script>
