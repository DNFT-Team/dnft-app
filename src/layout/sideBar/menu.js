import { Avatar, Divider, Drawer, DrawerContent, DrawerOverlay, Flex } from '@chakra-ui/react'
import { Icon } from '@iconify/react'

import { Btn } from 'components/Button'
import { contactData } from 'config/helper'
import { css, cx } from 'emotion'
import Logo from 'images/home/dnftLogo.png'
import assetSvg from 'images/menu/asset.svg'
import assetSvg_Select from 'images/menu/asset_select.svg'
import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { withRouter } from 'react-router-dom'
import { MENU_MAP } from 'routers/config'
import { get, post } from 'utils/request'
import { shortenAddress, shortenNameString } from 'utils/tools'
// import { assetSvg } from '../../utils/svg';
import ethSvg from '../../images/networks/logo_eth.svg'
import bscSvg from '../../images/networks/logo_bsc.svg'
// import polkadotSvg from '../../images/networks/logo_pk.svg'
import selectEthSvg from '../../images/networks/logo_select_eth.svg'
import selectBscSvg from '../../images/networks/logo_select_bsc.svg'
import { NET_WORK_VERSION } from 'utils/constant'
import { setProfileAddress, setProfileToken } from 'reduxs/actions/profile'
import globalConf from 'config/index'

const DrawerMenu = (props) => {
	const { isOpen, dispatch, skipTo, location, onClose, token, address, datas } = props
	const { t } = useTranslation()
	const netArray = useMemo(
		() => [
			{
				name: 'Ethereum Mainnet',
				icon: selectEthSvg,
				shortName: ['ETH', 'Ethereum'],
				shortIcon: ethSvg,
				netWorkId: 1,
			},
			// {
			//   name: 'Polkadot Mainnet',
			//   icon: selectPolkadotSvg,
			//   shortName: ['DOT', 'Polkadot'],
			//   shortIcon: polkadotSvg,
			// },
			globalConf.net_env === 'mainnet'
				? {
						name: 'BSC Mainnet',
						icon: selectBscSvg,
						shortName: ['BSC', 'BSC'],
						shortIcon: bscSvg,
						netWorkId: 56,
				  }
				: {
						name: 'BSC Testnet',
						icon: selectBscSvg,
						shortName: ['BSC', 'BSC Test'],
						shortIcon: bscSvg,
						netWorkId: 97,
				  },
		],
		[],
	)
	let history = useHistory()
	const [profile, setprofile] = useState({})
	useEffect(async () => {
		if (address && token) {
			// dispatch(getMyProfileList({ userId: address }, token));
			const data = await post(`/api/v1/users/address/${address}`, {}, token)
			setprofile(data?.data?.data || {})
			console.log(data, 'data')
		}
	}, [address, token])
	const menuNav = [
		{
			style: { marginTop: 0 },
			navName: t('menu.profile'),
			path: `/profile/address/${address}`,
		},
		{
			icon: assetSvg,
			icon_Select: assetSvg_Select,
			style: { marginTop: 5 },
			navName: t('menu.asset'),
			path: '/asset',
			divider: true,
		},
		...MENU_MAP,
	]
	const connectMetaMaskWallet = async () => {
		try {
			let ethereum = window.ethereum
			await ethereum.enable()
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			})
			const account = accounts[0]
			const currentIndex = netArray.findIndex(
				(item) => Number(item.netWorkId) === Number(ethereum.networkVersion || ethereum.chainId),
			)
			let params = {
				address: account,
				chainType: NET_WORK_VERSION[ethereum.networkVersion || ethereum.chainId],
			}

			dispatch(setProfileAddress(params))
			dispatch(setProfileToken(params))
		} catch (e) {
			console.log(e, 'e')
		}
	}
	return (
		<Drawer placement="left" isOpen={isOpen} onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent className={styleModalContainer}>
				<div className={styleModalContainer}>
					<div className="header">
						<div onClick={() => history.push('/')} className="left">
							<Avatar className="logo" src={Logo} />
							<span>
								DNFT
								<br />
								PROTOCOL
							</span>
						</div>
						<Icon onClick={onClose} icon="ci:close-big" color="white" width="30" height="30" />
					</div>
					{!address && (
						<a className={styleConnect}>
							<Btn
								onClick={async () => {
									await connectMetaMaskWallet()
								}}
								style={{
									background: '#fff',
									color: '#00398D',
									fontFamily: 'Helvetica',
									fontWeight: 'bold',
									textAlign: 'center',
									width: '100%',
								}}
								bgColor="#fff"
							>
								{t('connect')}
							</Btn>
						</a>
					)}

					{menuNav.map((item) => {
						let isActive =
							(location?.pathname.includes(item.path) && item.path !== '/') ||
							(location.pathname === '/' && item.path === '/')
						if (!address && (item.navName === 'Profile' || item.navName === 'Asset')) {
							return null
						}
						return (
							<React.Fragment key={item.navName}>
								<div
									style={item.style || {}}
									onClick={() => {
										onClose()
										if (address || item.navName !== t('menu.profile')) {
											skipTo(item)
										}
									}}
									className={cx(styleMenuLi, isActive && styleMenuActive)}
								>
									<Flex justifyContent="space-between" alignItems="center">
										<div className="menuLeft">
											<Flex alignItems="center">
												{item.navName === 'Profile' ? (
													<>
														<img src={profile?.avatorUrl} className="userLogo" />
														<div className="user">
															<span className="menuSpan">
																{shortenNameString(profile?.nickName)}
															</span>
															<span>{address && shortenAddress(address)}</span>
														</div>
													</>
												) : (
													<>
														<img
															src={isActive ? item.icon_Select : item.icon}
															className="menuLogo"
														/>
														<span className="navName">
															{t(`menu.${item.navName.toLocaleLowerCase()}`)}
														</span>
													</>
												)}
											</Flex>
										</div>
										<div className="menuRight">
											<Icon
												icon="akar-icons:chevron-right"
												color={isActive ? '#FFFFFF' : '#c0beff'}
												width="19"
												height="19"
											/>
										</div>
									</Flex>
								</div>
								{item.divider && (
									<Divider
										bg="rgba(255, 255, 255, 0.25)"
										width="calc(100% - 52px)"
										mt="20px"
										mb="20px"
									/>
								)}
							</React.Fragment>
						)
					})}
					<div className={styleContactUs}>
						{contactData.map((item, i) => (
							<a className="item" href={item.url} target="_blank" key={i} rel="noreferrer">
								<Icon icon={item.icon} />
							</a>
						))}
					</div>
					<a
						className={styleFootDoc}
						target="_blank"
						href="https://dnft.gitbook.io"
						rel="noreferrer"
					>
						<Btn
							style={{
								margin: '0 auto',
								background: '#fff',
								paddingLeft: '40px',
								paddingRight: '40px',
								color: '#000',
								fontFamily: 'Helvetica',
								fontWeight: 'bold',
							}}
							bgColor="#fff"
						>
							{t('doc.btn.link')}
						</Btn>
					</a>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
const mapStateToProps = ({ profile }) => ({
	datas: profile.datas,
	token: profile.token,
})
export default withRouter(connect(mapStateToProps)(DrawerMenu))
const styleModalContainer = css`
	min-height: 100vh;
	width: 85vw;
	overflow: inherit;
	box-sizing: border-box;
	background: #00398d;
	.header {
		display: flex;
		padding: 10px 26px 0;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 7px;
		.left {
			display: flex;
			align-items: center;
			padding: 10px;
			span {
				font-family: Archivo Black;
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 15px;
				color: #ffffff;
			}
		}
		.logo {
			width: 40px;
			margin-right: 7px;
		}
	}
`
const styleMenuLi = css`
	padding: 10px 0;
	margin: 15px 33px 0 34px;
	.menuLeft {
		.menuLogo {
			height: 22px;
			width: 22px;
			margin-right: 20px;
			margin-left: 10px;
		}
		.userLogo {
			height: 40px;
			width: 40px;
			border-radius: 50%;
			margin-right: 10px;
			padding: 10px 0;
		}
		span {
			font-family: Archivo Black;
			font-style: normal;
			font-weight: normal;
			font-size: 16px;
			line-height: 17px;
			letter-spacing: 0.02em;
			color: #929ac2;
		}
		.user {
			display: flex;
			flex-direction: column;
			span {
				font-family: Helvetica;
				font-style: normal;
				font-weight: bold;
				font-size: 14px;
				line-height: 18px;
				color: #929ac2;
				&:first-child {
					font-size: 18px;
					line-height: 32px;
					color: #ffffff;
				}
			}
		}
	}
`
const styleMenuActive = css`
	.navName {
		color: #fff !important;
	}
`
const styleContactUs = css`
	display: flex;
	flex-direction: row;
	gap: 50px;
	margin-top: 30px;
	justify-content: center;
	.item {
		text-decoration: none;
		font-size: 1.84rem;
		color: white;
		&:hover {
			svg {
				transform: scale(1.2);
			}
		}
	}
`
const styleConnect = css`
	cursor: pointer;
	display: flex;
	margin: 27px;
	margin-bottom: 10px;
	align-items: center;
	justify-content: center;
	text-decoration: none;
`
const styleFootDoc = css`
	cursor: pointer;
	display: flex;
	margin: 20px;
	align-items: center;
	justify-content: center;
	text-decoration: none;
`
