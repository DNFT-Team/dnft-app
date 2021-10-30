import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { css } from 'emotion';
import comingSoon from 'images/igo/igoComingSoon.png';

const cardData = [
  {
    key: 'b2e',
    param: {from: 'BSC', to: 'ETH', target: 'DNF', protocol: 'BEP-20'},
    skipTo: '/bridge/transfer',
    isActive: false,
    avatar: comingSoon,
    txt: 'To transfer your BEP-20 DNF to ERC-20 DNF, you need to connect your wallet and switch to BSC Network!'
  },
  {
    key: 'e2b',
    param: {from: 'ETH', to: 'BSC', target: 'DNF', protocol: 'ERC-20'},
    skipTo: '/bridge/transfer',
    isActive: true,
    avatar: comingSoon,
    txt: 'To transfer your ERC-20 DNF to BEP-20 DNF, you need to connect your wallet and switch to ETH Network!'
  },
]

const BridgeScreen = (props) => {
  let history = useHistory();

  return <div className={styleBridge}>
    <h3>Bridge</h3>
    <h5>
      Choose
      <strong>“Single”</strong>
      if you want your collectible to be one of a kind or
      <strong>“Multiple”</strong>
      if you want to sell one collectible multiple times</h5>
    <div className={styleRow}>
      {
        cardData.map((item, i) => (
          <div className={styleCard} key={i}>
            <img src={item.avatar} alt=""/>
            <p>{item.txt}</p>
            <button onClick={() => {
              if (item.isActive && item.skipTo) {
                history.push(item.skipTo, {key: item.key, param: item.param})
              } else {
                toast('Coming soon!')
              }
            }}>Bridging</button>
          </div>
        ))
      }
    </div>
  </div>
}

export default BridgeScreen;

const styleBridge = css`
  position: relative;
  padding: 30px 50px;
  h3 {
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 48px;
    line-height: 56px;
    letter-spacing: -0.02em;
    color: #23262F;
  }
  h5 {
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
const styleRow = css`
  position: relative;
  display: grid;
  grid-gap: 50px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`
const styleCard = css`
  background: #FFFFFF;
  border: 1px solid #E6E8EC;
  box-sizing: border-box;
  padding: 30px 50px;
  border-radius: 20px;
  img{
    border-radius: 20px 20px 0 0;
    width: 100%;
    height: fit-content;
    background-color: #1b225c;
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

