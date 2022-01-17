import React, {useState, useCallback, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { Heading, Text, Box, Grid, Link } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import igoAvatar from 'images/igo/igoAvatar.png';
import igoPokeAvatar from 'images/igo/poke-list-bg.png'
import {noDataSvg} from '../../utils/svg';
import globalConfig from '../../config/index';
import { Dialog, Button } from 'element-react';
import helper from 'config/helper';
import { Icon } from '@iconify/react';
import SwitchModal from 'components/SwitchModal';
import { getWallet } from 'utils/get-wallet';
import Title from 'components/Title'
import  { useTranslation } from 'react-i18next';


const IGOScreen = (props) => {
  let history = useHistory();
  const { t } = useTranslation();

  const mockGameList = [
    { title: t('igo.mockGamelist.title'), description: '', avatarUrl: igoAvatar, skipTo: '/igo/syncBtc' },
  ];
  const onGoingGameList = [
    { title: t('igo.pokeGameList.title'), description: '', avatarUrl: igoPokeAvatar, skipTo: '/igo/poke' },
  ]
  const tabList = [[0, t('igo.ongoing')], [1, t('igo.ended')]];

  const currentNetEnv = globalConfig.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const right16ChainId =  currentNetEnv === 'testnet' ? '0x61' : '0x38';
  const rightRpcUrl = currentNetEnv === 'testnet' ? ['https://data-seed-prebsc-1-s1.binance.org:8545/'] : ['https://bsc-dataseed.binance.org/'];

  const [tab, setTab] = useState(0)

  const [gameList, setGameList] = useState(onGoingGameList)
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);
  const handleTab = (tab) => {
    setTab(tab)
    if (tab === 0) {
      setGameList(onGoingGameList)
    } else if (tab === 1) {
      setGameList(mockGameList)
    }
  }
  const handlePlay = (item) => {
    if (tab === 1) {
      toast(t('toast.game.ended'))
      return
    }
    if (!item.isComing && item.skipTo) {
      history.push(item.skipTo)
    } else {
      toast(t('toast.come.soon'))
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
      console.error(t('toast.fail.setup.in.metamask'), error)
      return false
    }
  }, []);

  useEffect(() => {
    setIsShowSwitchModal(false)
    let wallet = getWallet();

    if (wallet) {
      if (
        (Number(wallet.networkVersion || wallet.chainId) !== rightChainId) &&
        history.location.pathname === '/igo'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, [window.onto, window.walletProvider, window.ethereum]);

  return (
    <div className={styleIgo}>
      <Title title={t('menu.igo')} linkHelper={{
        youtubeLink: helper.nftMagic.youtube,
        youtubeTitle: helper.nftMagic.title,
        bookLink: helper.nftMagic.book,
        bookTitle: t('book.title')
      }} />
      <Text className="describe">
        {t('igo.title')}
      </Text>
      <div className={tabRow}>
        {
          tabList.map((e, i) => (
            <div key={i} className={`tabBtn ${tab === e[0] ? 'active' : ''}`} onClick={() => {handleTab(e[0])}}>{e[1]}</div>
          ))
        }
      </div>
      <Grid gap={50} height="max-content" templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)']}>
        {
          gameList.length > 0 ? gameList.map((g, i) => (
            <Box className={cardBox} key={i}>
              <img className="avatar" src={g.avatarUrl} alt=""/>
              {g.title && <Text className="title">{g.title}</Text>}
              {g.description && <Text className="desc">{g.description}</Text>}
              <div className="play" onClick={() => {handlePlay(g)}}>{t('igo.play')}</div>
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
  padding: 50px 50px;
  position: relative;
  z-index: 0;
  .styleHeader {
    display: flex;
    align-items: center;
  }
  @media (max-width: 900px) {
    padding: 15px;
  }
  h3 {
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 3rem;
    line-height: 3rem;
    letter-spacing: -0.02em;
    color: #23262F;
    margin: 0;
    margin-right: 30px;
    @media (max-width: 900px)  {
      font-size: 2rem;
    }
  }
  .describe {
    margin: 30px 0 50px 0;
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
  margin-bottom: 30px;
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
    border-radius: 10px;

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
  // padding: 10px;
  box-sizing: border-box;
  width: 100%;
  // border: 2px solid #E6E8EC;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
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
    margin: 30px 0 30px 0;
    font-family: Archivo Black;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
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
    margin-bottom: 30px;
    box-sizing: border-box;
    width: 165.21px;
    height: 40px;
    background: #0057D9;
    border-radius: 10px;
    font-family: Archivo Black;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
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

