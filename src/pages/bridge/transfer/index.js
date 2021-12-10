/**
 * React Framework
 */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useHistory  } from 'react-router-dom';
import { connect } from 'react-redux';

/**
 * Plugins
 */
import { css } from 'emotion';
import axios from 'http/default'
import { shortenString } from 'utils/tools';

/**
 * Web3 Ref
 */
import Web3 from 'web3';
import {
  NERVE_BRIDGE, NERVE_WALLET_ADDR,
  TOKEN_DNF, bscTestTokenContact
} from 'utils/contract';
import {tokenAbi} from 'utils/abi';
import { toDecimal, WEB3_MAX_NUM } from 'utils/web3Tools';

/**
 * Components
 */
import {
  Text, Input, InputGroup, Link, InputRightAddon,
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { Dialog, Button } from 'element-react';
import { toast } from 'react-toastify';
import TradeTable from 'components/TradeTable';

/**
* Icon
*/
import { Icon } from '@iconify/react';
import IconEth from 'images/networks/logo_select_eth.svg';
import IconBsc from 'images/networks/logo_select_bsc.svg';

/**
 * Config state
 */
import helper from 'config/helper';
import globalConf from 'config';

/**
 * Chain Node
 */
const ChainNodes = {
  'eth': {
    key: 'ETH', protocol: 'ERC-20', icon: IconEth,
    exploreURL: 'https://etherscan.io',
    chain: {chainId: '0x1'}, nerveChainId: '9',
    abi: TOKEN_DNF.abi, address: TOKEN_DNF.tokenContract,
    heterogeneousChain: 'eth',
    nerveContract: '0x6758d4C4734Ac7811358395A8E0c3832BA6Ac624',
    title: 'Ethereum network'
  },
  'bsc': {
    key: 'BSC', protocol: 'BEP-20', icon: IconBsc,
    exploreURL: 'https://bscscan.com',
    chain: {
      chainId: '0x38',
      chainName: 'Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'bnb',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
    }, nerveChainId: '9',
    abi: tokenAbi, address: bscTestTokenContact.mainnet,
    heterogeneousChain: 'bnb',
    nerveContract: '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5',
    title: 'Binance Smart Chain'
  },
  'bnb': {
    key: 'BSC', protocol: 'BEP-20', icon: IconBsc,
    exploreURL: 'https://bscscan.com',
    chain: {
      chainId: '0x38',
      chainName: 'Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'bnb',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
    }, nerveChainId: '9',
    abi: tokenAbi, address: bscTestTokenContact.mainnet,
    heterogeneousChain: 'bnb',
    nerveContract: '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5'
  }
}

const getQueryString = (url, name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = url.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

const gasLimit = 3000000;

/**
 * The View of Bridge Transfer
 * @description BSC, ETH......
 */
const TransferView = (props) => {
  const TargetToken = 'DNFT'  //  The target token asset
  const {location, address, chainType} = props;
  const fr = getQueryString(location?.search, 'fr')
  const to = getQueryString(location?.search, 'to')
  if (!fr || !to || fr === to || !ChainNodes[fr] || !ChainNodes[to]) {
    useHistory().push('/bridge')
  }
  const nerveContractAddress = ChainNodes[fr].nerveContract

  /**
   * Table cols
   */
  const TableCols = [
    {title: 'FROM', key: 'upChain', cell: (row) => (
      <img src={row?.upChain === 'bnb' ? IconBsc : IconEth} alt='' className={tableIcon}/>
    )},
    {title: 'TO', key: 'heterogeneousChain', cell: (row) => (
      <img src={row?.heterogeneousChain === 'bnb' ? IconBsc : IconEth} alt='' className={tableIcon}/>
    )},
    {title: 'AMOUNT', key: 'amount', isNum: true},
    {title: 'TX HASH', key: 'tx_hash', ellipsis: true, cell: (row) => ChainNodes?.[row.upChain]?.exploreURL &&
          <a href={`${ChainNodes[row.upChain].exploreURL}/tx/${row.tx_hash}`}
            target='_blank' rel="noopener noreferrer" className={tableLink}>{shortenString(row.tx_hash)}</a>
    },
    {title: 'FEE HASH', key: 'fee_hash', ellipsis: true, cell: (row) => {
      const base = ChainNodes?.[row.upChain]?.exploreURL
      if (!base) {return null}
      if (!row.fee_hash) {
        return row.status === 'failed'
          ? null
          : <button onClick={() => {sendWithdrawFee(row.tx_hash)}} className={styleBtnIcon}>Send Fee</button>
      }
      return <a href={`${base}/tx/${row.fee_hash}`}
        target='_blank' rel="noopener noreferrer" className={tableLink}>{shortenString(row.fee_hash)}</a>
    }
    },
    {title: 'STATUS', key: 'status'},
    // {title: 'DYNAMIC INFO', key: 'dynamic_info'},
    // {title: 'FAILED CODE', key: 'failed_code'},
    {title: 'UPDATED AT', key: 'updated_at'},
  ]
  //  networks
  const frNet = ChainNodes[fr]
  const toNet = ChainNodes[to]
  //  global loading
  const [tableLoad, setTableLoad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isInjected, setIsInjected] = useState(false)
  //  form - input
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  //  drawer bottom
  const [historyList, setHistoryList] = useState([])
  //  alert pop-up
  const [isOpen, setIsOpen] = useState(false)
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef()
  //  initial check
  useEffect(() => {
    // console.log('useEffect', address, chainType);
    chainType && init()
  }, [address, chainType]);
  const init = async () => {
    !isInjected && await injectWallet()
    getHistory()
    return await checkSuit()
  }
  //  setUp wallet
  const injectWallet = async () => {
    try {
      let ethereum = window.ethereum;
      if (ethereum) {
        window.web3 = new Web3(ethereum);
        await ethereum.enable();
        setIsInjected(true)
      } else {
        toast.error('Please install wallet');
      }
    } catch (err) {
      toast.error(err);
    }
  }
  const checkSuit = async (step = 3) => {
    let res = {netOk: false, address: '', balance: 0, isApprove: false}
    if (chainType !== frNet.key) {
      setIsShowSwitchModal(true)
      res.netOk = false
      setBalance(0)
    } else {
      res.netOk = true
      step >= 2 && (res.address = address)
      step >= 3 && (res.balance = await getDnfBalance())
      step >= 4 && (res.isApprove = await getIsApprove(res))
    }
    return res
  }
  //  get basic info
  const getDnfBalance = async () => {
    let balance = 0
    try {
      if (address) {
        const contract = new window.web3.eth.Contract(frNet.abi, frNet.address);
        const dnfBalance = await contract.methods['balanceOf'](address).call();
        balance = Number(toDecimal(dnfBalance))
        console.info('===>DNF-Balance', balance, dnfBalance);
      }
    } catch (err) {
      console.error(err);
      balance = 0
    }
    setBalance(balance)
    return balance
  }
  const getIsApprove = async (chainSuit) => {
    try {
      if (chainSuit.netOk && chainSuit.address) {
        const contract = new window.web3.eth.Contract(frNet.abi, frNet.address);
        const dnfAuth = await contract.methods['allowance'](chainSuit.address, nerveContractAddress).call();
        console.log('dnfAuth', dnfAuth);
        return Number(dnfAuth) > 0
      } else {
        return false
      }
    } catch {
      return false
    }
  }
  //  mutations
  const approveDnfToNerve = async () => {
    onClose()
    try {
      const dnfContract = new window.web3.eth.Contract(frNet.abi, frNet.address);
      await dnfContract.methods['approve'](nerveContractAddress, WEB3_MAX_NUM).send({ from: address, gasLimit });
    } catch (err) {
      console.error('approveDnfToNerve', err);
      err.code === 4001 && toast.error('You denied the approve');
    }
  }
  const submitCross = async () => {
    if (amount <= 0) {
      toast.warning('Please Input active number.');
      return
    }
    // if (amount < 5) {
    //   toast.warning('Quantity is at least 5.');
    //   return
    // }

    setLoading(true)
    const chainSuit = await checkSuit(4)
    console.log('chainSuit', chainSuit);
    if (chainSuit.netOk && chainSuit.address) {
      if (chainSuit.balance < Number(amount)) {
        toast.warning('Your balance is not enough.');
        setLoading(false)
        return
      }
      if (!chainSuit.isApprove) {
        setLoading(false)
        setIsOpen(true)
      } else {
        const nerveContract = new window.web3.eth.Contract(NERVE_BRIDGE.abi, nerveContractAddress)
        const isEth = to === 'eth';
        // transfer DNF token
        nerveContract.methods['crossOut'](
          NERVE_WALLET_ADDR,
          toDecimal(amount, true, 'ether', true),
          frNet.address
        ).send({
          from: chainSuit.address,
          gasLimit
        }, (err, hash) => {
          console.log('#nerveContract', err, hash);
          setLoading(false)
          if (err) {
            toast.error(err.message)
          } else {
            toast.success('Cross out success.')
            const param = {
              amount: Number(amount), // 提现数额
              to_address: address, // 提现地址
              tx_hash: hash, // 交易哈希
              fee_hash: isEth ? '' : hash, // 手续费哈希
              chain_id: toNet.nerveChainId, // nerve桥链id[主网9，测试网5],表示跨链服务使用主网还是测试网
              upChain: frNet.heterogeneousChain, // 跨链发起方链名称['eth','bnb','ht','okt']
              heterogeneousChain: toNet.heterogeneousChain  // 跨链接收方（DNF异构链）名称['eth','bnb','ht','okt']
            }
            axios
              .post('/monitor', param, {baseURL: globalConf.bridgeApi})
              .then(() => {
                if (isEth) {
                  toast.success('Step2.Transfer withdraw fee.')
                  sendWithdrawFee(hash)
                } else {
                  toast.success('Please wait for the withdraw.')
                }
              })
              .finally(getHistory)
          }
        })
      }
    } else {
      setLoading(false)
    }
  }
  const sendWithdrawFee = async (tx_hash) => {
    if (!tx_hash) {return null}
    try {
      const BLACK_HOLE_ADDRESS = '0x67E0a20E82815DEae3e200d73de6883A6CBeeC78'
      // const FEE_AMOUNT = toDecimal('1000', true, 'ether', true)
      const FEE_AMOUNT = toDecimal('1', true, 'ether', true)
      const dnfContract = new window.web3.eth.Contract(frNet.abi, frNet.address);
      dnfContract.methods['transfer'](BLACK_HOLE_ADDRESS, FEE_AMOUNT)
        .send({ from: address }, (err, fee_hash) => {
          if (err) {
            toast.error(err.message)
          } else {
            axios.post('/monitor/update', {
              tx_hash,
              fee_hash, // 手续费哈希
            }, {baseURL: globalConf.bridgeApi})
              .then(() => {
                toast.success('Withdraw fee sent.')
              })
              .finally(getHistory)
          }
        });
    } catch (err) {
      toast.error(err.message)
    }
  }
  //  get history list
  const getHistory = () => {
    if (tableLoad) {return}
    setTableLoad(true)
    let list = []
    axios.get(`/query?address=${address}&upChain=${fr === 'bsc' ? 'bnb' : 'eth'}`, {baseURL: globalConf.bridgeApi})
      .then((res) => {list = res.data.data})
      .finally(() => {
        setHistoryList(list)
        list.length <= 0 && toast('No record has been found yet!')
      })
      .catch(() => {
        setHistoryList([])
      })
      .finally(() => {setTableLoad(false)})
  }

  /**
   * @description switch network
   */
  const goToRightNetwork = async (ethereum) => {
    try {
      if (frNet.key === 'ETH') {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [frNet.chain],
        })
      } else {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [frNet.chain],
        })
      }
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  };
  const renderShowSwitchModal = () =>
    // console.log(isShowSwitchModal, 'isShowSwitchModal')
    (
      <Dialog
        size="tiny"
        className={styleSwitchModal}
        visible={isShowSwitchModal}
        closeOnClickModal={false}
        closeOnPressEscape={false}
      >
        <Dialog.Body>
          <span>You’ve connected to unsupported networks, please switch to {frNet.key} network.</span>
        </Dialog.Body>
        <Dialog.Footer className="dialog-footer">
          <Button onClick={() => {
            let ethereum = window.ethereum;
            goToRightNetwork(ethereum);
          }}>Switch Network</Button>
        </Dialog.Footer>
      </Dialog>
    )
  //  render Dom
  return <div className={styleWrapper}>
    <div>
      <span className={styleTitleH3}>Transfer ${TargetToken} from {frNet.key} to {toNet.key}</span>
      <div className={styleLinks}>
        <Link href={helper.bridge.youtube} isExternal color="#0057D9" fontStyle="italic"
          display="inline-block">
          <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.bridge.title}
        </Link>
        <Link href={helper.bridge.book} isExternal color="#0057D9" fontStyle="italic"
          display="inline-block" ml="1rem">
          <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#1d90e6'}} /> Learn How To Cross
        </Link>
      </div>
    </div>
    <h5>
      Bridge your $DNF from {ChainNodes[fr]?.title} to {ChainNodes[to]?.title}
    </h5>
    <div className={styleTransferBox}>
      <div className={styleFormItem}>
        <label>Send</label>
        <InputGroup my="10px">
          <Input
            className={styleInput}
            is-full-width="true"
            focusBorderColor="#00398D"
            placeholder="Amount"
            autoFocus
            isInvalid={amount < 0}
            type="number"
            _hover={{borderColor: 'inherit'}}
            value={amount}  onChange={(v) => {
              const val = v.target.value
              setAmount(val < 0 ? 0 : val)
            }}
          />
          <InputRightAddon className={styleRight}>
            <img src={frNet.icon} alt='' />
            <span> {frNet.protocol} ${TargetToken} </span>
          </InputRightAddon>
        </InputGroup>
        <p>Available balance : {balance} {TargetToken}</p>
      </div>
      <div className={styleFormItem}>
        <label>For</label>
        <InputGroup my="10px">
          <Input
            className={styleInput}
            is-full-width="true"
            focusBorderColor="#00398D"
            placeholder="Received"
            isDisabled
            _hover={{borderColor: 'inherit'}}
            value={amount}
          />
          <InputRightAddon className={styleRight}>
            <img src={toNet.icon} alt='' />
            <span> {toNet.protocol} ${TargetToken} </span>
          </InputRightAddon>
        </InputGroup>
        {
          to === 'eth'
            ? <p>Fees 1000 {TargetToken}</p>
            : <p>By now, You will received 100% {TargetToken}</p>
        }
      </div>
      <div>
        <button className={styleBtn} onClick={submitCross}>Confirm</button>
      </div>
    </div>
    <div>
      <h4>
        Transaction History
        <button className={styleBtnIcon} onClick={getHistory}>
          <Icon icon="zmdi:refresh" className={tableLoad && spinIcon}/>
        </button>
      </h4>
      <TradeTable cols={TableCols} data={historyList}/>
    </div>
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent w="max-content" borderRadius="10px">
          <AlertDialogBody p="2.5rem 2rem" textAlign="center" justifyContent="center">
            <h6 className={styleTitle}>Approve first!</h6>
            <Text
              color="brand.100"  my="2.14rem"
              fontSize="1rem" lineHeight="1.43rem"
            >You may need to approve first!</Text>
            <button style={{margin: '0 auto'}} className={styleBtn} onClick={approveDnfToNerve} >OK</button>
            <Text
              color="brand.100" mt="2.14rem" cursor="pointer"
              fontSize="1rem" lineHeight="1.43rem"
              _hover={{textDecoration: 'underline'}}
              onClick={onClose}
            >Skip for now</Text>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
    {renderShowSwitchModal()}
  </div>
}
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType
});
export default withRouter(connect(mapStateToProps)(TransferView));

/**
 * Emotion css
 * */
const styleWrapper = css`
  position: relative;
  padding: 30px 50px;
  h4{
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 16px;
    color: #000000;
  }
  h5 {
    margin: 21px 0 40px 0;
    font-family: Helvetica, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #777E91;
    strong{
      color: rgba(35, 38, 47, 1);
    }
  }
`
const styleBtnIcon = css`
  user-select: none;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  margin-left: 16px;

  background: #0057D9;
  border-radius: 10px;
  text-align: center;
  font-family: Archivo Black, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;

  color: #FCFCFD;
  svg{
    height: 24px;
    width: 24px;
    color: #FCFCFD;
  }
  @keyframes spin{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(180deg);
    }
  }
`
const spinIcon = css`
  animation: spin infinite ease-in-out 1s;
`
const styleBtn = css`
  user-select: none;
  display: inline-flex;
  min-width: 177.37px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  box-sizing: border-box;


  background: #0057D9;
  border-radius: 10px;

  font-family: Archivo Black, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  text-align: center;

  color: #FCFCFD;
`
const styleTransferBox = css`
  background: #FFFFFF;
  border-radius: 10px;
  padding: 40px;

`
const styleFormItem = css`
  max-width: 867.43px;
  margin-bottom: 50px;
  label{
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 16px;
    display: flex;
    align-items: center;
    color: #000000;
  }
  p{
    margin: 0;
    font-family: Helvetica,sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    /* identical to box height, or 171% */

    display: flex;
    align-items: center;

    color: #8F9BBA;
  }
`
const styleInput = css`
  border: 2px solid #E6E8EC;
  box-sizing: border-box;
  border-radius: 10px;
  height: 50px !important;
  
  font-family: Poppins,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height, or 120% */

  display: flex;
  align-items: center;

  color: #1B2559;
`
const styleRight = css`
  background: #F2F2F2;
  border-radius: 10px;
  box-sizing: border-box;
  height: 50px !important;
  img{
    height: 90%;
    margin-right: .6rem;
  }
  span{
    font-family: Helvetica,sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1rem;
    /* identical to box height, or 70% */

    letter-spacing: -0.02em;

    color: #1B2559;
  }
`
const styleTitle = css`
  font-family: Archivo Black,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  color: #000000;
  margin: 0;
`
const styleTitleH3 = css`
  margin-right: 1.8rem;
  font-family: Archivo Black, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.02em;
  color: #23262F;
`
const styleLinks = css`
  margin-left: .6rem;
  margin-top: .6rem;
  font-weight: normal;
  font-size: .8rem;
  display: inline-block;
  color: #75819A;
`
const styleSwitchModal = css`
  @media (max-width: 900px) {
    width: calc(100% - 32px);
  }
  border-radius: 10px;
  width: 400px;
  padding: 40px 30px 30px 30px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    font-family: Archivo Black,sans-serif;
    color: #000000;
    font-size: 18px;
    line-height: 30px;
    span {
      display: flex;
      text-align: center;
    }
  }
  .dialog-footer {
    padding: 0;
    text-align: center;
    margin-top: 16px;
    button {
      background: rgba(0, 87, 217, 1);
      color: #FCFCFD;
      font-size: 16px;
      border-radius: 10px;
      font-family: Archivo Black,sans-serif;
      padding: 18px 24px;
    }
  }
`
const tableLink = css`
  color: #0057D9;
  font-style: italic;
`
const tableIcon = css`
  height: 40px;
  width: 40px;
`
