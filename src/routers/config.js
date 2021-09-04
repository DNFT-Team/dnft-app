//  Route - Pages
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
//  Menu - Icon
import homeIcon from '../images/nav/home_selected.svg';
import miningIcon from '../images/nav/mining_selected.svg';
import bridgeIcon from '../images/nav/bridge_selected.svg';
import marketIcon from '../images/nav/market_selected.svg';
import igoIcon from '../images/nav/igo_selected.svg';
import dataIcon from '../images/nav/data_selected.svg';

/*
  reqComing - 是否需要显示coming-soon
 */
const MENU_MAP = [
  { path: '/', Component: HomeScreen, navName: 'Home', icon: homeIcon, exact: true, reqComing: true},
  { path: '/mining', Component: MiningScreen, navName: 'Mining', icon: miningIcon },
  { path: '/bridge', Component: BridgeScreen, navName: 'Bridge', icon: bridgeIcon },
  { path: '/market', Component: MarketScreen, navName: 'Market', icon: marketIcon, exact: true, reqComing: true},
  { path: '/igo', Component: IGOScreen, navName: 'IGO', icon: igoIcon, exact: true },
  { path: '/data', Component: DataScreen, navName: 'Data', icon: dataIcon, exact: true, reqComing: true }

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
