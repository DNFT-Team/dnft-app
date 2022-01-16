import { css, cx } from 'emotion'
import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { withRouter } from 'react-router-dom'
import styles from '../index.less'
import noImg from 'images/common/collection_noImg.svg'
import { Box } from '@chakra-ui/react'
import { getImgLink } from 'utils/tools'

const NFTCard = (props) => {
	const { item, index, newAddress } = props
	let randomLen = Math.floor(Math.random() * (item?.nftAvatorUrls?.length || 0))
	const viewUrl = getImgLink(item?.nftAvatorUrls?.[randomLen]) || noImg
	let history = useHistory()
	let len = item?.nftAvatorUrls?.length
	return (
		<Box
			w={['calc(100% - 40px)', 'calc(100% - 40px)', 'calc(100% - 40px)', '300px']}
			key={`title-${index}`}
			className={styleCardContainer}
			onClick={() => history.push('/profile/collection', { item, newAddress })}
		>
			<div
				style={{
					backgroundImage: `url(${viewUrl})`,
				}}
				className={styles.shortPic}
			/>
			<div className={styleInfoAvatarUrl}>
				{item?.nftAvatorUrls?.map((obj, index) => {
					if (index > 2) {
						return
					}
					return <img key={index} src={getImgLink(obj)} />
				})}
				{len <= 3 && new Array(3 - len).fill().map((obj, index) => <div key={index + '_'} />)}
			</div>
			<div className={styleInfoContainer}>
				<div className={styleCardHeader}>
					<div className={styleInfo}>
						<div className="title">{item.name}</div>
						<span className="desc">{item.description}</span>
					</div>
				</div>
			</div>
		</Box>
	)
}
const mapStateToProps = ({ profile }) => ({
	address: profile.address,
	token: profile.token,
})
export default withRouter(connect(mapStateToProps)(NFTCard))

const styleInfoAvatarUrl = css`
	display: flex;
	align-items: center;
	margin-top: 5px;
	img {
		height: 88px;
		margin-right: 6px;
		border-radius: 6px;
		width: calc((100% - 12px) / 3);
		object-fit: cover;
		&:last-child {
			margin-right: 0;
		}
	}
	div {
		height: 88px;
		margin-right: 6px;
		border-radius: 6px;
		width: calc((100% - 12px) / 3);
		background: #e5e5e5;
		&:last-child {
			margin-right: 0;
		}
	}
`

const styleCardContainer = css`
	background: #ffffff;
	border-radius: 10px;
	${'' /* max-width: 300px; */}
	display: flex;
	flex-direction: column;
	position: relative;
	flex: 1;
	${'' /* min-width: 300px; */}
	padding: 6px;
	margin: 0 auto;
`
const styleInfoContainer = css`
	padding: 20px 0px 0 0px;
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: space-between;
	color: rgba(117, 129, 154, 1);
	font-size: 12px;
`

const styleCardHeader = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
`

const styleInfo = css`
	align-items: center;
	.title {
		color: #000;
		display: block;
		font-family: Archivo Black;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 14px;
		margin-bottom: 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.desc {
		color: #000000;
		font-family: DM Sans;
		height: 32px;
		font-family: Helvetica;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
	}
`
