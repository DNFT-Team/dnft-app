import HomeScreen from 'pages/home';
import MarketScreen from 'pages/market';
import BridgeScreen from 'pages/bridge';
import MiningScreen from 'pages/mining';
import DataScreen from 'pages/data';
import MarketDetailScreen from 'pages/market/detail';
import AssetScreen from 'pages/asset';
import IGOScreen from 'pages/igo'

const MENU_MAP = [
  { path: '/', Component: HomeScreen, navName: 'Home', exact: true },
  { path: '/mining', Component: MiningScreen, navName: 'Mining' },
  { path: '/bridge', Component: BridgeScreen, navName: 'Bridge' },
  { path: '/market', exact: true, Component: MarketScreen, navName: 'Market'},
  // { path: '/data', Component: DataScreen, navName: 'Data', deActive: true },
  { path: '/igo', Component: IGOScreen, navName: 'IGO' },
];
const ROUTER_MAP = [
  ...MENU_MAP,
  {
    path: '/market/detail',
    exact: true,
    Component: MarketDetailScreen,
    navName: 'market',
  },
  { path: '/asset', exact: true, Component: AssetScreen, navName: 'asset' },
];
export { MENU_MAP, ROUTER_MAP };
