import React, {useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Icon} from '@iconify/react';
import {
  Grid, GridItem, Box, HStack,
  Heading, Text, Button, Fade,
  Input, InputGroup, Link,
  InputLeftElement, InputRightAddon,
  AlertDialog, AlertDialogBody,
  AlertDialogContent, AlertDialogOverlay,
  Drawer, DrawerBody, DrawerHeader,
  DrawerOverlay, DrawerContent, IconButton
} from '@chakra-ui/react';
import { Divider } from 'ui-neumorphism'
import { toast } from 'react-toastify';
import gitbook from '../../config/gitbook';
import Web3 from 'web3';
import {NERVE_BRIDGE, TOKEN_DNF, NERVE_WALLET_ADDR} from '../../utils/contract';
import {toDecimal, WEB3_MAX_NUM} from '../../utils/web3Tools';
import axios from '../../http/default'
import globalConf from '../../config'
import {curveArrow, combineArrow} from '../../utils/svg';
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
  const { address, chainType } = props;
  //  global loading
  const [loading, setLoading] = useState(false)
  const [isInjected, setIsInjected] = useState(false)
  const [transaction, setTransaction] = useState(null)
  //  networks
  const [frNet, setFrNet] = useState(0)
  const [toNet, setToNet] = useState(1)
  //  form - input
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  //  drawer bottom
  const [isDrawer, setIsDrawer] = useState(false)
  const [historyList, setHistoryList] = useState([])
  //  alert pop-up
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

  useEffect(() => {
    // console.log('useEffect', address, chainType);
    if (chainType) {init()}
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
            chainId:'0x1',
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
      goToRightNetwork(window.ethereum);
      toast.warning('Please connect ETH-NET', {position: toast.POSITION.TOP_CENTER});
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
    // console.log('skipHistory', address, chainType);
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
            axios.post('/transaction/monitor', {
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
  const skipHistory = () => {
    let list = []
    axios.get(`/transaction/query?address=${address}`, {baseURL: globalConf.bridgeApi})
      .then((res) => {list = res.data.data})
      .finally(() => {
        if (list.length > 0) {
          setIsDrawer(true)
          setHistoryList(list)
        } else {
          setIsDrawer(false)
          setHistoryList([])
          toast('No record has been found yet', {position: toast.POSITION.TOP_CENTER})
        }
      })
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
              <Link href={gitbook.bridge} isExternal color="brand.100" mt="2rem" display="inline-block">
                <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem'}} /> Learn how to cross
              </Link>
              <Text color="brand.100" className={styles.subTitle} lineHeight="2rem">
                The whole process of providing a quick, simple and reliable solution to get your DNF running across the chain in just 3 short steps, as shown below:<br/>
                1. Swiftly data packing<br/>
                2. Reliable transaction confirmation after data transfer<br/>
                3. Easily withdraw your money from Trading-center
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
                      isInvalid={amount < 0}
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
                    loadingText="Trading..."
                  >
                    Confirm
                  </Button>
                  <Button  colorScheme="teal" variant="outline" fontSize="1.14rem" p="1.14rem 2.14rem" onClick={skipHistory}>History</Button>
                </HStack>
                {loading ? (<Text color="brand.600" mt="2rem" fontWeight="600">
                  Transactions are being processed and raising fuel can speed up
                </Text>) : ''}
                {transaction ? (<Fade in>
                  <Box
                    mt="4" p="1.8rem"
                    color="brand.100" bg="#e3ebf5"
                    rounded="xl" shadow="md"
                  >
                    <Text color="green.400">
                      Transfer transaction has been written into the chain!<br/>
                      All you need to do now is just waiting for the withdraw.
                    </Text>
                    <Divider style={{margin: '1rem .8rem'}}/>
                    <p>Transfer {transaction.amount} DNF from {transaction.from} to {transaction.to} at {new Date(transaction.timestamp).toISOString()}</p>
                    <p>You can check via this hash:<Link href={`https://etherscan.io/tx/${transaction.hash}`} color="brand.600" isExternal>{transaction.hash}</Link> </p>
                  </Box>
                </Fade>) : ''}
              </Box>
            </GridItem>
          )}
        </Grid>
      </div>
      <Drawer placement="bottom" onClose={() => {setIsDrawer(false)}} isOpen={isDrawer} isFullHeight>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Trade History
            <IconButton onClick={() => {setIsDrawer(false)}} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
              icon={<Icon icon="mdi:close"/>}/>
          </DrawerHeader>
          <DrawerBody>
            {historyList.map((e) => (
              <Text border="1px solid" p="1rem" color="brand.100" className={styles.history}>
                <span>AMOUNT:{e.amount || '---'}</span>
                <span>STATUS:{e.status || '---'}</span>
                <span>DYNAMIC INFO:{e.dynamic_info || '---'}</span>
                <span>FAILED CODE:{e.failed_code || '---'}</span>
                <br/>
                <span>TXHASH:<Link href={`https://etherscan.io/tx/${e.tx_hash}`} color="brand.600" isExternal>{e.tx_hash}</Link></span>
                <br/>
                <span>UPDATED AT:{e.updated_at || '---'}</span>
                <span>CREATED AT:{e.created_at || '---'}</span>
              </Text>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent w="max-content" borderRadius="40px">
            <AlertDialogBody fontFamily="DM Sans" letterSpacing="-0.02em" p="2.14rem 3rem" textAlign="center">
              <Heading
                as="h4" color="black" fontWeight="bold"
                fontSize="lg" lineHeight="2.57rem"
              >Approve first!</Heading>
              <Text
                color="brand.100"  my="2.14rem"
                fontSize="0.857rem" lineHeight="1.43rem"
              >You may need to approve first!</Text>
              <Button colorScheme="custom" px="2.92rem" borderRadius="5.36rem" onClick={approveDnfToNerve} >OK</Button>
              <Text
                color="brand.100" my="2.14rem" cursor="pointer"
                fontSize="0.857rem" lineHeight="1.43rem"
                _hover={{textDecoration: 'underline'}}
                onClick={onClose}
              >Skip for now</Text>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}

const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType
});
export default withRouter(connect(mapStateToProps)(BridgeScreen));

