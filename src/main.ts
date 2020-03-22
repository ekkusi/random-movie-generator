import Vue from 'vue';
import { Button, Tag, Select, Option } from 'element-ui';
import App from './App.vue';
import router from './router';
import './element-variables.scss';

Vue.config.productionTip = false;

Vue.component(Button.name, Button);
Vue.component(Tag.name, Tag);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
