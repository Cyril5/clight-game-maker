import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';

library.add(fas);

// import {Project} from './project';
// setInterval(()=>{
//   console.log('hello');
//   console.log(Project.currProjectDirectory);
// },3000)


createApp(App).
component('font-awesome-icon',FontAwesomeIcon)
.mount('#app')
