import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes'

//解决 在用vue-router 做单页应用的时候重复点击一个跳转的路由会出现报错
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return (originalPush.call(this, location).catch(err=>err))
// }
Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  routes,
});
router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router;
