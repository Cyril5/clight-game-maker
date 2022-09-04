<template>
    <div class="properties-bar" v-if="store.editorRtv.selectedObj">

        <div class="components">
            <h2>{{ store.editorRtv.selectedObj.name }}</h2>
            <input type="checkbox" name="" checked id="">Actif
            <TransformComponent/> 

            <FSMComponent v-for="(item, index) in store.editorRtv.selectedObj.finiteStateMachines" :fsm="item" :index="index"/>

            <button id="addFSMBtn" @click="addFSM">Ajouter une machine d'Etat sur l'objet</button>
        </div>

    </div>
    <div v-else>
        <h2>Aucun objet sélectionné</h2>
        <p>Sélectionnez un objet dans la liste à gauche de l'écran</p>
    </div>
</template>

<script lang="ts">
import TransformComponent from "./editorcomponents/TransformComponent.vue";
import FSMComponent from "./editorcomponents/FSMComponent.vue";
import { inject } from "vue";

export default {

    name: 'PropertiesBar',
    components: {
        TransformComponent,
        FSMComponent,
    },
    setup() {
        const store = inject('store');
        
        const addFSM = ()=> {
            store.editorRtv.selectedObj.addFSM('Nouvel Automate Fini');
        }

        return {
            store,
            addFSM
        }
    },
}
</script>