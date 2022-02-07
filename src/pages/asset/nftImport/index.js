import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Input, Select, Dialog, Button } from 'element-react'
import { toast } from 'react-toastify'
import { css } from 'emotion'
import { post } from 'utils/request'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'web3-utils'
import CreateCollectionModal from '../../../components/CreateCollectionModal'
import LoadingIcon from '../../../images/asset/loading.gif'

const NFT_SCHEMA = {
	blockchain: '',
	category: '',
	collectionId: -2,
	contract: '',
	owner: '',
	standard: '721',
	tokenId: '',
}

const NFTImportModal = (props) => {
	const { t } = useTranslation()
	const {
		onClose,
		onSuccess,
		address,
		chainType,
		categoryList,
		token, //  req-token
		lng,
	} = props
	const [loading, setLoading] = useState(false)

	const [nftInput, setNftInput] = useState({ ...NFT_SCHEMA })

	const [options, setOptions] = useState([])
	const [showCreateCollection, setShowCreateCollection] = useState(false)

	const renderFormItem = (label, item, isRequired) => (
		<div className={styleFormItemContainer}>
			<div className="label">
				<span style={{ color: '#FF2E2E' }}></span>
				{label}
				{isRequired && <i>*</i>}
			</div>
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

	const submitNftImport = async () => {
		setLoading(true)
		if (!token || !address) {
			return
		}
		if (!['ETH', 'BSC', 'HECO'].includes(chainType)) {
			toast.warning(t('toast.wrong.network'))
			return
		}
		if (!nftInput.tokenId) {
			toast.warning(t('toast.token.id.required'))
			setLoading(false)
			return
		}
		if (!nftInput.standard) {
			toast.warning(t('toast.token.starndard.required'))
			setLoading(false)
			return
		}
		if (!nftInput.contract) {
			toast.warning(t('toast.contract.address.required'))
			setLoading(false)
			return
		}
		if (!isAddress(nftInput.contract)) {
			toast.warning(t('toast.contract.address.wrong'))
			setLoading(false)
			return
		}
		// if (!nftInput.collectionId) {
		// 	toast.warning(t('toast.collection.required'))
		// 	setLoading(false)
		// 	return
		// }
		if (!nftInput.category) {
			toast.warning(t('toast.category.required'))
			setLoading(false)
			return
		}
		try {
			const param = {
				...nftInput,
				collectionId: nftInput.collectionId || -2,
				// owner: address,
				blockchain: chainType,
			}
			console.log('[NFT-import-param]', param)
			const { data } = await post('/api/v1/nft/import', param, token)
			if (data.success) {
				toast.success(t('toast.nft.import.success'))
				onSuccess(true)
			} else {
				toast.error(t('toast.nft.import.failed') + ':' + data.message)
			}
		} catch (e) {
			console.log(e, 'e')
			toast.error(e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		token && getCollectionList()
	}, [token])

	return (
		<React.Fragment>
			<Dialog
				customClass={styleCollectionModalContainer}
				title={t('nftCard.import')}
				visible
				closeOnClickModal={false}
				onCancel={onClose}
			>
				<Dialog.Body>
					{renderFormItem(
						t('nftCard.contract.type'),
						<Select
							value={nftInput.standard}
							placeholder={t('please.choose')}
							onChange={(value) => {
								setNftInput({
									...nftInput,
									standard: value,
								})
							}}
						>
							<Select.Option label="721" value="721" />
							<Select.Option label="1155" value="1155" />
						</Select>,
						true,
					)}
					{renderFormItem(
						t('market.token.id'),
						<div style={{ display: 'flex' }}>
							<Input
								style={{ flex: 1, marginRight: '8px' }}
								placeholder={t('market.token.id')}
								value={nftInput.tokenId}
								onChange={(v) => {
									setNftInput({
										...nftInput,
										tokenId: isNaN(v) ? 0 : v,
									})
								}}
							/>
							<Button
								onClick={async () => {
									try {
										const clipboardObj = navigator.clipboard
										const text = await clipboardObj.readText()
										if (!isNaN(text)) {
											setNftInput({ ...nftInput, tokenId: text })
										} else {
											throw new Error(t('toast.token.id.wrong'))
										}
									} catch (err) {
										toast.warn(err.message)
									}
								}}
							>
								{t('paste')}
							</Button>
						</div>,
						true,
					)}
					{renderFormItem(
						t('market.contract.address'),
						<div style={{ display: 'flex' }}>
							<Input
								style={{ flex: 1, marginRight: '8px' }}
								placeholder={t('market.contract.address')}
								value={nftInput.contract}
								onChange={(v) => {
									setNftInput({ ...nftInput, contract: v })
								}}
							/>
							<Button
								onClick={async () => {
									try {
										const clipboardObj = navigator.clipboard
										const text = await clipboardObj.readText()
										const addr = text.trim()
										if (isAddress(addr)) {
											setNftInput({
												...nftInput,
												contract: addr,
											})
										} else {
											throw new Error(t('toast.contract.address.wrong'))
										}
									} catch (err) {
										toast.warn(err.message)
									}
								}}
							>
								{t('paste')}
							</Button>
						</div>,
						true,
					)}
					{renderFormItem(
						t('collection.title'),
						<div style={{ display: 'flex' }}>
							<Select
								placeholder={t('please.choose')}
								defaultValue={nftInput.collectionId}
								value={nftInput.collectionId}
								className={styleCollection}
								style={{ flex: 1, marginRight: '8px' }}
								onChange={(v) => {
									setNftInput({
										...nftInput,
										collectionId: v,
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
						false,
					)}
					{renderFormItem(
						t('nftCard.category'),
						<Select
							placeholder={t('please.choose')}
							onChange={(value) => {
								setNftInput({
									...nftInput,
									category: value,
								})
							}}
						>
							{categoryList?.slice(1)?.map((el) => (
								<Select.Option key={el.value} label={el[lng]} value={el.value} />
							))}
						</Select>,
						true,
					)}

					<Button loading={loading} className={styleCreateCollection} onClick={submitNftImport}>
						{t('import')}
					</Button>
				</Dialog.Body>
			</Dialog>
			{showCreateCollection && (
				<CreateCollectionModal
					formDs={{ address, chainType }}
					token={token}
					isNew
					onSuccess={() => {
						setShowCreateCollection(false)
						getCollectionList()
					}}
					onClose={() => {
						setShowCreateCollection(false)
					}}
				/>
			)}
			{loading && (
				<div className={styleLoadingIconContainer}>
					<img src={LoadingIcon} />
				</div>
			)}
		</React.Fragment>
	)
}

const mapStateToProps = ({ profile, market, lng }) => ({
	address: profile.address,
	chainType: profile.chainType,
	categoryList: market.category,
	token: profile.token,
	lng: lng.lng
})
export default withRouter(connect(mapStateToProps)(NFTImportModal))

const styleCollectionModalContainer = css`
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
		height: 40px;
		font-family: Helvetica;
	}

	.el-dialog__headerbtn .el-dialog__close {
		color: #000000;
		font-family: Archivo Black;

		font-size: 14px;
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
		padding: 30px;
	}
	.el-dialog__body {
		padding: 0 30px 30px 30px;
	}
	.el-input-number {
		width: 100%;
	}
`

const styleCreateCollection = css`
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
	outline: none;
	&:hover {
		color: #fff;
		background: #0057d9;
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
		overflow: hidden;
		border-radius: 20px;
	}
`
