<template>
    <!-- The Modal -->
    <div v-if="show" id="myModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" @click="show=false">&times;</span>
                <h2>Bienvenue dans Lusine Game Maker</h2>
            </div>

            <div class="modal-body">
                <img src="../assets/logo.png" alt="logo">
                <button @click="createProject">Créer un nouveau projet</button>
                <button @click="openProject">Ouvrir un projet</button>
                <button>Quitter Lusine</button>
            </div>
            <div class="modal-footer">
                <h3>Lusine Game Maker Alpha 0.1.1</h3>
                <h4>Developpé par Cyril5</h4>
                <h5>https://github.com/Cyril5/</h5>
            </div>

        </div>

    </div>
</template>

<script lang="ts">
import * as THREE from 'three';
import { Project } from '@renderer/project';
import store from '@renderer/store/store';
import { Game } from '../../../engine/game';
import { ref } from 'vue';

export default {
    name: 'Welcome',
    components: {
    },
    setup() {

        const show = ref(true);

        const {ipcRenderer}  = require('electron');

        const createProject = () => {
            ipcRenderer.invoke('createProject');
        }

        const openProject = () => {
            ipcRenderer.invoke('openProject');
        }

        // Réponse après que le projet soit créé
         ipcRenderer.on('projectCreatedReply', (event, arg) => {
            console.log(arg);
            Project.setDir(arg); // obligé de le refaire ici car cela ne fonctionne pas dans le main process d'electron
            store.assetsDir.value = Project.getAssetsDir();
            show.value = false;
            //Game.createGOTest();
            new Game();
         });

         // Réponse après qu'on ouvre un projet
         ipcRenderer.on('projectOpenedReply', (event, arg) => {
            Project.setDir(arg); // obligé de le refaire ici car cela ne fonctionne pas dans le main process d'electron
            store.assetsDir.value = Project.getAssetsDir();
            show.value = false;
            new Game(); // TODO ouvrir un projet
         });


        return {
            show,
            createProject,
            openProject,
        }
    }
}
</script>

<style lang="scss">
/* The Modal (background) */
.modal {
    //   display: none; /* Hidden by default */
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
    background-color: rgb(0, 0, 0);
    /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4);
    /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
    position: relative;
    background-color: #fefefe;
    top: 25%;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    width: 80%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;

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
        padding: 2px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;

        button {
            margin: 5px 0;
            width: 80%;
        }
    }

    /* Modal Footer */
    .modal-footer {
        padding: 2px 16px;
        background-color: #211e30;
        color: white;
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