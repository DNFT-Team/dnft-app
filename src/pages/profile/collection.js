import { Flex, Box } from '@chakra-ui/react'
import { Btn } from 'components/Button'
import CreateCollectionModal from 'components/CreateCollectionModal'
import { css } from 'emotion'
import LoadingIcon from 'images/asset/loading.gif'
import add from 'images/profile/add.png'
import share_bg from 'images/profile/share.svg'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { withRouter } from 'react-router-dom'
import { get, stack_post } from 'utils/request'
import NFTCard from '../../components/NFTCard'
import CreateNFTModal from '../asset/create/index'
import SharePopover from 'components/SharePopover'
import { queryParse } from 'utils/tools'
const CollectionScreen = (props) => {
	const {
		address,
		location: { state },
		token,
	} = props
	const { t } = useTranslation()

	const [list, setList] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [showCreateCollection, setShowCreateCollection] = useState(false)
	const [showCreateNft, setShowCreateNft] = useState(false)
	let history = useHistory()
	const shareUrl = window.location.href
	let url = queryParse(shareUrl)

	useEffect(() => {
		getCollectionNftList()
		stack_post('/track/event', {
			address,
			event: 'Collect',
			info: {},
		})
	}, [])
	const getCollectionNftList = async () => {
		try {
			setIsLoading(true)
			const { data } = await get(`/api/v1/collection/detail/${url?.collectionId}`, '', token)
			setList(data?.data)
			setIsLoading(false)
		} catch (e) {
			setIsLoading(true)
		}
	}
	const getList = (id, isSave) => {
		let _list = list?.content?.slice()
		_list.map((obj) => {
			if (obj.id === id) {
				obj.isSaved = isSave
				obj.saveCount = isSave ? obj.saveCount + 1 : obj.saveCount - 1
			}
		})
		setList({
			...list,
			content: _list,
		})
	}
	const renderCard = useCallback(
		(item, index) => (
			<NFTCard
				item={item}
				index={index}
				fromCollection
				currentStatus={''}
				getList={getList}
				handleDetail={() => {
					history.push(
						`/market/detail?address=${item?.address}&status=${item?.status}&nftId=${
							item?.nftId
						}&fromAsset=${true}`,
					)
				}}
			/>
		),
		[list],
	)
	return (
		<Box p={['20px', '20px', '20px', '50px']} className={styleCardContainer}>
			<Box flexDirection={['column', 'column', 'column', 'row']} className={styleCardHeaderBox}>
				<Flex pb={['25px', '25px', '25px', 0]} textAlign="center" className={styleCardHeader}>
					<h4>{list?.name}</h4>
					<div>{list?.collectionDesc}</div>
				</Flex>
				<Flex>
					<SharePopover datas={list} typeName="collection" />
					{address && address === state?.newAddress && (
						<Btn
							style={{
								fontWeight: 'normal',
							}}
							onClick={() => setShowCreateCollection(true)}
						>
							{t('collection.edit')}
						</Btn>
					)}
				</Flex>
			</Box>
			<div className={styleInfoContainer}>
				{list?.content?.length > 0
					? list.content.map((item, index) => renderCard(item, index))
					: null}
				{address && address === state?.newAddress && (
					<div className={styleCardContainerNFT}>
						<img src={add} />
						<div onClick={() => setShowCreateNft(true)}>{t('nftCard.create')}</div>
					</div>
				)}
			</div>
			{isLoading && (
				<div className={styleLoadingIconContainer}>
					<img src={LoadingIcon} alt="" />
				</div>
			)}
			{showCreateCollection && address === state?.newAddress && (
				<CreateCollectionModal
					formDs={{
						name: list?.name,
						description: list?.collectionDesc,
						id: url?.collectionId,
						chainType: state?.item.chainType,
					}}
					token={token}
					isNew={false}
					isProfile
					onSuccess={() => {
						setShowCreateCollection(false)
						getCollectionNftList()
					}}
					onClose={() => {
						setShowCreateCollection(false)
					}}
				/>
			)}
			{showCreateNft && (
				<CreateNFTModal
					collectionId={Number(url?.collectionId)}
					onClose={(isCreate) => {
						if (isCreate) {
							getCollectionNftList()
						}
						setShowCreateNft(false)
					}}
				/>
			)}
		</Box>
	)
}
const mapStateToProps = ({ profile }) => ({
	address: profile.address,
	token: profile.token,
})
export default withRouter(connect(mapStateToProps)(CollectionScreen))

const styleLoadingIconContainer = css`
	position: absolute;
	width: 100%;
	height: 100%;
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

const styleCardContainer = css`
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	position: relative;
	flex: 1;
`
const styleCardHeaderBox = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
`
const styleCardHeader = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	h4 {
		font-family: Archivo Black;
		font-style: normal;
		font-weight: normal;
		font-size: 36px;
		line-height: 36px;
		color: #000000;
		margin: 0;
		margin-bottom: 20px;
	}
	div {
		font-family: Helvetica;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 16px;
		color: #888888;
	}
`

const styleInfoContainer = css`
	margin-top: 30px;
	display: grid;
	flex-wrap: wrap;
	flex-direction: row;
	gap: 30px 16px;
	grid-template-columns: repeat(5, minmax(250px, 1fr));
	@media (max-width: 1650px) {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
	@media (max-width: 900px) {
		justify-content: center;
	}
`

const styleCardContainerNFT = css`
	background: #ffffff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	position: relative;
	align-items: center;
	flex: 1;
	margin: 0 0.6rem;
	width: calc(100% - 1.2rem);

	img {
		width: 84px;
		height: 84px;
		margin: 113px 0;
	}
	div {
		width: 181px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background: #0057d9;
		border-radius: 10px;
		font-family: Archivo Black;
		font-size: 14px;
		text-align: center;
		color: #fcfcfd;
		cursor: pointer;
	}
`
