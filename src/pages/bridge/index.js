import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { css } from 'emotion';
import Tb2e from 'images/bridge/b2e.png';
import Te2b from 'images/bridge/e2b.png';
import { connect } from 'react-redux';
import helper from 'config/helper';
import { Icon } from '@iconify/react';
import { Link } from '@chakra-ui/react';
import Title from 'components/Title'
import {Box} from '@chakra-ui/react';
const cardData = [
  {
    key: 'b2e',
    skipTo: '/bridge/transfer?fr=bsc&to=eth',
    isActive: true,
    avatar: Tb2e,
    txt: 'To transfer your BEP-20 DNF to ERC-20 DNF, you need to connect your wallet and switch to BSC Network!'
  },
  {
    key: 'e2b',
    skipTo: '/bridge/transfer?fr=eth&to=bsc',
    isActive: true,
    avatar: Te2b,
    txt: 'To transfer your ERC-20 DNF to BEP-20 DNF, you need to connect your wallet and switch to ETH Network!'
  },
]

const BridgeScreen = (props) => {
  let history = useHistory();
  const { address } = props;

  return <Box p={['20px', '20px', '20px', '50px']} className={styleBridge}>
    <Title title='Bridge' linkHelper={{
      youtubeLink: helper.bridge.youtube,
      youtubeTitle: helper.nftMagic.title,
      bookLink: helper.bridge.book,
      bookTitle: 'Mechanism'
    }} />
    {/* <div className='styleHeader'>
      <h3>Bridge</h3>
      <div style={{fontSize: '.8rem',  display: 'flex', alignItems: 'center'}}>
        <Link href={helper.bridge.youtube} isExternal color="#0057D9" fontStyle='italic' marginRight="20px" style={{display: 'flex', alignItems: 'center'}}
          display="inline-block">
          <Icon icon="logos:youtube-icon" fontSize={14} style={{marginRight: '10px'}} /> {helper.nftMagic.title}
        </Link>
        <Link href={helper.bridge.book} isExternal color="#0057D9" fontStyle='italic' style={{display: 'flex', alignItems: 'center'}}
          display="inline-block">
          <Icon icon="simple-icons:gitbook" fontSize={18} style={{marginRight: '10px', color: '#1d90e6'}} /> Mechanism
        </Link>
      </div>
    </div> */}
    <h5>
    $DNF is a multi-chain token. The bridge enable users transfer their $DNF across Ethereum and Binance Smart Chain. </h5>
    <div className={styleRow}>
      {
        cardData.map((item, i) => (
          <div className={styleCard} key={i}>
            <img src={item.avatar} alt=""/>
            <p>{item.txt}</p>
            <button onClick={() => {
              if (!address) {
                toast.warn('Please link wallet');
                return;
              }

              if (item.isActive && item.skipTo) {
                history.push(item.skipTo)
              } else {
                toast('Coming soon!')
              }
            }}>Bridging</button>
          </div>
        ))
      }
    </div>
  </Box>
}

const mapStateToProps = ({ profile }) => ({
  address: profile.address,
});
export default withRouter(connect(mapStateToProps)(BridgeScreen));


const styleBridge = css`
  position: relative;
  .styleHeader {
    display: flex;
    align-items: center;
  }
  h3 {
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 3rem;
    line-height: 3rem;
    letter-spacing: -0.02em;
    color: #23262F;
    margin-right: 30px;
  }
  h5 {
    margin: 34px 0 46px 0;
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
const styleRow = css`
  position: relative;
  display: grid;
  grid-gap: 50px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`
const styleCard = css`
  background: #FFFFFF;
  // border: 1px solid #E6E8EC;
  box-sizing: border-box;
  padding: 100px 50px 50px 50px;
  border-radius: 20px;
  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  }
  @media (max-width: 900px) {
    padding: 15px;
  }
  img{
    border-radius: 20px 20px 0 0;
    width: 100%;
    //height: fit-content;
  }
  p{
    margin: 40px 0;
    font-family: Helvetica, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 30px;
    /* or 167% */

    display: flex;
    align-items: center;
    text-align: center;

    color: #1B2559;
  }
  button{
    user-select: none;
    margin: 0 auto;
    display: flex;
    min-width: 177.37px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    box-sizing: border-box;


    background: #0057D9;
    border-radius: 10px;

    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 16px;
    text-align: center;

    color: #FCFCFD;
  }
`

