import React, { useEffect, useState } from 'react'
import styles from './index.less';
import { connect } from 'umi';
import Items from './ranksItem';
import { history, useIntl, FormattedMessage } from 'umi';


const Component = props => {
    const intl = useIntl();
    const times_isUp = [
        { label: intl.formatMessage({ id: 'rank.1d' }), value: 4 },
        { label: intl.formatMessage({ id: 'rank.24h' }), value: 3 },
        { label: intl.formatMessage({ id: 'rank.7d' }), value: 2 },
        { label: intl.formatMessage({ id: 'rank.1h' }), value: 1 },
    ]
    const times_coinval = [
        { label: intl.formatMessage({ id: 'rank.24h' }), value: '' },
        { label: intl.formatMessage({ id: 'rank.7d' }), value: 'vol_w' },
        { label: intl.formatMessage({ id: 'rank.30d' }), value: 'vol_m' },
    ]
    const times_turnOver = [
        { label: intl.formatMessage({ id: 'rank.24h' }), value: '' }
    ]
    const [isUpTab, setIsUpTab] = useState(4); // 涨幅排行榜
    const [isDownTab, setIsDownTab] = useState(4); // 跌幅排行榜
    const [coinValTab, setCoinValTab] = useState(''); // 成交排行榜


    const { dispatch, isUps, isDowns, coinVal, turnover } = props;
    const handleTimeUp = (obj) => {
        setIsUpTab(obj.value)
        dispatch({ type: 'hot/fetchIsUps', payload: obj.value })
    }
    const handleTimeDown = (obj) => {
        setIsDownTab(obj.value)
        dispatch({ type: 'hot/fetchIsDowns', payload: obj.value })
    }
    const handleTimeCoinVal = (obj) => {
        setCoinValTab(obj.value)
        dispatch({ type: 'hot/fetchCoinVal', payload: obj.value })
    }
    useEffect(() => {
        dispatch({ type: 'hot/fetchIsUps', payload: isUpTab }) //涨幅排行榜
        dispatch({ type: 'hot/fetchIsDowns', payload: isDownTab }) //跌幅排行榜
        dispatch({ type: 'hot/fetchCoinVal', payload: coinValTab }) //成交排行榜
        dispatch({ type: 'hot/fetchTurnover' }) //换手排行榜
    }, [])
    return (
        <div className={styles.content}>
            <div className={styles.header}><FormattedMessage id="rank.title" /></div>
            <div className={styles.main}>
                <Items
                    handleTimeUp={handleTimeUp}
                    isUpTab={isUpTab}
                    isUps={isUps}
                    title={intl.formatMessage({ id: 'rank.up' })}
                    color={'textGreen'}
                    times_isUp={times_isUp}
                    percentTitle={intl.formatMessage({ id: 'rank.up.today' })}
                    percent={'change_percent'}
                />
                <Items
                    handleTimeUp={handleTimeDown}
                    isUpTab={isDownTab}
                    isUps={isDowns}
                    title={intl.formatMessage({ id: 'rank.down' })}
                    color={'textRed'}
                    times_isUp={times_isUp}
                    percentTitle={intl.formatMessage({ id: 'rank.down.today' })}
                    percent={'change_percent'}
                />
                <Items
                    handleTimeUp={handleTimeCoinVal}
                    isUpTab={coinValTab}
                    isUps={coinVal}
                    title={intl.formatMessage({ id: 'rank.coinVal' })}
                    color={''}
                    times_isUp={times_coinval}
                    percentTitle={intl.formatMessage({ id: 'rank.coinVal.today' })}
                    percent={'turnover'}
                />
                <Items
                    handleTimeUp={()=>{}}
                    isUpTab={''}
                    isUps={turnover}
                    title={intl.formatMessage({ id: 'rank.turnover' })}
                    color={''}
                    times_isUp={times_turnOver}
                    percentTitle={intl.formatMessage({ id: 'rank.turnover.today' })}
                    percent={'turnover_percent'}
                />

            </div>
        </div>
    )
}
export default connect(({ hot }) => ({
    isUps: hot.isUps,
    isDowns: hot.isDowns,
    coinVal: hot.coinVal,
    turnover: hot.turnover,
}))(Component);