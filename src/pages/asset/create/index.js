import { Dialog, Button, Input, InputNumber, Select, Upload } from 'element-react'
import { css } from 'emotion'
import React, { useEffect, useState, useCallback } from 'react'
import CreateCollectionModal from '../../../components/CreateCollectionModal'
import { post } from 'utils/request'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { ipfs_add, sensi_post } from 'utils/ipfs-request'
import { getObjectURL, json2File } from 'utils/tools'
import { toast } from 'react-toastify'
import { createNFTContract1155, createNFTContract721 } from '../../../utils/contract'
import { createNFTAbi1155, createNFTAbi721 } from '../../../utils/abi'
import Web3 from 'web3'
import { getWallet } from 'utils/get-wallet'
import { useTranslation } from 'react-i18next'
import SwitchModal from 'components/SwitchModal'
import StepCard, { STEP_ENUM } from './step'

const CreateNFTModal = (props) => {
	const { collectionId, address, chainType, token, net_env, categoryList, onClose } = props
	const { t } = useTranslation()

	const [options, setOptions] = useState([])
	const [showCreateCollection, setShowCreateCollection] = useState(false)
	const [form, setForm] = useState({
		supply: 1,
		contractType: '721',
		collectionId: collectionId,
	})
	const [nftUrl, setNftUrl] = useState()
	const [nftFile, setNftFile] = useState()
	const [isShowSwitchModal, setIsShowSwitchModal] = useState(false)
	const [step, setStep] = useState(STEP_ENUM.INITIAL)
	const [stepErr, setStepErr] = useState('')

	let history = useHistory()

	const paramsMap = {
		name: 'name',
		collectionId: 'collection',
		category: 'category',
		contractType: 'contract type',
		supply: 'supply',
	}

	const contractType = [
		{ label: '1155', value: '1155' },
		{ label: '721', value: '721' },
	]
	const uploadFile = async (file) => {
		setNftUrl('')
		setNftFile(null)
		try {
			const imgUrl = getObjectURL(file)
			imgUrl && setNftFile(file)
			return imgUrl
		} catch (e) {
			console.log(e, 'e')
		}
	}

	const beforeUpload = (file) => {
		const isLt10M = file.size / 1024 / 1024 < 10
		if (!isLt10M) {
			toast.warn(t('cropImg.uploaded.nft.limit'), {
				position: toast.POSITION.TOP_CENTER,
			})
			return false
		}
	}

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
			let list = data?.data?.content || []
			setOptions(
				list.map((item) => ({
					label: item.name,
					value: item.id,
				})),
			)
		} catch (e) {
			console.log(e, 'e')
			setOptions([])
		}
	}

	const goToRightNetwork = useCallback(async (ethereum) => {
		if (history.location.pathname !== '/asset') {
			return
		}
		try {
			if (net_env === 'testnet') {
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

	const checkSensi = async (file) => {
		try {
			const fileData = new FormData()
			fileData.append('content', file)
			const res = await sensi_post('/single/multipart-form', fileData)
			return res.data.prediction.some(
				(e) => e.probability > 0.5 && ['Sexy', 'Porn'].includes(e.className),
			)
		} catch {
			return true
		}
	}

	const mintNFTInBlock = async (form, imageCid, jsonCid) => {
		try {
			let wallet = getWallet()
			if (!wallet) {
				return null
			} else {
				window.web3 = new Web3(wallet)
				await window.web3.eth.requestAccounts()
				const is1155 = form.contractType == 1155

				const contractAddress = is1155
					? createNFTContract1155[net_env]
					: createNFTContract721[net_env]
				const myContract = new window.web3.eth.Contract(
					is1155 ? createNFTAbi1155 : createNFTAbi721,
					contractAddress,
				)

				const fee = await myContract.methods.bnbFee().call()

				const payloads = is1155
					? [
							address,
							form.supply,
							`ipfs://${jsonCid}`,
							'0x0000000000000000000000000000000000000000000000000000000000000000',
					  ]
					: [address, `ipfs://${jsonCid}`]

				const createNFTResult = await myContract.methods
					.create(...payloads)
					.send({ from: address, value: fee })

				if (createNFTResult.transactionHash) {
					const tokenId = is1155
						? createNFTResult.events.TransferSingle.returnValues.id
						: createNFTResult.events.Transfer.returnValues.tokenId
					return {
						tokenId,
						hash: createNFTResult.transactionHash,
						tokenAddress: contractAddress,
					}
				} else {
					return null
				}
			}
		} catch (err) {
			if (4001 === err?.code) {
				setStepErr('User denied transaction signature.')
			} else {
				setStepErr('Mint transaction failed.')
			}
			return null
		}
	}

	const createNFT = async () => {
		// check network
		if (!['BSC'].includes(chainType)) {
			setIsShowSwitchModal(true)
			return
		}
		//	check file import
		if (!nftFile) {
			toast.dark(t('toast.upload.nft'))
			return
		}
		// validate form
		const inValidParam = Object.entries(paramsMap).find((item) => {
			if (item[0] === 'supply' && form.contractType == '721') {
				return false
			}
			return form[item[0]] === undefined
		})
		if (inValidParam) {
			toast.dark(`${t('please.input')} ${inValidParam[1]}`)
			return
		}
		//	execute create
		try {
			//	1.check Sensi
			setStep(STEP_ENUM.SENSI_PENDING)
			const isSensi = await checkSensi(nftFile)
			if (isSensi) {
				setStep(STEP_ENUM.SENSI_FAILED)
				setStepErr('Warning! Your media resource is too sensitive!')
				return
			}
			// 2.upload media file
			setStep(STEP_ENUM.IMAGE_PENDING)
			const imageCid = await ipfs_add(nftFile)
			if (!imageCid) {
				setStep(STEP_ENUM.IMAGE_FAILED)
				setStepErr('Network congestion when uploading files.')
				return
			}
			// 3.upload metadata json
			setStep(STEP_ENUM.JSON_PENDING)
			const metaFile = json2File(
				{
					name: form.name,
					description: form.description,
					image: 'ipfs://' + imageCid,
					animation_url: 'ipfs://' + imageCid,
				},
				`DNFT_${form.contractType}_${Date.now()}.json`,
			)
			const jsonCid = await ipfs_add(metaFile)
			if (!jsonCid) {
				setStep(STEP_ENUM.JSON_FAILED)
				setStepErr('Network congestion when uploading files.')
				return
			}
			//  4.mint nft
			setStep(STEP_ENUM.MINT_PENDING)
			const txRes = await mintNFTInBlock(jsonCid)
			if (!txRes) {
				setStep(STEP_ENUM.MINT_FAILED)
				return
			}
			//	notify api
			const noftifyRes = await post(
				'/api/v1/nft/',
				{
					...form,

					address,
					chainType,

					tokenAddress: txRes.tokenAddress,
					hash: txRes.hash,
					tokenId: txRes.tokenId,

					avatorUrl: 'ipfs://' + imageCid,
					// animationUrl: '',
					// itemType: nftFile.type,

					ipfs_hash: jsonCid,
				},
				token,
			)
			console.log('[ noftifyRes ]', noftifyRes)

			// if (!noftifyRes.data.success) {
			// 	console.log('Notify failed')
			// }

			setStep(STEP_ENUM.END)
		} catch (e) {
			console.log(e, 'e')
		}
	}

	useEffect(() => {
		if (token) {
			getCollectionList()
		}
	}, [token])

	const renderFormItem = (label, item, isRequired) => (
		<div className={styleFormItemContainer}>
			<div className="label">
				{label}
				<span style={{ color: '#FF2E2E' }}>{isRequired && '*'}</span>
			</div>
			{item}
		</div>
	)

	return (
		<React.Fragment>
			<Dialog
				customClass={styleModalContainer}
				title={t('nftCard.create')}
				visible
				closeOnClickModal={false}
				onCancel={() => {
					onClose()
				}}
			>
				<Dialog.Body>
					{step !== STEP_ENUM.INITIAL && (
						<StepCard
							step={step}
							errMsg={stepErr}
							onBack={() => {
								setStep(STEP_ENUM.INITIAL)
							}}
							onClose={onClose}
						/>
					)}
					<div
						className={styleContainer}
						style={{ display: step !== STEP_ENUM.INITIAL ? 'none' : 'block' }}
					>
						<Upload
							className={styleUploadContainer}
							drag
							multiple={false}
							withCredentials
							showFileList={false}
							action=""
							beforeUpload={(file) => beforeUpload(file)}
							httpRequest={async (e) => {
								let result = await uploadFile(e.file)
								setNftUrl(result)
							}}
							onRemove={() => {
								setNftUrl(undefined)
							}}
						>
							{nftUrl ? (
								<img style={{ marginBottom: '.6rem' }} src={nftUrl} alt="" />
							) : (
								<React.Fragment>
									<i className="el-icon-upload2" />
									<div className="el-upload__text">PNG, GIF</div>
								</React.Fragment>
							)}
						</Upload>
						{renderFormItem(
							t('nftCard.name'),
							<Input
								placeholder={t('collection.placeholder.name30')}
								maxLength={30}
								onChange={(value) => {
									setForm({
										...form,
										name: value,
									})
								}}
							/>,
							true,
						)}
						{renderFormItem(
							t('nftCard.desc'),
							<Input
								type="textarea"
								placeholder={t('collection.placeholder.desc')}
								maxLength={500}
								autosize={{ minRows: 4, maxRows: 4 }}
								onChange={(value) => {
									setForm({
										...form,
										description: value,
									})
								}}
							/>,
						)}
						{renderFormItem(
							t('collection.title'),
							<div style={{ display: 'flex' }}>
								<Select
									placeholder={t('please.choose')}
									defaultValue={form.collectionId}
									value={form.collectionId}
									className={styleCollection}
									style={{ flex: 1, marginRight: '8px' }}
									onChange={(value) => {
										setForm({
											...form,
											collectionId: value,
										})
									}}
								>
									{options.map((el) => (
										<Select.Option key={el.value} label={el.label} value={el.value} />
									))}
								</Select>
								<Button
									onClick={() => {
										setShowCreateCollection(true)
									}}
								>
									+ {t('nftCard.add')}
								</Button>
							</div>,
							true,
						)}
						{renderFormItem(
							t('nftCard.category'),
							<Select
								placeholder={t('please.choose')}
								onChange={(value) => {
									setForm({
										...form,
										category: value,
									})
								}}
							>
								{categoryList?.slice(1)?.map((el) => (
									<Select.Option key={el} label={el} value={el} />
								))}
							</Select>,
							true,
						)}
						<div style={{ display: 'flex', gap: '20px' }}>
							{renderFormItem(
								t('nftCard.contract.type'),
								<Select
									value={form.contractType}
									placeholder={t('please.choose')}
									onChange={(value) => {
										setForm({
											...form,
											contractType: value,
										})
									}}
								>
									{contractType.map((el) => (
										<Select.Option key={el.value} label={el.label} value={el.value} />
									))}
								</Select>,
								true,
							)}
							{form.contractType != '721' &&
								renderFormItem(
									t('nftCard.supply'),
									<InputNumber
										defaultValue={1}
										min={1}
										max={10000}
										onChange={(value) => {
											setForm({
												...form,
												supply: value,
											})
										}}
									/>,
									true,
								)}
						</div>
						<div className={styleCreateNFT} onClick={createNFT}>
							{t('create')}
						</div>
					</div>
				</Dialog.Body>
			</Dialog>
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
		</React.Fragment>
	)
}

const mapStateToProps = ({ profile, market }) => ({
	address: profile.address,
	chainType: profile.chainType,
	categoryList: market.category,
	token: profile.token,
})
export default withRouter(connect(mapStateToProps)(CreateNFTModal))

const styleModalContainer = css`
	max-width: 564px;
	width: calc(100% - 40px);
	border-radius: 10px;
	height: 80vh;
	overflow: auto;

	.el-input + .el-button,
	.el-select + .el-button,
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
	}
	.el-dialog__header {
		padding: 20px 32px 12px 32px;
	}
	.el-dialog__body {
		padding: 0 32px 32px 32px;
	}
	.el-input-number {
		width: 100%;
	}
`

const styleContainer = css`
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 12px;
	@media (max-width: 900px) {
		margin: 16px 0;
	}

	h1 {
		color: #23262f;
		font-size: 38px;
		margin: 0 0 20px 0;
		padding: 0;
		display: flex;
		@media (max-width: 900px) {
			font-size: 18px;
		}
	}
	h3 {
		color: #23262f;
		font-size: 16px;
		padding: 0;
		margin: 0 0 40px 0;
	}
`
const styleContainerWithStep = css`
	height: 40vh;
	overflow: hidden;
	position: relative;
	border-radius: 0;
`
const styleUploadContainer = css`
	margin-bottom: 18px;
	.el-upload {
		width: 100%;
		.el-upload-dragger {
			display: flex;
			flex-direction: column;
			color: #777e90;
			background-color: #f4f5f6;
			min-height: 182px;
			width: 204px;
			justify-content: center;
			border-radius: 10px;
			border: none;
			height: auto;
			@media (max-width: 900px) {
				width: 100%;
			}

			.el-upload__text {
				margin-top: 10px;
				padding: 0 40px;
				font-size: 12px;
			}
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

const styleCreateNFT = css`
	background-color: #0057d9;
	font-family: Archivo Black;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	color: #fcfcfd;
	width: 150px;
	height: 40px;
	margin: 0 auto;
	border-radius: 5px;
	cursor: pointer;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	outline: none;
	&:hover {
		color: #fff;
		background: #0057d9;
	}
	.circular {
		width: 24px;
		height: 24px;
		left: -45px;
		position: relative;
		top: 24px;
	}
`

const styleCollection = css`
	.el-select-dropdown__empty {
		width: 0;
		overflow: hidden;
		&:before {
			content: 'No Data';
			display: block;
			position: absolute;
			top: 50%;
			left: 0;
			height: 100%;
			width: 100%;
			overflow: hidden;
		}
	}
`
