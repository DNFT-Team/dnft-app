import React, {useState, useCallback, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { Heading, Text, Box, Grid } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import comingSoon from 'images/igo/igoComingSoon.png';
import igoAvatar from 'images/igo/igoAvatar.png';
import {noDataSvg} from '../../utils/svg';
import globalConfig from '../../config/index';
import { Dialog, Button } from 'element-react';

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

  const goToRightNetwork = useCallback(async (ethereum) => {
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
    let ethereum = window.ethereum;

    if (ethereum) {
      if (
        Number(ethereum.networkVersion) !== rightChainId &&
        history.location.pathname === '/igo'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, []);

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

  return (
    <div className={styleIgo}>
      <Heading as="h3">IGO</Heading>
      <Text className="describe">
        Choose “Single” if you want your collectible to be one of a kind or “<strong>Multiple</strong>” if you want to sell one collectible multiple times
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
      {renderShowSwitchModal()}
    </div>
  )
}
export default IGOScreen

const styleIgo = css`
  border-radius: 1.429rem;
  padding: 30px 50px;
  position: relative;
  z-index: 0;
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
