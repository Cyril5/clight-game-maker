
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm'
import {GameObject} from '../../../engine/gameObject';
import {reactive,ref, watch} from 'vue'

const fs = require('fs');

const state = reactive({
    counter: 566,
})

const assetsDir = ref<string>();
const selectedObj = ref<GameObject>();
const currentFSM = ref<FiniteStateMachine>();


export default {
    state,
    assetsDir,
    selectedObj,
    currentFSM,
}