import React from 'react'
import styles from '../index.less'
import { Select } from 'element-react'
const cateType = [
	{ label: 'Lasted', value: 'LASTED' },
	{ label: 'Virtual Reality', value: 'VIRTUAL_REALITY' },
	{ label: 'Domain', value: 'DOMAIN' },
	{ label: 'Art', value: 'ART' },
	{ label: 'Cooection', value: 'COOECTION' },
	{ label: 'Sports', value: 'SPORTS' },
	{ label: 'Game', value: 'GAME' },
]
const sortTagType = [
	{ label: 'Most favorited', value: 'likeCount' },
	{ label: 'Price:high to low', value: 'ASC-price' },
	{ label: 'Price:low to high', value: 'DESC-price' },
]
const Header = (props) => (
	<div className={styles.header}>
		<span className={styles.headerT}>
			Market
			{/* /Coming Soon */}
		</span>
		<div className={styles.headerR}>
			<Select style={{ marginRight: 20 }} value={0} placeholder="请选择">
				{cateType.map((el) => (
					<Select.Option key={el.value} label={el.label} value={el.value} />
				))}
			</Select>
			<Select value={0} placeholder="请选择">
				{sortTagType.map((el) => (
					<Select.Option key={el.value} label={el.label} value={el.value} />
				))}
			</Select>
		</div>
	</div>
)
export default Header
