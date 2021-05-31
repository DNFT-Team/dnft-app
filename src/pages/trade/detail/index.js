import React from 'react'
import { Card, Button, message } from 'antd';
import styles from './index.less';
import { Images } from '@/constants'
import { history, useIntl, FormattedMessage } from 'umi';

// ethereum.networkVersion 1: 以太坊网络   56: bsc主网
import web3 from 'web3'
const yourAddress = '0x4803dfdb9Ff5Ce13908913001bCF6DbEb2cCB6Ad'
const value = '0x0' // 16进制表示的以太币数量，单位：wei

const Component = props => {
    const intl = useIntl();

    const { location } = props;
    const detail = location.state.detail || {};
    const handleBuy = async () => {
        console.log(window.BinanceChain, 'BinanceChain')
        try {
            if (typeof window.ethereum === 'undefined') {
                message.error('未安装MetaMask，无法获取以太坊账户地址');
            } else {
                if (ethereum.networkVersion !== '56') { // 56 bsc主网  1  eth主网
                    message.error('此应用程序需要BSC主网络，请在您的MetaMask UI中进行切换。');
                    return;
                }

                // const web3 = new web3('https://bsc-dataseed1.binance.org:443');
                // const loader = setupLoader({ provider: web3 }).web3;

                // const account1 = web3.eth.accounts.create();
                // console.log(account1);

                // return;
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0]
                sendEtherFrom(account, function (err, transaction) {
                    if (err) {
                        return alert(`交易失败!`)
                    }

                    alert('交易成功!')
                })
                function sendEtherFrom(account, callback) {

                    //在这里我们要使用底层API
                    const method = 'eth_sendTransaction'
                    const parameters = [{
                        from: account,
                        to: yourAddress,
                        value: value,
                        chainId: '1001', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.

                        //   gasPrice: web3.utils.toHex(22000)

                    }]
                    const from = account

                    //现在把所有数据整合为一个RPC请求
                    const payload = {
                        method: method,
                        params: parameters,
                        //   from: from,
                    }

                    //需要用户授权的方法，类似于这个，都会弹出一个对话框提醒用户交互
                    //其他方法，例如只是读取区块链的数据，可能就不会弹框提醒
                    window.ethereum.sendAsync(payload, function (err, response) {
                        const rejected = 'User denied transaction signature.'
                        if (response.error && response.error.message.includes(rejected)) {
                            console.log(response)
                            return alert(`We can't take your money without your permission.`)
                        }

                        if (err) {
                            return alert('There was an issue, please try again.')
                        }

                        if (response.result) {
                            //如果存在response.result，那么调用就是成功的
                            //在这种情况下，它就是交易哈希
                            const txHash = response.result
                            // alert('Thank you for your generosity!')

                            //你可以轮询区块链来查看交易何时被打包进区块
                            pollForCompletion(txHash, callback)
                        }
                    })
                }

                function pollForCompletion(txHash, callback) {
                    let calledBack = false

                    //正常情况下，以太坊区块大约15秒钟出一块
                    //这里我们每隔2秒钟轮询一次
                    const checkInterval = setInterval(function () {

                        const notYet = 'response has no error or result'
                        window.ethereum.sendAsync({
                            method: 'eth_getTransactionByHash',
                            params: [txHash],
                        }, function (err, response) {
                            if (calledBack) return
                            if (err || response.error) {
                                if (err.message.includes(notYet)) {
                                    return 'transaction is not yet mined'
                                }

                                callback(err || response.error)
                            }

                            //我们已经成功地验证了打包入块的交易
                            //提醒一下，我们应当在服务端使用我们的区块链连接进行验证
                            //在客户端做的话，就意味着我们信任用户的区块链连接
                            const transaction = response.result
                            clearInterval(checkInterval)
                            calledBack = true
                            callback(null, transaction)
                        })
                    }, 2000)
                }
            }
        } catch {
            message.error('There was an issue signing you in')
        }

    }
    return (
        <div className={styles.content}>
            <div className={styles.img}>
                <img src={detail.img} />
            </div>
            <div className={styles.right}>
                <div className={styles.title}><FormattedMessage id="name" />: {detail.title}</div>
                <div className={styles.notice}><FormattedMessage id="intro" />：{detail.des}</div>
                <div className={styles.hash}><FormattedMessage id="hash" />：wuwghdisauhiusahiugfpiqughdpasudiusahdiusagiudgasipudgisaudjsah</div>

                <div className={styles.link}><FormattedMessage id="related.links" />：<a href={'http://www.cvfqu.wam'} target='_blank'>www.cvfqu.wam</a></div>
                <div className={styles.price}>
                {detail.price}   BNB
                    <span />
                    <span>${detail.price_cny}</span>
                </div>
                <Button className={styles.btn} onClick={handleBuy} type='primary'><FormattedMessage id="buy" /></Button>
                <div className={styles.line} />
            </div>
        </div>
    )
}
export default Component;