import React, { useState,useEffect } from 'react';
import Web3 from "web3";
import styles from './index.less';
import { Tooltip, Layout,Dialog,Steps,Alert } from 'element-react';
import { toast } from 'react-toastify';
import trans from 'images/bridge/trans.png';
import dnft from 'images/bridge/nft.png';
import selIconRight from 'images/bridge/sel.png';
import i3 from 'images/bridge/icon3.png'
import i4 from 'images/bridge/icon4.png'
import i5 from 'images/bridge/icon5.png'

import { TOKEN_DNF, NERVE_BRIDGE  } from '../../utils/contract.js'
import {NERVE_WALLET_ADDR,NERVE_WALLET_PRI} from '../../config/priConfig'
import {WEB3_MAX_NUM,toDecimal} from '../../utils/web3Tools'
import {withdrawalTest, getWithdrawalFee, broadcastTx, validateTx, getNulsBalance} from '../../api/nerve'

const crossAll = [
    {
        key: 'eth',
        icon: i5,
        name: 'ETH',
        desc: 'Ethereum'
    },
    {
        key: 'bsc',
        icon: i4,
        name: 'BSC',
        desc: 'Bsc'
    },
    // {
    //     key: 'heco',
    //     icon: i3,
    //     name: 'HECO',
    //     desc: 'Heco'
    // }
]
const emptyChain = {
    key: '',
    icon: null,
    name: '',
    desc: ''
}

const AssetsScreen = props => {
    const [loading, setLoading] = useState(false)
    const [crossStep, setCrossStep] = useState(0)
    const [visible, setVisible] = useState(false)
    const handleShowSel  = (flag) => {
        setVisible(!flag)
    }
    //  nerve-bridge-cross
    const [frIcon, setFrIcon] = useState(crossAll[0]);
    const [toIcon, setToIcon] = useState({...emptyChain});
    const [fromAddr, setFromAddr] = useState("");
    const [toAddr, setToAddr] = useState("");
    const [availableMount, setAvailableMount] = useState(0);
    const [inputAmount, setInputAmount] = useState(0);
    const [isApprove, setIsApprove] = useState(false);

    const handleCrossFr = async (addr,item)=>{
        setFrIcon(item||crossAll[0])
        setToIcon({...emptyChain})
        setToAddr('')
        setInputAmount(0)
        setFromAddr(addr||'')
        setAvailableMount(await getBalance(addr))
        setIsApprove(await getIsApprove(addr))
    }
    const handleCrossTo = async (item) => {
        setToIcon(item)
        setToAddr(item.key?fromAddr:'')
        setVisible(false)
        setInputAmount(0)
        setAvailableMount(await getBalance(fromAddr))
        setIsApprove(await getIsApprove(fromAddr))
    }

    useEffect(async () => {
        await injectWallet();
      }, []);
    //  get metaMask connect
    const injectWallet = async ()=>{
        let ethereum = window.ethereum;
        if(ethereum){
            //监听账号切换
            ethereum.on('networkChanged', (networkIDstring)=> {
                toast.dark(`NetworkChanged:${networkIDstring}`,{position:toast.POSITION.TOP_CENTER});
                handleCrossFr(fromAddr,null)
            })
            //监听账号切换
            ethereum.on('accountsChanged', (accounts)=> {
                toast.dark('AccountsChanged',{position:toast.POSITION.TOP_CENTER});
                handleCrossFr(accounts[0],null)
            })
            window.web3 = new Web3(ethereum);
            let accounts = await ethereum.enable();
            await handleCrossFr(accounts[0],null)
        }else {
            alert('Please install wallet')
        }
    }
    const getBalance = async (addr)=>{
        let balance = 0
        try {
            if(addr){
                const contract = new window.web3.eth.Contract(
                    TOKEN_DNF.abi,
                    TOKEN_DNF.tokenContract
                );
                const dnfBalance = await contract.methods['balanceOf'](addr).call();
                console.log('dnfBalance',dnfBalance);
                balance = toDecimal(dnfBalance)
            }
        }catch(err) {
            console.log(err);
            balance = 0
        }
        return balance
    }
    const getIsApprove = async (addr) =>{
        let apr = false
        try {
            if(addr){
                const contract = new window.web3.eth.Contract(
                    TOKEN_DNF.abi,
                    TOKEN_DNF.tokenContract
                );
                const dnfAuth = await contract.methods['allowance'](addr,NERVE_BRIDGE.tokenContract).call();
                console.log('dnfAuth',dnfAuth);
                apr = Number(dnfAuth)>0
            }
        }catch {
            apr = false
        }
        return apr
    }
    const approveDnfToNerve = async ()=>{
        try {
            const theApprove = await getIsApprove()
            setIsApprove(theApprove)
            if(!theApprove){
                const dnfContract = new window.web3.eth.Contract(
                    TOKEN_DNF.abi,
                    TOKEN_DNF.tokenContract
                );
                await dnfContract.methods['approve'](
                    NERVE_BRIDGE.tokenContract,
                    WEB3_MAX_NUM
                ).send({ from: fromAddr });
            }
        }catch(err) {
            console.log('approveDnfToNerve',err);   //code:4001-user denied action
            setIsApprove(false)
        }
    }
    const submitCross = async ()=>{
        try {
            setLoading(false)
            setCrossStep(0)
            if(!toAddr||!toIcon.key){
                toast.warn('Please select destination chain',{position:toast.POSITION.TOP_CENTER});
                return
            }
            if(inputAmount<=0){
                toast.warn('Amount can\'t be zero',{position:toast.POSITION.TOP_CENTER});
                return
            }
            const availableMount = await getBalance(fromAddr)
            if(availableMount<=0){
                toast.error('You have no dnf yet',{position:toast.POSITION.TOP_CENTER});
                return
            }
            const theApprove = await getIsApprove(fromAddr)
            if(!theApprove){
                toast.error('You have not approved yet',{position:toast.POSITION.TOP_CENTER});
                return
            }
            setLoading(true)
            const nerveContract = new window.web3.eth.Contract(
                NERVE_BRIDGE.abi,
                NERVE_BRIDGE.tokenContract
            )
            const gasNum = 210000, gasPrice = '20000000000';
            // transfer DNF token
            nerveContract.methods['crossOut'](
                NERVE_WALLET_ADDR,
                toDecimal(inputAmount,true,'ether',true),
                TOKEN_DNF.tokenContract
            ).send({
                from: fromAddr,
                gas: gasNum,
                gasPrice: gasPrice
            }).then(receipt=>{
                console.log(receipt);
                toast.success('Step1 Ok',{position:toast.POSITION.TOP_CENTER})
                setCrossStep(1)
                balanceCycle()
            }).catch(err=>{
                toast.error(err.message,{position:toast.POSITION.TOP_CENTER})
                setLoading(false)
            })
        }catch (e) {
            toast.error(e.message,{position:toast.POSITION.TOP_CENTER})
            setLoading(false)
        }
    }
    const nerveTakeOut = async ()=>{
        // 提现异构链网络ID(ETH:101, BSC:102, HECO:103, OKT:104)
        const heterogeneousChainId = 102;
        // 提现手续费(NVT) | 'bnb','eth','ht','ok'
        let withdrawalFeeOfNVT = await getWithdrawalFee('bnb');

        const txhex = await withdrawalTest(
            // 提现账户信息
            NERVE_WALLET_PRI,
            NERVE_WALLET_ADDR,
            // 提现接收地址
            toAddr,
            // 提现异构链网络ID
            heterogeneousChainId,
            // 提现资产信息
            9,
            107,
            // 提现金额
            0.1,
            // 提现资产小数位
            18,
            // 提现手续费(NVT)
            withdrawalFeeOfNVT,
            //  备注
            'withdrawal transaction from DNFT'
        )
        const result = await validateTx(txhex);
        if (result.success) {
            console.log(result.data.value);
            let results = await broadcastTx(txhex);
            if (results && results.value) {
                setCrossStep(2)
                setTimeout(()=>{
                    toast.success('Cross Success',{position:toast.POSITION.TOP_CENTER});
                    setLoading(false)
                },800)
            } else {
                toast.error(`Cross Failed:${JSON.stringify(results)}`,{position:toast.POSITION.TOP_CENTER});
                setLoading(false)
            }
        } else {
            toast.error(`Verify Failed:${JSON.stringify(result.error)}`,{position:toast.POSITION.TOP_CENTER});
            setLoading(false)
        }
    }
    const balanceCycle = async()=>{
        let withdrawalBalance = await getNulsBalance(NERVE_WALLET_ADDR, 9, 107);
        console.log('balanceCycle',withdrawalBalance);
        if(withdrawalBalance.success){
            const balance = toDecimal(withdrawalBalance.data.balance)
            if(balance>=inputAmount && inputAmount>0){
                await nerveTakeOut()
            }else {
                setTimeout(()=>{
                    balanceCycle()
                },20 * 1_000)
            }
        }
    }
    //  utils
    const simplyAddr = (addr)=>{
        if(!addr) return 'Address'
        return addr.slice(0,6)+'...'+addr.substr(-6)
    }
    //  render Dom
    return (
        <div className={styles.main}>
            <div className={styles.mainTop}>
                <div className={styles.box}>
                    <div className={styles.bridge}>
                        <img className={styles.dnftImg} src={dnft} alt="DNFT"/>
                        <span>DNF Bridge</span>
                    </div>
                    <div className={styles.proTitle}>Network</div>
                    <Layout.Row gutter="10" className={styles.trans}>
                        <Layout.Col span="4" className={styles.fixFrom}>
                            <div className={styles.transContent}>
                                <img className={styles.ethIcon} src={frIcon.icon} alt="icon"/>
                                <div className={styles.ethText}>
                                    <span className={styles.ethTitle}>{frIcon.name}</span>
                                    <span className={styles.ethDesc}>{frIcon.desc}</span>
                                </div>
                            </div>
                        </Layout.Col>
                        <Layout.Col span="6">
                            <Tooltip disabled={!fromAddr} content={fromAddr} placement="bottom" effect="dark">
                                <span className={styles.swapAddress}>{simplyAddr(fromAddr)}</span>
                            </Tooltip>
                        </Layout.Col>
                        <Layout.Col span="4">
                            <img className={styles.transImg} src={trans} alt="switch"/>
                        </Layout.Col>
                        <Layout.Col span="6">
                            <Tooltip disabled={!toAddr} content={toAddr} placement="bottom" effect="dark">
                                <span className={styles.swapAddress}>{simplyAddr(toAddr)}</span>
                            </Tooltip>
                        </Layout.Col>
                        <Layout.Col span="4">
                            <div className={styles.select}>
                                <div className={styles.selAll}>
                                    <div className={styles.transRight} onClick={()=>{handleShowSel(visible)}}>

                                        {
                                            toIcon && toIcon.icon ?
                                                (<div className={styles.transContent}>
                                                    <img className={styles.selIcon1} src={toIcon.icon} />
                                                    <div className={styles.ethText}>
                                                        <span className={styles.dTitle}>{toIcon.name}</span>
                                                        <span className={styles.ethDesc}>{toIcon.desc}</span>
                                                    </div>
                                                </div>) : ''
                                        }
                                        <img className={styles.selIcon2} src={selIconRight} />
                                    </div>
                                    <ul className={styles.dropdown} style={{display: visible && 'block' || 'none'}}>
                                        <div className={styles.borderBlue}></div>
                                        {
                                            crossAll.map((item) => {
                                                if(item.key===frIcon.key) return ''
                                                return (
                                                    <li key={item.key} onClick={()=>handleCrossTo(item)} className={styles.dropLi}>
                                                        <div className={styles.dorpLiLeft}>
                                                            <img className={styles.selIcon3} src={item.icon} />
                                                            <span className={styles.dropdownText}>{item.name}</span>
                                                        </div>
                                                        {
                                                            item.key===toIcon.key && <div  className={styles.selDrop}><span /></div>
                                                        }

                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>

                                </div>
                            </div>
                        </Layout.Col>
                    </Layout.Row>
                    <div className={styles.proTitle}>Amount</div>
                    <div className={styles.amountInput}>
                        <span className={styles.available}>Available: {availableMount}</span>
                        <div className={styles.assetInpAll}>
                            <input type='number' onChange={(e)=>{setInputAmount(e.target.value)}} placeholder={'Quantity of DNF transferred'} className={styles.assetInput} value={inputAmount}/>
                            <div className={styles.prepend}>DNF</div>
                        </div>
                    </div>
                    {
                        isApprove ? (
                            <div className={styles.confirm} onClick={submitCross}>Confirm</div>
                        ) : (
                            <div className={styles.confirm} onClick={approveDnfToNerve}>Approve</div>
                        )
                    }
                    <Dialog
                        title="Cross Process"
                        closeOnPressEscape={false}
                        closeOnClickModal={false}
                        visible={loading}
                        onCancel={()=>{
                            setLoading(false)
                        }}
                    >
                        <Dialog.Body>
                            <Alert className={styles.corsAlerts} type="error" title="Warn" description="The transaction is in progress, please do not leave this page!" closable={false} />
                            <Alert className={styles.corsAlerts} type="warning" title="Info" description="If you have any questions, please contact the administrator in time." closable={false} />
                            <Alert className={styles.corsAlerts} type="success" title="Tips" description="Increasing fuel can speed up transactions." closable={false} />
                            <div className={styles.loading}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <Steps active={crossStep} finishStatus="success">
                                <Steps.Step title="Step1" description="Swap DNF to Nerve Contract" />
                                <Steps.Step title="Step2" description="Take DNF from Nerve Bridge" />
                            </Steps>
                        </Dialog.Body>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
export default AssetsScreen;
