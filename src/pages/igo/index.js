import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { Heading, Text, Box, Grid } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import comingSoon from 'images/igo/igoComingSoon.png';
import igoAvatar from 'images/igo/igoAvatar.png';
import {noDataSvg} from '../../utils/svg';


const mockGameList = [
  { title: 'Olympic BTC Synthesis', description: '', avatarUrl: igoAvatar, skipTo: '/igo/syncBtc' },
  // { title: '', description: 'DNFT provides gamers with a chance to win Gold, Silver or Bronze upon completion.', avatarUrl: comingSoon, isComing: true }
]
const IGOScreen = (props) => {
  let history = useHistory();

  const tabList = [[0, 'Ongoing'], [1, 'Ended']]
  const [tab, setTab] = useState(0)

  const [gameList, setGameList] = useState(mockGameList)
  const handleTab = (tab) => {
    setTab(tab)
    setGameList(tab === 0 ? mockGameList : [])
  }
  const handlePlay = (item) => {
    if (!item.isComing && item.skipTo) {
      history.push(item.skipTo)
    } else {
      toast('Coming soon!', {position: toast.POSITION.TOP_CENTER})
    }
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
          gameList.length > 0 ? gameList.map((g) => (
            <Box className={cardBox}>
              <img className="avatar" src={g.avatarUrl} alt=""/>
              {g.title && <Text className="title">{g.title}</Text>}
              {g.description && <Text className="desc">{g.description}</Text>}
              <div className="play" onClick={() => {handlePlay(g)}}>Play</div>
            </Box>
          )) : <div className={styleNoDataContainer}>{noDataSvg}</div>
        }
      </Grid>
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
