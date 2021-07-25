export const menu = [
  {
    path: '/home',
    name: 'Home',
    meta: { title: 'home', icon: 'home' },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/market',
    name: 'Market',
    meta: { title: 'market', icon: 'market' },
    component: () => import('../views/Market.vue'),
  },
  {
    path: '/ai',
    name: 'AI',
    meta: { title: 'AI', icon: 'AI' },
    component: () => import('../views/DataTsf.vue'),
  },
  {
    path: '/dao',
    name: 'DAO',
    meta: { title: 'dao', icon: 'dao' },
    component: () => import('../views/DaoTsf.vue'),
  },
  {
    path: '/auction',
    name: 'Auction',
    meta: { title: 'auction*', icon: 'auction' },
    component: () => import('../views/Auction.vue'),
  },
  {
    path: '/recycle',
    name: 'Recycle',
    meta: { title: 'recycle*', icon: 'recycle' },
    component: () => import('../views/Recycle.vue'),
  },
];
export default [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('../layout/Page404.vue'),
  },
  {
    path: '/assets',
    name: 'Assets',
    meta: { title: 'assets', icon: 'assets' },
    component: () => import('../views/AssetsTax.vue'),
  },
  {
    path: '/pending',
    name: 'Pending',
    meta: { title: 'pending', icon: 'pending' },
    component: () => import('../layout/TransferPending.vue'),
  },
  {
    path: '/transfer',
    name: 'Transfer',
    meta: { title: 'transfer', icon: 'transfer' },
    component: () => import('../views/TransferInfo.vue'),
  },
  {
    path: '/bit',
    name: 'Bit',
    meta: { title: 'bit', icon: 'bit' },
    component: () => import('../views/AuctionInfo.vue'),
  },
  {
    path: '/bound',
    name: 'ai-info',
    meta: { title: 'bound', icon: 'bound' },
    component: () => import('../views/ai-info.vue'),
  },
  {
    path: '/nft2006',
    name: 'nft2006',
    meta: { title: 'nft2006', icon: 'nft2006' },
    component: () => import('../views/nft2006.vue'),
  },
  ...menu,
];
