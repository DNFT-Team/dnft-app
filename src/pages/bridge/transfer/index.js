import React, { useState, useEffect, useRef } from 'react';
import { css } from 'emotion';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Text, Input, InputGroup, Link, InputRightAddon,
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { Dialog, Button } from 'element-react';
import { toast } from 'react-toastify';
import helper from 'config/helper';
import Web3 from 'web3';
import { NERVE_BRIDGE, TOKEN_DNF, NERVE_WALLET_ADDR } from 'utils/contract';
import { toDecimal, WEB3_MAX_NUM } from 'utils/web3Tools';
import axios from 'http/default'
import globalConf from 'config'

import IconEth from 'images/networks/logo_select_eth.svg';
import IconBsc from 'images/networks/logo_select_bsc.svg';
import { Icon } from '@iconify/react';
import TradeTable from 'components/TradeTable';

/* Available network*/
const NetOptions = [
  {key: 'ETH', icon: IconEth, netId: '', isShow: true },
  {key: 'BSC', icon: IconBsc, netId: '', isShow: true }
]

/* Table cols*/
const TableCols = [
  {title: 'TX HASH', key: 'tx_hash', ellipsis: true, isLink: true},
  {title: 'AMOUNT', key: 'amount', isNum: true},
  {title: 'DYNAMIC INFO', key: 'dynamic_info'},
  {title: 'STATUS', key: 'status'},
  {title: 'FAILED CODE', key: 'failed_code'},
  {title: 'UPDATED AT', key: 'updated_at'},
]

const BridgeScreen = (props) => {
  const {location, address, chainType} = props;
  const payloads = location?.state?.param;
  if (!payloads) {
    let histroy = useHistory()
    histroy.goBack()
  }
  //  networks
  const frNet = 0
  const toNet = 1
  //  global loading
  const [loading, setLoading] = useState(false)
  const [isInjected, setIsInjected] = useState(false)
  const [transaction, setTransaction] = useState(null)
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

  useEffect(() => {
    // console.log('useEffect', address, chainType);
    if (chainType) {
      init()
    }
  }, [address, chainType]);
  const init = async () => {
    if (!isInjected) {await injectWallet()}
    return await checkSuit()
  }

  const goToRightNetwork = async (ethereum) => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x1',
          },
        ],
      })
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  };

  //  setUp wallet
  const injectWallet = async () => {
    try {
      let ethereum = window.ethereum;
      if (ethereum) {
        window.web3 = new Web3(ethereum);
        await ethereum.enable();
        setIsInjected(true)
      } else {
        toast.error('Please install wallet', {position: toast.POSITION.TOP_CENTER});
      }
    } catch (err) {
      toast.error(err, {position: toast.POSITION.TOP_CENTER});
    }
  }
  const checkSuit = async (step = 3) => {
    let res = {netOk: false, address: '', balance: 0, isApprove: false}
    if (chainType !== 'ETH') {
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
        const contract = new window.web3.eth.Contract(TOKEN_DNF.abi, TOKEN_DNF.tokenContract);
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
        const contract = new window.web3.eth.Contract(TOKEN_DNF.abi, TOKEN_DNF.tokenContract);
        const dnfAuth = await contract.methods['allowance'](chainSuit.address, NERVE_BRIDGE.tokenContract).call();
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
      const dnfContract = new window.web3.eth.Contract(TOKEN_DNF.abi, TOKEN_DNF.tokenContract);
      await dnfContract.methods['approve'](NERVE_BRIDGE.tokenContract, WEB3_MAX_NUM).send({ from: address });
    } catch (err) {
      console.error('approveDnfToNerve', err);
      if (err.code === 4001) {
        toast.error('You denied the approve', {position: toast.POSITION.TOP_CENTER});
      }
    }
  }
  const submitCross = async () => {
    if (amount <= 0) {
      toast.warning('Please Input active number.', {position: toast.POSITION.TOP_CENTER});
      return
    }
    if (amount < 5) {
      toast.warning('Quantity is at least 5.', {position: toast.POSITION.TOP_CENTER});
      return
    }

    setLoading(true)
    setTransaction(null)
    const chainSuit = await checkSuit(4)
    console.log('chainSuit', chainSuit);
    if (chainSuit.netOk && chainSuit.address) {
      if (chainSuit.balance < Number(amount)) {
        toast.warning('Your balance is not enough.', {position: toast.POSITION.TOP_CENTER});
        setLoading(false)
        return
      }
      if (!chainSuit.isApprove) {
        setLoading(false)
        setIsOpen(true)
      } else {
        const nerveContract = new window.web3.eth.Contract(NERVE_BRIDGE.abi, NERVE_BRIDGE.tokenContract)
        const gasNum = 210000, gasPrice = '20000000000';
        // transfer DNF token
        nerveContract.methods['crossOut'](
          NERVE_WALLET_ADDR,
          toDecimal(amount, true, 'ether', true),
          TOKEN_DNF.tokenContract
        ).send({
          from: chainSuit.address,
          gas: gasNum,
          gasPrice: gasPrice
        }, (err, hash) => {
          console.log('#nerveContract', err, hash);
          setLoading(false)
          if (err) {
            toast.error(err.message, {position: toast.POSITION.TOP_CENTER})
          } else {
            toast.success('Trade Packing Success', {position: toast.POSITION.TOP_CENTER})
            setTransaction({
              timestamp: Date.now(),
              account: address,
              amount, hash,
              from: 'ETH', to: 'BSC'
            })
            axios.post('/monitor', {
              amount,
              to_address: address,
              tx_hash: hash,
              chain_id: '9'
            }, {baseURL: globalConf.bridgeApi}).then(() => {
              toast.success('Cross Service has got your withdraw!', {position: toast.POSITION.TOP_CENTER})
            })
          }
        })
      }
    } else {
      setLoading(false)
    }
  }

  const getHistory = () => {
    let list = []
    axios.get(`/query?address=${address}`, {baseURL: globalConf.bridgeApi})
      .then((res) => {list = res.data.data})
      .finally(() => {
        setHistoryList(list)
        list.length <= 0 && toast('No record has been found yet')
      })
  }

  const renderShowSwitchModal = () => {
    console.log(isShowSwitchModal, 'isShowSwitchModal')
    return (
      <Dialog
        size="tiny"
        className={styleSwitchModal}
        visible={isShowSwitchModal}
        closeOnClickModal={false}
        closeOnPressEscape={false}
      >
        <Dialog.Body>
          <span>You’ve connected to unsupported networks, please switch to BSC network.</span>
        </Dialog.Body>
        <Dialog.Footer className="dialog-footer">
          <Button onClick={() => {
            let ethereum = window.ethereum;
            goToRightNetwork(ethereum);
          }}>Switch Network</Button>
        </Dialog.Footer>
      </Dialog>
    )
  }

  //  render Dom
  return <div className={styleWrapper}>
    <div>
      <span className={styleTitleH3}>Transfer ${payloads.target} from {payloads.from} to {payloads.to}</span>
      <div className={styleLinks}>
        <Link href={helper.bridge.youtube} isExternal color="#75819A"
          display="inline-block">
          <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.bridge.title}
        </Link>
        <Link href={helper.bridge.book} isExternal color="#75819A"
          display="inline-block" ml="1rem">
          <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#1d90e6'}} /> Learn How To Cross
        </Link>
      </div>
    </div>
    <h5>
      Choose
      <strong>“Single”</strong>
      if you want your collectible to be one of a kind or
      <strong>“Multiple”</strong>
      if you want to sell one collectible multiple times</h5>
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
            <img src={NetOptions[frNet].icon} alt='' />
            <span> ERC-20 ${payloads.target} </span>
          </InputRightAddon>
        </InputGroup>
        <p>Available balance : {balance} {payloads.target}</p>
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
            <img src={NetOptions[toNet].icon} alt='' />
            <span> BEP-20 ${payloads.target} </span>
          </InputRightAddon>
        </InputGroup>
        <p>By now, You will received 100% {payloads.target}</p>
      </div>
      <div>
        <button className={styleBtn} onClick={submitCross}>Confirm</button>
        <button className={styleBtn} onClick={getHistory}>History</button>
      </div>
    </div>
    <div>
      <h4>Transaction History</h4>
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
export default withRouter(connect(mapStateToProps)(BridgeScreen));

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
  &:first-child{
    margin-right: 1rem;
  }
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
    font-family: Archivo Black;
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
      font-family: Archivo Black;
      padding: 18px 24px;
    }
  }
`
