import { Images } from '@/constants';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import styles from './index.less';
import Nft from '@/api/nft'
import { Buffer } from 'buffer';
// var Web3 = require('web3');

// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
//     // set the provider you want from Web3.providers
//     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// }

const Component = props => {
    const intl = useIntl();

    const { } = props;

    const [account, setAccount] = useState(window.state && window.state.account) //账户余额
    const [address, setAddress] = useState(window.state && window.state.sender) //账户余额

    const [valueTab, setValueTab] = useState(1)
    const [assetsTab, setAssetsTab] = useState(1)
    const [product, setProduct] = useState([])
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
    function Uint8ToBase64(u8Arr) {
        var CHUNK_SIZE = 0x8000; //arbitrary number
        var index = 0;
        var length = u8Arr.length;
        var result = '';
        var slice;
        while (index < length) {
            slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
            result += String.fromCharCode.apply(null, slice);
            index += CHUNK_SIZE;
        }
        return btoa(result);
    }
    useEffect(() => {
        try {
            Nft.NFT_IdList().then(res => {
                // var b64 = Buffer.from('0x697066732e696f2f697066732f516d5256786438645244613262544433746d347465543758456453486f7a6f396e6131454773774c6d4674597055').toString('base64')
                // let a = Uint8ToBase64(res[0].metaData)
                // console.log(a);

                setProduct(res);
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
                        console.log(obj.metaData)
                        return (
                            <div key={index} className={styles.project}>
                                <div style={{ flex: 1 }}>
                                    <div className={styles.p_img}>
                                        <img src={obj.icon} />
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
export default connect(({ user, chainState }) => ({

}))(Component);