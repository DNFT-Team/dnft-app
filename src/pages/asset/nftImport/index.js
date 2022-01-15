import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Input, Select, Dialog, Button } from 'element-react'
import { toast } from 'react-toastify'
import { css } from 'emotion'
import { post } from 'utils/request'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'web3-utils'
import CreateCollectionModal from '../../../components/CreateCollectionModal'

const NFT_SCHEMA = {
	category: '',
	collectionId: '',
	token_id: '',
	token_standard: 'ERC-721',
	contract_address: '',
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
				{<i>*</i>}
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
		console.log(address, chainType)
		setLoading(true)
		if (!token || !address) {
			return
		}
		if (!['ETH', 'BSC', 'HECO'].includes(chainType)) {
			toast.warning(t('toast.wrong.network'))
			return
		}
		if (!nftInput.token_id) {
			toast.warning(t('toast.token.id.required'))
			setLoading(false)
			return
		}
		if (!nftInput.token_standard) {
			toast.warning(t('toast.token.starndard.required'))
			setLoading(false)
			return
		}
		if (!nftInput.contract_address) {
			toast.warning(t('toast.contract.address.required'))
			setLoading(false)
			return
		}
		if (!isAddress(nftInput.contract_address)) {
			toast.warning(t('toast.contract.address.wrong'))
			setLoading(false)
			return
		}
		if (!nftInput.collectionId) {
			toast.warning(t('toast.collection.required'))
			setLoading(false)
			return
		}
		if (!nftInput.category) {
			toast.warning(t('toast.category.required'))
			setLoading(false)
			return
		}
		try {
			const param = {
				...nftInput,
				owner: address,
				blockchain: chainType,
			}
			console.log(param)
			const { data } = await post('api/v1/nft/import', param, token)
			if (data.success) {
				toast.success(data.message)
				onSuccess(true)
			} else {
				toast.error(data.message)
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
		<Dialog
			customClass={styleCollectionModalContainer}
			style={{ height: 'auto' }}
			title={t('nftCard.import')}
			visible
			closeOnClickModal={false}
			onCancel={onClose}
		>
			<Dialog.Body>
				{renderFormItem(
					t('market.token.standard'),
					<Select
						value={nftInput.token_standard}
						placeholder={t('please.choose')}
						onChange={(value) => {
							setNftInput({
								...nftInput,
								token_standard: value,
							})
						}}
					>
						<Select.Option label="ERC-721" value="ERC-721" />
						<Select.Option label="ERC-1155" value="ERC-1155" />
					</Select>,
					true,
				)}
				{renderFormItem(
					t('market.token.id'),
					<div style={{ display: 'flex' }}>
						<Input
							style={{ flex: 1, marginRight: '8px' }}
							placeholder={t('market.token.id')}
							value={nftInput.token_id}
							type="number"
							step="1"
							onChange={(v) => {
								setNftInput({
									...nftInput,
									token_id: v,
								})
							}}
						/>
						<Button
							onClick={async () => {
								try {
									const clipboardObj = navigator.clipboard
									const text = await clipboardObj.readText()
									const id = Number(text.trim())
									if (id) {
										setNftInput({ ...nftInput, token_id: id })
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
							value={nftInput.contract_address}
							onChange={(v) => {
								setNftInput({ ...nftInput, contract_address: v })
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
											contract_address: addr,
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
					true,
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
							<Select.Option key={el} label={el} value={el} />
						))}
					</Select>,
					true,
				)}

				<Button loading={loading} className={styleCreateCollection} onClick={submitNftImport}>
					{t('import')}
				</Button>

				{showCreateCollection && (
					<CreateCollectionModal
						formDs={{ address, chainType }}
						token={token}
						isNew
						isProfile
						onSuccess={() => {
							setShowCreateCollection(false)
							getCollectionList()
						}}
						onClose={() => {
							setShowCreateCollection(false)
						}}
					/>
				)}
			</Dialog.Body>
		</Dialog>
	)
}

const mapStateToProps = ({ profile, market }) => ({
	address: profile.address,
	chainType: profile.chainType,
	categoryList: market.category,
	token: profile.token,
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
