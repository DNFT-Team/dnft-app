import HomeScreen from 'pages/home';
import MarketScreen from 'pages/market';
import BridgeScreen from 'pages/bridge';
import MiningScreen from 'pages/mining';
import DataScreen from 'pages/data';
import MarketDetailScreen from 'pages/market/detail';
import AssetScreen from 'pages/asset';

const MENU_MAP = [
  { path: '/', Component: HomeScreen, navName: 'Home', exact: true },
  { path: '/mining', Component: MiningScreen, navName: 'Mining' },
  { path: '/bridge', Component: BridgeScreen, navName: 'Bridge' },
  { path: '/market', exact: true, Component: MarketScreen, navName: 'Market', deActive: true},
  { path: '/data', Component: DataScreen, navName: 'Data', deActive: true },
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
