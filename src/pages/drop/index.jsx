import React from 'react'
import { css } from 'emotion'
import { useHistory } from 'react-router-dom'
import Title from 'components/Title'
import helper from 'config/helper'
import { Text, Flex, Grid } from '@chakra-ui/react'
import pic1 from 'images/drops/pic1.svg'
import pic2 from 'images/drops/pic2.svg'
import { useTranslation } from 'react-i18next'

const Drops = (props) => {
	const { t } = useTranslation()
	const history = useHistory()
	const cardData = [
		{
			key: 'mystery',
			title: 'MYSTERY BOX',
			time: 'Coming Soon',
			link: '/drop/blind-box',
			isActive: true,
			avatar: pic1,
			txtTitle: 'Parking Infinity',
			txt: 'Hi all, sharing a mobile version of a dashboard app that keeps all expenses organized, stay tax ready at all time',
		},
		{
			key: 'auction',
			title: 'TIMED AUCTION',
			time: '01/04/2022 0:00 AM (UTC)',
			link: '/drop/auction',
			isActive: false,
			avatar: pic2,
			txtTitle: 'Parking Infinity',
			txt: 'Hi all, sharing a mobile version of a dashboard app that keeps all expenses organized, stay tax ready at all time',
		},
	]
	return (
		<section className={styleContainer}>
			<Title
				title={t('drops.title')}
				linkHelper={{
					youtubeLink: helper.nftMagic.youtube,
					youtubeTitle: helper.nftMagic.title,
					bookLink: helper.nftMagic.book,
					bookTitle: t('book.title'),
				}}
			/>
			<Text className="describe">{t('drops.tipTitle')}</Text>
			<Grid
				className={styleRow}
				gap={50}
				height="max-content"
				templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
			>
				{cardData.map((item, i) => (
					<div className={styleCard} key={i}>
						<Flex flexDirection={'column'} className="header">
							<h3>{item.title}</h3>
							<span>{item.isActive ? item.time : 'Coming Soon'}</span>
							<button
								onClick={() => {
									if (item.isActive && item.link) {
										history.push(item.link)
									}
								}}
							>
								PLAY
							</button>
							<img src={item.avatar} alt="" />
						</Flex>
						<div className="descBox">
							<div className="descTitle">{item.txtTitle}</div>
							<p>{item.txt}</p>
						</div>
					</div>
				))}
			</Grid>
		</section>
	)
}
export default Drops
const styleContainer = css`
	border-radius: 1.429rem;
	padding: 50px 50px;
	position: relative;
	z-index: 0;
	.styleHeader {
		display: flex;
		align-items: center;
	}
	@media (max-width: 900px) {
		padding: 15px;
	}
	.describe {
		margin: 30px 0 50px 0;
		font-family: Helvetica, sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 24px;
		color: #777e91;
		strong {
			color: rgba(35, 38, 47, 1);
		}
	}
`
const styleRow = css`
	position: relative;
`
const styleCard = css`
	background: #ffffff;
	box-sizing: border-box;
	border-radius: 20px;
	border: 4px solid #ffffff;
	border-radius: 30px;
	&:hover {
		border: 4px solid #00398d;
	}
	@media (max-width: 900px) {
		padding: 15px;
	}
	.header {
		height: 258px;
		background: #f5f7fa;
		border-radius: 30px;
		padding: 41px 0 0 24px;
		box-sizing: border-box;
		position: relative;
		h3 {
			font-family: Barlow;
			font-style: normal;
			font-weight: bold;
			font-size: 24px;
			padding-bottom: 21px;
			line-height: 18px;
			color: #000000;
		}
		span {
			font-family: Barlow;
			font-style: normal;
			font-weight: 500;
			font-size: 18px;
			line-height: 18px;
			color: #13b571;
			padding-bottom: 54px;
		}
	}
	.descBox {
		padding: 33px;
	}
	.descTitle {
		font-family: Barlow;
		font-style: normal;
		font-weight: bold;
		font-size: 16px;
		line-height: 18px;
		padding-bottom: 13px;
		color: #000000;
	}
	img {
		position: absolute;
		right: 0;
		top: 0;
		width: 107px;
		height: 258px;
		border-radius: 20px 20px 0 0;
	}
	p {
		margin: 0;
		font-family: Barlow;
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 24px;
		color: #75819a;
	}
	button {
		user-select: none;
		display: flex;
		width: 127.37px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 12px 24px;
		box-sizing: border-box;
		background: #0057d9;
		border-radius: 10px;
		font-family: Barlow;
		font-style: normal;
		font-weight: 800;
		font-size: 14px;
		line-height: 14px;
		text-align: center;
		text-transform: uppercase;
		color: #ffffff;
	}
`
