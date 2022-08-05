<template>
    <div class="component">
        <!-- {{fsm.name}} -->
        <div class="bar">
            <h2><input v-model="fsm.name" type="text"/>(Automate Fini)</h2>
            <button>X</button>
        </div>
        <button v-on:click="test">Editer</button>
        <input type="checkbox" checked name="enabled" id="enabled" class="checkbox">Actif
        <p>Nb Etats : {{fsm.states.length}}</p>
    </div>
</template>

<script lang="ts">

import { GameObject } from '../../../engine/gameObject';
import * as THREE from 'three';
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm';

export default {

    name: 'FSMComponent',
    components: {
    },

    setup() {
    },
    data() {
        return {
            }
    },
    props:{
        fsm: FiniteStateMachine,
    },
    methods: {
        test() {
            console.log(fsm);
        }
    },
    mounted() {
    },

}


</script>