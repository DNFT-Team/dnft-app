import HomeScreen from 'pages/home';
import MarketScreen from 'pages/market';
import BridgeScreen from 'pages/bridge';
import MiningScreen from 'pages/mining';
import DataScreen from 'pages/data';
import MarketDetailScreen from 'pages/market/detail';
import AssetScreen from 'pages/asset';
import IGOScreen from 'pages/igo';
import SyncBtcScreen from 'pages/igo/syncbtc';
import ProfileScreen from 'pages/profile';
import DataDetailScreen from 'pages/data/detail';
import ProfileEditScreen from 'pages/profile/edit';
import CreateNFT from 'pages/asset/create';

/*
  reqComing - 是否需要显示coming-soon
 */
const MENU_MAP = [
  { path: '/', Component: HomeScreen, navName: 'Home', exact: true },
  { path: '/mining', Component: MiningScreen, navName: 'Mining' },
  { path: '/bridge', Component: BridgeScreen, navName: 'Bridge' },
  { path: '/market', exact: true, Component: MarketScreen, navName: 'Market', reqComing: true},
  { path: '/igo', exact: true, Component: IGOScreen, navName: 'IGO' },
  { path: '/data', exact: true, Component: DataScreen, navName: 'Data', reqComing: true },

];
const ROUTER_MAP = [
  ...MENU_MAP,
  { path: '/market/detail', exact: true, Component: MarketDetailScreen, navName: 'market' },
  { path: '/asset', exact: true, Component: AssetScreen, navName: 'asset' },
  { path: '/profile/address/*', exact: true, Component: ProfileScreen, navName: 'profile' },
  { path: '/profile/edit', exact: true, Component: ProfileEditScreen, navName: 'profile' },
  { path: '/data/detail', exact: true, Component: DataDetailScreen, navName: 'Data' },
  { path: '/asset/create', exact: true, Component: CreateNFT },
  { path: '/igo/syncBtc', exact: true, Component: SyncBtcScreen, navName: 'IGO' },
];
export { MENU_MAP, ROUTER_MAP };
