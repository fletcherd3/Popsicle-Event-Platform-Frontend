import { createApp } from 'vue';
import {router} from './routes';
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App);



app.use(router).use(ElementPlus).mount('#app')
