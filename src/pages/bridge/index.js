import React, { useState, useEffect } from 'react';
import {
  Grid, GridItem, Box, HStack,
  Heading, Text, Button,
  Input, InputGroup,
  InputLeftElement, InputRightAddon
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Web3 from 'web3';
import {NERVE_BRIDGE, TOKEN_DNF} from '../../utils/contract';
import {toDecimal, WEB3_MAX_NUM} from '../../utils/web3Tools';
import styles from './index.less';
import bgWindow from '../../images/bridge/bg_window.png';
import { curveArrow, combineArrow } from '../../utils/svg';
import {NERVE_WALLET_ADDR} from '../../config/priConfig';

/* Available network*/
const NetOptions = [
  {key: 'ETH', icon: '', netId: '', isShow: true },
  {key: 'BSC', icon: '', netId: '', isShow: true },
  {key: 'HECO', icon: '', netId: '', isShow: false },
  {key: 'POLKA', icon: '', netId: '', isShow: false }
]

const BridgeScreen = (props) => {
  //  global loading
  const [loading, setLoading] = useState(false)
  //  networks
  const [frNet, setFrNet] = useState(0)
  const [toNet, setToNet] = useState(1)
  //  form - input
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(5)
  const [targetAddress, setTargetAddress] = useState('')


  useEffect(async () => {
    //  do something here
    // await injectWallet();
  }, []);

  const injectWallet = async () => {
    let ethereum = window.ethereum;
    if (ethereum) {
      // // 监听账号切换
      // ethereum.on('networkChanged', (networkIDstring) => {
      //   handleCrossFr(fromAddr, null)
      // })
      window.web3 = new Web3(ethereum);
      let accounts = await ethereum.enable();
      const current = accounts[0]
      setTargetAddress(current)
      return current
    } else {
      toast.error('Please install wallet', {position: toast.POSITION.TOP_CENTER});
      return null
    }
  }
  const getBalance = async () => {
    let balance = 0
    try {
      if (targetAddress) {
        const contract = new window.web3.eth.Contract(
          TOKEN_DNF.abi,
          TOKEN_DNF.tokenContract
        );
        const dnfBalance = await contract.methods['balanceOf'](targetAddress).call();
        console.log('dnfBalance', dnfBalance);
        balance = toDecimal(dnfBalance)
      }
    } catch (err) {
      console.log(err);
      balance = 0
    }
    setBalance(balance)
    return balance
  }
  const getIsApprove = async () => {
    let apr = false
    try {
      if (targetAddress) {
        const contract = new window.web3.eth.Contract(
          TOKEN_DNF.abi,
          TOKEN_DNF.tokenContract
        );
        const dnfAuth = await contract.methods['allowance'](targetAddress, NERVE_BRIDGE.tokenContract).call();
        console.log('dnfAuth', dnfAuth);
        apr = Number(dnfAuth) > 0
      }
    } catch {
      apr = false
    }
    return apr
  }
  const approveDnfToNerve = async () => {
    try {
      const dnfContract = new window.web3.eth.Contract(
        TOKEN_DNF.abi,
        TOKEN_DNF.tokenContract
      );
      await dnfContract.methods['approve'](
        NERVE_BRIDGE.tokenContract,
        WEB3_MAX_NUM
      ).send({ from: targetAddress });
    } catch (err) {
      console.log('approveDnfToNerve', err);   // code:4001-user denied action
    }
  }
  const submitCross = async () => {
    let wallet = await injectWallet()
    console.log(wallet);
    // setLoading(true)
    // const nerveContract = new window.web3.eth.Contract(
    //   NERVE_BRIDGE.abi,
    //   NERVE_BRIDGE.tokenContract
    // )
    // const gasNum = 210000, gasPrice = '20000000000';
    // // transfer DNF token
    // nerveContract.methods['crossOut'](
    //   NERVE_WALLET_ADDR,
    //   toDecimal(amount, true, 'ether', true),
    //   TOKEN_DNF.tokenContract
    // ).send({
    //   from: targetAddress,
    //   gas: gasNum,
    //   gasPrice: gasPrice
    // })
    //   .then((receipt) => {
    //     console.log(receipt);
    //     toast.success('Step1 Ok', {position: toast.POSITION.TOP_CENTER})
    //   })
    //   .catch((err) => {
    //     toast.error(err.message, {position: toast.POSITION.TOP_CENTER})
    //     setLoading(false)
    //   })
  }

  //  render Dom
  return (
    <div className="d-fullWidth">
      <div className={styles.main}>
        <Grid
          gap={4}
          h="497px"
          bg="brand.900"
          templateColumns="repeat(10, 1fr)"
        >
          {(

            /* Banner Left/Top */
            <GridItem colSpan={[10, 10, 10, 5, 4]} p={['1.785rem', '1.785rem', '1.785rem', '2rem', '3.785rem']} color="white">
              <Heading as="h4" className={styles.title}>Bridge</Heading>
              <Text color="brand.100" className={styles.subTitle} isTruncated>
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
              <Box bg="white" height="100%" borderRadius='.8rem' p='1rem' boxSizing='border-box'>
                <div>
                  <Text size="xl" fontWeight="bold">DNF-{NetOptions[frNet].key} :</Text>
                  <InputGroup my=".4rem">
                    <InputLeftElement color="brand.600">
                      <div className={styles.tokenType}> </div>
                    </InputLeftElement>
                    <Input
                      is-full-width="true"
                      focusBorderColor="brand.600"
                      borderColor="brand.300"
                      placeholder="Amount"
                      autoFocus
                      style={{textIndent: '1rem'}}
                      _hover={{borderColor: 'inherit'}}
                      value={amount}  onChange={(v) => {setAmount(v.target.value)}}
                    />
                    <InputRightAddon>{
                      NetOptions[frNet].key
                    }</InputRightAddon>
                  </InputGroup>
                  <Text size="sm" color="brand.100">Available balance : {balance} DNF</Text>
                </div>
                <Box my="3rem" textAlign="right">
                  <div className={styles.switchIcon}>{combineArrow}</div>
                </Box>
                <div>
                  <Text size="xl" fontWeight="bold">DNF-{NetOptions[toNet].key} :</Text>
                  <InputGroup my=".4rem">
                    <InputLeftElement color="brand.600">
                      <div className={styles.tokenType}> </div>
                    </InputLeftElement>
                    <Input
                      is-full-width="true"
                      focusBorderColor="brand.600"
                      borderColor="brand.300"
                      placeholder="Received"
                      isReadOnly
                      style={{textIndent: '1rem'}}
                      _hover={{borderColor: 'inherit'}}
                      value={amount}
                    />
                    <InputRightAddon>{NetOptions[toNet].key}</InputRightAddon>
                  </InputGroup>
                  <Text size="sm" color="brand.100">By now, You will received 100% DNF</Text>
                </div>
                <HStack mt="3rem">
                  <Button colorScheme="custom" onClick={submitCross}>Confirm</Button>
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
