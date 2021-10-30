//  Route - Pages
import HomeScreen from 'pages/home';
import MarketScreen from 'pages/market';
import BridgeScreen from 'pages/bridge';
import BridgeTransfer from 'pages/bridge/transfer';
import MiningScreen from 'pages/mining';
import DataScreen from 'pages/data';
import CompetitionScreen from 'pages/data/competition';
import MarketDetailScreen from 'pages/market/detail';
import AssetScreen from 'pages/asset';
import IGOScreen from 'pages/igo';
import SyncBtcScreen from 'pages/igo/syncbtc';
import ProfileScreen from 'pages/profile';
import collectionScreen from 'pages/profile/collection';

import DataDetailScreen from 'pages/data/detail';
import ProfileEditScreen from 'pages/profile/edit';
import CreateNFT from 'pages/asset/create';
import GalleryScreen from 'pages/gallery';
import UnityScreen from 'pages/gallery/unitys';
//  Menu - Icon
import homeIcon from '../images/nav/home_selected.svg';
import miningIcon from '../images/nav/mining_selected.svg';
import bridgeIcon from '../images/nav/bridge_selected.svg';
import marketIcon from '../images/nav/market_selected.svg';
import igoIcon from '../images/nav/igo_selected.svg';
import dataIcon from '../images/nav/data_selected.svg';
import galleryIcon from '../images/nav/gallery.svg';

import globalConf from 'config/index';
const NetName = globalConf.net_name
const nets = ['devnet', 'testnet', 'mainnet']

/*
  reqComing - 是否需要显示coming-soon
 */
const menuAll = [
  { net_env: nets, path: '/', Component: HomeScreen, navName: 'Home', icon: homeIcon, exact: true },
  { net_env: [nets[2]], path: '/mining', Component: MiningScreen, navName: 'Mining', icon: miningIcon },
  { net_env: [nets[2]], path: '/bridge', Component: BridgeScreen, navName: 'Bridge', icon: bridgeIcon, exact: true },
  { net_env: nets, path: '/market', Component: MarketScreen, navName: 'Market', icon: marketIcon, exact: true },
  { net_env: nets, path: '/igo', Component: IGOScreen, navName: 'IGO', icon: igoIcon, exact: true },
  { net_env: [nets[0], nets[1]], path: '/data', Component: DataScreen, navName: 'Data', icon: dataIcon, exact: true,  },
  { net_env: [nets[0]], path: '/gallery', Component: GalleryScreen, navName: 'Gallery', icon: galleryIcon, exact: true },

];
const MENU_MAP = menuAll.filter((e) => e.net_env.includes(NetName))
const ROUTER_MAP = [
  ...MENU_MAP,
  { path: '/market/detail', exact: true, Component: MarketDetailScreen, navName: 'market' },
  { path: '/asset', exact: true, Component: AssetScreen, navName: 'asset' },
  { path: '/profile/address/*', exact: true, Component: ProfileScreen, navName: 'profile' },
  { path: '/profile/edit', exact: true, Component: ProfileEditScreen, navName: 'profile' },
  { path: '/profile/collection', exact: true, Component: collectionScreen, navName: 'profile' },
  { path: '/data/competition', exact: true, Component: CompetitionScreen, navName: 'Data', reqComing: 'devnet' !== NetName  },
  { path: '/data/competition/detail', exact: true, Component: DataDetailScreen, navName: 'Data' },
  { path: '/asset/create', exact: true, Component: CreateNFT },
  { path: '/igo/syncBtc', exact: true, Component: SyncBtcScreen, navName: 'IGO' },
  { path: '/gallery/unityView', exact: true, Component: UnityScreen, navName: 'Gallery' },
  { path: '/bridge/transfer', exact: true, Component: BridgeTransfer, navName: 'Transfer' }
];
export { MENU_MAP, ROUTER_MAP };
