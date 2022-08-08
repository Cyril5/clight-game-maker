
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm'
import GameObject from '../../../engine/gameObject';
import {reactive,ref} from 'vue'

const fs = require('fs');

const state = reactive({
    counter: 566,
})

const selectedObj = ref<GameObject>();
const currentFSM = ref<FiniteStateMachine>();


export default {
    state,
    selectedObj,
    currentFSM,
}