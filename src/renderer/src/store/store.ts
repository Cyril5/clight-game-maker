
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm'
import {GameObject} from '../../../engine/gameObject';
import {State} from '../../../engine/statesmachine/state';
import {reactive,ref, watch} from 'vue'
import EditorMode from '@renderer/components/Editor.vue';
import { StateFile } from '../../../engine/statesmachine/stateFile';

const fs = require('fs');

const state = reactive({
    counter: 566,
})

const statesEditorRtv = reactive({
    currState: StateFile,
});

const editorRtv = reactive({
    states: Array<StateFile>(), //States File
});

const editorMode = ref('LEVEL'); // FSM_STATES, LEVEL, GAME_RUNNING
const assetsDir = ref<string>();
const selectedObj = ref<GameObject>();
const currentFSM = ref<FiniteStateMachine>();


export default {
    state,
    editorRtv,
    assetsDir,
    selectedObj,
    currentFSM,
    statesEditorRtv,
    editorMode,

}