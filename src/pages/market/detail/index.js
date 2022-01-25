import { Box, Flex, Text, Tooltip } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { Btn } from 'components/Button'
import NftSlider from 'components/NftSlider'
import RenderOffShelfModal from 'components/RenderOffShelfModal'
import SwitchModal from 'components/SwitchModal'
import { Button, Dialog, InputNumber } from 'element-react'
import { css } from 'emotion'
import busd_unit from 'images/market/busd.svg'
import dnft_unit from 'images/market/dnft_unit.png'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import { tokenAbi, tradableNFTAbi, tradableNFTAbi721 } from 'utils/abi'
import {
	bscTestTokenContact,
	busdMarketContract,
	tradableNFTContract,
	tradableNFTContract721,
} from 'utils/contract'
import { getWallet } from 'utils/get-wallet'
import { get, post } from 'utils/request'
import { shortenAddress, shortenNameString, queryParse, getImgLink } from 'utils/tools'
import { toDecimal } from 'utils/web3Tools'
import Web3 from 'web3'
import CreateCollectionModal from '../../../components/CreateCollectionModal'
import styles from './index.less'
import SharePopover from 'components/SharePopover'

const MarketDetailScreen = (props) => {
	const { t } = useTranslation()
	const { location, net_env, address, token, chainType } = props
	const item = location?.state?.item
	const fromAsset = location?.state?.fromAsset
	const category = location?.state?.category
	const sortTag = location?.state?.sortTag
	let history = useHistory()
	const [datas, setDatas] = useState(item || {})
	const [list, setList] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(false)
	const [approveLoading, setApproveLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const onClose = () => setIsOpen(false)
	const [form, setForm] = useState({})
	const [options, setOptions] = useState([])
	const [isWrongNetWork, setIsWrongNetWork] = useState(false)
	const [showCreateCollection, setShowCreateCollection] = useState(false)
	const [isShowSwitchModal, setIsShowSwitchModal] = useState(false)
	const [lineFlag, setLineFlag] = useState(false)
	const [showOffShelfModal, setShowOffShelfModal] = useState(false)
	let url = queryParse(window.location.href)

	const rightChainId = net_env === 'testnet' ? 97 : 56
	const currentWindowWidth = useMemo(() => window.innerWidth, [])
	useEffect(() => {
		if (item) {
			setDatas(item || {})
		}
	}, [item])
	useEffect(() => {
		getMarketInfo()
	}, [token])
	console.log(url,'url?.fromAsset')
	const getMarketInfo = async () => {
		try {
			if (url?.fromAsset) {
				const { data } = await get(
					`/api/v1/trans/asset/${url?.address}/${url?.status}/${url?.nftId}`,
					'',
					token,
				)
				console.log(data,'data')
				setDatas(data?.data?.content)
			} else {
				const { data } = await get(
					`/api/v1/trans/market/${url?.contractType}/${url?.orderId}`,
					'',
					token,
				)
				setDatas(data?.data?.content?.[0])
			}
		} catch (e) {
			console.log(e, 'e')
		}
	}
	const getNFTList = useCallback(async () => {
		try {
			setIsLoading(true)
			const { data } = await post('/api/v1/info/recommend')
			setList(data?.data?.content || [])
		} finally {
			setIsLoading(false)
		}
	}, [token])

	useEffect(() => {
		// if (token) {
		//   getCollectionList();
		// }
		getNFTList()
	}, [token])

	useEffect(() => {
		setIsShowSwitchModal(false)
	}, [])

	useEffect(() => {
		let wallet = getWallet()

		if (wallet) {
			if (
				Number(wallet.networkVersion || wallet.chainId) !== rightChainId &&
				history.location.pathname.includes('/market/detail')
			) {
				setIsWrongNetWork(true)
				setIsShowSwitchModal(true)
			} else {
				setIsWrongNetWork(false)
			}
		}
	}, [window.onto, window.walletProvider, window.ethereum, address])

	const goToRightNetwork = useCallback(async () => {
		const ethereum = window.ethereum
		if (!history.location.pathname.includes('/market/detail')) {
			return
		}
		try {
			let result
			if (net_env === 'testnet') {
				result = await ethereum.request({
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
				result = await ethereum.request({
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

			if (result === null) {
				setIsWrongNetWork(false)
			} else {
				setIsWrongNetWork(true)
			}
			return true
		} catch (error) {
			console.error(t('toast.fail.setup.in.metamask'), error)
			return false
		}
	}, [])
	const getMarketList = (id, isSave) => {
		let data = list.slice()
		data.map((obj) => {
			if (obj.id === id) {
				obj.isSaved = isSave
				obj.saveCount = isSave ? obj.saveCount + 1 : obj.saveCount - 1
			}
		})
		setList(data)
	}
	const renderHotList = useCallback(
		(title) => (
			<NftSlider
				title={title}
				list={list}
				getMarketList={getMarketList}
				loading={isLoading}
				cww={currentWindowWidth}
			/>
		),
		[list, isLoading],
	)
	const isApproved = async () => {
		setApproveLoading(true)
		const { contractType, type } = datas || {}
		const tradableNFTAddress = (
			contractType == 1155 ? tradableNFTContract : tradableNFTContract721
		)[net_env]

		const contract = new window.web3.eth.Contract(
			tokenAbi,
			(type === 'DNF' ? bscTestTokenContact : busdMarketContract)[net_env],
		)
		const auth = await contract.methods['allowance'](address, tradableNFTAddress).call()
		if (!(auth > 0)) {
			await contract.methods
				.approve(
					tradableNFTAddress,
					Web3.utils.toBN(
						'115792089237316195423570985008687907853269984665640564039457584007913129639935',
					),
				)
				.send({
					from: address,
				})
		}
	}

	const clickBuyItem = async () => {
		const { contractType, type } = datas || {}
		try {
			let wallet = getWallet()

			if (wallet) {
				window.web3 = new Web3(wallet)
				setLoading(true)

				await isApproved()

				setApproveLoading(false)
				setIsOpen(false)
				const tradableNFTAddress = (
					contractType == 1155 ? tradableNFTContract : tradableNFTContract721
				)[net_env]

				const tradableNFTAbiType = contractType == 1155 ? tradableNFTAbi : tradableNFTAbi721
				const myContract = new window.web3.eth.Contract(tradableNFTAbiType, tradableNFTAddress)
				const gasNum = 210000,
					gasPrice = '20000000000',
					gasLimit = 3000000
				const params = contractType == 721 ? [datas?.orderId] : [datas?.orderId, form.quantity]
				await myContract.methods[datas?.type === 'BUSD' ? 'buyByBusd' : 'buyByDnft'](...params)
					.send(
						{
							from: address,
							gasLimit,
							gas: gasNum,
							gasPrice: gasPrice,
						},
						function (error, transactionHash) {
							if (!error) {
								console.log('hash: ', transactionHash)
							} else {
								console.log('error', error)
							}
						},
					)
					.then(async function (receipt) {
						// 监听后续的交易情况
						setLoading(false)
						const { data } = await post(
							'/api/v1/trans/sell_out',
							{
								buyerAddress: address,
								collectionId: -1,
								tokenAddress: datas?.tokenAddress,
								nftId: datas?.nftId,
								orderId: datas?.orderId,
								quantity: contractType == 721 ? 1 : form?.quantity,
							},
							token,
						)
						toast[data?.success ? 'success' : 'error'](
							data?.success ? t('market.success') : t('market.failed'),
							{
								position: toast.POSITION.TOP_CENTER,
							},
						)
						console.log('[ receipt.status ]', receipt.status)
						historyBack()
					})
			}
		} catch (e) {
			setLoading(false)
			setApproveLoading(false)
			console.log(e, 'e')
		} finally {
			console.log('finally')
			setApproveLoading(false)
			setLoading(false)
		}
	}

	const historyBack = () => {
		history.push('/market', { category, sortTag })
	}
	const handleStar = async () => {
		if (!address) {
			toast.warn(t('toast.link.wallet'), {
				position: toast.POSITION.TOP_CENTER,
			})
			return
		}

		const { data } = await post(
			'/api/v1/nft/save',
			{
				saved: datas?.isSaved ? 0 : 1,
				nftId: datas?.nftId,
			},
			token,
		)
		const flag = data?.success
		const msg = flag
			? `${datas?.isSaved ? t('market.unmarked') : t('market.marked')}`
			: data?.message
		toast[flag ? 'success' : 'error'](msg, { position: toast.POSITION.TOP_CENTER })
		getMarketInfo()
	}
	const handleLinkProfile = (address) => {
		if (!token) {
			toast.warn(t('toast.link.wallet'), {
				position: toast.POSITION.TOP_CENTER,
			})
			return
		}
		history.push(`/profile/address/${address}`)
	}
	const renderFormItem = (label, item) => (
		<div className={styles.styleFormItemContainer}>
			<div className={styles.label}>{label}</div>
			{item}
		</div>
	)
	const getCollectionList = async () => {
		try {
			const { data } = await post(
				'/api/v1/collection/batch',
				{
					address: address,
					sortOrder: 'ASC',
					sortTag: 'createTime',
					page: 0,
					size: 100,
				},
				token,
			)
			setOptions(
				data?.data?.content?.map((item) => ({
					label: item.name,
					value: item.id,
				})),
			)
		} catch (e) {
			console.log(e, 'e')
		}
	}
	const transPrice = (amount) => {
		if (isNaN(amount)) {
			return amount
		}
		let _amount
		try {
			_amount = Number(Number(amount).toFixed(4))
		} catch (e) {
			console.log(e)
		}
		return _amount
	}

	let price = datas?.price && toDecimal(datas?.price)

	return (
		<Box bg={'white'} p={['20px', '20px', '20px', '50px']} pb={[0, 0, 0, '20px']}>
			<Flex flexWrap="wrap">
				<Box
					mr={[0, 0, 0, '50px']}
					mb={['30px', '30px', '30px', 0]}
					h={['80vw', '80vw', '80vw', 0]}
					w={['100%', '100%', '100%', 'calc(50% - 25px)']}
					className={styles.mainL}
					style={{ backgroundImage: `url(${getImgLink(datas?.avatorUrl)})` }}
				/>
				<Box w={['100%', '100%', '100%', 'calc(50% - 25px)']} boxSizing="border-box">
					<Flex
						flexDirection={['row', 'row', 'row', 'column']}
						justifyContent={['space-between', 'space-between', 'space-between']}
					>
						<Text
							mr="35px"
							fontSize={['24px', '24px', '24px', '36px']}
							className={styles.proNameText}
						>
							{datas?.name}
						</Text>
						<Flex alignItems="center">
							<Text m="0" className={styles.proNameType}>
								{datas?.category}
							</Text>
							<Icon
								className={styles.star}
								icon={datas?.isSaved ? 'flat-color-icons:like' : 'icon-park-outline:like'}
								onClick={handleStar}
							/>
							<Text
								m="0"
								ml="5px"
								style={{ color: datas?.isSaved ? '#FF4242' : '#B8BECC' }}
								className={styles.saveCount}
							>
								{datas?.saveCount}
							</Text>
							<SharePopover datas={datas} typeFrom="nft" />
						</Flex>
					</Flex>
					<Flex
						mt="30px"
						mb={['5px', '5px', '5px', '50px']}
						flexDirection={['column', 'column', 'column', 'row']}
					>
						<Flex flex="1" flexDirection={['row', 'row', 'row', 'column']}>
							<Text m="0" mr="5px" className={styles.owner}>
								{t('collection.title')}
							</Text>
							<p
								onClick={() =>
									history.push(`/profile/collection?collectionId=${datas?.collectionId}`, {
										item: {
											id: datas?.collectionId,
											flag: true,
										},
										newAddress: datas?.address,
									})
								}
								className={`${styles.userName} ${styles.tokenAddress}`}
							>
								{shortenNameString(datas?.collectionName)}
							</p>
						</Flex>
						<Flex flex="2" mt={['30px', '30px', '30px', 0]}>
							<Flex flex="1" alignItems="center" cursor="pointer">
								<img src={getImgLink(datas?.createrAvatorUrl)} className={styles.avatar} />
								<Flex flexDirection="column">
									<Text className={styles.owner}>{t('market.creater')}</Text>
									<Tooltip
										label={datas?.createrAddress && shortenAddress(datas?.createrAddress)}
										hasArrow
									>
										<a
											onClick={() => handleLinkProfile(datas?.createrAddress)}
											className={`${styles.userName} ${styles.tokenAddress}`}
										>
											{shortenNameString(datas?.createrName ?? 'Unknown', 10)}
										</a>
									</Tooltip>
								</Flex>
							</Flex>
							<Flex flex="1" alignItems="center" cursor="pointer">
								<img src={getImgLink(datas?.userAvatorUrl)} className={styles.avatar} />
								<Flex flexDirection="column">
									<Text className={styles.owner}>{t('market.owner')}</Text>
									<Tooltip label={datas?.address && shortenAddress(datas?.address)} hasArrow>
										<a
											onClick={() => handleLinkProfile(datas?.address)}
											className={`${styles.userName} ${styles.tokenAddress}`}
										>
											{shortenNameString(datas?.nickName ?? 'Unknown', 10)}
										</a>
									</Tooltip>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
					<Box
						bg={[null, null, null, 'white']}
						px={[0, 0, 0, '25px']}
						borderRadius={'10px'}
						mb="50px"
					>
						<Text className={styles.descriptionTitle}>{t('collection.desc')}</Text>
						<div className={styles.warpperDesc}>
							<input id="exp1" className={styles.exp} type="checkbox" />
							<p className={`${styles.description} ${lineFlag && styles.slider}`}>
								<label htmlFor={'exp1'}>
									<Icon
										className={styles.icon}
										color="#75819A"
										onClick={() => {
											setLineFlag((lineFlag) => !lineFlag)
										}}
										icon={`akar-icons:chevron-${lineFlag ? 'up' : 'down'}`}
									/>
								</label>
								{datas?.description}
							</p>
						</div>
						<Text className={styles.descriptionTitle}>{t('market.contract.detail')}</Text>
						<Flex
							borderWidth={[1, 1, 1, 0]}
							borderRadius={10}
							py={['14px', '14px', '14px', '0']}
							px={['25px', '25px', '25px', 0]}
							borderStyle="solid"
							borderColor="#EAEDF0"
							justifyContent="space-between"
							flexWrap="wrap"
							flexDirection={['column', 'column', 'column', 'row']}
						>
							<Flex
								flexDirection={['row', 'row', 'row', 'column']}
								className={styles.contract_details_item}
							>
								<div>{t('market.blockchain')}</div>
								<div>{datas?.chainType}</div>
							</Flex>
							<Flex
								flexDirection={['row', 'row', 'row', 'column']}
								className={styles.contract_details_item}
							>
								<div>{t('market.token.standard')}</div>
								<div>ERC-{datas?.contractType}</div>
							</Flex>
							<Flex
								flexDirection={['row', 'row', 'row', 'column']}
								className={styles.contract_details_item}
							>
								<div>{t('market.contract.address')}</div>
								<div>
									<a
										href={`https://${net_env === 'mainnet' ? '' : 'testnet.'}bscscan.com/address/${
											datas?.tokenAddress
										}`}
										className={styles.tokenAddress}
										target="_blank"
										rel="noopener noreferrer"
									>
										{datas?.tokenAddress && shortenAddress(datas?.tokenAddress)}
									</a>
								</div>
							</Flex>
							<Flex
								flexDirection={['row', 'row', 'row', 'column']}
								className={styles.contract_details_item}
							>
								<div>{t('market.token.id')}</div>
								<div>{datas?.tokenId}</div>
							</Flex>
						</Flex>
					</Box>
					{(!url?.fromAsset || datas?.status === 'ONSALE') && (
						<Box
							w={['100vw', '100vw', '100vw', '400px']}
							boxSizing={'border-box'}
							ml={['-20px', '-20px', '-20px', 0]}
							py={['15px', '15px', '15px', 0]}
							px={['20px', '20px', '20px', 0]}
							position={['sticky', 'sticky', 'sticky', 'relative']}
							background={['white', 'white', 'white', 'transparent']}
							bottom={0}
							boxShadow={[
								'0px -8px 40px rgba(0, 0, 0, 0.1)',
								'0px -8px 40px rgba(0, 0, 0, 0.1)',
								'0px -8px 40px rgba(0, 0, 0, 0.1)',
								'none',
							]}
						>
							<Flex
								display={'flex'}
								flexDirection={['row-reverse', 'row-reverse', 'row-reverse', 'initial']}
								justifyContent={['space-between', 'space-between', 'space-between', 'flex-start']}
								mb={['13px', '13px', '13px', '30px']}
								className={styles.priceBox}
							>
								<Flex alignSelf={['flex-end', 'flex-end', 'flex-end', '']} alignItems="flex-end">
									<img src={datas?.type === 'DNF' ? dnft_unit : busd_unit} />
									<Text ml={'10px'} className={styles.priceAmount}>
										{transPrice(price)}
									</Text>
									<div className={styles.worth}>≈ ${transPrice(datas?.amount * price)}</div>
								</Flex>
								{datas?.contractType == 1155 && (
									<Box
										ml={[0, 0, 0, '30px']}
										alignSelf={['flex-start', 'flex-start', 'flex-start', '']}
										className={styles.stock}
									>
										{t('market.available', { qty: datas?.quantity })}
									</Box>
								)}
							</Flex>
							<div className={styles.btnBox}>
								<Btn
									isLoading={loading}
									disabled={!datas?.quantity || loading}
									loadingText={t('market.buynow')}
									bgColor={datas?.address === address && '#FF2E2E!important'}
									w={['100%', '100%', '100%', '153px']}
									m={0}
									onClick={() => {
										if (!address) {
											toast.warn(t('toast.link.wallet'), {
												position: toast.POSITION.TOP_CENTER,
											})
											return
										}
										if (datas?.address === address) {
											setShowOffShelfModal(true)
											return
										}
										if (datas?.contractType === '721') {
											clickBuyItem()
										} else {
											setIsOpen(true)
										}
									}}
								>
									{datas?.address === address ? t('nftCard.unsell') : t('market.buy')}
								</Btn>
							</div>
						</Box>
					)}
				</Box>
			</Flex>
			<Box display={['none', 'none', 'none', 'initial']}>
				{renderHotList(t('market.recommendations'))}
			</Box>
			{isOpen && (
				<Dialog
					title={t('market.buynft')}
					visible
					customClass={styleModalContainer}
					onCancel={onClose}
				>
					<Dialog.Body p="0 32px">
						{renderFormItem(
							t('market.qty', { qty: datas?.quantity || 0 }),
							<InputNumber
								style={{ width: '100%', marginTop: 20 }}
								min={0}
								max={datas?.quantity}
								onChange={(value) => {
									setForm({
										...form,
										quantity: value > datas?.quantity ? datas?.quantity : value,
									})
								}}
							/>,
						)}
					</Dialog.Body>
					<Dialog.Footer justifyContent="flex-start">
						<Button
							isLoading={approveLoading}
							loadingText={t('market.submit')}
							disabled={!datas?.quantity || loading}
							colorScheme="custom"
							className={styles.submitBtn}
							onClick={() => {
								if (!form.quantity) {
									toast.warn(t('toast.enter.qty'), {
										position: toast.POSITION.TOP_CENTER,
									})
									return
								}
								clickBuyItem()
							}}
						>
							{t('market.submit')}
						</Button>
					</Dialog.Footer>
				</Dialog>
			)}
			{showCreateCollection && (
				<CreateCollectionModal
					formDs={{ address, chainType }}
					token={token}
					isNew
					onSuccess={(res) => {
						setShowCreateCollection(false)
						getCollectionList()
					}}
					onClose={() => {
						setShowCreateCollection(false)
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
			<RenderOffShelfModal
				showOffShelfModal={showOffShelfModal}
				setShowOffShelfModal={() => setShowOffShelfModal(false)}
				datas={datas}
				address={address}
				token={token}
				net_env={net_env}
				historyBack={historyBack}
			/>
		</Box>
	)
}
const mapStateToProps = ({ profile, market }) => ({
	token: profile.token,
	datas: market.datas,
	chainType: profile.chainType,
	net_env: profile.net_env,
	address: profile.address,
})
export default withRouter(connect(mapStateToProps)(MarketDetailScreen))
const styleModalContainer = css`
	max-width: 484px;
	width: calc(100% - 40px);
	border-radius: 10px;
	// height: 50vh;
	overflow: auto;
	.el-dialog__title {
		font-family: Poppins;
		font-style: normal;
		font-weight: 500;
		font-size: 24px;
		line-height: 32px;
	}
	.el-dialog__header {
		padding: 20px 22px 0px 22px;
	}
	.el-dialog__body {
		padding: 49px 22px 26px 22px;
	}
	.el-dialog__headerbtn .el-dialog__close {
		color: #1b1d21;
		font-size: 16px;
	}
	.el-dialog__footer {
		padding: 0px 22px;
		margin-bottom: 50px;
	}
`
