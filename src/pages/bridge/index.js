import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { css } from 'emotion';
import Tb2e from 'images/bridge/b2e.png';
import Te2b from 'images/bridge/e2b.png';
import { connect } from 'react-redux';

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
  </div>
}

const mapStateToProps = ({ profile }) => ({
  address: profile.address,
});
export default withRouter(connect(mapStateToProps)(BridgeScreen));


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

