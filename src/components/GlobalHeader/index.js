import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { setProfileAddress, setProfileToken } from 'reduxs/actions/profile';

import { Dialog, Input } from 'element-react';
import {
  Box, Avatar, Link,
  Button, Text,
  Menu, MenuButton,
  MenuList, MenuGroup,
  MenuItem, MenuDivider,
  Drawer, DrawerOverlay, DrawerContent,
  DrawerHeader, IconButton, DrawerBody,
  Stat, StatLabel, StatNumber, StatHelpText
} from '@chakra-ui/react';
import { SideBar } from 'layout/sideBar';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import { css } from 'emotion';
import axios from 'axios';

import { NET_WORK_VERSION } from 'utils/constant'
import globalConf from 'config/index'
// import styles from './index.less';

// import { assetSvg } from '../../utils/svg';
import ethSvg from '../../images/networks/logo_eth.svg'
import bscSvg from '../../images/networks/logo_bsc.svg'
// import polkadotSvg from '../../images/networks/logo_pk.svg'
import selectEthSvg from '../../images/networks/logo_select_eth.svg'
import selectBscSvg from '../../images/networks/logo_select_bsc.svg'
// import selectPolkadotSvg from '../../images/networks/logo_select_pk.svg'
import Logo from '../../images/home/dnftLogo.png';
import assetSvg from 'images/asset/asset.svg';
import { getCategoryList } from 'reduxs/actions/market';

// const mvpUrl = 'http://mvp.dnft.world';
const DEFAULT_STAT = {count: 0, balance: 0, total: 0 }

const GlobalHeader = (props) => {
  let history = useHistory();
  const { dispatch, chainType, token } = props;
  const ref = useRef();

  const [isNetListVisible, setIsNetListVisible] = useState(false);
  const [currentNetIndex, setCurrentNetIndex] = useState();
  const [address, setAddress] = useState();
  const netArray = useMemo(
    () => [
      // {
      //   name: 'Ethereum Mainnet',
      //   icon: selectEthSvg,
      //   shortName: ['ETH', 'Ethereum'],
      //   shortIcon: ethSvg,
      //   netWorkId: 1,
      // },
      // {
      //   name: 'Polkadot Mainnet',
      //   icon: selectPolkadotSvg,
      //   shortName: ['DOT', 'Polkadot'],
      //   shortIcon: polkadotSvg,
      // },
      globalConf.net_env === 'mainnet' ? {
        name: 'BSC Mainnet',
        icon: selectBscSvg,
        shortName: ['BSC', 'BSC'],
        shortIcon: bscSvg,
        netWorkId: 56,
      } : {
        name: 'BSC Testnet',
        icon: selectBscSvg,
        shortName: ['BSC', 'BSC Test'],
        shortIcon: bscSvg,
        netWorkId: 97,
      },
    ],
    []
  );
  console.log('globalheader', chainType)

  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      setAddress(ethereum.selectedAddress);
      const currentIndex = netArray.findIndex(
        (item) => Number(item.netWorkId) === Number(ethereum.networkVersion)
      );
      setCurrentNetIndex(currentIndex)

      // 监听网络切换
      ethereum.on('networkChanged', (networkIDstring) => {
        console.log(networkIDstring, 'networkIDstring')
        const currentIndex = netArray.findIndex(
          (item) => Number(item.netWorkId) === Number(networkIDstring)
        );
        let params = {address: ethereum.selectedAddress, chainType: NET_WORK_VERSION[ethereum.networkVersion]}
        // 存储address
        dispatch(setProfileAddress(params))
        dispatch(setProfileToken(params))

        setCurrentNetIndex(currentIndex);
      });
      let params = {address: ethereum.selectedAddress, chainType: NET_WORK_VERSION[ethereum.networkVersion]}
      // 存储address
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
      // 监听账号切换
      ethereum.on('accountsChanged', (accounts) => {
        if (accounts[0] &&  accounts[0] !== address) {
          console.log(accounts[0], address)
        }
        setAddress(accounts[0]);
        let params = {address: accounts[0], chainType: NET_WORK_VERSION[ethereum.networkVersion]}

        dispatch(setProfileAddress(params))
        dispatch(setProfileToken(params))

      });
    } else {
      alert('Please install wallet');
    }
  }, [address, netArray]);

  useEffect(() => {
    injectWallet();
  }, [injectWallet, window.ethereum]);

  const goToRightNetwork = async (ethereum, netWorkId) => {
    try {
      if (netWorkId === 1) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: '0x1',
            },
          ],
        })
      } else {
        if (globalConf.net_env === 'testnet') {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'Smart Chain Test',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              },
            ],
          });
        } else {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  };

  const connectWallet = async () => {
    try {
      let ethereum = window.ethereum;
      await ethereum.enable();
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      const currentIndex = netArray.findIndex(
        (item) =>
          Number(item.netWorkId) === Number(ethereum.networkVersion)
      );

      setCurrentNetIndex(currentIndex);
      setAddress(account);
    } catch (e) {
      console.log(e, 'e')
    }
  };

  const [giftLoading, setGiftLoading] = useState(false);
  const [isDrawer, setIsDrawer] = useState(false)
  const [healthData, setHealthData] = useState({tdnf: {...DEFAULT_STAT }, tbusd: {...DEFAULT_STAT}, list: []})
  const getToken = (assetId, chainId, giftMode) => {
    if (assetId && chainId && address && !giftLoading) {
      setGiftLoading(true)
      axios.get(
        `/gift/${address}?assetId=${assetId}&chainId=${chainId}&giftMode=${giftMode}`,
        {baseURL: globalConf.faucetApi, withCredentials: false}
      ).then(() => {
        toast.success('Request Send Successfully!', {position: toast.POSITION.TOP_CENTER})
      })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message
          toast.dark(msg, {position: toast.POSITION.TOP_CENTER})
        })
        .finally(() => {setGiftLoading(false)})
    }
  }
  const getFaucetMore = () => {
    let tdnf = {...DEFAULT_STAT }
    let tbusd = {...DEFAULT_STAT}
    let list = []
    Promise.allSettled([
      axios.get('/health?chainId=97&assetId=TDNF', {baseURL: globalConf.faucetApi, withCredentials: false}),
      axios.get('/health?chainId=97&assetId=TBUSD', {baseURL: globalConf.faucetApi, withCredentials: false}),
      axios.get('/history', {baseURL: globalConf.faucetApi, withCredentials: false})
    ]).then((results) => {
      if (results[0].status === 'fulfilled') {tdnf = results[0].value.data || DEFAULT_STAT}
      if (results[1].status === 'fulfilled') {tbusd = results[1].value.data || DEFAULT_STAT}
      if (results[2].status === 'fulfilled') {list = results[2].value.data || []}
    })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setHealthData({ tdnf, tbusd, list })
        setIsDrawer(true)
      })
  }
  const menuData = [
    {
      token: 'TDNF',
      chainId: '97',
      assetId: 'TDNF',
      color: 'brand.600',
      giftModes: [
        {value: '2024', label: '20 TDNF / 24 H'},
        {value: '1012', label: '10 TDNF / 12 H'},
        {value: '506', label: '5 TDNF / 6 H'},
      ]
    },
    {
      token: 'TBUSD',
      chainId: '97',
      assetId: 'TBUSD',
      color: 'yellow.500',
      giftModes: [
        {value: '2024', label: '20 TBUSD / 24 H'},
        {value: '1012', label: '10 TBUSD / 12 H'},
        {value: '506', label: '5 TBUSD / 6 H'},
      ]
    }
  ]
  useEffect(() => {
    dispatch(
      getCategoryList(null, token)
    );
  }, [token])
  const renderFaucet = () => (
    globalConf.net_env === 'testnet' && address && (
      <Menu closeOnSelect>
        <MenuButton as={Button} colorScheme="custom" variant="outline" mx="1rem" borderRadius="5.36rem">
              FAUCET
        </MenuButton>
        <MenuList width="max-content">
          {
            menuData.map((item) => (
              <MenuGroup title={item.token}>
                {
                  item.giftModes.map((gift) => (
                    <MenuItem color={item.color} fontWeight="bolder" boxSizing="border-box"
                      onClick={() => {
                        getToken(item.assetId, item.chainId, gift.value)
                      }}>{gift.label}</MenuItem>
                  ))
                }
              </MenuGroup>
            ))
          }
          <MenuDivider />
          <MenuGroup title="BNB">
            <MenuItem fontWeight="bolder" boxSizing="border-box">
              <a href="https://testnet.binance.org/faucet-smart" target="_blank" rel="noreferrer">Get BNB</a>
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="More+">
            <MenuItem fontWeight="bolder" boxSizing="border-box" onClick={getFaucetMore}>History</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    )
  )

  const renderModal = useMemo(
    () => (
      <Dialog
        customClass={styleModalContainer}
        title='Switch to'
        visible={isNetListVisible}
        onCancel={() => {
          setIsNetListVisible(false);
        }}
      >
        <Dialog.Body>
          {netArray.map((item, index) => (
            <div
              key={index}
              className={styleNetItem}
              style={{ border: index === netArray.length - 1 && 'none' }}
              onClick={() => {
                setIsNetListVisible(false);
                if (item.name === 'Polkadot Mainnet') {
                  ref.current.click();
                } else {
                  goToRightNetwork(window.ethereum, item.netWorkId)
                }
              }}
            >
              <span className={styleNetIcon}><img src={item.icon} /></span>
              <span>{item.name}</span>
            </div>
          ))}
        </Dialog.Body>
      </Dialog>
    ),
    [netArray, isNetListVisible]
  );

  return (
    <header className={styleHeader}>
      {/* <div className={styleSearchContainer}>*/}
      {/*  <i className='el-icon-search' />*/}
      {/*  <Input placeholder={'Search Art,Game or Fun'} />*/}
      {/* </div>*/}
      <Box className={actionContainer} display={['none', 'none', 'flex', 'flex', 'flex']}>
        {renderFaucet()}
        <span
          className={address ? styleHasAddress : styleAddress}
          onClick={async () => {
            if (globalConf.net_env !== 'mainnet' && address) {
              history.push(`/profile/address/${address}`, true)
              return;
            }
            await connectWallet()
          }}
        >
          {address
            ? <span><span className='styleDot'></span><span>{address?.slice(0, 8)}...{address?.slice(38)}</span></span>
            : 'connect wallet'}
        </span>
        {address && (
          <div
            className={styleAssetTarget}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              history.push('/asset');
            }}
          >
            <img src={assetSvg} alt="assetIcon"/>
            <span>Asset</span>
          </div>
        )}
        <div className={styleActionContainer}>
          <div
            style={{background: 'transparent'}}
            className={actionItem}
            onClick={() => {
              setIsNetListVisible(true);
            }}
          >
            <img src={netArray[currentNetIndex]?.shortIcon} alt=""/>
          </div>
          <div
            className={styleNetContainer}
            onClick={() => {
              setIsNetListVisible(true);
            }}
          >
            <div style={{ color: '#23262F', fontWeight: 'bold', marginRight: '10px', textAlign: 'right' }}>
              {netArray[currentNetIndex]?.shortName[1] || 'Network'}
            </div>
          </div>
        </div>
        {/* <a ref={ref} href={mvpUrl} target="_blank" rel="noreferrer"/>*/}
      </Box>
      <Box className={actionContainer} display={['flex', 'flex', 'none', 'none', 'none']} justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar src={Logo}  mr="1.5rem" width="2rem" height="2rem"/>
          <strong>DNFT Protocol</strong>
        </Box>
        <Box display="flex" alignItems="center">
          {
            address ? (
              <Box bgColor="brand.600" cursor="pointer" mr="1.5rem" p=".3rem"
                borderRadius="10px" width="2rem" height="2rem" onClick={() => {history.push('/asset')}}>
                <img src={assetSvg} alt="asset"/>
              </Box>
            ) : (
              <Text bgColor="brand.600" color="white" cursor="pointer" mr="1.5rem" p=".4rem .6rem"
                fontSize=".8rem" fontWeight="bolder" borderRadius="16px" onClick={async () => {
                  await connectWallet()
                }}>
                Connect
              </Text>
            )
          }
          <SideBar address={address} location={props.curPath} skipTo={props.skipTo}/>
        </Box>
      </Box>
      {renderModal}
      <Drawer placement="bottom" onClose={() => {setIsDrawer(false)}} isOpen={isDrawer} isFullHeight>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Faucet Board
            <IconButton onClick={() => {setIsDrawer(false)}} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
              icon={<Icon icon="mdi:close"/>}/>
          </DrawerHeader>
          <DrawerBody>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stat>
                  <StatLabel>TDNF</StatLabel>
                  <StatNumber>{healthData?.tdnf?.balance || 0}</StatNumber>
                  <StatHelpText>Count:{healthData?.tdnf?.count || 0} / Tol:{healthData?.tdnf?.total || 0}</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>TBUSD</StatLabel>
                  <StatNumber>{healthData?.tbusd?.balance || 0}</StatNumber>
                  <StatHelpText>Count:{healthData?.tbusd?.count || 0} / Tol:{healthData?.tbusd?.total || 0}</StatHelpText>
                </Stat>
              </Box>
              <Box>
                {
                  healthData.list.map((l) => (
                    <Text border="1px solid" p="1rem" color="brand.100" my=".2rem">
                      <label>ChainId:</label>{l.chainId} |
                      <label>AssetId:</label>{l.assetId} |
                      <label>Address:</label>{l.address} |
                      <label>Amount:</label>{l.amount} |
                      <label>UpdatedAt:</label>{l.updatedAt} |
                      <label>Expired_at:</label>{l.expired_at} |
                      <label>Txhash:</label>
                      <Link href={`https://testnet.bscscan.com/tx/${l.txhash}`} color="brand.600" isExternal>{l.txhash}</Link>
                    </Text>
                  ))
                }
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </header>
  );
};
// export default GlobalHeader;
const mapStateToProps = ({ profile }) => ({
  myAddress: profile.address,
  chainType: profile.chainType,
  token: profile.token
});
export default (connect(mapStateToProps)(GlobalHeader));
const styleHeader = css`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  //box-shadow: 0 1px 4px 1px #d9dadf;
  input {
    &:focus {
      outline: none;
    }
  }
`;

const actionItem = css`
  display: flex;
  background: #1c2656;
  border-radius: 42px;
  height: 42px;
  width: 42px;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 10px;
  img {
    width: 16px;
  }
`;

const styleNetContainer = css`
  position: relative;
  /* cursor: pointer; */
  width: 90px;
  svg {
    position: relative;
    top: -4px;
  }
`;
const styleActionContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 30px;
  border: 1px solid #E1E6FF;
  border-radius: 8px;
  cursor: pointer;
`;
const styleModalContainer = css`
  width: 400px;
  border-radius: 30px;

  .el-dialog__header {
    padding: 20px 32px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #23262F;
    font-size: 16px;
    position: relative;
    top: 8px;
  }
  .el-dialog__title {
    color: #23262F;
    font-size: 32px;
  }
  .el-dialog__body {
    padding: 0 16px 20px 16px;
  }
`;

const styleNetItem = css`
  display: flex;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #dddddd;
  font-size: 18px;
  color: #233a7d;
  font-weight: bold;
  padding: 0 20px 0 16px;
  cursor: pointer;
  &:hover {
    background: #f6f7f9;
  }
`;

const styleNetIcon = css`
  margin-right: 20px;
  line-height: 14px;
`;

const styleSearchContainer = css`
  display: flex;
  flex: 2;
  align-items: center;
  font-size: 28px;
  margin-bottom: 16px;
  padding-top: 12px;
  .el-input__inner {
    border: none;
    font-size: 14px;
    margin-left: 20px;
    width: 90%;
    color: #8f9bba;
  }
`;

const styleHasAddress = css`
  cursor: pointer;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border: 1px solid #E1E6FF;
  color: #23262F;
  font-weight: bold;
  &>span{
    display: flex;
    align-items: center;
    .styleDot {
      background: #68d3bc;
      border-radius: 6px;
      width: 6px;
      height: 6px;
      margin-right: 6px;
    }
  }

`
const styleAddress = css`
  cursor: pointer;
  background: #112DF2;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
`;

const styleAssetTarget = css`
  background: #0834e8;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 8px;
  margin-left: 30px;
  span{
    color: white;
    display: flex;
    padding: 0 4px;
    font-size: 14px;
    font-weight: bold;
  }
`
const actionContainer  = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  //margin-left: 20px;
  height: 64px;
  padding: 10px 30px 10px 56px;
  align-items: center;
  color: #233a7d;
`
