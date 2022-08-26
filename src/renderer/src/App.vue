<script lang="ts">
// import Versions from './components/Versions.vue';
import { inject, provide } from 'vue';
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

    console.log(store.assetsDir.value);
  }
}

</script>

<template>
  <WelcomeVue />
  <EditorVue/>

</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
