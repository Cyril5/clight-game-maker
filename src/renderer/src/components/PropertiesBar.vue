<template>
    <div class="properties-bar" v-if="obj">

        <div class="components">
            <h2>{{obj.name}}</h2>
            <input type="checkbox" name="" checked id="">Actif
            <Transform :position="transform.position"
                :rotation="transform.rotation" :scale="transform.scale" />
    
            <FSMComponentVue v-if="obj.finiteStateMachines.length > 0" :fsm="obj.finiteStateMachines[0]"/>
    
            <button id="addFSMBtn">Ajouter une machine d'Etat sur l'objet</button>
        </div>

    </div>
</template>

<script lang="ts">
import Transform from "./Transform.vue";
import FSMComponentVue from "./FSMComponent.vue";
import GameObject from "../../../engine/gameObject";

export default {

    name: 'Editor',
    components: {
        Transform,
        FSMComponentVue,
    },
    props:{
        obj: GameObject,
        transform: null
    }
}
</script>