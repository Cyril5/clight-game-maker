<template>
    <h2>Objets</h2>
    <ul id="myUL">
        <li v-for="[key, go] in gameObjectsLstRef">

            <div class="node" v-if="go.parent.type=='Scene'">
                <span class="caret"><button @click="selectObject(go)">{{go.name}}
                    (ID:{{go.id}})</button>
            </span>

            <ul class="nested" v-if="go.children">
                <li v-for="child in go.children"><span class="caret"><button @click="selectObject(child)">{{child.name}}
                    (ID:{{child.id}})</button></span>
                    <ul class="nested">
                        <li v-for="subchild in child.children"><span class="caret"><button @click="selectObject(subchild)">{{subchild.name}} (ID : {{subchild.id}})</button></span>
                        </li>
                    </ul>
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

<script lang="ts">import { GameObject } from '@engine/gameObject';
import { inject, ref } from 'vue';
import Editor from './Editor.vue';

let gameObjectsLstRef;

export default {

name: 'ObjectsList',
components: {

},
setup() {
    const store = inject('store');

    gameObjectsLstRef = ref();

    const selectObject = (go : GameObject)=> {
        Editor.methods.selectObject(go);
    }
    
    return {
        store,
        gameObjectsLstRef,
        selectObject
    }
},
mounted() {
        // A Améliorer
        setInterval(() => {
            gameObjectsLstRef.value = new Map(GameObject.gameObjects);
        }, 1000)
}
}
</script>

<style lang="scss">
/* Remove default bullets */
ul,
#myUL {
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