import React from 'react';
import styles from '../index.less';
import { Select } from 'element-react';
const cateType = [
  { label: 'Lasted', value: 0, },
  { label: 'Virtual reality', value: 1, },
  { label: 'Domain', value: 2, },
  { label: 'Art', value: 3, },
  { label: 'Cooection', value: 4, },
  { label: 'Sports', value: 5, },
  { label: 'Game', value: 6, },
]
const cateType1 = [
  { label: 'Most favorited', value: 0, },
  { label: 'Price:high to low', value: 1, },
  { label: 'Price:low to high', value: 2, },
]
const Header = (props) => (
  <div className={styles.header}>
    <span className={styles.headerT}>Market
      {/* /Coming Soon */}
    </span>
    <div className={styles.headerR}>
      <Select style={{ marginRight: 20 }} value={0} placeholder="请选择">
        {
          cateType.map((el) => <Select.Option key={el.value} label={el.label} value={el.value} />)
        }
      </Select>
      <Select value={0} placeholder="请选择">
        {
          cateType1.map((el) => <Select.Option key={el.value} label={el.label} value={el.value} />)
        }
      </Select>
    </div>
  </div>
)
export default Header;
