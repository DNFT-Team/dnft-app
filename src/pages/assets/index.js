import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import styles from './index.less';
import Nft from '@/api/nft'

const Component = props => {
    const intl = useIntl();

    const { dispatch,product } = props;

    const [account, setAccount] = useState(window.state && window.state.account) //账户余额
    const [address, setAddress] = useState(window.state && window.state.sender) //账户余额

    const [valueTab, setValueTab] = useState(1)
    const [assetsTab, setAssetsTab] = useState(1)
    // const [product, setProduct] = useState([])
    const tab = [
        { label: intl.formatMessage({ id: 'asset.overview' }), value: 1 },
        { label: intl.formatMessage({ id: 'asset.history' }), value: 2 },
    ]
    const assetsActive = [
        { label: intl.formatMessage({ id: 'asset.create.nft' }), value: 1 },
        { label: intl.formatMessage({ id: 'asset.bug.nft' }), value: 2 },
        { label: intl.formatMessage({ id: 'asset.sell.nft' }), value: 3 },
        { label: intl.formatMessage({ id: 'asset.collection.nft' }), value: 4 }
    ]
    useEffect(() => {
        try {
            Nft.NFT_IdList().then(res => {
                dispatch({type: 'assets/fetchProduct',payload: res})
                // setProduct(res);
            })
        } catch (res) {

        }

    }, [])
    useEffect(() => {
        setTimeout(() => {
            setAccount(window.state && window.state.account)
            setAddress(window.state && window.state.sender)
        }, 1200)
    }, [])
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span ><FormattedMessage id="asset.account" /></span>
                <Input className={styles.input} placeholder={intl.formatMessage({ id: 'asset.account.search' })} />
            </div>
            <div className={styles.accountTitle}><FormattedMessage id="asset.my.account" /></div>
            <div className={styles.address}>{address}</div>
            <div className={styles.accounts}>
                <div className={styles.zc}>
                    <span><FormattedMessage id="asset.total" /></span>
                    <span>{account}</span>
                    <div className={styles.zcR}>
                        <div />
                        <div />
                    </div>
                </div>
                <div className={styles.zc}>
                    <span><FormattedMessage id="asset.new.total" /></span>
                    <span>{account}</span>
                    <div className={`${styles.zcR} ${styles.zcR1}`}>
                        <div />
                        <div />
                    </div>
                </div>
                <div className={styles.zc}>
                    <span><FormattedMessage id="asset.goods.total" /></span>
                    <span>{account}</span>
                    <div className={`${styles.zcR} ${styles.zcR2}`}>
                        <div />
                    </div>
                </div>
            </div>
            <div className={styles.line} />
            {/* 账户总览 */}
            <div className={styles.tab}>
                {
                    tab.map(obj => {
                        return (
                            <span
                                onClick={() => setValueTab(obj.value)}
                                key={obj.value}
                                className={valueTab === obj.value && styles.dashBoard || null}
                            >
                                {obj.label}
                            </span>
                        )
                    })
                }
            </div>
            <div className={styles.assetsTab}>
                {
                    assetsActive.map((obj) =>
                        <span
                            key={obj.value}
                            className={assetsTab === obj.value && styles.active || null}
                            onClick={() => setAssetsTab(obj.value)}
                        >
                            {obj.label}
                        </span>)
                }

            </div>
            <div className={styles.main}>
                {
                    product && product.map((obj, index) => {
                        return (
                            <div key={index} className={styles.project}>
                                <div style={{ flex: 1 }}>
                                    <div className={styles.p_img}>
                                        <img src={obj.metaData} />
                                    </div>
                                    <div className={styles.title}><FormattedMessage id="asset.goods.name" />： {obj.name}</div>
                                    <div className={styles.intro}><FormattedMessage id="asset.goods.note" />：{obj.desc}</div>
                                    <div className={styles.price}><FormattedMessage id="price" />：{obj.price}</div>

                                </div>
                                <div className={styles.detailBtn}>
                                    <FormattedMessage id="asset.goods.title" />
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
export default connect(({ assets, chainState }) => ({
    product: assets.product
}))(Component);