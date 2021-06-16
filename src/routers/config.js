import HomeScreen from "pages/home";
import MarketScreen from "pages/market";
import BridgeScreen from "pages/bridge";
import MiningScreen from "pages/mining";
import DataScreen from "pages/data";
import AssetScreen from "pages/asset";
import HelpScreen from "pages/help";

export const navRouter = [
  { path: "/", Component: HomeScreen, navName: "Home", exact: true },
  { path: "/market", Component: MarketScreen, navName: "Market" },
  { path: "/bridge", Component: BridgeScreen, navName: "Bridge" },
  { path: "/mining", Component: MiningScreen, navName: "Mining" },
  { path: "/data", Component: DataScreen, navName: "Data" },

  // {path: "/help", Component: HelpScreen,navName: "help",},
];

export const commonRouter = [
  { path: "/asset", Component: AssetScreen, navName: "asset" },
];
