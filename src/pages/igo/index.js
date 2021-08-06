import React, { useCallback, useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import bg from '../../images/igo/game-bg.png';
import medal from '../../images/igo/medal.png';
import title from '../../images/igo/title.png';
import fiveRings from '../../images/igo/five-rings.png';
import podium from '../../images/igo/podium.png';
import playButton from '../../images/igo/play-button.png';
import infoBg from '../../images/igo/info-bg.png';
import people from '../../images/igo/people.png';
import { toast } from 'react-toastify';

const IGOScreen = () => {
  const [address, setAddress] = useState();

  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      setAddress(ethereum.selectedAddress);

      // 监听账号切换
      ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0]);
      });
    } else {
      alert('Please install wallet');
    }
  }, [address]);

  useEffect(() => {
    injectWallet();
  }, [injectWallet]);

  return (
    <div className={styleContainer}>
      <img className={styleTopMedal} src={medal} />
      <img className={styleTitle} src={title} />
      <img className={styleFiveRings} src={fiveRings} />
      <img
        className={stylePlayButton}
        src={playButton}
        onClick={async () => {
          if (address) {
            return;
          }
          let ethereum = window.ethereum;
          await ethereum.enable();
          const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
          });
          const account = accounts[0];

          setAddress(account);
        }}
      />
      <img className={stylePodium} src={podium} />
      <img className={stylePeople} src={people} />
      <div className={styleBottomContainer}>
        <div>
          <div className={styleInfoContainer}>
            <span className='title'>Gold Medal</span>
            <span className='goal'>Goal：1,000</span>
            <div className='raised'>Raised：999</div>
          </div>
          <div className={styleInfoContainer}>
            <span className='title'>Silver Medal</span>
            <span className='goal'>Goal：1,000</span>
            <div className='raised'>Raised：999</div>
          </div>
        </div>
        <div>
          <div className={styleInfoContainer}>
            <span className='title'>Bronze Medal</span>
            <span className='goal'>Goal：1,000</span>
            <div className='raised'>Raised：999</div>
          </div>
          <div className={styleInfoContainer}>
            <span className='title'>All Medal’s</span>
            <span className='goal'>Goal：1,000</span>
            <div className='raised'>Raised：999</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IGOScreen;

const styleContainer = css`
  background: url(${bg}) no-repeat 100% 100%;
  height: 100%;
  background-size: cover;
  position: relative;
`;

const styleTopMedal = css`
  width: 22%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
`;

const styleTitle = css`
  top: 16%;
  width: 45%;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
`;

const styleFiveRings = css`
  width: 10%;
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const stylePlayButton = css`
  width: 10%;
  top: 60%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const stylePodium = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 72%;
  width: 15%;
`;

const stylePeople = css`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 40vh;
  width: auto;
`;

const styleBottomContainer = css`
  display: flex;
  flex-direction: row;
  margin: 0 8%;
  position: absolute;
  bottom: 6vh;
  width: 84%;
  justify-content: space-between;
  gap: 0 20%;
  & > div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10%;
    &:first-child {
      justify-content: flex-start;
    }
    &:last-child {
      justify-content: flex-end;
    }
  }
`;

const styleInfoContainer = css`
  background: url(${infoBg}) no-repeat 100% 100%;
  width: 8vw;
  min-width: 180px;
  background-size: contain;
  padding: 2vh 1vw 2vh 1vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: white;
  justify-content: center;
  gap: 4px;
  .title {
    font-size: 20px;
    font-weight: bolder;
    white-space: nowrap;
  }
  .goal {
    font-size: 16px;
    font-weight: 300;
  }
  .raised {
    background: #01aef3;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding: 2% 10%;
    font-size: 18px;
    font-weight: bolder;
    white-space: nowrap;
  }
`;
