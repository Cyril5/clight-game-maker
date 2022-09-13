<script lang="ts">
// import Versions from './components/Versions.vue';
import { provide } from 'vue';
import store from './store/store';
import EditorVue from './components/Editor.vue';
import WelcomeVue from './components/Welcome.vue';


export default {
  components: {
    EditorVue,
    WelcomeVue,
  },
  setup() {
    provide('store', store);

  }
}

</script>

<template>
  <WelcomeVue />
  <EditorVue />

</template>

<style lang="scss">
@import './assets/css/styles.scss';
</style>
