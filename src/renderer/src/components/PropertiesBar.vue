<template>
    <div class="properties-bar" v-if="store.selectedObj.value">

        <div class="components">
            <h2>{{ store.selectedObj.value.name }}</h2>
            <input type="checkbox" name="" checked id="">Actif
            <!-- <Transform :position="transform.position" :rotation="transform.rotation" :scale="transform.scale" /> -->

            <FSMComponent v-for="(item, index) in store.selectedObj.value.finiteStateMachines" :fsm="item" :index="index"/>

            <button id="addFSMBtn" @click="addFSM">Ajouter une machine d'Etat sur l'objet</button>
        </div>

    </div>
</template>

<script lang="ts">
import Transform from "./Transform.vue";
import FSMComponent from "./FSMComponent.vue";
import GameObject from "../../../engine/gameObject";
import { inject, ref } from "vue";

export default {

    name: 'PropertiesBar',
    components: {
        Transform,
        FSMComponent,
    },
    setup() {
        const store = inject('store');
        
        const addFSM = ()=> {
            store.selectedObj.value.addFSM('Nouvel Automate Fini');
        }

        return {
            store,
            addFSM
        }
    },
    props: {
        transform: null,
    },
}
</script>