import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { css } from 'emotion'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { toast } from 'react-toastify'
import { Dialog } from 'element-react'
import { SimpleGrid, AspectRatio, Tooltip } from '@chakra-ui/react'

import { get, post } from 'utils/request'
import { getImgLink } from 'utils/tools'
import { toDecimal } from 'utils/web3Tools'

import { InstanceAuction721 } from 'constant/abi'

import refreshIcon from 'images/common/refresh.svg'
import LoadingIcon from 'images/asset/loading.gif'
import busd_unit from 'images/market/busd.svg'
import dnft_unit from 'images/market/dnft_unit.png'
import bg from 'images/igo/poke-bg.png'
import vedioCut from 'images/igo/vedio-cut.png'

/**
 * @todo contract
 * @todo api
 * @todo ui
 */
const DropAuctionScreen = (props) => {
	const { t } = useTranslation()
	const { address, chainType, token } = props
	const tabList = [
		{ key: 1, label: 'On Going' },
		{ key: 2, label: 'Ended' },
	]

	const [modalObj, setModalObj] = useState({
		case: 'bid',
		isShow: false,
		loading: false,
		nftInfo: null,
		bidInfo: null,
	})

	const [lastUpdtae, setLU] = useState(0)
	const [tabName, setTab] = useState(1)
	const [busdPrice, setBusdPrice] = useState(1)
	const [dnfPrice, setDnfPrice] = useState(1)
	const [list, setList] = useState([])
	const [listHis, setListHis] = useState([])

	const detectProvider = async () => {
		if (!window.ethereum) {
			throw new Error('Please install Wallet Provider')
		}
		if (!address) {
			throw new Error('Please Connect Wallet')
		}
		if (chainType !== 'BSC') {
			throw new Error('Please Change to BSC Network')
		}
	}

	const updateAuctions = useCallback(
		async (lotId) => {
			const checkLU = new Date().getTime() - lastUpdtae
			const duration = 3_000
			if (checkLU < duration) {
				toast.dark('Please try 3s later')
				return
			}
			try {
				if (lotId) {
					setLU(new Date().getTime())
					const res = await post(
						'/api/v1/auction/update',
						{
							sender: address,
							lotId,
						},
						token,
					)
					if (res?.data.error) {
						throw new Error('Auction Update Failed')
					}
					toast.dark('Auction Data Is Updating')
					await getAuctionList()
				}
			} catch (err) {
				toast.error(err.message)
			}
		},
		[address, token, lastUpdtae],
	)

	const getAuctionList = useCallback(async () => {
		const res = await get(`/api/v1/auction/list/${tabName}`)
		// setList(data?.data?.data)
		console.log(res?.data?.data?.data)
		setList(
			[0, 1, 2].map((e) => ({
				auction: {
					createTime: 1646494662025,
					updateTime: 1646494662025,
					id: 110788,
					lotId: '4',
					payMod: '0',
					address: '0xAe8d7E09Ed86E658C42d3D3eADE99219E213583F',
					startingPrice: '1000000000000000000',
					bidIncrement: '100000000000000000',
					startTime: '1646561451614',
					durationTime: e * '36000000',
					auctionLastId: '4',
					auctionLastBid: '1210000000000000000',
					auctionLastTime: '1646489041',
					nftId: 106508,
					status: tabName,
					consignorclaimed: null,
					winnerclaimed: null,
				},
				nft: {
					createTime: 1638891078763,
					updateTime: 1638891078763,
					id: 106508,
					name: 'Horse',
					description: 'HHAHAHHAHAHAHAHAHAHHAH aHHAHDHJH',
					category: 'Art',
					avatorUrl: 'https://bit.ly/naruto-sage',
					chainType: 'BSC',
					hash: '0xf66bf5be025605fa988cea7c8ae72dbae936b441fee4c41d962c842465e798f2',
					supply: 1,
					likeCount: 0,
					saveCount: 0,
					hashStatus: false,
					tokenId: '3529',
					tokenAddress: '0x47cd52E61e3210FF86d797162ba03474dD304E00',
					contractType: '721',
					ipfsHash: 'QmUgLEXEAVb8SrPwQRB8dVTgkobZRQ2zzKsn9rAADBnpZf',
					sellable: null,
					source: null,
					fileType: null,
					animationUrl: null,
					collectionId: 106506,
				},
			})),
		)
		const priceDNFT = await get('/api/v1/info/price/DNFT')
		const priceBUSD = await get('/api/v1/info/price/BUSD')
		// console.log(priceBUSD, priceDNFT)
	}, [tabName])

	const hanldeHistory = useCallback(
		async (item) => {
			try {
				setModalObj({
					...modalObj,
					isShow: false,
					loading: true,
				})
				setListHis([1, 2])
				setTimeout(() => {
					setModalObj({
						case: 'history',
						nftInfo: item,
						bidInfo: null,
						isShow: true,
						loading: false,
					})
				}, 1000)
			} catch (err) {
				toast.warn(err.message)
				setModalObj({
					...modalObj,
					isShow: false,
					loading: false,
				})
			}
		},
		[chainType, address, modalObj],
	)

	const hanldeBid = useCallback(
		async (item) => {
			try {
				if (!item || !item?.auction) {
					return
				}
				const {
					auction: { lotId, payMod, bidIncrement, auctionLastBid },
				} = item

				setModalObj({
					...modalObj,
					loading: true,
					isShow: false,
				})
				await detectProvider()
				const contract = InstanceAuction721()
				const isEnded = await contract.methods['checkTime'](lotId).call()
				if (isEnded) {
					throw new Error('Auction is Ended')
				}
				const bidInfo = await contract.methods['getBidInfo'](lotId, address).call()
				// console.log('bidInfo', bidInfo)
				const oldBid = bidInfo?.[1] || 0
				const unit = +payMod === 0 ? 'DNF' : 'BUSD'
				const total = auctionLastBid * 1 + bidIncrement * 1 - oldBid * 1
				setModalObj({
					case: 'bid',
					isShow: true,
					loading: false,
					nftInfo: item,
					title: 'Make Offer',
					bidInfo: {
						unit,
						lotId,
						old: toDecimal(String(oldBid)),
						tol: toDecimal(String(total)),
						inc: toDecimal(String(bidIncrement)),
						now: toDecimal(String(auctionLastBid)),
					},
				})
			} catch (err) {
				toast.warning(err.message)
				setModalObj({
					...modalObj,
					loading: false,
					isShow: false,
				})
			}
		},
		[chainType, address, modalObj],
	)

	const handleCheckout = useCallback(
		async (item) => {
			try {
				if (!item || !item?.auction || !item?.nft) {
					return
				}
				const {
					auction: { lotId, payMod },
					nft: { avatorUrl },
				} = item
				const unit = +payMod === 0 ? 'DNF' : 'BUSD'
				const fee = 5 / 10_000
				setModalObj({
					...modalObj,
					isShow: false,
					loading: true,
				})
				await detectProvider()
				const contract = InstanceAuction721()
				const lotInfo = await contract.methods['getLotInfo'](lotId).call()
				// console.log('lotInfo', lotInfo)
				if (lotInfo.status < 2) {
					throw new Error('Auction is not ended.')
				}
				// bidInfo [auctionId,amount,claimed,isWinner]
				const bidInfo = await contract.methods['getBidInfo'](lotId, address).call()
				if (bidInfo?.[3]) {
					// konckedInfo [status,consignorClaimed,winnerClaimed]
					const knockedInfo = await contract.methods['getKnockedInfo'](lotId).call()
					// console.log('knockedInfo', knockedInfo)
					if (knockedInfo?.[2]) {
						throw new Error('You have already claimed.')
					} else {
						setModalObj({
							case: 'checkout',
							isShow: true,
							loading: false,
							nftInfo: item,
							bidInfo: {
								unit,
								fee,
								amount: 0,
								avatar: avatorUrl,
								isWinner: true,
							},
						})
					}
				} else {
					if (bidInfo?.[2]) {
						throw new Error('You have already claimed.')
					} else if (bidInfo?.[1] <= 0) {
						throw new Error('You have not take part in the aution.')
					} else {
						setModalObj({
							case: 'checkout',
							isShow: true,
							loading: false,
							nftInfo: item,
							bidInfo: {
								unit,
								fee,
								amount: toDecimal(bidInfo?.[1]),
								avatar: avatorUrl,
								isWinner: true,
							},
						})
					}
				}
			} catch (err) {
				toast.warning(err.message)
				setModalObj({
					...modalObj,
					isShow: false,
					loading: false,
				})
			}
		},
		[chainType, address, modalObj],
	)

	const sumbitBid = useCallback(async () => {
		try {
			const {
				bidInfo: { lotId, unit, tol },
			} = modalObj
			if (lotId && unit && tol) {
				await detectProvider()
				const contract = InstanceAuction721()
				const payloads = [lotId, toDecimal(tol, true, 'ether', true)]
				console.log('sumbitBid-payloads', payloads, Number(payloads[1]))
				const tx = await contract.methods['buy'](...payloads).send({
					from: address,
				})
				if (tx.transactionHash) {
					await post('/api/v1/auction/bid', {
						auctionId: lotId,
						sender: address,
						txHash: tx.transactionHash,
					})
				}
			}
		} catch (err) {
			toast.warning(err.message)
		}
	}, [modalObj, address])

	const sumbitClaim = useCallback(async () => {
		try {
			const { nftInfo, bidInfo } = modalObj
			if (nftInfo && nftInfo.auction) {
				const {
					auction: { lotId },
				} = nftInfo
				await detectProvider()
				const contract = InstanceAuction721()
				let tx
				if (bidInfo) {
					tx = await contract.methods['claimByBuyer'](lotId).send()
				} else if (address === nftInfo?.auction?.address) {
					tx = await contract.methods['claimByConsignor'](lotId).send()
				} else {
					tx = await contract.methods['claimByWinner'](lotId).send()
				}
				if (tx.transactionHash) {
					await updateAuctions(lotId)
				}
			}
		} catch (err) {
			toast.warning(err.message)
		}
	}, [modalObj, address])

	const renderModal = useMemo(() => {
		const { nftInfo, bidInfo } = modalObj
		if (
			!nftInfo ||
			(modalObj.case === 'bid' && !bidInfo) ||
			(modalObj.case === 'checkout' && !bidInfo)
		) {
			return null
		}
		return (
			<Dialog
				customClass={styleModalContainer}
				title={modalObj.title || modalObj.case}
				visible={modalObj.isShow}
				style={modalObj.case === 'checkout' && { maxWidth: '448px' }}
				onCancel={() => {
					setModalObj({ ...modalObj, isShow: false })
				}}
			>
				<Dialog.Body>
					{modalObj.case === 'bid' && bidInfo && (
						<div className={styleModalBid}>
							<p>
								<label>Current Bid</label>
								<span>
									+<strong>{bidInfo?.now || 0}</strong>
								</span>
							</p>
							<p>
								<label>Increment Bid</label>
								<span>
									+<strong>{bidInfo?.inc || 0}</strong>
								</span>
							</p>
							<p>
								<label>Last Bid</label>
								<span>
									-<strong>{bidInfo?.old || 0}</strong>
								</span>
							</p>
							<p>
								<label>Tol</label>
								<span>
									=
									<img src={bidInfo?.unit === 'DNF' ? dnft_unit : busd_unit} />
									<strong>{`${bidInfo?.tol || 0} ${bidInfo.unit}`}</strong>
								</span>
							</p>
							<div className="button" onClick={sumbitBid}>
								Place Bid
							</div>
						</div>
					)}
					{modalObj.case === 'history' && <div>history</div>}
					{modalObj.case === 'checkout' && (
						<div className={styleModalCheck}>
							<AspectRatio className="avatar" ratio={3 / 4} maxWidth="338px">
								<img src={getImgLink(bidInfo?.avatar)} alt="" />
							</AspectRatio>
							{!bidInfo?.isWinner ? (
								<section>
									<div className="InvalidBid">
										<p>Your Invalid bid In Total</p>
										<strong>
											<img src={bidInfo?.unit === 'DNF' ? dnft_unit : busd_unit} />
											<span>{`${bidInfo.amount} ${bidInfo?.unit || 'Token'}`}</span>
										</strong>
									</div>
									<p>
										What a pity! You missed the NFT. Thank you for the participation! You are able
										to claim your invalid bid now.
									</p>
									<div className="button" onClick={sumbitClaim}>
										Claim Invalid Bid
									</div>
								</section>
							) : (
								<section>
									<p>
										Congraduations! You won the NFT from the auction. You are able to claim your NFT
										now!
									</p>
									<div className="button" onClick={sumbitClaim}>
										Claim Your NFT
									</div>
								</section>
							)}
						</div>
					)}
				</Dialog.Body>
			</Dialog>
		)
	}, [modalObj, address, chainType, token])

	const renderCard = (item) => {
		const { nft, auction } = item
		const isEnded = auction?.status > 1
		const unit = +auction.payMod === 0 ? 'DNF' : 'BUSD'
		const minimum = toDecimal((auction.auctionLastBid * 1 + auction.bidIncrement * 1).toString())
		return (
			<SimpleGrid
				className={styleItem}
				columns={[1, 1, 1, 1, 2]}
				width={['100%', '100%', '100%', '80%', '80%']}
				spacingX="40px"
				spacingY="20px"
			>
				<AspectRatio className="cover" ratio={3 / 4} maxWidth="400px">
					<img src={getImgLink(nft?.avatorUrl)} alt="" />
				</AspectRatio>
				<div className="content">
					<section>
						<h2>
							<span>{nft?.name}</span>
							<Tooltip label="Refresh Data" hasArrow>
								<img
									className="action"
									src={refreshIcon}
									onClick={() => {
										updateAuctions(auction?.lotId)
									}}
								/>
							</Tooltip>
						</h2>
						<p>{nft?.description}</p>
					</section>
					{isEnded ? (
						<div className="auctionEnded">
							<h3>Auction Ended</h3>
							<p>
								You are able to check the result of the auction by clicking the ”Checkout“ button,
								which means the participants of the auction can claim their invalid bid or the NFT.
							</p>
							<div
								className="button success"
								onClick={() => {
									handleCheckout(item)
								}}
							>
								Checkout
							</div>
						</div>
					) : (
						<div>
							<div className="auctionInfo">
								<div className="left">
									<h4>Minimum Bid</h4>
									<strong>
										<img src={unit === 'DNF' ? dnft_unit : busd_unit} />
										<span>{`${Number(minimum).toFixed(2)} ${unit}`}</span>
									</strong>
									<p className="subText">
										≈ ${Number(minimum * (unit === 'DNF' ? dnfPrice : busdPrice)).toFixed(2)}
									</p>
								</div>
								<div className="right">
									<h4>Time Left</h4>
									<div className="countDown">
										<div>
											<strong>3</strong>
											<p className="subText">DAY</p>
										</div>
										<div>
											<strong>12</strong>
											<p className="subText">HOURS</p>
										</div>
										<div>
											<strong>56</strong>
											<p className="subText">MINUTES</p>
										</div>
									</div>
								</div>
							</div>
							<div>
								<div
									className="button primary"
									onClick={() => {
										hanldeBid(item)
									}}
								>
									Place Bid
								</div>
								<div
									className="button outline"
									onClick={() => {
										hanldeHistory(item)
									}}
								>
									Bid History
								</div>
							</div>
						</div>
					)}
				</div>
			</SimpleGrid>
		)
	}

	useEffect(() => {
		getAuctionList()
	}, [tabName])

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
				<h1>Timed Auction</h1>
				<div className={tabRow}>
					{tabList.map((e) => (
						<div
							key={e.key}
							className={`tabBtn ${tabName === e.key ? 'active' : ''}`}
							onClick={() => {
								setTab(e.key)
							}}
						>
							{e.label}
						</div>
					))}
				</div>
				{list.map((e) => renderCard(e))}
			</div>
			{renderModal}
			{modalObj.loading && (
				<div className={styleLoadingIconContainer}>
					<img src={LoadingIcon} />
				</div>
			)}
		</div>
	)
}

const mapStateToProps = ({ profile, lng }) => ({
	address: profile.address,
	chainType: profile.chainType,
	net_env: profile.net_env,
	token: profile.token,
	lng: lng.lng,
})
export default withRouter(connect(mapStateToProps)(DropAuctionScreen))

const styleContainer = css`
	min-height: 100vh;
	padding: 50px;
	border-radius: 20px;
	font-family: Archivo Black;
	color: white;
	.button {
		font-family: Archivo Black;
		display: inline-block;
		background: #0057d9;
		padding: 12px 16px;
		font-size: 14px;
		width: fit-content;
		border-radius: 10px;
		cursor: pointer;
		user-select: none;
		min-width: 175px;
		text-align: center;
		box-sizing: border-box;
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

const tabRow = css`
	margin-bottom: 30px;
	.tabBtn {
		display: inline-block;
		padding: 12px 16px;
		font-size: 14px;
		width: fit-content;
		border-radius: 10px;
		cursor: pointer;
		user-select: none;
		min-width: 175px;
		text-align: center;
		box-sizing: border-box;
		background: rgba(0, 87, 217, 0.2);
		border: 1px solid #0057d9;
		margin-right: 32px;
	}
	.active {
		background: #0057d9;
		color: #ffffff;
	}
`

const styleListContainer = css`
	background: linear-gradient(180deg, #033073 0%, #00112b 100%);
	padding: 4vw 3vw;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	h1 {
		font-size: 3vw;
		color: #fff;
		margin-bottom: 4vh;
	}
`

const styleItem = css`
	align-items: flex-start;
	justify-content: center;
	margin: 4vh auto 8vh;
	.cover {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 16px 4px rgba(49, 78, 120, 0.8), 0 0 20px 1px rgba(255, 255, 255, 0.8);
	}
	.content {
		margin-top: 2rem;
		width: 100%;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 30px;
		section {
			h2 {
				font-family: Archivo Black;
				font-size: 36px;
				color: #ffffff;
				margin: 0;
				display: flex;
				align-items: center;
				.action {
					height: 24px;
					width: 24px;
					background: rgba(0, 87, 217, 0.2);
					border: 1px solid #0057d9;
					padding: 10px 8px;
					border-radius: 10px;
					cursor: pointer;
					user-select: none;
					margin-left: 1rem;
				}
			}
			p {
				font-family: Barlow;
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 20px;
				color: rgba(255, 255, 255, 0.7);
			}
		}
		.auctionInfo {
			background: #193864;
			border: 1px solid #002a67;
			border-radius: 10px;
			position: relative;
			display: flex;
			flex-direction: row wrap;
			justify-content: space-between;
			align-items: flex-start;
			box-sizing: border-box;
			padding: 15px;
			margin: 1rem 0;
			max-width: 500px;
			.left,
			.right {
				font-family: Barlow;
				font-style: normal;
				height: 100%;
				h4 {
					font-weight: 500;
					font-size: 14px;
					color: rgba(255, 255, 255, 0.5);
				}
				.subText {
					font-weight: 500;
					font-size: 12px;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.8);
				}
			}
			.left {
				strong {
					display: flex;
					align-items: center;
					img {
						height: 20px;
						width: 20px;
						margin-right: 10px;
					}
				}
			}
			.right {
				h4 {
					margin-left: 1rem;
				}
				.countDown {
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					div {
						display: flex;
						flex-flow: column nowrap;
						margin: 0 1rem;
						position: relative;
					}
					div:nth-child(2) {
						text-align: center;
						&::before,
						&::after {
							position: absolute;
							content: ':';
							top: 0;
						}
						&::before {
							left: -1rem;
						}
						&::after {
							right: -1rem;
						}
					}
				}
			}
		}
		.auctionEnded {
			color: #ffffff;
			font-style: normal;
			font-weight: normal;
			h3 {
				font-family: Archivo;
				font-weight: 800;
				font-size: 18px;
				color: #ffffff;
				margin-top: 40px;
			}
			p {
				font-family: Barlow;
				font-size: 16px;
				margin: 34px 0 26px 0;
			}
		}
		.button.primary {
			margin-right: 20px;
		}
		.button.outline {
			background: rgba(0, 87, 217, 0.2);
			border: 1px solid #0057d9;
			margin-top: 20px;
		}
		.button.success {
			background: #45b36b;
		}
	}
`

const styleModalContainer = css`
	max-width: 564px;
	width: calc(100% - 40px);
	border-radius: 10px;
	max-height: 80vh;
	overflow: auto;

	.el-textarea__inner,
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
	.el-dialog__title {
		font-family: Archivo Black;
		font-style: normal;
		font-weight: normal;
		font-size: 24px;
		line-height: 24px;
		color: #000000;
		text-transform: capitalize;
	}
	.el-dialog__header {
		padding: 20px 32px 12px 32px;
	}
	.el-dialog__body {
		padding: 0 32px 32px 32px;
		.button {
			color: white;
			width: -webkit-fill-available;
		}
	}
	.el-input-number {
		width: 100%;
	}
`

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

const styleModalBid = css`
	padding: 20px;
	box-sizing: border-box;
	p {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 1rem 0;
		span {
			display: inline-grid;
			grid-template-columns: auto 1fr auto;
		}
		strong {
			margin-left: 1rem;
		}
		img {
			margin-left: 1rem;
			height: 100%;
			width: 24px;
		}
	}
	p:nth-child(4) {
		border-top: 2px solid #48576a;
		margin-top: 1rem;
		margin-bottom: 3rem;
		padding-top: 1rem;
	}
`
const styleModalCheck = css`
	padding: 7px 23px;
	p {
		font-family: Barlow;
		font-style: normal;
		font-weight: 500;
		font-size: 18px;
		color: #8f9bba;
	}
	.avatar {
		border-radius: 20px;
		box-shadow: 0px 0px 40px rgba(255, 255, 255, 0.5);
		overflow: hidden;
	}
	.button {
		margin-top: 1rem;
	}
	.InvalidBid {
		display: block;
		background: #e6e8ec;
		border: 1px solid #929ac2;
		box-sizing: border-box;
		border-radius: 10px;
		font-family: Barlow;
		font-style: normal;
		font-weight: 600;
		font-size: 14px;
		color: #333333;
		padding: 21px 12px;
		margin: 1.8rem 0;
		p {
			margin: 0 0 1rem 0;
			text-transform: capitalize;
		}
		strong {
			display: flex;
			align-items: center;
			img {
				height: 20px;
				width: 20px;
				margin-right: 1rem;
			}
			span {
				font-family: Barlow;
				font-style: normal;
				font-weight: 800;
				font-size: 24px;
				line-height: 24px;
				color: #000000;
			}
		}
	}
`
