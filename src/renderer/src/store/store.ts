
import { FiniteStateMachine } from '@engine/statesmachine/fsm';
import {GameObject} from '@engine/gameObject';
import {reactive,ref} from 'vue';
import EditorMode from '@renderer/components/Editor.vue';
import { StateFile } from '@engine/statesmachine/stateFile';

const fs = require('fs');

const state = reactive({
    counter: 566,
})

const statesEditorRtv = reactive({
    currStateFile: StateFile,
});

const editorRtv = reactive({
    selectedObj: null,
    states: new Map<string, StateFile>(), //States File
});

const editorMode = ref('LEVEL'); // FSM_STATES, LEVEL, GAME_RUNNING
const assetsDir = ref<string>();
const currentFSM = ref<FiniteStateMachine>();


export default {
    state,
    editorRtv,
    assetsDir,
    currentFSM,
    statesEditorRtv,
    editorMode,

}