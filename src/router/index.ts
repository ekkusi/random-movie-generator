import Vue from 'vue';
import VueRouter from 'vue-router';
import Medias from '../views/Medias.vue';
import { MediaType } from '@/types/Media';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Movies',
    component: Medias,
    props: { mediaType: MediaType.MOVIE },
  },
  {
    path: '/shows',
    name: 'TV-Shows',
    component: Medias,
    props: { mediaType: MediaType.SHOW },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
