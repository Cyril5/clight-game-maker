<template>
    <h2>Objets</h2>

    <ul id="myUL">
        <li v-for="[key, go] in gameObjectsLstRef">
            
            <!-- v-if="go.transform.parent.type=='Scene'" -->
            <div class="node" draggable="true"> 
                <span class="caret"><button @click="selectObject(go)">{{go.transform.name}}</button>
                </span>

                <ul class="nested">
                    <li v-for="child in go.transform.children"><span class="caret"><button @click="selectFromTransformRef(child)">
                        {{child.name}} (ID:{{child.id}})</button></span>
                        <!-- <ul class="nested">
                            <li v-for="subchild in child.children"><span class="caret"><button
                                        @click="selectObject(subchild)">{{subchild.name}} (ID :
                                        {{subchild.id}})</button></span>
                            </li>
                        </ul> -->
                    </li>
                </ul>
            </div>

        </li>
    </ul>
    <!-- <div v-for="[key, go] in gameObjectsLstRef">
        <button @click="selectObject(go)">{{ go.name }} (ID:
            {{ go.id }})</button>
        <button class="child" v-for="child in go.children" @click="selectObject(child)">{{ child.name
        }}</button>
    </div> -->
</template>

<script lang="ts">
import { inject, ref } from 'vue';
import { GameObject } from '../../../engine/gameObject';
import Editor from './Editor.vue';

let gameObjectsLstRef; // Map<uuid,GameObject>

export default {

    name: 'ObjectsList',
    components: {
    },
    setup() {
        const store = inject('store');

        gameObjectsLstRef = ref();

        const selectObject = (go: GameObject) => {
            Editor.methods.selectObject(go);
        }

        const selectFromTransformRef = (obj : THREE.Object3D)=> {
            const goId = obj.userData.gameObjectId;
            Editor.methods.selectObject(GameObject.gameObjects.get(goId));
        }

        return {
            store,
            gameObjectsLstRef,
            selectObject,
            selectFromTransformRef,
        }
    },
    mounted() {
        // A Améliorer
        setInterval(() => {
            gameObjectsLstRef.value = new Map<string,GameObject>(GameObject.gameObjects);
        }, 1000)
    }
}
</script>

<style lang="scss">
/* Remove default bullets */
ul,#myUL {
    list-style-type: none;
}

/* Remove margins and padding from the parent ul */
#myUL {
    margin: 0;
    padding: 0;
}

/* Style the caret/arrow */
.caret {
    cursor: pointer;
    user-select: none;
    /* Prevent text selection */
}

/* Create the caret/arrow with a unicode, and style it */
.caret::before {
    content: "\25B6";
    color: black;
    display: inline-block;
    margin-right: 6px;
}

/* Rotate the caret/arrow icon when clicked on (using JavaScript) */
.caret-down::before {
    transform: rotate(90deg);
}

/* Hide the nested list */
.nested {
    // display: none;
}

/* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
.active {
    display: block;
}
</style>