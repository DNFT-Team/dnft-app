import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Dialog, Input } from 'element-react';
import styles from './index.less';
import { css } from 'emotion';
import {
  assetSvg,
  polkadotNetSvg,
} from '../../utils/svg';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { setProfileAddress, setProfileToken } from 'reduxs/actions/profile';
import { NET_WORK_VERSION } from 'utils/constant'

import ethSvg from '../../images/networks/logo_eth.svg'
import bscSvg from '../../images/networks/logo_bsc.svg'
import polkadotSvg from '../../images/networks/logo_pk.svg'

import selectEthSvg from '../../images/networks/logo_select_eth.svg'
import selectBscSvg from '../../images/networks/logo_select_bsc.svg'
import selectPolkadotSvg from '../../images/networks/logo_select_pk.svg'

import globalConf from '../../config'
import defaultHeadSvg from '../../images/asset/Head.svg'

// import { toast } from 'react-toastify';
const mvpUrl = 'http://mvp.dnft.world';
const GlobalHeader = (props) => {
  let history = useHistory();
  const { dispatch, chainType } = props;
  const ref = useRef();

  const [isNetListVisible, setIsNetListVisible] = useState(false);
  const [currentNetIndex, setCurrentNetIndex] = useState();
  const [address, setAddress] = useState();
  const netArray = useMemo(
    () => [
      {
        name: 'Ethereum Mainnet',
        icon: selectEthSvg,
        shortName: ['ETH', 'Ethereum'],
        shortIcon: ethSvg,
        netWorkId: 1,
      },
      {
        name: 'Polkadot Mainnet',
        icon: selectPolkadotSvg,
        shortName: ['DOT', 'Polkadot'],
        shortIcon: polkadotSvg,
      },
      globalConf.net_env === 'mainnet' ? {
        name: 'Bsc Mainnet',
        icon: selectBscSvg,
        shortName: ['BSC', 'Bsc'],
        shortIcon: bscSvg,
        netWorkId: 56,
      } : {
        name: 'Bsc Mainnet Test',
        icon: selectBscSvg,
        shortName: ['BSC', 'Bsc'],
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
      <div className={styleSearchContainer}>
        <i className='el-icon-search' />
        <Input placeholder={'Search Art,Game or Fun'} />
      </div>
      <div className={styles.actionContainer}>
        <span
          className={address ? styleHasAddress : styleAddress}
          onClick={async () => {

            if (address) {
              history.push(`/profile/address/${address}`)
              return;
            }
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
            <span>{assetSvg}</span>
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
            <img src={netArray[currentNetIndex]?.shortIcon} />
          </div>
          <div
            className={styleNetContainer}
            onClick={() => {
              setIsNetListVisible(true);
            }}
          >
            <div style={{ color: '#23262F', fontWeight: 'bold',marginRight: '10px', textAlign: 'right' }}>
              {netArray[currentNetIndex]?.shortName[1] || 'Network'}
            </div>
          </div>
        </div>
        <a ref={ref} href={mvpUrl} target="_blank" rel="noreferrer">
          {/* {polkadotNetSvg} */}
        </a>
      </div>
      {renderModal}
    </header>
  );
};
// export default GlobalHeader;
const mapStateToProps = ({ profile }) => ({
  myAddress: profile.address,
  chainType: profile.chainType
});
export default (connect(mapStateToProps)(GlobalHeader));
const styleHeader = css`
  display: flex;
  height: 64px;
  padding: 10px 30px 10px 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
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
  padding: 0 20px;
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
