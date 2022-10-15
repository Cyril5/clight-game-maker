<template>

    <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-header">
            <span class="close" @click="show = false">&times;</span>
            <h2>Objects Viewer</h2>
        </div>

        <div class="modal-body">

            


            <table class="center">
                <tr>
                    <th>GameObject ID</th>
                    <th>Transform ID</th>
                    <th>Type</th>
                </tr>
                <tr v-for="[key, go] in gameObjectsLstRef">
                    <td>{{go.id}}</td>
                    <td>{{go.transform.uuid}}</td>
                    <td>{{go.transform.type}}</td>
                </tr>
            </table>
            <table class="center transforms">
                <tr>
                    <th>name</th>
                    <th>Object ID</th>
                </tr>
                <tr v-for="obj in transformsListRef">
                    <td>{{obj.uuid}}</td>
                    <td>{{obj.name}}</td>
                </tr>
                <!-- <tr v-for="child in go.transform.children">
                    <td>{{child.uuid}}</td>
                    <td>{{child.name}}</td>
                </tr> -->
            </table>
        </div>

    </div>

    <!-- The Modal -->
    <!-- <div v-if="show" id="myModal" class="modal"> -->
    <!-- </div> -->
</template>

<script lang="ts">
import { Project } from '@renderer/project';
import store from '@renderer/store/store';
import { Game } from '@engine/game';
import { ref } from 'vue';
import StatesEditor from './StatesEditor.vue';
import { GameObject } from '@engine/gameObject';
import { RendererManager } from '@renderer/rendererManager';

const fs = require('fs');

let gameObjectsLstRef;
let transformsListRef;

export default {

    name: 'ObjectsViewer',
    components: {
        
    },
    setup() {

        const show = ref(true);

        const { ipcRenderer } = require('electron');

        gameObjectsLstRef = ref();
        transformsListRef = ref();
        return {
            show,
            gameObjectsLstRef,
            transformsListRef,
        }
    },
    mounted() {
        // A Améliorer
        setInterval(() => {

            gameObjectsLstRef.value = new Map<string, GameObject>(GameObject.gameObjects);
            transformsListRef.value = RendererManager.getInstance().scene?.children;
        }, 1000)
    }
}
</script>

<style lang="scss">

.icon {
    &:hover {
      cursor: pointer;
    }
  }

  .muted {
    color: gray;
    font-size: 80%;
  }

.vtl {
    .vtl-drag-disabled {
      background-color: #d0cfcf;
      &:hover {
        background-color: #d0cfcf;
      }
    }
    .vtl-disabled {
      background-color: #d0cfcf;
    }
  }

/* Modal Content */
.modal-content {
    z-index: 100;
    position: fixed;
    background-color: #292a319b;
    top: 12.5%;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    // max-width: 1024px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;

    .center {
        margin-left: auto;
        margin-right: auto;
    }

    .transforms {
        color: red;
    }

    img {
        width: 25%;
    }

    /* Modal Header */
    .modal-header {
        padding: 2px 16px;
        background-color: #211e30;
        color: white;
    }

    /* Modal Body */
    .modal-body {
        // padding: 2px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            margin: 30px;
        }

        button {
            margin: 5px 0;
            width: 80%;
        }
    }

    /* Modal Footer */
    .modal-footer {
        // padding: 2px 16px;
        background-color: #211e30;
    }
}

/* Add Animation */
@keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }

    to {
        top: 0;
        opacity: 1
    }
}


/* The Close Button */
.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>