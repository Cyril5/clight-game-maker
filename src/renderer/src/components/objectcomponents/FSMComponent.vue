<template>
    <div class="component">
        <div class="bar">
            <input v-model="fsm.name" type="text"/>(Automate Fini)
            <button @click="deleteFSM">X</button>
        </div>
        <button @click="editFSM">Editer</button>
        <input type="checkbox" v-model="fsm.enabled" checked name="enabled" id="enabled" class="checkbox">Actif
        <div style="display: flex;">
            <p>Etat Initial :</p>
        </div>
        <p>Nb Etats : {{fsm.states.length}}</p>
    </div>
</template>

<script lang="ts">

import { inject } from 'vue';
import FSMEditor from '../FSMEditor.vue';

export default {

    name: 'FSMComponent',
    components: {
        FSMEditor
    },
    props:{
        index: 0,
        fsm: null,
    },
    setup(props : any) {

        const store = inject('store');

        const editFSM = ()=> {

            
            store.currentFSM.value = props.fsm; // currentFSM est dans le store
            console.log(store.currentFSM.value);

            if(store.currentFSM.value.getBaseState()===undefined) {
                alert("Aucun état de base à été défini sur cet automate fini \n Veuillez en ajoutez un.");
            }else{
                if(store.currentFSM.value.getBaseState().filename == '') {
                    alert("Aucun fichier n'a été défini pour "+store.currentFSM.value.getBaseState().name
                    +"\n l'état ne pourra pas être sauvegardé");
                }
            }
        };

        const deleteFSM = ()=>{
            props.fsm.delete();
        }


        return {
            store,
            editFSM,
            deleteFSM
        }
    },
    mounted() {
    },

}


</script>