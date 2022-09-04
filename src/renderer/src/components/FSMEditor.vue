<template>

    <div id="fsm-editor" v-if="store.currentFSM.value">
        <div class="group" style="display: flex; justify-content: center;">
            <h3 id="fsm-name" style="color: #fff;">{{  store.currentFSM.value.gameObject.name 
                }}->{{  store.currentFSM.value.name  }}</h3>
            <!-- <select name="fsm-states" id="fsm-states">
                <option value="stateA">State A</option>
            </select> -->
        </div>

        {{ store.editorRtv.states.length }}

        <div class="statesArea">
            <div class="run">
                <font-awesome-icon icon="fa-solid fa-person-running" />
            </div>
            
            <div class="state" v-for="state in store.currentFSM.value.states">
                <font-awesome-icon icon="fa-solid fa-arrow-right-long" />
                <div class="content">
                    <div class="top">
                        <font-awesome-icon icon="fa-solid fa-gears" />
                        <input v-model="state.name" type="text" />
                    </div>
                    <select name="states" @change="setStateFileToState(state, $event)">
                        <option value="">--Aucun Fichier d'État--</option>
                        <option v-for="(stateFile, index) in store.editorRtv.states" :value="stateFile[1].getFileName()">{{
                             stateFile[1].getFileName()  }}</option> 
                    </select>
                    <button @click="editState(state)">Editer</button>
                    <button @click="removeState(state)">Retirer</button>
                </div>
            </div>
            <button @click="addState">Ajouter un état</button>
        </div>



    </div>





</template>

<script lang="ts">
import { inject } from 'vue';

import { GameObject } from '../../../engine/gameObject';
import StatesEditor from '@renderer/components/StatesEditor.vue';
import { State } from '../../../engine/statesmachine/state';

let store;
const fs = require('fs');

export default {

    name: 'FSMEditor',
    components: {
        StatesEditor,
    },

    setup() {
        store = inject('store');


        const addState = () => {
            console.log("ajout d'un etat");
            store.currentFSM.value.addState();
        };

        const setStateFileToState = (state: State, event) => {
            console.log(event.target.value);
            const index = event.target.value;

            const value = store.editorRtv.states.get(index);

            console.log(state);

            if (value) {
                state.statefile = value;
                console.log(state.statefile.outputCode);
            }else{
                state.statefile = undefined;
            }

        }

        const editState = (state: State) => {

            console.log(state);

            if (state.statefile === undefined || state.statefile.getFileName() == "") {
                alert("L'état : '" + state.name + "' est relié à aucun fichier \n " +
                    "Pour relier un fichier a l'état: sélectionné le nom du fichier dans " +
                    "la liste déroulante de l'état. Sinon le créer dans l'éditeur d'états puis le relier");
                return;
            }

            store.editorMode.value = "FSM_STATES";
            StatesEditor.methods.loadState(state.statefile,true);
        }

        const removeState = (state) => {

            store.currentFSM.value.removeState(state);

        }

        const saveState = () => {
            if (store.currentFSM.value.getBaseState().filename == '') {

            } else {

            }
        };

        const setStateFile = (event) => {
            console.log(event.target.value);
        }

        const executeJSCode = (code: string) => {
            setTimeout(code, 0);
        }


        const executeCmd = () => {

            console.log(store.currentFSM.value);

            const g = GameObject.getById(161);
            //g.finiteStateMachines[0].getCurrState().code = "let test = require('test_require.js');";
            // g.finiteStateMachines[0].getCurrState().code += "\n\nconsole.log(GameObject.getById(161));";
            //alert(g.finiteStateMachines[0].getCurrState().code);
            //g.finiteStateMachines[0].getCurrState().runCode();

            // eval("alert(GameObject)"); // works
            console.log(store.currentFSM.value.getCurrState().runCode());

        };


        return {
            store,
            addState,
            saveState,
            setStateFile,
            executeCmd,
            editState,
            removeState,
            setStateFileToState
        }

    },

    mounted() {
        // All Components are ready

        console.log('fsm editor mounted');









    }
}

</script>

<style lang="scss">
.start {
    background-color: green;
}


.statesArea {
    width: 100%;
    display: flex;
    align-items: center;

    .run {
        font-size: 2em;
    }

    .state {
        display: flex;
        font-size: 2.8em;
        margin: 5px 0px;
        align-items: center;
        // border: 1px solid white;
        
        .content {
            max-width: 250px;
            background-color: rgb(17, 16, 13);
            color: rgb(199, 187, 187);
            border-radius: 5%;

            .top {
                display: flex;
            }

            input,select {
                width: 100%;
                border: none;
                background-color: rgb(17, 16, 13);
                font-size: 0.5em;
                color: rgb(199, 187, 187);
            }

            select {
                font-size: 0.4em;
            }


        }
    }

}

p {
    text-align: center;
}
</style>