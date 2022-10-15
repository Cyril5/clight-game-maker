<template>
    <!-- The Modal -->
    <div v-if="show" id="myModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" @click="show = false">&times;</span>
                <h2>Bienvenue dans Lusine Game Maker</h2>
            </div>

            <div class="modal-body">
                <img src="../assets/logo.png" alt="logo">
                <button @click="createProject">Créer un nouveau projet</button>
                <button @click="openProject">Ouvrir un projet</button>
                <button @click="exit">Quitter Lusine</button>
            </div>
            <div class="modal-footer">
                <h3>Lusine Game Maker Alpha 0.1.2</h3>
                <h4>Developpé par Cyril5</h4>
                <a href="https://github.com/Cyril5/">Git Hub Repository</a>
            </div>

        </div>

    </div>
</template>

<script lang="ts">
import { Project } from '@renderer/project';
import store from '@renderer/store/store';
import Editor from './Editor.vue';
import { Game } from '@engine/game';
import { ref } from 'vue';
import StatesEditor from './StatesEditor.vue';

const fs = require('fs');

export default {
    name: 'Welcome',
    components: {
    },
    setup() {

        const show = ref(true);

        const { ipcRenderer } = require('electron');

        const exit = ()=>{
            ipcRenderer.invoke("exitApp");
        }

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
            Game.getInstance(); // initialize a new game
            store.editorMode.value = 'LEVEL';

            try {
                StatesEditor.methods.updateAllStateFilesCode();
            } catch (err) {
                alert("Erreur pendant la génération du code dans tous les états : \n" + err.message);
            }
        });

        // Réponse après qu'on ouvre un projet
        ipcRenderer.on('projectOpenedReply', (event, arg) => {

            console.log("project opening");

            Project.setDir(arg); // obligé de le refaire ici car cela ne fonctionne pas dans le main process d'electron
            store.assetsDir.value = Project.getAssetsDir();
            show.value = false;
            //Game.getInstance(); // TODO ouvrir un projet
            //Project.open();
            
            store.editorMode.value = 'LEVEL';

            
            try {
                    StatesEditor.methods.updateAllStateFilesCode();
                } catch (err) {
                    alert("Erreur pendant la génération du code dans tous les états : \n" + err.message);
            }


        });



        return {
            show,
            createProject,
            openProject,
            exit
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
    z-index: 101;
    /* Sit on top */
    // left: 0;
    // top: 0;
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
    background-color: #292a319b;
    top: 12.5%;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    max-width: 1024px;
    // height: 100%;
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