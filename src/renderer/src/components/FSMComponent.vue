<template>
    <div class="component">
        <div class="bar">
            <input v-model="fsm.name" type="text"/>(Automate Fini)
            <button>X</button>
        </div>
        <button @click="editFSM">Editer</button>
        <input type="checkbox" checked name="enabled" id="enabled" class="checkbox">Actif
        <div style="display: flex;">
            <p>Etat Initial :</p>
            <select name="fsm-states" id="fsm-states">
                    <option value="stateA">State A</option>
            </select>
        </div>
        <p>Nb Etats : {{fsm.states.length}}</p>
    </div>
</template>

<script lang="ts">

import { GameObject } from '../../../engine/gameObject';
import * as THREE from 'three';
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm';
import FSMEditor from './FSMEditor.vue';
import { inject } from 'vue';

export default {

    name: 'FSMComponent',
    components: {
        FSMEditor
    },
    props:{
        index: 0,
        fsm: FiniteStateMachine,
    },
    setup(props : any) {

        const store = inject('store');

        const editFSM = ()=> {

            
            store.currentFSM.value = props.fsm; // currentFSM est dans le store
            console.log(store.currentFSM.value);

            if(store.currentFSM.value.getCurrState().filename == '') {
                alert("Aucun fichier n'a été défini pour "+store.currentFSM.value.getCurrState().name
                +"\n l'état ne pourra pas être sauvegardé");
            }

            FSMEditor.loadState();

                
        };


        return {
            store,
            editFSM
        }
    },
    mounted() {
    },

}


</script>