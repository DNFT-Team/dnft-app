import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'market',
        component: () => import('../views/market/index.vue'),
      },
      {
        path: '/detail',
        name: 'detail',
        component: () => import('../views/market/ProjectDetail.vue'),
      },
      {
        path: '/createnft',
        name: 'createnft',
        component: () => import('../views/market/CreateNFT.vue'),
      },
      {
        path: '/createnftcategory',
        name: 'createnftcategory',
        component: () => import('../views/market/CreateNFTCategory.vue'),
      },
      {
        path: '/auction',
        name: 'auction',
        component: () => import('../views/auction/index.vue'),
      },
      {
        path: '/adetail',
        name: 'adetail',
        component: () => import('../views/auction/ProjectDetail.vue'),
      },
      {
        path: '/acreatenft',
        name: 'acreatenft',
        component: () => import('../views/auction/CreateNFT.vue'),
      },
      {
        path: '/acreatenftcategory',
        name: 'acreatenftcategory',
        component: () => import('../views/auction/CreateNFTCategory.vue'),
      },
      {
        path: '/tax',
        name: 'TaxList',
        component: () => import('../views/tax/TaxList.vue'),
      },
    ],
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
