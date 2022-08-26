<template>

    <div id="fsm-editor" v-if="store.currentFSM.value">
        <div class="group" style="display: flex; justify-content: center;">
            <h3 id="fsm-name" style="color: #fff;">{{ store.currentFSM.value.gameObject.name
            }}->{{ store.currentFSM.value.name }}</h3>
            <!-- <select name="fsm-states" id="fsm-states">
                <option value="stateA">State A</option>
            </select> -->
        </div>
        <p>Double cliquez sur un état orange pour l'éditer</p>

        {{store.editorRtv.states.length}}

        <div class="statesArea">
            <button class="start">Départ</button>
            <div class="state" v-for="state in store.currentFSM.value.states">
                =>
                <input v-model="state.name" type="text" />
                <select name="states" id="pet-select">
                    <option value="">--Aucun Fichier d'État--</option>
                    <option v-for="stateFile in store.editorRtv.states" :value="state.statefile">{{ stateFile.getFileName() }}</option>
                </select>
                <button @click="editState(state)">Editer</button>
                <button @click="removeState(state)">Retirer</button>
            </div>
            <button @click="addState">Ajouter un état</button>
        </div>



    </div>





</template>

<script lang="ts">
import { inject } from 'vue';

import { GameObject } from '../../../engine/gameObject';
import StatesEditor from '@renderer/components/StatesEditor.vue';

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

        const editState = (state) => {
            if (state.filename === undefined) {
                alert("L'état : '" + state.name + "' est relié à aucun fichier \n " +
                    "Pour relier un fichier a l'état: sélectionné le nom du fichier dans " +
                    "la liste déroulante de l'état. Sinon le créer dans l'éditeur d'états puis le relier");
                return;
            }
            StatesEditor.loadState(state);
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
        }

    },

    mounted() {
        // All Components are ready

        console.log('fsm editor mounted');



        const saveWorkspace = () => {
            const json = Blockly.serialization.workspaces.save(store.statesEditorRtv.currState);

            fs.writeFile(
                store.currentFSM.value.filename, JSON.stringify(json), err => {
                    if (err) {
                        alert("Une erreur c'est produite pendant la sauvegarde de StateA :\n\n" + err);
                        console.log(err);
                    }
                }
            );
        };





    }
}

</script>

<style lang="scss">
.start {
    background-color: green;
}


.statesArea {
    display: flex;
    align-items: center;

    .state {
        margin: 15px 15px;
        max-width: 200px;
        background-color: orange;
        color: black;
    }
}

p {
    text-align: center;
}
</style>