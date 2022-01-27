import { Dialog, Input, InputNumber, Select, Button, Loading } from 'element-react'
import { css, cx } from 'emotion'
import React, { useState, useMemo, useCallback } from 'react'
import { post } from 'utils/request'
import { connect } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom'
import Web3 from 'web3'
import {
	createNFTContract1155,
	createNFTContract721,
	tradableNFTContract,
	tradableNFTContract721,
	auction721Contract,
} from '../../utils/contract'
import {
	createNFTAbi1155,
	createNFTAbi721,
	tradableNFTAbi,
	tradableNFTAbi721,
	auction721Abi,
} from '../../utils/abi'
import { Box } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import _ from 'lodash'
import NFTCardItem from 'pages/market/component/item'
import { getWallet } from 'utils/get-wallet'
import { useTranslation } from 'react-i18next'
import { getImgLink, numInValid } from 'utils/tools'
import imgSaleType1 from 'images/asset/saleType_1.png'
import imgSaleType2 from 'images/asset/saleType_2.png'
import loadingBar from 'images/common/loadingBar.svg'
import successIcon from 'images/asset/success.png'

const SaleList = [
	{ key: 1, label: 'Fixed Price', banner: imgSaleType1, active: '' },
	{ key: 2, label: 'Timed Auction', banner: imgSaleType2, active: '' },
]
const DurationList = [
	{ key: 3600 * 24, label: '24 Hours' },
	{ key: 3600 * 24 * 7, label: '1 Week' },
	{ key: 3600 * 24 * 30, label: '1 Month' },
	{ key: 3600 * 24 * 30 * 3, label: '2 Months' },
]

const gasLimit = 3000000
const NFTCard = (props) => {
	const {
		net_env,
		item,
		index,
		currentStatus,
		token,
		address,
		onRefresh,
		fromCollection,
		handleDetail,
		getList,
	} = props
	const { t } = useTranslation()
	const history = useHistory()
	const [showSellModal, setShowSellModal] = useState(false)
	const [showOffShelfModal, setShowOffShelfModal] = useState(false)
	const [sellForm, setSellForm] = useState({
		quantity: 1,
		type: 'DNF',
		price: 0,
		duration: '',
		startPrice: 1,
		bitIncrement: 1,
		auctionPutOnFee: 0,
	})
	const [isApproved, setIsApproved] = useState(false)
	const [isApproveLoading, setIsAprroveLoading] = useState(false)
	const [isOnLoading, setIsOnLoading] = useState(false)
	const [isOffLoading, setIsOffLoading] = useState(false)
	const [saleType, setSaleType] = useState(0)
	const [feeLoading, setFeeloading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const onShowSellModal = () => {
		setSaleType(net_env === 'mainnet' ? 1 : 0)
		setShowSellModal(true)
	}

	const onShowOffShelfModal = () => {
		setShowOffShelfModal(true)
	}

	const renderFormItem = (label, item) => (
		<div className={styleFormItemContainer}>
			<div className="label">{label}</div>
			{item}
		</div>
	)

	const FixedForm = useMemo(() => {
		const isPriceInvalid =
			typeof sellForm.price !== 'number' ||
			sellForm.price === 0 ||
			String(sellForm.price).split('.')[1]?.length > 4

		return (
			<React.Fragment>
				{renderFormItem(
					`${t('nftCard.quantity')}/${item.quantity || 0}`,
					<InputNumber
						disabled={item.contractType == 721}
						min={1}
						max={item.quantity}
						defaultValue={1}
						onChange={(value) => {
							setSellForm({
								...sellForm,
								quantity: value > item.quantity ? item.quantity : value,
							})
						}}
					/>,
				)}
				{renderFormItem(
					t('nftCard.type'),
					<Select
						style={{ width: '100%' }}
						value={sellForm.type}
						placeholder={t('please.choose')}
						onChange={(value) => {
							setSellForm({
								...sellForm,
								type: value,
							})
						}}
					>
						<Select.Option key={'DNF'} label={'DNF'} value={'DNF'} />
						<Select.Option key={'BUSD'} label={'BUSD'} value={'BUSD'} />
					</Select>,
				)}
				{renderFormItem(
					t('nftCard.price'),
					<InputNumber
						controls={false}
						placeholder={t('nftCard.eth')}
						value={sellForm.price}
						onChange={(value) => {
							setSellForm({
								...sellForm,
								price: value,
							})
						}}
					/>,
				)}
				<div
					style={{
						opacity: isPriceInvalid || isApproveLoading || isOnLoading ? 0.5 : 1,
					}}
					className={styleCreateNFT}
					onClick={async () => {
						if (isPriceInvalid) {
							return
						}

						try {
							let wallet = getWallet()
							if (wallet) {
								window.web3 = new Web3(wallet)

								if (isApproved) {
									try {
										const is721Contract = item.contractType == 721

										setIsOnLoading(true)
										const myContract = new window.web3.eth.Contract(
											is721Contract ? tradableNFTAbi721 : tradableNFTAbi,
											is721Contract
												? tradableNFTContract721[net_env]
												: tradableNFTContract[net_env],
										)

										let putOnResult
										if (sellForm.type === 'DNF') {
											if (is721Contract) {
												putOnResult = await myContract.methods
													.putOnByDnft(
														item.tokenAddress,
														item.tokenId,
														Web3.utils.toWei(String(sellForm.price), 'ether'),
													)
													.send({
														from: address,
														gasLimit,
													})
											} else {
												putOnResult = await myContract.methods
													.putOnByDnft(
														item.tokenAddress,
														item.tokenId,
														Web3.utils.toWei(String(sellForm.price), 'ether'),
														sellForm.quantity,
													)
													.send({
														from: address,
														gasLimit,
													})
											}
										} else if (sellForm.type === 'BUSD') {
											if (is721Contract) {
												putOnResult = await myContract.methods
													.putOnByBusd(
														item.tokenAddress,
														item.tokenId,
														Web3.utils.toWei(String(sellForm.price), 'ether'),
													)
													.send({
														from: address,
														gasLimit,
													})
											} else {
												putOnResult = await myContract.methods
													.putOnByBusd(
														item.tokenAddress,
														item.tokenId,
														Web3.utils.toWei(String(sellForm.price), 'ether'),
														sellForm.quantity,
													)
													.send({
														from: address,
														gasLimit,
													})
											}
										}
										const orderId = putOnResult?.events?.PutOn?.returnValues?.orderId

										if (orderId != undefined) {
											const result = await post(
												'/api/v1/trans/sell_up',
												{
													...sellForm,
													price: Web3.utils.toWei(String(sellForm.price), 'ether'),
													nftId: item.nftId,
													orderId: orderId,
													collectionId: item.collectionId,
													tokenAddress: item.tokenAddress,
												},
												token,
											)
											setShowSellModal(false)
											setIsAprroveLoading(false)
											setIsOnLoading(false)
											onRefresh(address, token, true)
											setIsApproved(false)
											// toast.info('Operation succeeded！', {
											//   position: toast.POSITION.TOP_CENTER,
											// });
										}
									} finally {
										setIsOnLoading(false)
									}
								} else {
									try {
										const is721Contract = item.contractType == 721
										setIsAprroveLoading(true)
										const dnfTokenContract = new window.web3.eth.Contract(
											is721Contract ? createNFTAbi721 : createNFTAbi1155,
											item.tokenAddress,
										)

										let isApproved = await dnfTokenContract.methods
											.isApprovedForAll(
												address,
												is721Contract
													? tradableNFTContract721[net_env]
													: tradableNFTContract[net_env],
											)
											.call()

										if (!isApproved) {
											let result = await dnfTokenContract.methods
												.setApprovalForAll(
													is721Contract
														? tradableNFTContract721[net_env]
														: tradableNFTContract[net_env],
													true,
												)
												.send({
													from: address,
													gasLimit,
												})
											if (result) {
												setIsApproved(true)
											}
										} else {
											setIsApproved(true)
										}
									} finally {
										setIsAprroveLoading(false)
									}
								}
							}
						} catch (e) {
							console.log(e, 'e')
						}
					}}
				>
					<Loading loading={isApproveLoading || isOnLoading} />
					{isApproved ? t('confirm') : t('nftCard.approve')}
				</div>
			</React.Fragment>
		)
	}, [sellForm, isApproved, isApproveLoading, isOnLoading, getWallet])

	const AuctionForm = useMemo(() => {
		const isFormvalid =
			!numInValid(Number(sellForm.startPrice), 1e10) &&
			!numInValid(Number(sellForm.bitIncrement), 1e10) &&
			sellForm.duration &&
			sellForm.type
		return (
			<div className={cx(styleAuction, isSuccess && styleAuctionSuccess)}>
				<div
					className="showCard"
					style={{ backgroundImage: `url(${getImgLink(item?.avatorUrl)})` }}
				/>
				{!isSuccess ? (
					<React.Fragment>
						{renderFormItem(
							'Duration',
							<Select
								style={{ width: '100%' }}
								value={sellForm.duration}
								placeholder={t('please.choose')}
								onChange={(value) => {
									setSellForm({
										...sellForm,
										duration: value,
									})
								}}
							>
								{DurationList.map((dl) => (
									<Select.Option key={dl.key} label={dl.label} value={dl.key} />
								))}
							</Select>,
						)}
						{renderFormItem(
							'Starting Price',
							<Input
								type="number"
								min="0"
								value={sellForm.startPrice}
								onChange={(value) => {
									setSellForm({
										...sellForm,
										startPrice: value,
									})
								}}
								prepend={
									<Select
										style={{ width: '100px', paddingRight: '10px' }}
										value={sellForm.type}
										defaultValue={'DNF'}
										onChange={(value) => {
											setSellForm({
												...sellForm,
												type: value,
											})
										}}
									>
										<Select.Option key={'DNF'} label={'DNF'} value={'DNF'} />
										<Select.Option key={'BUSD'} label={'BUSD'} value={'BUSD'} />
									</Select>
								}
							/>,
						)}
						{renderFormItem(
							'Bid Increment',
							<Input
								type="number"
								min="0"
								value={sellForm.bitIncrement}
								onChange={(value) => {
									setSellForm({
										...sellForm,
										bitIncrement: value,
									})
								}}
							/>,
						)}
						<p className="fee-line">
							<span>Service Fee</span>
							<strong>
								{feeLoading ? <img src={loadingBar} /> : sellForm.auctionPutOnFee + 'DNF'}
							</strong>
						</p>
						<div
							style={{
								opacity: !isFormvalid || isApproveLoading || isOnLoading ? 0.6 : 1,
							}}
							className={styleCreateNFT}
							onClick={() => {
								if (isFormvalid) {
									auctionHandle()
								} else {
									toast.warn('Please fill out the form correctly')
								}
							}}
						>
							<Loading loading={isApproveLoading || isOnLoading} />
							{!isApproved ? t('nftCard.approve') : isFormvalid ? 'Complete listing' : 'List'}
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<p>Success</p>
						<div
							className={styleCreateNFT}
							onClick={() => {
								history.push(
									`/market/detail?address=${item?.address}&status=${item?.status}&nftId=${
										item?.nftId
									}&fromAsset=${true}`,
								)
							}}
						>
							View Item
						</div>
					</React.Fragment>
				)}
			</div>
		)
	}, [sellForm, isApproved, isApproveLoading, isOnLoading, isSuccess, feeLoading, getWallet])

	const auctionHandle = useCallback(async () => {
		try {
			let wallet = getWallet()
			if (wallet) {
				window.web3 = new Web3(wallet)
				console.log('isApproved', isApproved)
				if (isApproved) {
					try {
						setIsOnLoading(true)
						const myContract = new window.web3.eth.Contract(
							auction721Abi,
							auction721Contract[net_env],
						)
						const payloads = [
							item.tokenAddress,
							item.tokenId,
							Web3.utils.toWei(String(sellForm.startPrice), 'ether'),
							Web3.utils.toWei(String(sellForm.bitIncrement), 'ether'),
							sellForm.duration,
						]
						let putOnResult = await myContract.methods[
							`putOnBy${sellForm.type === 'DNF' ? 'Dnft' : 'Busd'}`
						](...payloads).send({
							from: address,
							gasLimit,
						})
						const lotId = putOnResult?.events?.PutOn?.returnValues?.lotId

						if (lotId != undefined) {
							await post(
								'/api/v1/trans/sell_up', // TODO auction-Interface
								{
									...sellForm,
									price: Web3.utils.toWei(String(sellForm.price), 'ether'),
									nftId: item.nftId,
									lodId: lotId,
									collectionId: item.collectionId,
									tokenAddress: item.tokenAddress,
								},
								token,
							)
							setIsSuccess(true)
							setIsAprroveLoading(false)
							setIsOnLoading(false)
							onRefresh(address, token, true)
							setIsApproved(false)
						}
					} finally {
						setIsOnLoading(false)
					}
				} else {
					try {
						setIsAprroveLoading(true)
						const nftContract = new window.web3.eth.Contract(createNFTAbi721, item.tokenAddress)
						let isApproved = await nftContract.methods
							.isApprovedForAll(address, item.tokenAddress)
							.call()
						console.log('nftContract.isApproved', nftContract, isApproved)
						if (!isApproved) {
							let result = await nftContract.methods
								.setApprovalForAll(item.tokenAddress, true)
								.send({
									from: address,
									gasLimit,
								})
							if (result) {
								setIsApproved(true)
							}
						} else {
							setIsApproved(true)
						}
					} finally {
						setIsAprroveLoading(false)
					}
				}
			}
		} catch (e) {
			console.log(e, 'e')
		}
	}, [getWallet, sellForm, isApproved])

	const getAuctionPutonFee = useCallback(async () => {
		try {
			setFeeloading(true)
			let wallet = getWallet()
			if (wallet) {
				window.web3 = new Web3(wallet)
				await window.web3.eth.requestAccounts()
				const myContract = new window.web3.eth.Contract(auction721Abi, auction721Contract[net_env])
				let putOnfee = await myContract.methods.putOnFee().call()
				// console.log('[putOnfee]',putOnfee)
				putOnfee = Web3.utils.fromWei(putOnfee, 'ether')
				sellForm.auctionPutOnFee = putOnfee
			}
		} catch {
			sellForm.auctionPutOnFee = 0
		} finally {
			setFeeloading(false)
		}
	}, [getWallet, sellForm])

	const renderOffShelfModal = useMemo(() => {
		console.log('off')
		return (
			<Dialog
				title={t('nftCard.tips')}
				size="tiny"
				visible
				closeOnClickModal={false}
				customClass={styleOffShelfModal}
				onCancel={() => {
					setShowOffShelfModal(false)
					setIsOffLoading(false)
				}}
			>
				<Dialog.Body>
					<span>{t('nftCard.hint.phase.out')}</span>
				</Dialog.Body>
				<Dialog.Footer className="dialog-footer">
					<Button
						onClick={() => {
							setShowOffShelfModal(false)
						}}
					>
						{t('cancel')}
					</Button>
					<Button
						type="primary"
						style={{ opacity: isOffLoading ? 0.6 : 1 }}
						onClick={async () => {
							try {
								setIsOffLoading(true)
								let wallet = getWallet()
								if (wallet) {
									window.web3 = new Web3(wallet)
									const is721Contract = item.contractType == 721

									const contractAddress = is721Contract
										? tradableNFTContract721[net_env]
										: tradableNFTContract[net_env]
									const myContract = new window.web3.eth.Contract(
										is721Contract ? tradableNFTAbi721 : tradableNFTAbi,
										contractAddress,
									)

									let offResult = await myContract.methods.off(item.orderId).send({
										from: address,
										gasLimit,
									})

									if (offResult) {
										const result = await post(
											'/api/v1/trans/sell_back',
											{
												orderId: item.orderId,
												tokenAddress: item.tokenAddress,
											},
											token,
										)
										setShowOffShelfModal(false)
										onRefresh(address, token, true)
										setIsOffLoading(false)

										// toast.info('Operation succeeded！', {
										//   position: toast.POSITION.TOP_CENTER,
										// });
									}
								}
							} finally {
								setIsOffLoading(false)
							}
						}}
					>
						{isOffLoading ? t('loading') : t('confirm')}
					</Button>
				</Dialog.Footer>
			</Dialog>
		)
	}, [isOffLoading, getWallet])
	const isEmpty = item.quantity === 0

	return (
		<div
			key={`title-${index}`}
			className={`${styleCardContainer} ${fromCollection && styleCardCollection}`}
		>
			<NFTCardItem
				item={item}
				index={index}
				whetherShowPrice={false}
				getMarketList={getList}
				clickDetail={(e) => {
					handleDetail && handleDetail()
				}}
			>
				{currentStatus.value === 'INWALLET' && (
					<Box
						w={['calc(100% - 88px)', 'calc(100% - 88px)', 'calc(100% - 88px)', '144px']}
						className={styleButton}
						style={{
							opacity: isEmpty ? 0.5 : 1,
							cursor: isEmpty ? 'not-allowed' : 'pointer',
							background: '#0057D9',
						}}
						onClick={() => {
							if (isEmpty) {
								return
							}
							if (item?.sellable === false) {
								toast.warn(t('nftCard.not.allowed.sell'))
								return
							}
							setIsSuccess(false)
							setFeeloading(false)
							setIsApproved(false)
							onShowSellModal()
						}}
					>
						{t('sell')}
					</Box>
				)}
				{currentStatus.value === 'ONSALE' && (
					<Box
						w={['calc(100% - 88px)', 'calc(100% - 88px)', 'calc(100% - 88px)', '144px']}
						className={styleButton}
						style={{
							opacity: isEmpty ? 0.5 : 1,
							cursor: isEmpty ? 'not-allowed' : 'pointer',
						}}
						onClick={(e) => {
							e.stopPropagation()
							onShowOffShelfModal()
						}}
					>
						{t('unsell')}
					</Box>
				)}
			</NFTCardItem>
			<Dialog
				customClass={styleModalContainer}
				title={t(
					isSuccess
						? ''
						: saleType === 1
						? 'nftCard.title'
						: saleType === 2
						? 'nftCard.sale.auction'
						: 'nftCard.sale.saleType',
				)}
				visible={showSellModal}
				closeOnClickModal={false}
				onCancel={() => {
					setShowSellModal(false)
					setIsAprroveLoading(false)
					setIsOnLoading(false)
					setIsApproved(false)
				}}
			>
				<Dialog.Body>
					{saleType === 1 ? (
						FixedForm
					) : saleType === 2 ? (
						AuctionForm
					) : (
						<div className={styleSaleWrapper.flexBox}>
							{SaleList.map((e) => (
								<div
									className={styleSaleWrapper.box}
									key={e.key}
									onClick={() => {
										setSaleType(e.key)
										e.key === 2 && getAuctionPutonFee()
									}}
								>
									<img src={e.banner} alt="" />
									<p>{e.label}</p>
								</div>
							))}
						</div>
					)}
				</Dialog.Body>
			</Dialog>
			{showOffShelfModal && renderOffShelfModal}
		</div>
	)
}
const mapStateToProps = ({ profile }) => ({
	address: profile.address,
	token: profile.token,
	net_env: profile.net_env,
})
export default withRouter(connect(mapStateToProps)(NFTCard))

const styleButton = css`
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	background: #ff2e2e;
	border-radius: 10px;
	font-family: Archivo Black, sans-serif;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 14px;
	color: #fcfcfd;
	box-sizing: border-box;
	padding: 8px 12px;
	position: relative;
	width: 140px;
	height: 40px;
	margin: 0 auto 12px auto;
`

const styleCardContainer = css`
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	position: relative;
	flex: 1;
	&:hover {
		position: relative;
	}
	.shortPic {
		min-height: 300px;
		border-radius: 10px 10px 0 0;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}
	.imgFlow {
		background-size: cover;
		animation: nftFlow 6s infinite cubic-bezier(0.42, 0.13, 0, 1.04);
	}
	@keyframes nftFlow {
		0%,
		100% {
			background-position: 0 0;
		}
		50% {
			background-position: 100% 100%;
		}
	}
`
const styleCardCollection = css`
	&:hover {
		top: 0px;
	}
`

const styleCreateNFT = css`
	background-color: #0049c6;
	color: white;
	padding: 10px 32px;
	height: fit-content;
	font-size: 16px;
	border-radius: 10px;
	cursor: pointer;
	user-select: none;
	width: -webkit-fill-available;
	text-align: center;
	font-family: Archivo Black, sans-serif;
	.circular {
		width: 20px !important;
		height: 20px !important;
		left: -45px !important;
		position: relative;
		top: 24px !important;
	}
`

const styleModalContainer = css`
	max-width: 564px;
	width: calc(100% - 40px);
	border-radius: 10px;
	max-height: 80vh;
	overflow: auto;

	.el-input + .el-button,
	.el-select + .el-button,
	.el-textarea__inner,
	.el-input-group__append,
	.el-input-group__prepend,
	.el-input__inner {
		border: 2px solid #e1e6ff;
		border-radius: 6px;
		color: #75819a;
		min-height: 40px;
		font-family: Helvetica;
	}
	.el-dialog__headerbtn .el-dialog__close {
		color: #233a7d;
		font-size: 12px;
	}
	.el-dialog__header {
		padding: 32px;
	}
	.el-dialog__title {
		font-family: Archivo Black;
		font-style: normal;
		font-weight: normal;
		font-size: 24px;
		line-height: 24px;
		color: #000000;
	}
	.el-dialog__body {
		padding: 0 32px 32px 32px;
	}
	.el-input-number {
		width: 100%;
		.el-input-number__decrease,
		.el-input-number__increase {
			height: 100%;
			border-left: 2px solid #e1e6ff;
		}
	}
`

const styleFormItemContainer = css`
	display: flex;
	flex-direction: column;
	margin-bottom: 30px;
	.label {
		margin-bottom: 10px;
		font-family: Helvetica;
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 14px;
		color: #000000;
		i {
			font-size: 18px;
			padding-left: 4px;
			font-style: normal;
			color: #ff4242;
		}
	}
`

const styleOffShelfModal = css`
	max-width: 564px;
	width: calc(100% - 40px);
`

const styleSaleWrapper = {
	flexBox: css`
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	`,
	box: css`
		cursor: pointer;
		user-select: none;
		width: max-content;
		background: rgba(233, 233, 233, 0.1);
		border: 1px solid #c4c4c4;
		box-sizing: border-box;
		border-radius: 10px;
		padding: 0 46px;
		transition: all 0.2s ease-in-out;
		img {
			width: 124px;
			height: 78px;
			margin: 60px auto;
			filter: grayscale(1);
			transition: all 0.1s ease-in-out;
		}
		p {
			font-family: Helvetica;
			font-style: normal;
			font-weight: bold;
			font-size: 18px;
			text-align: center;
			color: #333333;
			margin: 0 0 30px 0;
		}
		:hover {
			background: rgba(0, 108, 255, 0.1);
			border-color: #006cff;
			img {
				filter: grayscale(0);
			}
		}
	`,
}
const styleAuction = css`
	.showCard {
		margin-bottom: 44px;
		height: 280px;
		width: 280px;
		position: relative;
		border-radius: 10px;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.fee-line {
		font-family: Helvetica;
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 14px;
		color: #000000;

		display: flex;
		justify-content: space-between;
		strong {
			color: #006cff;
		}
		img {
			height: 18px;
			width: 18px;
		}
	}
`
const styleAuctionSuccess = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.showCard {
		margin-bottom: 0;
		&::after {
			font-family: Archivo Black;
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			border-radius: 100%;
			background: white url(${successIcon}) no-repeat;
			border: 6px solid #fff;
			height: 35px;
			width: 35px;
			transform: translate(50%, -40%);
		}
	}
	p {
		font-family: Archivo Black;
		font-style: normal;
		font-weight: normal;
		font-size: 24px;
		color: #00ce93;
		margin: 27px 0 70px 0;
	}
`
