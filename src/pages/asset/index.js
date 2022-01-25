import { Dialog, Button, Select } from 'element-react'
import { css, cx } from 'emotion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { Box, Tab, Tabs, TabList, TabPanels, TabPanel, Flex } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { tradableNFTAbi, nftAbi, nft1155Abi } from 'utils/abi'
import { noDataSvg } from 'utils/svg'
import Web3 from 'web3'
import NFTCard from '../../components/NFTCard'
import { get, post } from 'utils/request'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import globalConfig from '../../config'
import { busdAbi, tokenAbi } from '../../utils/abi'
import { bscTestTokenContact, busdContract } from '../../utils/contract'
// import { getCategoryList } from 'reduxs/actions/market';
import CreateNFTModal from './create/index'
import NFTImportModal from './nftImport/index'
import LoadingIcon from 'images/asset/loading.gif'
import dnft_unit from 'images/market/dnft_unit.png'
import SwitchModal from 'components/SwitchModal'
import { getWallet } from 'utils/get-wallet'
import { Btn } from 'components/Button'
import { useTranslation } from 'react-i18next'
import { getImgLink } from 'utils/tools'

const AssetScreen = (props) => {
	const { dispatch, location, address, chainType, token, categoryList, lng } = props
	const { t } = useTranslation()

	const currentNetEnv = globalConfig.net_env
	const isTestNet = currentNetEnv === 'testnet'
	const tabArray = isTestNet
		? [
				{
					label: t('onsale'),
					value: 'ONSALE',
				},
				{
					label: t('inwallet'),
					value: 'INWALLET',
				},
				{
					label: t('sold'),
					value: 'sold',
				},
		  ]
		: [
				{
					label: t('onsale'),
					value: 'ONSALE',
				},
				{
					label: t('inwallet'),
					value: 'INWALLET',
				},
				{
					label: t('sold'),
					value: 'SOLD',
				},
		  ]

	const sortTagType = [
		{ label: t('sortTag.price.to.low'), value: 'ASC-price' },
		{ label: t('sortTag.price.to.high'), value: 'DESC-price' },
	]
	const [selectedTab, setSelectedTab] = useState({
		label: 'In Wallet',
		value: 'INWALLET',
	})
	const [isVisible, setIsVisible] = useState(false)
	const [balance, setBalance] = useState(0)
	const [category, setCategory] = useState('All')
	const [sortTag, setSortTag] = useState('ASC-price')
	const [list, setList] = useState([])
	const [sortOrder, setSortOrder] = useState('ASC')
	const rightChainId = currentNetEnv === 'testnet' ? 97 : 56
	const [isLoading, setIsLoading] = useState(false)
	const [bannerUrl, setBannerUrl] = useState('')
	const [avatorUrl, setAvatorUrl] = useState('')
	const [showCreateNft, setShowCreateNft] = useState(false)
	const [showImportNft, triggerImportNft] = useState(false)
	const [isShowSwitchModal, setIsShowSwitchModal] = useState(false)

	let history = useHistory()

	const getBannerUrl = async () => {
		const result = await post(`/api/v1/users/address/${address}`, {}, token)
		setBannerUrl(getImgLink(result?.data?.data?.bannerUrl))
		setAvatorUrl(getImgLink(result?.data?.data?.avatorUrl))
	}

	useEffect(() => {
		address && token && getBannerUrl()
	}, [address, token])

	useEffect(() => {
		address && getBalance()
	}, [address])

	const getList = (id, isSave) => {
		let _list = list.slice()
		_list.map((obj) => {
			if (obj.id === id) {
				obj.isSaved = isSave
				obj.saveCount = isSave ? obj.saveCount + 1 : obj.saveCount - 1
			}
		})
		setList(_list)
	}
	const getNFTList = async (currentAddress, currentToken, callback) => {
		try {
			setIsLoading(true)

			const { data } = await post(
				'/api/v1/trans/personal',
				{
					address: currentAddress || address,
					category: category,
					sortOrder: sortOrder,
					status: selectedTab.value,
					sortTag: 'price',
					page: 0,
					size: 100,
				},
				currentToken || token,
			)
			setList(data?.data?.content || [])
			if (callback) {
				toast.info(t('toast.operation.success'))
			}
		} finally {
			setIsLoading(false)
		}
	}

	const goToRightNetwork = useCallback(async () => {
		const ethereum = window.ethereum
		if (history.location.pathname !== '/asset') {
			return
		}
		try {
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

			return true
		} catch (error) {
			console.error('Failed to setup the network in Metamask:', error)
			return false
		}
	}, [])

	useEffect(() => {
		if (token && address) {
			getNFTList()
		} else {
			setList([])
		}
	}, [token, category, selectedTab, sortTag, address, chainType])

	useEffect(() => {
		setIsShowSwitchModal(false)
		let wallet = getWallet()
		console.log(wallet, 'wallet')

		if (wallet) {
			console.log(wallet, 'wallet', rightChainId)
			if (
				Number(wallet.networkVersion || wallet.chainId) !== rightChainId &&
				history.location.pathname === '/asset'
			) {
				setIsShowSwitchModal(true)
			}
		}
	}, [window.onto, window.walletProvider, window.ethereum, address])

	const getBalance = async () => {
		try {
			let wallet = getWallet()
			if (wallet) {
				window.web3 = new Web3(wallet)
				const account = address

				const myContract = new window.web3.eth.Contract(
					tokenAbi,
					bscTestTokenContact[currentNetEnv],
				)
				console.log(myContract, 'myContract')
				const dnftBalance = await myContract.methods.balanceOf(account).call({
					from: account,
				})
				setBalance((dnftBalance * Math.pow(10, -18)).toFixed(2))
			} else {
				setBalance(undefined)
			}
		} catch (e) {
			console.log(e, 'e')
		}
	}

	const renderAssetHeader = useMemo(
		() => (
			<>
				<Box
					h={['147px', '147px', '147px', 0]}
					pb={'16.7%'}
					mb={[0, 0, 0, '90px']}
					position="relative"
					borderRadius={[0, 0, 0, '10px']}
					style={{
						background: `#b7b7b7 center center / cover no-repeat url(${bannerUrl})`,
					}}
				>
					<Box display={['none', 'none', 'none', 'flex']} className={styleHeader}>
						<div className={styleAssetAccountContainer}>
							<p>{t('balance')}</p>
							<div className={styleACBalance}>
								<img src={dnft_unit} alt="" />
								<span>{balance} DNF</span>
							</div>
						</div>

						{currentNetEnv !== 'otherNet' && (
							<div className={styleTopActions}>
								<div
									className={styleCreateNFT}
									onClick={() => {
										triggerImportNft(true)
									}}
								>
									{t('nftCard.import')}
								</div>
								<div
									className={styleCreateNFT}
									onClick={() => {
										setShowCreateNft(true)
									}}
								>
									{t('nftCard.create')}
								</div>
							</div>
						)}
					</Box>
				</Box>
				<Box
					display={['flex', 'flex', 'flex', 'none']}
					alignContent="center"
					justifyContent="center"
					flexDirection="column"
					className={styleHeaderMp}
				>
					<div className={styleAssetAccountContainer}>
						<div className={styleACBalance}>
							<img src={dnft_unit} alt="" />
							<span>{balance} DNF</span>
						</div>
						<p>{t('balance')}</p>
					</div>
					{currentNetEnv !== 'otherNet' && (
						<div className={styleTopActions}>
							<div
								className={cx(styleCreateNFT, styleCreateNftMp)}
								onClick={() => {
									triggerImportNft(true)
								}}
							>
								{t('nftCard.import')}
							</div>
							<div
								className={cx(styleCreateNFT, styleCreateNftMp)}
								onClick={() => {
									setShowCreateNft(true)
								}}
							>
								{t('nftCard.create')}
							</div>
						</div>
					)}
				</Box>
			</>
		),
		[balance, bannerUrl, avatorUrl],
	)

	const renderTabList = useMemo(
		() =>
			tabArray.map((item) => (
				<div
					className={cx(styleTabButton, item?.value === selectedTab?.value && styleActiveTabButton)}
					onClick={() => {
						setSelectedTab(item)
					}}
				>
					{item.label}
				</div>
			)),
		[selectedTab],
	)
	const getFormatName = (nftId) => {
		let _id = Number(nftId)
		return _id === 100 ? 'Gold' : _id === 200 ? 'Silver' : 'Bronze'
	}

	const renderCard = useCallback(
		(item, index) => (
			<NFTCard
				item={item}
				index={index}
				needAction={isTestNet}
				currentStatus={selectedTab}
				getList={getList}
				onLike={getNFTList}
				onSave={getNFTList}
				handleDetail={() => {
					history.push(
						`/market/detail?address=${item?.address}&status=${item?.status}&nftId=${
							item?.nftId
						}&fromAsset=${true}`,
						// { item, fromAsset: true },
					)
				}}
				onRefresh={(currentAddress, currentToken, callback) =>
					getNFTList(currentAddress, currentToken, callback)
				}
			/>
		),
		[selectedTab, list],
	)

	const renderModal = useMemo(
		() => (
			<Dialog
				customClass={styleModalContainer}
				visible={isVisible}
				onCancel={() => {
					setIsVisible(false)
				}}
			>
				<Dialog.Body>
					<div>
						<h1>Venus Design Introduction Tour</h1>
						<span>
							Venus is a complex Design System Tool with more than 2000+ components for busy
							designers, developers, entrepreneurs, agencies, etc...
						</span>
					</div>
					<div className={styleModalActionContainer}>
						<div className={styleModalConfirm}>Start the tour</div>
						<div>Skip for now</div>
					</div>
				</Dialog.Body>
			</Dialog>
		),
		[isVisible],
	)

	const renderNoData = useMemo(
		() => (
			<div className={styleNoDataContainer}>
				<div>{noDataSvg}</div>
			</div>
		),
		[],
	)

	return (
		<div className={styleContainer}>
			<div>
				{renderAssetHeader}
				<div className={styleBody}>
					<div className={styleTabContainer}>
						<div>{renderTabList}</div>
						{isLoading && (
							<div className={styleLoadingIconContainer}>
								<img src={LoadingIcon} />
							</div>
						)}
						{/* <Loading
              loading={isLoading}
              style={{ position: 'fixed', width: 'calc(100% - 76px)', zIndex: 10000 }}
            /> */}
						<Box
							flexDirection={[
								'column!important',
								'column!important',
								'column!important',
								'row!important',
							]}
						>
							<Select
								value={category}
								className={styleSelectContainer}
								placeholder={t('please.choose')}
								onChange={(value) => {
									setCategory(value)
								}}
							>
								{categoryList?.map((el) => (
									<Select.Option key={el.value} label={el[lng]} value={el.value} />
								))}
							</Select>
							{isTestNet && (
								<Select
									value={sortTag}
									className={styleSelectContainer}
									placeholder={t('please.choose')}
									onChange={(value) => {
										setSortTag(value)
										setSortOrder(value.split('-')[0])
									}}
								>
									{sortTagType.map((el) => (
										<Select.Option key={el.value} label={el.label} value={el.value} />
									))}
								</Select>
							)}
						</Box>
					</div>

					<div
						className={styleCardList}
						style={{
							opacity: isLoading ? 0.5 : 1,
							display: (isLoading || list?.length == 0) && 'flex',
						}}
					>
						{!isLoading && list?.length > 0
							? list.map((item, index) => renderCard(item, index))
							: renderNoData}
						{/* {nftData?.length > 0
              ? nftData.map((item, index) => renderCard(item, index))
              : renderNoData} */}
					</div>
				</div>
			</div>
			{renderModal}
			{showCreateNft && (
				<CreateNFTModal
					onClose={(isCreate) => {
						if (isCreate) {
							getNFTList()
						}
						setShowCreateNft(false)
					}}
				/>
			)}
			{showImportNft && (
				<NFTImportModal
					onClose={() => {
						triggerImportNft(false)
					}}
					onSuccess={(status) => {
						triggerImportNft(false)
						status && getNFTList()
					}}
				/>
			)}
			<SwitchModal
				visible={isShowSwitchModal}
				networkName={'BSC'}
				goToRightNetwork={goToRightNetwork}
				onClose={() => {
					setIsShowSwitchModal(false)
				}}
			/>
		</div>
	)
}

const mapStateToProps = ({ profile, market, lng }) => ({
	address: profile.address,
	chainType: profile.chainType,
	categoryList: market.category,
	token: profile.token,
	lng: lng.lng,
})
export default withRouter(connect(mapStateToProps)(AssetScreen))

const styleLoadingIconContainer = css`
	position: absolute;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	top: 0;
	left: 0;
	z-index: 1000000000;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: 158px;
		height: 145px;
		border-radius: 26px;
	}
`
const styleContainer = css`
	background: #f5f7fa;
	padding: 0 50px 30px 50px;
	box-sizing: border-box;
	@media (max-width: 900px) {
		padding: 0;
	}
	& > div {
		&:first-child {
			border-radius: 10px;
			padding: 32px 0;
			display: flex;
			flex-direction: column;
			flex: 1;
			height: calc(100% - 64px);
			@media (max-width: 900px) {
				padding: 0;
			}
		}
	}
`

const styleHeader = css`
	border-bottom: 1px solid #efefef;
	padding: 0 36px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: calc(100% - 146px);
	margin: 0 auto;
	margin-top: calc(16.7% - 55px);
	margin-left: 50%;
	transform: translate(-50%, 0);
	background: linear-gradient(
		112.83deg,
		rgba(255, 255, 255, 0.82) 0%,
		rgba(255, 255, 255, 0.8) 110.84%
	);
	border: 1.5px solid #ffffff;
	box-shadow: 0px 2px 5.5px rgba(0, 0, 0, 0.02);
	backdrop-filter: blur(21px);
	height: 110px;
	border-radius: 15px;
	@media (max-width: 900px) {
		padding: 24px 12px;
		flex-wrap: wrap;
		top: 60%;
		width: 80%;
	}
`

const styleSelectContainer = css`
	@media (max-width: 900px) {
		width: 100% !important;
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.el-select-dropdown__list {
		padding: 0;
		border-radius: 10px;
		overflow: hidden;
	}
	.el-select .el-input .el-input__icon {
		color: #777e90;
	}
	.el-icon-caret-top:before {
		content: \e603;
	}
	.el-input__inner {
		border: 1px solid #dddddd;
		color: #aaaaaa;
		border-radius: 10px;
		background: transparent;
		height: 40px;
		font-family: Archivo Black;
	}
	.el-select-dropdown__item {
		height: 40px;
	}
	.el-input__inner:hover {
		color: #888;
		border: 1px solid #aaa;
	}
	.el-select-dropdown__item {
		color: #888888;
		font-family: Archivo Black;
	}
	.el-select-dropdown {
		left: 0 !important;
		border-radius: 10px;
	}
	.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
	.el-select-dropdown__item.hover,
	.el-select-dropdown__item:hover {
		background: #dddddd;
	}
	.el-select-dropdown__item.selected {
		color: #ffffff;
		font-family: Archivo Black;
		background: #417ed9;
	}
`
const styleTopActions = css`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 43px;
`
const styleCreateNFT = css`
	background: #0057d9;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	height: 40px;
	padding: 10px 8px;
	min-width: 120px;
	border-radius: 10px;
	font-family: Archivo Black, sans-serif;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 14px;
	color: #fcfcfd;
	cursor: pointer;
	user-select: none;
	@media (max-width: 900px) {
		width: 100%;
		margin-top: 20px;
	}
`

const styleAssetAccountContainer = css`
	display: flex;
	flex-direction: column;
	// align-items: center;
	justify-content: center;
	p {
		user-select: none;
		font-family: Helvetica;
		font-style: normal;
		font-weight: normal;
		font-size: 18px;
		line-height: 140%;
		color: #718096;
		margin: 0;
	}
`
const styleACBalance = css`
	font-family: Helvetica;
	font-style: normal;
	font-weight: bold;
	font-size: 30px;
	line-height: 140%;
	color: #2d3748;
	display: flex;
	align-items: center;
	text-align: right;
	img {
		user-select: none;
		width: 35px;
		height: 35px;
		border-radius: 100%;
		margin-right: 10px;
	}
`

const styleBody = css`
	padding: 24px 36px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	.circular {
		position: relative;
		top: 120px;
		width: 100px;
		height: 100px;
	}
	@media (max-width: 900px) {
		padding: 24px 20px 80px 20px;
	}
`

const styleTabContainer = css`
	display: flex;
	flex-direction: row;
	flex: 1;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-bottom: 30px;
	& > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;

		@media (max-width: 900px) {
			gap: 0px;
			div {
				min-width: auto;
			}
			&:first-child {
				width: 100%;
				display: flex;
				margin-bottom: 20px;
			}
			&:last-child {
				display: flex;
				width: 100%;
				flex-wrap: wrap;
			}
			.el-select {
				flex: 1;
				display: flex;
				min-width: 160px;
			}
		}
	}
`

const styleTabButton = css`
	height: 40px;
	box-sizing: border-box;
	font-size: 14px;
	display: flex;
	align-items: center;
	padding: 6px 12px;
	border-radius: 10px;
	cursor: pointer;
	border: 1px solid #dddddd;
	//margin-right: 30px;
	color: #aaaaaa;
	font-family: Archivo Black;
	user-select: none;
	@media (max-width: 900px) {
		flex: 1;
		justify-content: center;
		font-size: 12px;
	}
`

const styleActiveTabButton = css`
	border: 1px solid #417ed9;
	color: #ffffff;
	background: #417ed9;
	@media (max-width: 900px) {
		flex: 1;
		justify-content: center;
		font-size: 12px;
	}
`

const styleCardList = css`
	display: grid;
	gap: 20px 20px;
	grid-template-columns: repeat(5, minmax(250px, 1fr));
	@media (max-width: 1950px) {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
	@media (max-width: 900px) {
		justify-content: center;
		margin-top: 0px;
	}
`

const styleModalContainer = css`
	width: 340px;
	border-radius: 40px;
	padding: 36px 32px;
	.el-dialog__headerbtn {
		color: #112df2;
		background: #f4f7fe;
		width: 24px;
		height: 24px;
		border-radius: 24px;
		.el-dialog__close {
			transform: scale(0.6);
			color: #112df2;
		}
	}

	.el-dialog__header {
		padding: 0;
	}
	.el-dialog__title {
		color: #233a7d;
		font-size: 24px;
	}
	.el-dialog__body {
		padding: 0;
		position: relative;
		top: -10px;
		color: #8f9bba;
		h1 {
			font-weight: bold;
			font-size: 28px;
			line-height: 36px;
			color: #000000;
			text-align: center;
			margin: 0;
			margin-bottom: 24px;
		}
		span {
			text-align: center;
			display: flex;
			font-size: 12px;
			line-height: 1.5;
		}
	}
`

const styleModalActionContainer = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 30px;
`
const styleModalConfirm = css`
	background: #112df2;
	border-radius: 70px;
	color: white;
	font-size: 14px;
	width: 180px;
	height: 46px;
	align-items: center;
	display: flex;
	justify-content: center;
	margin-bottom: 16px;
`

const styleNoDataContainer = css`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	width: 100%;
	flex-direction: column;
	color: #233a7d;
	min-height: calc(100vh - 400px);
	span {
		margin-top: 20px;
	}
`
const styleHeaderMp = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 20px;
	& > div {
		margin: 0 auto;
	}
	img {
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}
	span {
		color: #00327f;
		font-family: Helvetica;
		font-style: normal;
		font-weight: bold;
		font-size: 30px;
	}
	p {
		font-family: Helvetica;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 140%;
		color: #00327f;
		padding-bottom: 16px;
		text-align: center;
	}
`
const styleCreateNftMp = css`
	width: calc(100% - 40px) !important;
	height: 48px;
`
