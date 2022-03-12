import { lazy } from 'react'

import HomeScreen from 'pages/home'
import MarketScreen from 'pages/market'
import MiningScreen from 'pages/mining'
import DataScreen from 'pages/data'
import CompetitionScreen from 'pages/data/competition'
import MarketDetailScreen from 'pages/market/detail'
import AssetScreen from 'pages/asset'
import IGOScreen from 'pages/igo'
import SyncBtcScreen from 'pages/igo/syncbtc'
import pokeScreen from 'pages/igo/poke'
import ProfileScreen from 'pages/profile'
import collectionScreen from 'pages/profile/collection'

import DataDetailScreen from 'pages/data/detail'
import ProfileEditScreen from 'pages/profile/edit'
import CreateNFT from 'pages/asset/create'
import GalleryScreen from 'pages/gallery'
import AssetDetailScreen from 'pages/market/detail'

//  Menu - Icon
import homeIcon from 'images/menu/home.svg'
import miningIcon from '../images/menu/mining.svg'
import bridgeIcon from '../images/menu/bridge.svg'
import marketIcon from '../images/menu/market.svg'
import igoIcon from '../images/menu/igo.svg'
import dataIcon from '../images/menu/data.svg'
import galleryIcon from '../images/menu/gallery.svg'
import dropIcon from '../images/menu/drop.svg'

import homeIcon_Select from 'images/menu/home_select.svg'
import miningIcon_Select from '../images/menu/mining_select.svg'
import bridgeIcon_Select from '../images/menu/bridge_select.svg'
import marketIcon_Select from '../images/menu/market_select.svg'
import igoIcon_Select from '../images/menu/igo_select.svg'
import dataIcon_Select from '../images/menu/data_select.svg'
import galleryIcon_Select from '../images/menu/gallery_select.svg'
import dropIcon_Select from '../images/menu/drop_select.svg'

const NetName = process.env.REACT_APP_NET_ENV
const nets = ['devnet', 'testnet', 'mainnet']

const menuAll = [
	{
		net_env: nets,
		path: '/',
		Component: HomeScreen,
		navName: 'Home',
		icon: homeIcon,
		icon_Select: homeIcon_Select,
		exact: true,
	},
	{
		net_env: nets,
		path: '/market',
		Component: MarketScreen,
		navName: 'Market',
		icon: marketIcon,
		icon_Select: marketIcon_Select,
		exact: true,
	},
	{
		net_env: [nets[2]],
		path: '/mining',
		Component: MiningScreen,
		navName: 'Mining',
		icon: miningIcon,
		icon_Select: miningIcon_Select,
	},
	{
		net_env: [nets[2]],
		path: '/bridge',
		Component: lazy(async () => import('pages/bridge')),
		navName: 'Bridge',
		icon: bridgeIcon,
		icon_Select: bridgeIcon_Select,
		exact: true,
	},
	{
		net_env: nets,
		path: '/igo',
		Component: IGOScreen,
		navName: 'IGO',
		icon: igoIcon,
		icon_Select: igoIcon_Select,
		exact: true,
	},
	{
		net_env: nets,
		path: '/drop',
		Component: lazy(async () => import('pages/drop')),
		navName: 'Drop',
		icon: dropIcon,
		icon_Select: dropIcon_Select,
		exact: true,
	},
	{
		net_env: [nets[0], nets[1]],
		path: '/data',
		Component: DataScreen,
		navName: 'Data',
		icon: dataIcon,
		icon_Select: dataIcon_Select,
		exact: true,
	},
	{
		net_env: [nets[0]],
		path: '/gallery',
		Component: GalleryScreen,
		navName: 'Gallery',
		icon: galleryIcon,
		icon_Select: galleryIcon_Select,
		exact: true,
	}
]

const MENU_MAP = menuAll.filter((e) => e.net_env.includes(NetName))

const ROUTER_MAP = [
	...MENU_MAP,

	/*	Marker Router	*/

	{ path: '/market/detail', exact: true, Component: MarketDetailScreen, navName: 'market' },

	/*	Asset Router	*/

	{ path: '/asset', exact: true, Component: AssetScreen, navName: 'asset' },
	{ path: '/asset/detail', exact: true, Component: AssetDetailScreen, navName: 'asset' },
	{ path: '/asset/create', exact: true, Component: CreateNFT },

	/*	Profile Router	*/

	{ path: '/profile/address/*', exact: true, Component: ProfileScreen, navName: 'profile' },
	{ path: '/profile/edit', exact: true, Component: ProfileEditScreen, navName: 'profile' },
	{ path: '/profile/collection', exact: true, Component: collectionScreen, navName: 'profile' },

	/*	Bridge Router	*/

	{
		path: '/bridge/transfer',
		exact: true,
		Component: lazy(async () => import('pages/bridge/transfer')),
		navName: 'Transfer',
	},

	/*	Data Router	*/

	{
		path: '/data/competition',
		exact: true,
		Component: CompetitionScreen,
		navName: 'Data',
		reqComing: 'devnet' !== NetName,
	},
	{ path: '/data/competition/detail', exact: true, Component: DataDetailScreen, navName: 'Data' },

	/*	IGO Router	*/

	{ path: '/igo/syncBtc', exact: true, Component: SyncBtcScreen, navName: 'IGO' },
	{ path: '/igo/poke', exact: true, Component: pokeScreen, navName: 'IGO' },

	/*	Gallery Router	*/
	{
		path: '/gallery/unityView',
		exact: true,
		Component: lazy(async () => import('pages/gallery/unitys')),
		navName: 'Gallery',
	},

	/*	Drop Router	*/

	{
		path: '/drop/mystery',
		exact: true,
		Component: lazy(async () => import('pages/drop/mystery')),
		navName: 'Drop',
	},
	{
		path: '/drop/auction',
		exact: true,
		Component: lazy(async () => import('pages/drop/auction')),
		navName: 'Drop',
	},
]
export { MENU_MAP, ROUTER_MAP }
