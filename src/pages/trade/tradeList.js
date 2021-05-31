// import { EXCHANGE_CATEGORY, TRADE_TAB } from '@/utils/enum';
import { Button, Input, InputNumber, Radio } from 'antd';
import React, { useState } from 'react';
import { history, useIntl, FormattedMessage } from 'umi';
import markets from './data';
import styles from './index.less';

const { Search } = Input;
const Component = props => {
    const intl = useIntl();
     const EXCHANGE_CATEGORY = [
        { label: <FormattedMessage id="trade.category1" />, value: 0 },
        { label: <FormattedMessage id="trade.category2" />, value: 1 },
        { label: <FormattedMessage id="trade.category3" />, value: 2 },
        { label: <FormattedMessage id="trade.category4" />, value: 3 },
        { label: <FormattedMessage id="trade.category5" />, value: 4 },
        { label: <FormattedMessage id="trade.category6" />, value: 5 },
        { label: <FormattedMessage id="trade.category7" />, value: 6 },
        { label: <FormattedMessage id="trade.category8" />, value: 7 },
    ]
    
     const TRADE_TAB = [
        { label: <FormattedMessage id="trade.tab1" />, value: 0 },
        { label: <FormattedMessage id="trade.tab2" />, value: 1 },
        { label: <FormattedMessage id="trade.tab3" />, value: 2 },
        { label: <FormattedMessage id="trade.tab4" />, value: 3 },
        { label: <FormattedMessage id="trade.tab5" />, value: 4 },
    ]
    const [radio, setRadio] = useState(0)
    const [tab, setTab] = useState(0)
    const [data, setData] = useState(markets)
    const onChange = (e) => {
        setRadio(e.target.value);
    }

    // 切换目录
    const handleChangeTab = (value) => {
        setTab(value)
        if (value === 0) {
            setData(markets)
        } else {
            let newData = markets.filter(obj => obj.state === value);
            setData(newData);
        }
    }
    // 搜索按钮时间
    const onSearch = (value) => {
        console.log(value)
    }
    // 点击购买进入详情
    const handleDetail = (value) => {
        history.push('/trade/detail', { detail: value })
    }
    return (
        <div className={styles.content}>
            <div className={styles.left}>
                <h3 className={styles.sort}><FormattedMessage id="trade.type" /></h3>
                <Radio.Group onChange={onChange} value={radio}>
                    {
                        EXCHANGE_CATEGORY.map(obj => {
                            return <Radio className={styles.radioStyle} key={obj.value} value={obj.value}>{obj.label}</Radio>
                        })
                    }
                </Radio.Group>
                {/* <p className={styles.priceText}><span><FormattedMessage id="price" /></span> （BNB/DOT）</p>
                <div className={styles.priceInterval}>
                    <InputNumber placeholder={'1'} className={styles.numInput} />
                    <span className={styles.line}><FormattedMessage id="trade.price.end" /></span>
                    <InputNumber placeholder={'10000'} className={styles.numInput} />
                </div> */}

            </div>
            <div className={styles.right}>
                <div className={styles.headerT}>
                    <div className={styles.tradeTab}>
                        {
                            TRADE_TAB.map(obj => {
                                return (<span
                                    key={obj.value}
                                    className={obj.value === tab && styles.active || null}
                                    onClick={() => handleChangeTab(obj.value)}
                                >{obj.label}</span>)
                            })
                        }
                    </div>
                    <div>
                        <Button onClick={()=>history.push('/trade/createnft')} style={{ height: 30 }} size="large"><FormattedMessage id="trade.create.nft" /></Button>
                        <Button onClick={()=>history.push('/trade/createnftcategory')} style={{ height: 30, marginLeft: 30 }} size="large"><FormattedMessage id="trade.create.nft.category" /></Button>
                    </div>


                </div>
                {/* 搜索条件 */}
                <div className={styles.search}>
                    <Search onSearch={onSearch} enterButton={intl.formatMessage({id: 'trade.search'})} style={{ height: 40, fontSize: 16 }} placeholder={intl.formatMessage({id: 'trade.search.by.name'})} />
                </div>
                {/* 项目列表 */}
                <div className={styles.list}>

                    {
                        data.map((obj, i) => {
                            return (
                                <div key={i} onClick={() => handleDetail(obj)} className={styles.product}>
                                    <div className={styles.top}>
                                        <div className={styles.img}>
                                            <img src={obj.img} />
                                        </div>
                                        <div className={styles.name}><FormattedMessage id="name" />: {obj.title}</div>
                                        <div className={styles.text}>{obj.notice}</div>
                                        <div className={styles.proPrice}>
                                            <span>{obj.price}</span>
                                            <span>=</span>
                                            <span />
                                            <span>${obj.price_cny}</span>
                                        </div>
                                    </div>
                                    <div className={styles.buy}><FormattedMessage id="buy" /></div>
                                </div>
                            )
                        })
                    }



                </div>
            </div>

        </div>
    )
}
export default Component;