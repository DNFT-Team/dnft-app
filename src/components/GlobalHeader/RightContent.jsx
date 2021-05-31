import React, { useEffect, useRef, useState } from 'react';
import { connect, } from 'umi';
import SelectLang from '../SelectLang/SelectLang';
import { getLocale, getAllLocales, setLocale } from '../SelectLang/localeExports.ts';

import Avatar from './AvatarDropdown';
import styles from './index.less';
import { Images } from '@/constants'
import { Button, message } from 'antd';
import MetaMaskOnboarding from '@metamask/onboarding';
import Web3 from 'web3';
import { useIntl, FormattedMessage } from 'umi';
const concatImg = [
  {
    link: 'https://t.me/dnftprotocol',
    icon: Images.telegram1,
  },
  {
    link: 'https://twitter.com/dnftfomo',
    icon: Images.twitter1,
  },
  {
    link: 'https://medium.com/dnft-protocol',
    icon: Images.medium1,
  },
  {
    link: 'https://github.com/DNFT-Team',
    icon: Images.github1,
  },
];
const chain = [
  "DNFT",
  //  "BSC", "ETH", "HECO"
]
// let web3 = null; // Will hold the web3 instance
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
var Personal = require('web3-eth-personal');

// "Personal.providers.givenProvider" 在支持以太坊的浏览器上会被自动设置。
var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');

function GlobalHeaderRight(props) {
  const intl = useIntl();
  const [chainType, useChainType] = useState('DNFT');
  const ONBOARD_TEXT = intl.formatMessage({ id: 'download.metawallet' });
  const CONNECT_TEXT = intl.formatMessage({ id: 'link.metawallet' });
  const CONNECTED_TEXT = intl.formatMessage({ id: 'unlink.metawallet' });
  const { theme, layout, dispatch, currentUser } = props;

  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();

  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }


  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);
  useEffect(() => {
    setLocale('en-US')
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
    let accounts = sessionStorage.getItem('accounts')
    if (accounts) {
      try {
        let data = JSON.parse(accounts)
        // console.log(data)
        dispatch({ type: 'user/fetchCurrent', payload: data });

      } catch (e) { console.log(e) }
    }
    console.log()
    // 获取存储

  }, []);
  const handleSignMessage = (account, nonce) => {
    return new Promise((resolve, reject) =>
      personal.sign(
        nonce,
        account,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ account, nonce, signature });
        }
      )
    );
  }
  const handleAuthenticate = (res) => {
    return fetch(`http://dnft.walicj.com/access/access/validateUserSignature?pubkey=${res.account}&nonce=${res.nonce}&signature=${res.signature}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json());
  }
  const onClickLink = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts && accounts[0];
      // console.log({ accounts })
      fetch(`http://dnft.walicj.com/access/access/getUserNonce?address=${account}`)
        .then(response => response.json())
        .then(response => {
          let nonce = response.data;
          return handleSignMessage(account, nonce)
        })
        .then(handleAuthenticate)
        .then(res => {
          dispatch({ type: 'user/fetchCurrent', payload: res.data });
          sessionStorage.setItem('accounts', JSON.stringify(res.data))

          // 传值
          window.postMessage('312312')

        })
        .catch(err => {
          console.log(err)
        })

    } else {
      console.log('error')
      onboarding.current.startOnboarding();
    }
  };
  return (
    <div className={className}>

      {
        concatImg.map((obj, i) => {
          return (
            <a key={i} target="_blank" href={obj.link}>
              <img className={styles.converse} src={obj.icon} />
            </a>
          )
        })
      }
      {/* <SelectLang className={styles.action} /> */}
      <div className={styles.chain}>
        {
          chain.map(obj=>{
            return  <span onClick={()=>useChainType(obj)} key={obj} className={obj === chainType && styles.active || null}>{obj}</span>
          })
        }
      </div>
      {/* {
        currentUser.user_id ?
          <div className={styles.users}>
            <img src={currentUser.avatar_value} />
            <span>{currentUser.user_name}</span>
          </div>
          :
          <div className={styles.linkWallet} onClick={onClickLink}>
            <div className={styles.logo}><img src={Images.metawallet} /></div>
            <div className={styles.walletTxt}>{buttonText}
            </div>

          </div>
      } */}

    </div>
  );
}

export default connect(({ user, settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  currentUser: user.currentUser,
}))(GlobalHeaderRight);
