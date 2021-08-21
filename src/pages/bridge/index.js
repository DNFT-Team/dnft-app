import React, { useState, useEffect } from 'react';
import {Icon} from '@iconify/react';
import {
  Grid, GridItem, Box, HStack,
  Heading, Text, Button,
  Input, InputGroup,
  InputLeftElement, InputRightAddon
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Web3 from 'web3';
import {NERVE_BRIDGE, TOKEN_DNF} from '../../utils/contract';
import {NERVE_WALLET_ADDR} from '../../config/priConfig';
import {toDecimal, WEB3_MAX_NUM} from '../../utils/web3Tools';
import { curveArrow, combineArrow } from '../../utils/svg';
import styles from './index.less';
import bgWindow from '../../images/bridge/bg_window.png';
import IconEth from '../../images/networks/eth.png';
import IconBsc from '../../images/networks/bsc.png';
import IconHeco from '../../images/networks/heco.png';

/* Available network*/
const NetOptions = [
  {key: 'ETH', icon: IconEth, netId: '', isShow: true },
  {key: 'BSC', icon: IconBsc, netId: '', isShow: true },
  {key: 'HECO', icon: IconHeco, netId: '', isShow: false },
  {key: 'POLKA', icon: IconEth, netId: '', isShow: false }
]

/**
 * @description Bridge Screen
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const BridgeScreen = (props) => {
  //  global loading
  const [loading, setLoading] = useState(false)
  //  networks
  const [frNet, setFrNet] = useState(0)
  const [toNet, setToNet] = useState(1)
  //  form - input
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(5)

  useEffect(async () => {
    //  do something here
    await injectWallet();
    await checkSuit()
  }, []);
  //  setUp wallet
  const injectWallet = async () => {
    try {
      let ethereum = window.ethereum;
      if (ethereum) {
        window.web3 = new Web3(ethereum);
        await ethereum.enable();
      } else {
        toast.error('Please install wallet', {position: toast.POSITION.TOP_CENTER});
      }
    } catch (err) {
      toast.error(err, {position: toast.POSITION.TOP_CENTER});
    }
  }
  const checkSuit = async (step = 3) => {
    let res = {netOk: false, address: '', balance: 0, isApprove: false}
    res.netOk = await checkNetWork()
    step >= 2 && (res.address = await getAccount())
    step >= 3 && (res.balance = await getDnfBalance(res.address))
    step >= 4 && (res.isApprove = await getIsApprove(res))
    return res
  }
  //  get basic info
  const checkNetWork = async () => {
    let ethereum = window.ethereum
    // console.log('networkVersion', ethereum.networkVersion);
    if (1 === Number(ethereum.networkVersion)) {
      return true;
    } else {
      toast.warning('Please connect ETH-NET', {position: toast.POSITION.TOP_CENTER});
      return false
    }
  }
  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0]
    } catch {
      return ''
    }
  }
  const getDnfBalance = async (address) => {
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
  const approveDnfToNerve = async (address) => {
    try {
      const dnfContract = new window.web3.eth.Contract(TOKEN_DNF.abi, TOKEN_DNF.tokenContract);
      await dnfContract.methods['approve'](NERVE_BRIDGE.tokenContract, WEB3_MAX_NUM).send({ from: address });
    } catch (err) {
      console.log('approveDnfToNerve', err);   // code:4001-user denied action
    }
  }
  const submitCross = async () => {
    if (amount <= 0) {
      toast.warning('Please Input active number.', {position: toast.POSITION.TOP_CENTER});
      return
    }
    setLoading(true)
    const chainSuit = await checkSuit()
    if (chainSuit.netOk && chainSuit.address) {
      if (chainSuit.balance < Number(amount)) {
        toast.warning('Your balance is not enough.', {position: toast.POSITION.TOP_CENTER});
        setLoading(false)
        return
      }
      if (chainSuit.isApprove) {
        // call approve
        await approveDnfToNerve(chainSuit.address)
        setLoading(false)
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
        })
          .then((receipt) => {
            console.info('===>receipt', receipt);
            toast.success('Trade Write Success', {position: toast.POSITION.TOP_CENTER})
          })
          .catch((err) => {
            toast.error(err.message, {position: toast.POSITION.TOP_CENTER})
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } else {
      setLoading(false)
    }
  }
  const skipHistory = () => {
    toast('This page is coming soon', {position: toast.POSITION.TOP_CENTER});
  }
  //  render Dom
  return (
    <div className="d-fullWidth">
      <div className={styles.main}>
        <Grid
          gap={4}
          height="max-content"
          bg="brand.900"
          templateColumns="repeat(10, 1fr)"
        >
          {(

            /* Banner Left/Top */
            <GridItem colSpan={[10, 10, 10, 5, 4]} p={['1.785rem', '1.785rem', '1.785rem', '2rem', '3.785rem']} color="white">
              <Heading as="h4" className={styles.title}>Bridge</Heading>
              <Text color="brand.100" className={styles.subTitle} lineHeight="2rem">
                Swift, easy and reliable solution to cross your DNF over chains
              </Text>
              <Grid
                gap={4}
                templateColumns="repeat(5, 1fr)"
              >
                <GridItem colSpan={2}>
                  <div className={styles.winDL}>
                    <img src={bgWindow} alt=""/>
                    <div className={styles.winArrow}>{curveArrow('1')}</div>
                  </div>
                </GridItem>
                <GridItem colSpan={1}>&nbsp;</GridItem>
                <GridItem colSpan={2} >
                  <div className={styles.winDR}>
                    <img src={bgWindow} alt=""/>
                    <div className={styles.winArrow}>{curveArrow('2')}</div>
                  </div>
                </GridItem>
              </Grid>
            </GridItem>
          )}
          {(

            /* Cross-Chain Form */
            <GridItem colSpan={[10, 10, 10, 5, 6]} p={['1.785rem', '1.785rem', '1.785rem', '2rem', '3.785rem']} bg="brand.900">
              <Box
                h="427px" height="100%" bg="white"
                p={['1rem 2rem', '1rem 2rem', '1rem 2rem', '2rem 3rem', '2.5rem 4.46rem']}
                boxSizing="border-box" fontFamily="Poppins"
              >
                <div>
                  <Text lineHeight="1.71rem" fontSize="1.14rem" fontWeight="bold">DNF-{NetOptions[frNet].key} :</Text>
                  <InputGroup my=".4rem">
                    <InputLeftElement color="brand.600" height="100%">
                      <div className={styles.inputLeft}> </div>
                    </InputLeftElement>
                    <Input
                      is-full-width="true"
                      focusBorderColor="brand.600"
                      borderColor="brand.300"
                      placeholder="Amount"
                      height="3.57rem"
                      fontWeight="bold" fontSize="1.43rem"
                      autoFocus
                      type="number"
                      _hover={{borderColor: 'inherit'}}
                      value={amount}  onChange={(v) => {setAmount(v.target.value)}}
                    />
                    <InputRightAddon h="auto" cursor="not-allowed" bg="transparent">
                      <img src={NetOptions[frNet].icon} alt='net' className={styles.tokenIco} />
                      <div className={styles.tokenType}> {NetOptions[frNet].key} </div>
                      <Icon icon="mdi:menu-down"/>
                    </InputRightAddon>
                  </InputGroup>
                  <Text fontSize="1rem" color="brand.100">Available balance : {balance} DNF</Text>
                </div>
                <Box my="1.143rem" textAlign="right">
                  <div className={styles.switchIcon}>{combineArrow}</div>
                </Box>
                <div>
                  <Text lineHeight="1.71rem" fontSize="1.14rem" fontWeight="bold">DNF-{NetOptions[toNet].key} :</Text>
                  <InputGroup my=".4rem">
                    <InputLeftElement color="brand.600" height="100%">
                      <div className={styles.inputLeft}> </div>
                    </InputLeftElement>
                    <Input
                      is-full-width="true"
                      focusBorderColor="brand.600"
                      borderColor="brand.300"
                      placeholder="Received"
                      height="3.57rem"
                      fontWeight="bold" fontSize="1.43rem"
                      isDisabled
                      _hover={{borderColor: 'inherit'}}
                      value={amount}
                    />
                    <InputRightAddon h="auto" cursor="not-allowed" bg="transparent">
                      <img src={NetOptions[toNet].icon} alt='net' className={styles.tokenIco} />
                      <span className={styles.tokenType}> {NetOptions[toNet].key} </span>
                      <Icon icon="mdi:menu-down"/>
                    </InputRightAddon>
                  </InputGroup>
                  <Text fontSize="1rem" color="brand.100">By now, You will received 100% DNF</Text>
                </div>
                <HStack mt="3rem">
                  <Button
                    colorScheme="custom"
                    fontWeight="700" fontSize="1.14rem"
                    p="1.14rem 2.14rem"
                    onClick={submitCross}
                    isLoading={loading}
                  >
                    Confirm
                  </Button>
                  <Button  colorScheme="teal" variant="outline" fontSize="1.14rem" p="1.14rem 2.14rem" onClick={skipHistory}>History</Button>
                </HStack>
              </Box>
            </GridItem>
          )}
        </Grid>
      </div>
    </div>
  )
}

export default BridgeScreen;
