import React, {useState, useCallback, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { Heading, Text, Box, Grid } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import igoAvatar from 'images/igo/igoAvatar.png';
import {noDataSvg} from '../../utils/svg';
import globalConfig from '../../config/index';
import SwitchModal from 'components/SwitchModal';

const mockGameList = [
  { title: 'Olympic BTC Synthesis', description: '', avatarUrl: igoAvatar, skipTo: '/igo/syncBtc' },
  // { title: '', description: 'DNFT provides gamers with a chance to win Gold, Silver or Bronze upon completion.', avatarUrl: comingSoon, isComing: true }
]
const IGOScreen = (props) => {
  let history = useHistory();

  const tabList = [[0, 'Ongoing'], [1, 'Ended']];

  const currentNetEnv = globalConfig.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const right16ChainId =  currentNetEnv === 'testnet' ? '0x61' : '0x38';
  const rightRpcUrl = currentNetEnv === 'testnet' ? ['https://data-seed-prebsc-1-s1.binance.org:8545/'] : ['https://bsc-dataseed.binance.org/'];

  const [tab, setTab] = useState(0)

  const [gameList, setGameList] = useState([])
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);
  const handleTab = (tab) => {
    setTab(tab)
    setGameList(tab === 1 ? mockGameList : [])
  }
  const handlePlay = (item) => {
    if (tab === 1) {
      toast('Sorry, The game is ended!')
      return
    }
    if (!item.isComing && item.skipTo) {
      history.push(item.skipTo)
    } else {
      toast('Coming soon!')
    }
  }

  const goToRightNetwork = useCallback(async () => {
    const ethereum = window.ethereum;
    try {
      if (history.location.pathname !== '/igo') {
        return;
      }

      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: right16ChainId,
            chainName: 'Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: rightRpcUrl,
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  }, []);

  useEffect(() => {
    setIsShowSwitchModal(false)
    let wallet = window.ethereum.selectedAddress ? window.ethereum : window.walletProvider;

    if (wallet) {
      if (
        (Number(wallet.networkVersion || wallet.chainId) !== rightChainId) &&
        history.location.pathname === '/igo'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, [window.ethereum, window.walletProvider]);

  return (
    <div className={styleIgo}>
      <Heading as="h3">IGO</Heading>
      <Text className="describe">
      This module integrates gaming and play to earn mechanism. It will allow users  to enjoy the fun game while benifit from the token gain.
      </Text>
      <div className={tabRow}>
        {
          tabList.map((e, i) => (
            <div key={i} className={`tabBtn ${tab === e[0] ? 'active' : ''}`} onClick={() => {handleTab(e[0])}}>{e[1]}</div>
          ))
        }
      </div>
      <Grid gap={50} height="max-content" templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}>
        {
          gameList.length > 0 ? gameList.map((g, i) => (
            <Box className={cardBox} key={i}>
              <img className="avatar" src={g.avatarUrl} alt=""/>
              {g.title && <Text className="title">{g.title}</Text>}
              {g.description && <Text className="desc">{g.description}</Text>}
              <div className="play" onClick={() => {handlePlay(g)}}>Play</div>
            </Box>
          )) : <div className={styleNoDataContainer}>{noDataSvg}</div>
        }
      </Grid>
      <SwitchModal visible={isShowSwitchModal} networkName={'BSC'} goToRightNetwork={goToRightNetwork} onClose={() => {
        setIsShowSwitchModal(false)
      }} />
    </div>
  )
}
export default IGOScreen

const styleIgo = css`
  border-radius: 1.429rem;
  padding: 30px 50px;
  position: relative;
  z-index: 0;
  @media (max-width: 900px) {
    padding: 15px;
  }
  h3 {
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 48px;
    line-height: 56px;
    letter-spacing: -0.02em;
    color: #23262F;
    @media (max-width: 900px)  {
      font-size: 2rem;
    }
  }
  .describe {
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
const tabRow = css`
  margin-bottom: 80px;
  .tabBtn{
    cursor: pointer;

    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    width: 80px;
    height: 38px;
    border: 1px solid #E6E8EC;
    box-sizing: border-box;
    border-radius: 5px;

    font-family: DM Sans,sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;

    color: #777E90;
    margin-right: 32px;
  }
  .active{
    background: #417ED9;
    color: #ffffff;
  }
`
const cardBox = css`
  border-radius: 20px;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  border: 2px solid #E6E8EC;
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  .avatar{
    border-radius: 20px;
    width: 100%;
    height: fit-content;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .title{
    margin: 46px 0 20px 0;
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 20px;
    /* identical to box height, or 83% */
    width: 100%;
    color: #1B2559;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .desc{
    font-family: Helvetica, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    color: #1B2559;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .play{
    cursor: pointer;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    margin-bottom: 32px;
    box-sizing: border-box;
    width: 165.21px;
    height: 45.36px;
    background: #0057D9;
    border-radius: 10px;
    font-family: DM Sans,sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
    color: #FCFCFD;
  }
`
const styleNoDataContainer = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  color: #233a7d;
`;

