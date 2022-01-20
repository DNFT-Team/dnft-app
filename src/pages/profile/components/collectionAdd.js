import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { css, cx } from 'emotion'
import CreateCollectionModal from 'components/CreateCollectionModal'
import { getMyProfileBatch } from 'reduxs/actions/profile'
import add from 'images/profile/add.png'
import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const CollectionAdd = (props) => {
	const { address, dispatch, token, chainType, style = {}, handleCollect } = props
	const { t } = useTranslation()

	const [showCreateCollection, setShowCreateCollection] = useState(false)
	const getCollectionNftList = () => {
		dispatch(
			getMyProfileBatch(
				{
					address,
					page: 0,
					size: 100,
					sortOrder: 'ASC',
					sortTag: 'createTime',
				},
				token,
			),
		)
	}
	return (
		<>
			<Box
				m={['0 auto', '0 auto', '0 auto', '']}
				w={['calc(100vw - 40px)', 'calc(100vw - 40px)', 'calc(100vw - 40px)', '300px']}
				style={style}
				className={styleCardContainer}
			>
				<img src={add} />
				<div onClick={() => setShowCreateCollection(true)}>{t('collection.create')}</div>
			</Box>
			{showCreateCollection && (
				<CreateCollectionModal
					formDs={{ chainType }}
					token={token}
					isProfile
					isNew
					onSuccess={(res) => {
						setShowCreateCollection(false)
						getCollectionNftList()
					}}
					onClose={() => {
						setShowCreateCollection(false)
					}}
				/>
			)}
		</>
	)
}
const mapStateToProps = ({ profile }) => ({
	datas: profile.datas,
	address: profile.address,
	chainType: profile.chainType,
	token: profile.token,
	batch: profile.batch,
	owned: profile.owned,
	created: profile.created,
})
export default withRouter(connect(mapStateToProps)(CollectionAdd))

const styleCardContainer = css`
	background: #ffffff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	position: relative;
	align-items: center;
	flex: 1;
	padding: 6px;
	&:hover {
		background: white;
		position: relative;
		top: -10px;
	}
	img {
		width: 84px;
		height: 84px;
		margin: 124px 0;
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
