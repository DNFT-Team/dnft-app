import React from 'react';
import styles from './index.less';
import { history, useIntl, FormattedMessage } from 'umi';

function numberFormat(value) {
    var param = {};
    var k = 10000,
        sizes = ['', '万', '亿', '万亿'],
        i;
    if (value < k) {
        param.value = value
        param.unit = ''
    } else {
        i = Math.floor(Math.log(value) / Math.log(k));

        param.value = ((value / Math.pow(k, i))).toFixed(2);
        param.unit = sizes[i];
    }
    return  `${param.value}${param.unit}`;
}

const Items = props => {
    const { handleTimeUp, times_isUp, isUpTab, isUps, title, color, percent, percentTitle } = props;
    const getChangeData = (value, obj) => {
        if (value === 'turnover') { //总量
            let volume = 0;
            if (isUpTab === '') volume = obj.volume;
            if (isUpTab === 'vol_w') volume = obj.volume_week;
            if (isUpTab === 'vol_m') volume = obj.volume_month;
            let num = obj.price_cny * volume;
            return numberFormat(num)
        } else {
            return `${obj[value]}%`
        }
    }
    return (
        <div className={styles.list}>
            <div className={styles.box}>
                <div className={styles.boxTit}>
                    <h2>{title}</h2>
                    <div className={styles.seeMoreRight}>
                        <span>
                            <a target="_blank" ><FormattedMessage id="rank.more" /></a>
                        </span>
                        <i className={styles.iconArrowRight}></i>
                    </div>
                </div>
                {/* 今日筛选 */}
                <div className={styles.quotes_time} style={{ marginTop: '0px', paddingLeft: '42px' }}>
                    {
                        times_isUp.map(obj => {
                            return <div onClick={() => handleTimeUp(obj)} key={obj.value} className={`${styles.timeStyle} ${isUpTab === obj.value && styles.active || null}`}>{obj.label}</div>
                        })
                    }
                </div>
                {/* 排行榜 */}
                <div style={{ padding: '18px 16px 0 16px' }}>
                    <ul className={styles.sideTable}>
                        <li className={styles.tit}>
                            <span className={styles.row0}>#</span>
                            <span className={styles.row1}><FormattedMessage id="rank.coin" /></span>
                            <span className={styles.row2}><FormattedMessage id="rank.global.index" /></span>
                            <span className={styles.row3}>{percentTitle}</span>
                        </li>
                        {
                            isUps && isUps.map((obj, index) => {
                                if (index > 9) return null;
                                return (
                                    <li key={index} className={styles.tit2}>
                                        <span className={styles.row0}>{index + 1}</span>
                                        <span className={styles.row1}>
                                            <img src={obj.logo} />
                                            {obj.symbol}
                                        </span>
                                        <span className={styles.row2}>{obj.price_cny}</span>
                                        <span className={`${styles.row3} ${styles[color]}`}>{getChangeData(percent, obj)}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Items;