import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { setProfileAddress, setProfileToken } from 'reduxs/actions/profile';
// import { useCoingeckoPrice } from '@usedapp/coingecko'
import { Dialog, Input } from 'element-react';
import {
  Box, Avatar, Link,
  Button, Text,
  Menu, MenuButton,
  MenuList, MenuGroup,
  MenuItem, MenuDivider, Tooltip,
  Drawer, DrawerOverlay, DrawerContent,
  DrawerHeader, IconButton, DrawerBody,
  Stat, StatLabel, StatNumber, StatHelpText
} from '@chakra-ui/react';
import { SideBar } from 'layout/sideBar';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import { css } from 'emotion';
import axios from 'axios';
import Web3 from 'web3';

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
import dnftLogo from 'images/common/dnft.png';

import assetSvg from 'images/asset/asset.svg';
import accountSvg from 'images/common/account.svg';
import dnft_unit from 'images/market/dnft_unit.png'
import { getCategoryList } from 'reduxs/actions/market';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { shortenAddress } from 'utils/tools'
import DrawerMenu from 'layout/sideBar/menu';
import { useTranslation } from 'react-i18next';

// const mvpUrl = 'http://mvp.dnft.world';
const DEFAULT_STAT = {count: 0, balance: 0, total: 0 }

const GlobalHeader = (props) => {
  let history = useHistory();
  const { t } = useTranslation();

  const { dispatch, chainType, token } = props;
  const ref = useRef();

  const [isNetListVisible, setIsNetListVisible] = useState(false);
  const [isSwitchWalletVisible, setIsSwitchWalletVisible] = useState(false);
  const [currentNetIndex, setCurrentNetIndex] = useState();
  const [address, setAddress] = useState();
  const [menuToggle, setMenuToggle] = useState(false)
  const netArray = useMemo(
    () => [
      {
        name: 'Ethereum Mainnet',
        icon: selectEthSvg,
        shortName: ['ETH', 'Ethereum'],
        shortIcon: ethSvg,
        netWorkId: 1,
      },
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
  // const dnftPrice = useCoingeckoPrice('dnft-protocol', 'usd')

  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;
    if (ethereum) {
      const reqAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const curAccount = ethereum?.selectedAddress || reqAccounts[0];
      setAddress(curAccount);
      dispatch(setProfileAddress(curAccount))
      const currentIndex = netArray.findIndex(
        (item) => Number(item.netWorkId) === Number(ethereum.networkVersion || ethereum.chainId)
      );
      let defaultparams = {address: curAccount, chainType: NET_WORK_VERSION[ethereum.networkVersion || ethereum.chainId]}
      setCurrentNetIndex(currentIndex)
      dispatch(setProfileToken(defaultparams))

      //  监听节点切换
      ethereum.on('chainChanged', (chainId) => {
        window.location.reload()
      })
      // 监听网络切换
      ethereum.on('networkChanged', (networkIDstring) => {
        const currentIndex = netArray.findIndex(
          (item) => Number(item.netWorkId) === Number(networkIDstring)
        );
        let params = {address: ethereum?.selectedAddress, chainType: NET_WORK_VERSION[ethereum.networkVersion || ethereum.chainId]}
        // 存储address
        dispatch(setProfileAddress(params))
        dispatch(setProfileToken(params))

        setCurrentNetIndex(currentIndex);
      });
      let params = {address: curAccount, chainType: NET_WORK_VERSION[ethereum.networkVersion || ethereum.chainId]}
      // 存储address
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
      // 监听账号切换
      ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0]);
        let params = {address: accounts[0], chainType: NET_WORK_VERSION[ethereum.networkVersion || ethereum.chainId]}

        dispatch(setProfileAddress(params))
        dispatch(setProfileToken(params))

      });
    }
  }, [address, netArray]);

  const injectWalletConnect = useCallback(async () => {
    const provider = window.walletProvider;
    const currentIndex = netArray.findIndex(
      (item) => Number(item.netWorkId) === Number(provider.chainId)
    );
    let params = {address: provider.accounts[0], chainType: NET_WORK_VERSION[provider.chainId]}
    setCurrentNetIndex(currentIndex)
    setAddress(provider.accounts[0]);
    dispatch(setProfileAddress(params))
    dispatch(setProfileToken(params))

    provider.wc.on('accountsChanged', (accounts) => {
      const currentIndex = netArray.findIndex(
        (item) => Number(item.netWorkId) === Number(provider.chainId)
      );
      setCurrentNetIndex(currentIndex)
      setAddress(accounts[0]);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
    });
    provider.on('disconnect', (payload) => {
      localStorage.removeItem('walletconnect');
      window.walletProvider = undefined;
      let params = {address: undefined, chainType: chainType}
      setAddress(undefined);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
    })
  }, [address, netArray]);

  const injectOntoConnect = useCallback(async () => {
    const onto = window.onto;
    console.log(onto, 'onto inject')
    const currentIndex = netArray.findIndex(
      (item) => Number(item.netWorkId) === Number(onto.chainId)
    );
    let params = {address: onto.accounts[0], chainType: NET_WORK_VERSION[onto.chainId]}
    setCurrentNetIndex(currentIndex)
    setAddress(onto.accounts[0]);
    dispatch(setProfileAddress(params))
    dispatch(setProfileToken(params))
    window.onto.on('disconnect', (payload) => {
      let params = {address: undefined, chainType: chainType}
      setAddress(undefined);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
    })
  }, [address, netArray]);

  const getWalletConnectFromStorage = useCallback(async () => {
    if (localStorage.getItem('walletconnect')) {
      const provider = new WalletConnectProvider({
        infuraId: 'f65c0bbb601041e19fb6a106560bc9ac',
        qrcode: true,
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
        }
      });
      await provider.enable();
      window.walletProvider = provider;
      const currentIndex = netArray.findIndex(
        (item) => Number(item.netWorkId) === Number(provider.chainId)
      );
      let params = {address: provider.accounts[0], chainType: NET_WORK_VERSION[provider.chainId]}
      setCurrentNetIndex(currentIndex)
      setAddress(provider.accounts[0]);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
    }
  }, [])

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      injectWallet();
    } else if (window.walletProvider?.connected) {
      injectWalletConnect()
    } else if (window.onto?.isConnected) {
      injectOntoConnect()
    } else {
      getWalletConnectFromStorage()
    }
  }, [address, netArray, window.walletProvider,window.onto , window.ethereum, getWalletConnectFromStorage]);

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

  const connectMetaMaskWallet = async () => {
    try {
      let ethereum = window.ethereum;
      await ethereum.enable();
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      const currentIndex = netArray.findIndex(
        (item) =>
          Number(item.netWorkId) === Number(ethereum.networkVersion || ethereum.chainId)
      );
      let params = {address: account, chainType: NET_WORK_VERSION[ethereum.networkVersion || ethereum.chainId]}

      setCurrentNetIndex(currentIndex);
      setAddress(account);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
    } catch (e) {
      console.log(e, 'e')
    }
  };

  const connectWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        infuraId: 'f65c0bbb601041e19fb6a106560bc9ac',
        qrcode: true,
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
        }
      });
      await provider.enable();
      window.walletProvider = provider;
      const currentIndex = netArray.findIndex(
        (item) => Number(item.netWorkId) === Number(provider.chainId)
      );
      let params = {address: provider.accounts[0], chainType: NET_WORK_VERSION[provider.chainId]}
      setCurrentNetIndex(currentIndex)
      setAddress(provider.accounts[0]);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
    } catch (e) {
      console.log(e, 'e')
    }
  }

  const connectOntoWallet = async () => {
    try {
      const web3 = new Web3(window.onto);
      let accounts = await web3.eth.requestAccounts();
      let chainId = await web3.eth.getChainId();
      const currentIndex = netArray.findIndex(
        (item) => Number(item.netWorkId) === Number(chainId)
      );
      let params = {address: accounts[0], chainType: NET_WORK_VERSION[chainId]}
      setCurrentNetIndex(currentIndex)
      setAddress(accounts[0]);
      dispatch(setProfileAddress(params))
      dispatch(setProfileToken(params))
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
        toast.success(t('toast.send.success'), {position: toast.POSITION.TOP_CENTER})
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
        <MenuButton as={Button} colorScheme="custom" variant="outline" borderRadius="5.36rem" mr="30px">
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
        title={t('switch.to')}
        visible={isNetListVisible}
        onCancel={() => {
          setIsNetListVisible(false);
        }}
      >
        <Dialog.Body>
          {netArray.map((item, index) => (
            item.netWorkId !== 1 && <div
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

  const renderSwitchWallet = useMemo(
    () => (
      <Dialog
        customClass={styleModalContainer}
        title={t('switch.to')}
        visible={isSwitchWalletVisible}
        onCancel={() => {
          setIsSwitchWalletVisible(false);
        }}
      >
        <Dialog.Body>
          <div
            key={'Metamask'}
            className={styleNetItem}
            onClick={async () => {
              setIsSwitchWalletVisible(false);
              await connectMetaMaskWallet()
            }}
          >
            <span>Metamask</span>
          </div>
          <div
            key={'Wallet Connect'}
            className={styleNetItem}
            onClick={async () => {
              setIsSwitchWalletVisible(false);
              await connectWalletConnect()
            }}
          >
            <span>Wallet Connect</span>
          </div>
          <div
            key={'ONTO'}
            className={styleNetItem}
            onClick={async () => {
              setIsSwitchWalletVisible(false);
              await connectOntoWallet()
            }}
          >
            <span>ONTO Wallet</span>
          </div>
        </Dialog.Body>
      </Dialog>
    ),
    [isSwitchWalletVisible]
  );

  return (
    <header className={styleHeader}>
      {/* <div className={styleSearchContainer}>*/}
      {/*  <i className='el-icon-search' />*/}
      {/*  <Input placeholder={'Search Art,Game or Fun'} />*/}
      {/* </div>*/}
      <Box className={actionContainer} display={['none', 'none', 'flex', 'flex', 'flex']}>
        {renderFaucet()}
        {/* {*/}
        {/*  dnftPrice && (*/}
        {/*    <div className={priceBlock}>*/}
        {/*      <img src={dnft_unit} alt=""/>*/}
        {/*      <span>$ {Number(dnftPrice).toFixed(2)}</span>*/}
        {/*    </div>)*/}
        {/* }*/}
        {address && (
          <div
            className={styleAssetTarget}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              history.push('/asset');
            }}
          >
            <img src={assetSvg} alt="assetIcon"/>
            <span>{t('menu.asset')}</span>
          </div>
        )}
        <div
          className={address ? styleHasAddress : styleAddress}
          onClick={async () => {
            if (address) {
              history.push(`/profile/address/${address}`, true)
              return;
            }
            setIsSwitchWalletVisible(true);
          }}
        >
          {address
            // ? <Tooltip label="Go Profile" hasArrow bg="red.600">
            ? <span>
              <img src={accountSvg} alt=""/>
              {address && shortenAddress(address)}
            </span>
            // </Tooltip>
            : t('connect.wallet')}
        </div>
        {address && <div className={styleActionContainer}
          onClick={() => {
            setIsNetListVisible(true);
          }}>
          <img src={netArray[currentNetIndex]?.shortIcon} alt=""/>
          <span> {netArray[currentNetIndex]?.shortName[1] || t('network')}</span>
        </div>}
        {/* <a ref={ref} href={mvpUrl} target="_blank" rel="noreferrer"/>*/}
      </Box>
      <Box className={actionContainer} display={['flex', 'flex', 'none', 'none', 'none']} justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Icon onClick={() => setMenuToggle(true)} icon="dashicons:menu-alt" color="#0057d9" width="30" height="30" />
        </Box>
        <Box display="flex" alignItems="center">
          <img src={dnftLogo} onClick={() => history.push('/')} className={dnftLogoStyle} />
          {/* <Avatar src={dnftLogo}  mr="1.5rem" width="2rem" height="2rem"/> */}
          {/* <strong>DNFT Protoco</strong> */}
        </Box>
        <Box display="flex" alignItems="center">
          {
            address ? (
              <Box bgColor="brand.600" cursor="pointer" p=".3rem"
                borderRadius="10px" width="25px" height="25px" onClick={() => {history.push('/asset')}}>
                <img src={assetSvg} alt="asset"/>
              </Box>
            ) : (
              <Text bgColor="brand.600" color="white" cursor="pointer" p=".4rem .6rem"
                fontSize=".8rem" fontWeight="bolder" borderRadius="16px" onClick={async () => {
                  await connectMetaMaskWallet()
                }}>
                {t('connect')}
              </Text>
            )
          }
          <DrawerMenu address={address}  skipTo={props.skipTo} isOpen={menuToggle} onClose={() => setMenuToggle(false)} />
          {/* <SideBar address={address} location={props.curPath} skipTo={props.skipTo}/> */}
        </Box>
      </Box>
      {renderModal}
      {renderSwitchWallet}
      <Drawer placement="right" onClose={() => {setIsDrawer(false)}} isOpen={isDrawer} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            {t('faucet.title')}
            <IconButton onClick={() => {setIsDrawer(false)}} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
              icon={<Icon icon="mdi:close"/>}/>
          </DrawerHeader>
          <DrawerBody>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stat>
                  <StatLabel>{t('faucet.TDNF')}</StatLabel>
                  <StatNumber>{healthData?.tdnf?.balance || 0}</StatNumber>
                  <StatHelpText>{t('faucet.Count')}:{healthData?.tdnf?.count || 0} / Tol:{healthData?.tdnf?.total || 0}</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>{t('faucet.TBUSD')}</StatLabel>
                  <StatNumber>{healthData?.tbusd?.balance || 0}</StatNumber>
                  <StatHelpText>{t('faucet.Count')}:{healthData?.tbusd?.count || 0} / Tol:{healthData?.tbusd?.total || 0}</StatHelpText>
                </Stat>
              </Box>
              <Box>
                {
                  healthData.list.map((l) => (
                    <Text border="1px solid" p="1rem" color="brand.100" my=".2rem">
                      <label>{t('faucet.ChainId')}:</label>{l.chainId} |
                      <label>{t('faucet.AssetId')}:</label>{l.assetId} |
                      <label>{t('faucet.Address')}:</label>{l.address} |
                      <label>{t('faucet.Amount')}:</label>{l.amount} |
                      <label>{t('faucet.UpdatedAt')}:</label>{l.updatedAt} |
                      <label>{t('faucet.Expired_at')}:</label>{l.expired_at} |
                      <label>{t('faucet.Txhash')}:</label>
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

const styleActionContainer = css`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  height: 40px;
  padding: 11px 10px;
  border-radius: 10px;
  border: 1px solid rgba(35, 38, 47, 0.8);
  img {
    height: 20px;
    width: 20px;
  }
  span{
    display: inline-block;
    margin-left: 10px;
    font-family: Helvetica,sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 12px;
    color: #23262F;
  }
`;
const styleModalContainer = css`
  width: 400px;
  border-radius: 10px;

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
    font-family: Archivo Black,sans-serif;
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
  margin-right: 30px;
  span{
    border-radius: 10px;
    border: 1px solid #0057D9;
    height: 40px;
    box-sizing: border-box;
    padding: 13px 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: Helvetica sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    color: #0057D9;
    img{
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  }

`
const styleAddress = css`
  font-family: Archivo Black,sans-serif;
  cursor: pointer;
  background: #0057D9;
  color: #FFFFFF;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 10px 8px;
  margin-right: 30px;
  border-radius: 10px;
`;

const styleAssetTarget = css`
  background: #0057D9;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 10px 8px;
  margin-right: 30px;
  width: 97px;
  border-radius: 10px;
  justify-content: center;
  img{
    height: 18px;
    width: 18px;
    margin-right: 5px;
  }
  span{
    display: inline-block;
    //width: 66px;
    text-align: center;
    font-family: Archivo Black,sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    color: #fcfcfd;
  }
`
const actionContainer  = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  //margin-left: 20px;
  height: 60px;
  box-sizing: border-box;
  padding: 0 20px;
  align-items: center;
  color: #233a7d;
`
const dnftLogoStyle = css`
  width: 45px;
`
const priceBlock  = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  box-sizing: border-box;
  margin: 0 20px;
  color: #233a7d;
  img{
    height: 20px;
    width: 20px;
    margin-right: 10px;
  }
  span{
    font-family: Archivo Black,sans-serif;
    font-style: normal;
    font-weight: normal;
  }
`