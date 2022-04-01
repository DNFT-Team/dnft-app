import React, { useEffect, useState } from 'react'
import { css, cx } from 'emotion'
import bg from 'images/igo/poke-bg.png'
import vedioCut from 'images/igo/vedio-cut.png'
import card from 'images/igo/card.png'
import { useHistory } from 'react-router'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import globalConfig from '../../../config/index'
import { useTranslation } from 'react-i18next'
import { Dialog, Loading } from 'element-react'
import { SimpleGrid } from '@chakra-ui/react'
import { blindBoxAbi, busdAbi, tokenAbi } from 'utils/abi'
import { blindBox721Contract, blindBoxApproveContract } from 'utils/contract'
import { getWallet } from 'utils/get-wallet'
import SwitchModal from 'components/SwitchModal'
import Web3 from 'web3'
import { WEB3_MAX_NUM } from 'utils/web3Tools'
import { get, post } from 'utils/request'
import dayjs from 'dayjs'
import defaultBox from 'images/drops/box.png'
import { toast } from 'react-toastify'

const pokeScreen = (props) => {
	const { t } = useTranslation()
	const currentNetEnv = globalConfig.net_env
	const rightChainId = currentNetEnv === 'testnet' ? 97 : 56
	const [buyAmount, setBuyAmount] = useState(1)
	const [blindBoxId, setBlindBoxId] = useState()
	const [boxIsOpen, setBoxIsOpen] = useState()
	const [isApproved, setIsApproved] = useState(false)

	const [isUnboxVisible, setIsUnboxVisible] = useState(false)
	const [isGotoAssetVisible, setIsGotoAssetVisible] = useState(false)
	const [isShowSwitchModal, setIsShowSwitchModal] = useState(false)
	const [isListVisible, setIsListVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [oneNftPrice, setOneNftPrice] = useState()
	const [moreNftPrice, setMoreNftPrice] = useState()
	const [myBoxList, setMyBoxList] = useState([])
	const [blindBoxList, setBlindBoxList] = useState([])
	const [currentNFTList, setCurrentNFTList] = useState([])

	console.log(isGotoAssetVisible, 'isGotoAssetVisible')

	let history = useHistory()
	const { token, address } = props

	const goToRightNetwork = async (ethereum, netWorkId) => {
		try {
			if (netWorkId === 1) {
				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [
						{
							chainId: '0x1',
						},
					],
				})
			} else {
				if (currentNetEnv === 'testnet') {
					await ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: '0x61',
								chainName: 'Smart Chain Test',
								nativeCurrency: {
									name: 'BNB',
									symbol: 'bnb',
									decimals: 18,
								},
								rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
							},
						],
					})
				} else {
					await ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: '0x38',
								chainName: 'Smart Chain',
								nativeCurrency: {
									name: 'BNB',
									symbol: 'bnb',
									decimals: 18,
								},
								rpcUrls: ['https://bsc-dataseed.binance.org/'],
							},
						],
					})
				}
			}
		} catch (error) {
			console.error('Failed to setup the network in Metamask:', error)
			return false
		}
	}

	const getAmountPrice = async () => {
		try {
			let wallet = getWallet()
			if (wallet) {
				window.web3 = new Web3(wallet)

				const myContract = new window.web3.eth.Contract(
					blindBoxAbi,
					blindBox721Contract[currentNetEnv],
				)
				let oneNftPrice = await myContract.methods.amount_once().call()
				let moreNftPrice = await myContract.methods.amount_more().call()

				setOneNftPrice((oneNftPrice * Math.pow(10, -18)).toFixed(2))
				setMoreNftPrice((moreNftPrice * Math.pow(10, -18)).toFixed(2))
			}
		} catch (e) {
			console.log(e, 'e')
		}
	}

	const getApproveStatus = async () => {
		try {
			let wallet = getWallet()
			if (wallet) {
				window.web3 = new Web3(wallet)
				const myBusdContract = new window.web3.eth.Contract(
					busdAbi,
					blindBoxApproveContract[currentNetEnv],
				)

				let allowance = await myBusdContract.methods
					.allowance(address, blindBox721Contract[currentNetEnv])
					.call()

				if (allowance > 0) {
					setIsApproved(true)
				}
			}
		} finally {
		}
	}

	const getAllMyBox = async () => {
		const result = await get(`/api/v1/mystery/getRecords/${address}`, '', token)
		setMyBoxList(result?.data?.data?.data)
	}

	const getBlindBoxList = async () => {
		const result = await get('/api/v1/mystery/getAllMesteryBox')
		setBlindBoxList(result?.data?.data?.data)
	}

	useEffect(() => {
		setIsShowSwitchModal(false)
		let wallet = getWallet()

		if (wallet) {
			if (
				Number(wallet.networkVersion || wallet.chainId) !== rightChainId &&
				history.location.pathname === '/drop/blind-box'
			) {
				setIsShowSwitchModal(true)
			}
		}
	}, [window.onto, window.walletProvider, window.ethereum, address])

	useEffect(() => {
		if (address) {
			getAmountPrice()
			getApproveStatus()
		}
		address && getAmountPrice()
	}, [address])

	useEffect(() => {
		if (token) {
			getAllMyBox()
		}
	}, [token])

	useEffect(() => {
		getBlindBoxList()
	}, [])

	const renderAmountButton = (amount) => {
		console.log(amount)
		return (
			<div
				className={cx(styleAmountButton(buyAmount === amount))}
				onClick={async () => {
					setBuyAmount(amount)
				}}
			>
				<span className={cx(styleAmount)}>{amount} </span>
				<span>{t('igo.mysteryBox')}</span>
			</div>
		)
	}
	const renderCard = (data) => {
		console.log(blindBoxList, 'blindBoxList?.[0]?.imageUrl')
		return (
			<div className={styleItem}>
				<img src={data?.imageUrl} alt="" />
				<div className="content">
					<div className="title">{data?.title}</div>
					<p>{data?.description}</p>
					<div className="subTitle">{t('igo.selectAmount')}</div>
					<div className={styleButtonRow}>
						{renderAmountButton(1)}
						{renderAmountButton(5)}
					</div>
					<div className="subTitle">{`Total amount of  ${buyAmount}  NFT`}</div>
					<div className="nft-price">{buyAmount === 1 ? oneNftPrice : moreNftPrice}</div>
					<div
						className="button"
						onClick={async () => {
							let wallet = getWallet()
							if (wallet) {
								window.web3 = new Web3(wallet)
								try {
									setIsLoading(true)

									if (!isApproved) {
										const myBusdContract = new window.web3.eth.Contract(
											busdAbi,
											blindBoxApproveContract[currentNetEnv],
										)

										let allowance = await myBusdContract.methods
											.allowance(address, blindBox721Contract[currentNetEnv])
											.call()

										console.log(allowance, 'allowance')
										if (!(allowance > 0)) {
											await myBusdContract.methods
												.approve(
													blindBox721Contract[currentNetEnv],
													Web3.utils.toBN(
														'115792089237316195423570985008687907853269984665640564039457584007913129639935',
													),
												)
												.send({
													from: address,
												})
										}
										setIsApproved(true)
									} else {
										const myContract = new window.web3.eth.Contract(
											blindBoxAbi,
											blindBox721Contract[currentNetEnv],
										)
										let result
										if (buyAmount === 1) {
											result = await myContract.methods.buyOne().send({
												from: address,
											})
										} else {
											result = await myContract.methods.buyMore().send({
												from: address,
											})
										}
										console.log(result, 'result')
										if (buyAmount === 1) {
											const requestId = result.events.BuyOne.returnValues?.requestId
											const apiResult = await post(
												'/api/v1/mystery/createRecord',
												{
													address,
													amount: buyAmount,
													opened: false,
													requestId,
													mysteryId: data.id,
												},
												token,
											)
											console.log(apiResult, 'apiResult')
											setBlindBoxId(requestId)
										} else {
											const requestId = result.events.BuyMore.returnValues?.requestId
											const apiResult = await post(
												'/api/v1/mystery/createRecord',
												{
													address,
													amount: buyAmount,
													opened: false,
													requestId,
													mysteryId: data.id,
												},
												token,
											)
											console.log(apiResult, 'apiResult')
											setBlindBoxId(requestId)
										}
										setIsUnboxVisible(true)
									}
								} finally {
									setIsLoading(false)
								}
							}
						}}
					>
						<Loading
							loading={isLoading}
							style={{
								left: '-100px',
								top: '10px',
							}}
						/>
						{isApproved ? t('market.buy') : 'Approve'}
					</div>
				</div>
			</div>
		)
	}

	console.log(isGotoAssetVisible, 'isGotoAssetVisible')

	const renderBox = (item) => {
		console.log('item')
		return (
			<div>
				<img src={item.imageUrl ? item.imageUrl : defaultBox} />
				<div
					className="unbox-button"
					onClick={async () => {
						if (item.opened) {
							history.push('/asset')
							return
						}
						try {
							setIsLoading(true)
							setBlindBoxId(item.requestId)

							let wallet = getWallet()
							if (wallet) {
								window.web3 = new Web3(wallet)
								const myContract = new window.web3.eth.Contract(
									blindBoxAbi,
									blindBox721Contract[currentNetEnv],
								)

								let hasRandomNumberRequest = await myContract.methods.s_vrf(item.requestId).call({
									from: address,
									requestId: item.requestId,
								})
								// 判断随机数是否已返回
								if (hasRandomNumberRequest.isRev) {
									let result = await myContract.methods.claim(item.requestId).send({
										from: address,
										requestId: item.requestId,
									})

									let { data } = await get(`/api/v1/mystery/open/${item.requestId}`, '', token)

									setCurrentNFTList(data?.data?.data)

									setIsUnboxVisible(false)
									setIsGotoAssetVisible(true)
									setIsListVisible(false)
								} else {
									setIsLoading(false)
									setBlindBoxId(undefined)
									toast.warning(
										'Sorry, your unbox operation failed due to network issues. Please try again later.',
										{
											position: toast.POSITION.TOP_CENTER,
										},
									)
								}
							}
						} finally {
							setIsLoading(false)
							setBlindBoxId(undefined)
						}
					}}
				>
					<Loading
						style={{
							left: '-40px',
						}}
						loading={blindBoxId === item.requestId && isLoading}
					/>
					{item.opened ? 'Check My Asset' : 'Unbox'}
				</div>
			</div>
		)
	}
	console.log(blindBoxId, 'blindBoxId')

	return (
		<div className={styleContainer}>
			<div className={styleHeader}>
				<img src={bg} alt="" />
				<section>
					<h1>{t('igo.pokeGameList.title')}</h1>
					<p>{t('igo.pokeGameList.content')}</p>
				</section>
			</div>
			<SimpleGrid
				columns={[1, 1, 1, 2, 2]}
				spacingX="40px"
				spacingY="20px"
				className={styleVedioContainer}
			>
				<section>
					<h1>{t('igo.pokemine.game')}</h1>
					<span>{t('igo.pokemine.gamecontent')}</span>
					<div className="button">{t('igo.expore.more')}</div>
				</section>
				<img src={vedioCut} alt="" />
			</SimpleGrid>
			<div className={styleListContainer}>
				<h1>{t('igo.mysteryBox')}</h1>
				<span
					className="my-mystery-box"
					onClick={() => {
						setIsListVisible(true)
					}}
				>
					My mystery Box
				</span>
				{renderCard(blindBoxList?.[0])}
			</div>
			<Dialog
				key="unbox-modal"
				size="tiny"
				className={styleModal}
				visible={isUnboxVisible}
				title={t('igo.congratuations')}
				onCancel={() => {
					setIsUnboxVisible(false)
					getAllMyBox()
				}}
			>
				<Dialog.Body>
					<img src={defaultBox} />
				</Dialog.Body>
				<Dialog.Footer className="dialog-footer">
					<div
						className="unbox-button"
						onClick={async () => {
							try {
								setIsLoading(true)
								let wallet = getWallet()
								if (wallet) {
									console.log(
										blindBox721Contract[currentNetEnv],
										'blindBox721Contract[currentNetEnv]',
									)
									window.web3 = new Web3(wallet)
									const myContract = new window.web3.eth.Contract(
										blindBoxAbi,
										blindBox721Contract[currentNetEnv],
									)

									let hasRandomNumberRequest = await myContract.methods.s_vrf(blindBoxId).call({
										from: address,
										requestId: blindBoxId,
									})
									// 判断随机数是否已返回
									if (hasRandomNumberRequest.isRev) {
										let result = await myContract.methods.claim(blindBoxId).send({
											from: address,
											requestId: blindBoxId,
										})

										let { data } = await get(`/api/v1/mystery/open/${blindBoxId}`, {}, token)
										console.log(data, data?.data?.data, 'data?.data?.data')

										setCurrentNFTList(data?.data?.data)

										setIsUnboxVisible(false)
										setIsGotoAssetVisible(true)
									} else {
										setIsLoading(false)
										toast.warning(
											'Sorry, your unbox operation failed due to network issues. Please try again later.',
											{
												position: toast.POSITION.TOP_CENTER,
											},
										)
									}
								}
							} finally {
								setIsLoading(false)
							}
						}}
					>
						<Loading
							style={{
								left: '-100px',
							}}
							loading={isLoading}
						/>
						Unbox
					</div>
				</Dialog.Footer>
			</Dialog>
			<Dialog
				key={'go-to-asset-modal'}
				size="tiny"
				className={styleModal}
				visible={isGotoAssetVisible}
				title={t('igo.congratuations')}
				onCancel={() => {
					setIsGotoAssetVisible(false)
					getAllMyBox()
				}}
			>
				<Dialog.Body>
					<div className={styleBoxList}>
						{currentNFTList.map((item) => {
							console.log(item, 'item')
							return (
								<div>
									<img src={item.avatorUrl} />
								</div>
							)
						})}
					</div>
				</Dialog.Body>
				<Dialog.Footer className="dialog-footer">
					<div
						className="unbox-button"
						onClick={async () => {
							history.push('/asset')
						}}
					>
						Check My Asset
					</div>
				</Dialog.Footer>
			</Dialog>
			<Dialog
				key={'my-box-list'}
				size="tiny"
				className={styleBoxListModal}
				visible={isListVisible}
				title={'My mystery box'}
				onCancel={() => {
					setIsListVisible(false)
				}}
			>
				<Dialog.Body>
					<div className={styleBoxList}>{myBoxList?.map((item) => renderBox(item))}</div>
				</Dialog.Body>
			</Dialog>
			<SwitchModal
				isUnboxVisible={isShowSwitchModal}
				networkName={'BSC'}
				goToRightNetwork={goToRightNetwork}
				onClose={() => {
					setIsShowSwitchModal(false)
				}}
			/>
		</div>
	)
}

const mapStateToProps = ({ profile }) => ({
	token: profile.token,
	address: profile.address,
})
export default withRouter(connect(mapStateToProps)(pokeScreen))

const styleContainer = css`
	min-height: 100vh;
	padding: 50px;
	border-radius: 20px;
	font-family: Archivo Black;
	color: white;
	.button {
		margin-top: 30px;
		background: #0057d9;
		padding: 12px 16px;
		font-size: 14px;
		width: fit-content;
		border-radius: 10px;
		cursor: pointer;
	}
	.unbox-button {
		padding: 12px 16px;
		display: flex;
		flex: 1;
		background: #0057d9;
		font-size: 14px;
		border-radius: 10px;
		cursor: pointer;
		justify-content: center;
	}
	.el-loading-spinner .circular {
		width: 30px;
	}
`

const styleHeader = css`
	position: relative;
	display: flex;
	width: 100%;
	flex: 1;
	align-items: center;
	flex-direction: column;
	border-radius: 20px 20px 0 0;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgba(3, 42, 101, 0.3) 100%);
	}
	section {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%);
		text-shadow: 2px 8px 4px #065bae;
		h1 {
			font-size: 5vw;
			margin: 6.8vw 0 3vw;
		}
		p {
			font-size: 2vw;
			line-height: 2.6vw;
			text-align: center;
			max-width: 70%;
			margin: 0;
		}
	}
`

const styleVedioContainer = css`
	position: relative;
	background: linear-gradient(180deg, #032a65 0%, #001c45 100%);
	width: 100%;
	box-sizing: border-box;
	padding: 4vw 6vw;
	align-items: center;
	&::before,
	&::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
	}
	&::before {
		top: 0;
		background: red;
		background: linear-gradient(to left, #002459, #ffffff, #002459);
	}
	&::after {
		bottom: 0;
		background: linear-gradient(to left, transparent, #3763ff, transparent);
	}
	section {
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		h1 {
			margin: 2rem 0 0;
			font-size: 2vw;
		}
		span {
			display: inline-block;
			margin: 2rem 0;
			font-family: Helvetica;
			font-size: 1vw;
			color: rgba(255, 255, 255, 0.8);
		}
	}
	img {
		height: auto;
		max-width: 100%;
	}
`
const styleListContainer = css`
	background: linear-gradient(180deg, #033073 0%, #00112b 100%);
	padding: 4vw 3vw;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-wrap: wrap;
	position: relative;
	h1 {
		font-size: 3vw;
		color: #fff;
		margin-bottom: 4vh;
	}
	.my-mystery-box {
		@media (max-width: 1400px) {
			position: relative;
			width: 100%;
			display: flex;
			justify-content: center;
			left: 0;
		}
		position: absolute;
		right: 10%;
		cursor: pointer;
	}
`

const styleItem = css`
	display: flex;
	align-items: center;
	max-width: 1440px;
	padding: 0 5%;
	margin: 0 auto;
	justify-content: space-between;
	margin: 40px 0 100px 0;
	width: 90%;
	img {
		height: 410px;
		width: auto;
		border-radius: 20px;
	}
	.content {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		width: 50%;
		padding: 30px;
		font-family: 'Helvetica';
		font-weight: 400;
		box-sizing: border-box;
		.title {
			font-size: 36px;
			font-family: 'Archivo Black';
			line-height: 1;
		}
		.button {
			padding: 12px 110px;
			font-size: 16px;
			line-height: 1;
		}
		.subTitle {
			font-size: 12px;
		}
		.nft-price {
			font-size: 20px;
			font-weight: bold;
		}
	}
	@media (max-width: 1400px) {
		flex-wrap: wrap;
		img {
			width: 100%;
			height: auto;
		}
		.content {
			width: 100%;
			margin-top: 20px;
			.title {
				font-size: 16px;
			}
			.button {
				padding: 8px 44px;
			}
		}
	}
`

const styleButtonRow = css`
	display: flex;
	gap: 20px;
	margin: 16px 0;
	@media (max-width: 1400px) {
		flex-wrap: wrap;
	}
`

const styleAmountButton = (isActive) => css`
	background: ${isActive ? '#80ffaba1' : '#193864'};
	border: 1px solid #002a67;
	box-sizing: border-box;
	border-radius: 8px;
	padding: 10px 12px;
	font-family: 'Barlow';
	font-size: 12px;
	color: ${isActive ? 'white' : 'rgba(255, 255, 255, 0.6)'};
	font-weight: bold;
	cursor: pointer;
	span {
		line-height: 1;
	}
`

const styleAmount = css`
	font-size: 18px;
	color: white;
`

const styleModal = css`
	max-width: 450px;
	width: calc(100% - 40px);
	border-radius: 20px;
	.el-dialog__title {
		font-size: 36px;
		font-family: 'Barlow';
	}
	.el-dialog__header {
		padding: 20px 30px 20px 50px;
	}
	.el-dialog__body {
		padding: 50px;
	}
	.el-dialog__headerbtn .el-dialog__close {
		top: 10px;
		position: relative;
		color: #575d6f;
	}
`

const styleBoxListModal = css`
	width: fit-content;
	max-width: 690px;
	border-radius: 20px;
	width: calc(100% - 40px);
	.el-dialog__title {
		font-size: 36px;
		font-family: 'Barlow';
	}
	.el-dialog__header {
		padding: 20px 30px 20px 50px;
	}
	.el-dialog__body {
		padding: 50px;
	}
	.el-dialog__headerbtn .el-dialog__close {
		top: 10px;
		position: relative;
		color: #575d6f;
	}
	.el-dialog__footer {
		padding: 10px 50px;
	}
`

const styleBoxList = css`
	display: flex;
	justify-content: flex-start;
	display: flex;
	gap: 50px;
	flex-wrap: wrap;
	& > div {
		@media (max-width: 1400px) {
			min-width: 100%;
			max-width: 100%;
		}
		min-width: 160px;
		max-width: 160px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	img {
		padding-bottom: 30px;
		border-radius: 20px;
	}
	.unbox-button {
		color: white;
	}
`
