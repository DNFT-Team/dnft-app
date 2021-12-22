import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Button } from 'element-react';
import { css } from 'emotion';
import bg from 'images/igo/game-bg.png';
import medal from 'images/igo/medal.png';
import title from 'images/igo/title.png';
import fiveRings from 'images/igo/five-rings.png';
import podium from 'images/igo/podium.png';
import playButton from 'images/igo/play-button.png';
import infoBg from 'images/igo/info-bg.png';
import people from 'images/igo/people.png';
import champion from 'images/igo/champion.png';
import asset from 'images/igo/asset.png';
import {Icon} from '@iconify/react'
import { busdContract, igoContract, nft1155Contract } from 'utils/contract';
import { igoAbi, busdAbi } from 'utils/abi';
import Web3 from 'web3';
import { WEB3_MAX_NUM } from 'utils/web3Tools';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import globalConfig from '../../../config/index';
import SwitchModal from 'components/SwitchModal';
import { getWallet } from 'utils/get-wallet';

const iframeUrl = `https://fun.dnft.world/${globalConfig.net_env === 'mainnet' ? 'syncbtc' : 'test_syncbtc'}/`

const SyncBtcScreen = (props) => {
  let history = useHistory();
  const { token } = props;

  const [address, setAddress] = useState();
  const [medalData, setMedalData] = useState({
    Gold: {},
    Silver: {},
    Bronze: {},
    Total: {},
  });
  const [isReward, setIsReward] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftId, setNftId] = useState();
  const [hasAmount, setHasAmount] = useState(false);
  const [isWrongNetWork, setIsWrongNetWork] = useState(false);
  const [showRaffle, setShowRaffle] = useState(false);
  const [showStepGif, setShowStepGif] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);

  const currentNetEnv = globalConfig.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const right16ChainId =  currentNetEnv === 'testnet' ? '0x61' : '0x38';
  const rightRpcUrl = currentNetEnv === 'testnet' ? ['https://data-seed-prebsc-1-s1.binance.org:8545/'] : ['https://bsc-dataseed.binance.org/'];
  const isTestnet = currentNetEnv === 'testnet';

  const injectWallet = async () => {
    let wallet = getWallet();

    if (wallet) {
      if (
        (Number(wallet.networkVersion || wallet.chainId) !== rightChainId) && history.location.pathname === '/igo/syncBtc') {
        setIsWrongNetWork(true);
      } else {
        setIsWrongNetWork(false);
      }

      setAddress(wallet.selectedAddress || wallet.accounts[0]);
      // 监听账号切换
      wallet.on('accountsChanged', (accounts) => {
        setAddress(accounts[0]);
      });
    } else {
      alert('Please install wallet');
    }
  };

  const getMedalInfo = useCallback(async () => {
    let wallet = getWallet();

    if (wallet) {
      window.web3 = new Web3(wallet);

      const contractAddress = igoContract[currentNetEnv];
      const abi = igoAbi;

      const myContract = new window.web3.eth.Contract(abi, contractAddress);

      let medalIds = await Promise.all(
        [0, 1, 2].map((item) => myContract.methods.ids(item).call())
      );

      let data = await Promise.all(
        medalIds.map((item) => myContract.methods.tokenIds(item).call())
      );

      const isNotEnough =
        Number(data[0][1]) -
          Number(data[0][2]) +
          Number(data[1][1]) -
          Number(data[1][2]) +
          Number(data[2][1]) -
          Number(data[2][2]) ===
        0;

      setMedalData({
        Gold: {
          id: data[0][0],
          total: Number(data[0][1]),
          mintedTotal: data[0][2],
          isValid: data[0][3],
        },
        Silver: {
          id: data[1][0],
          total: Number(data[1][1]),
          mintedTotal: data[1][2],
          isValid: data[1][3],
        },
        Bronze: {
          id: data[2][0],
          total: Number(data[2][1]),
          mintedTotal: data[2][2],
          isValid: data[2][3],
        },
        Total: {
          total: Number(data[0][1]) + Number(data[1][1]) + Number(data[2][1]),
          mintedTotal: data[0][2] + data[1][2] + data[2][2],
          isValid: data[0][3] || data[1][3] || data[2][3],
          isNotEnough: isNotEnough,
        },
      });
    }
  }, [getWallet]);

  const getRewardInfo = useCallback(async () => {
    if (address == undefined) {
      return;
    }

    let wallet = getWallet();
    if (wallet) {
      window.web3 = new Web3(wallet);

      const contractAddress = igoContract[currentNetEnv];
      const abi = igoAbi;

      const myContract = new window.web3.eth.Contract(abi, contractAddress);

      const isReward = await myContract.methods.rewards(address).call({
        from: address,
      });

      setIsReward(isReward > 0);
    }
  }, [address, getWallet]);

  const getFormatName = (nftId) => {
    switch (nftId) {
    case '100':
      return 'Gold';
    case '200':
      return 'Silver';
    case '300':
      return 'Bronze';
    }
  };

  const handleRaffle = useCallback(async () => {
    setIsLoading(true);

    try {
      const myIgoContract = new window.web3.eth.Contract(
        igoAbi,
        igoContract[currentNetEnv]
      );

      const raffle = await myIgoContract.methods.raffle().send({
        from: address,
      });

      toast.info(`success! txhash:${raffle.transactionHash}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      let nftId = raffle.events.Raffled.returnValues.nftId;

      await post(
        '/api/v1/nft/',
        {
          name: `${getFormatName(nftId)} Medal NFT`,
          address: address,
          chainType: 'BSC',
          supply: 1,
          hash: raffle.transactionHashraffle.transactionHash,
          avatorUrl: `https://dnft.world/igo/${nftId}.png`,
          tokenAddress: nft1155Contract[currentNetEnv],
          tokenId: nftId,
          category: 'Game',
          collectionId: -1,
        },
        token
      );

      setNftId(nftId);
      setShowSuccess(false);
      setShowRaffle(true);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const getIsApproved = useCallback(async () => {
    let wallet = getWallet();
    if (wallet) {
      window.web3 = new Web3(wallet);

      try {
        const myBusdContract = new window.web3.eth.Contract(
          busdAbi,
          busdContract[currentNetEnv]
        );

        let allowance = await myBusdContract.methods
          .allowance(address, igoContract[currentNetEnv])
          .call();

        setIsApproved(allowance > 0);
      } catch (e) {
      } finally {
      }
    }
  }, [address, getWallet]);

  const getBusdAmount = useCallback(async () => {
    let wallet = getWallet();
    if (wallet) {
      window.web3 = new Web3(wallet);

      try {
        const myBusdContract = new window.web3.eth.Contract(
          busdAbi,
          busdContract[currentNetEnv]
        );

        let amount = await myBusdContract.methods.balanceOf(address).call();
        if (amount > 0) {
          setHasAmount(true);
        } else {
          setHasAmount(false);
        }
      } catch (e) {
      } finally {
      }
    }
  }, [address, getWallet]);

  useEffect(() => {
    let wallet = getWallet();

    if (wallet) {
      injectWallet();
    }
  }, [injectWallet, getWallet]);

  useEffect(() => {
    if (isTestnet) {
      getMedalInfo();
      getRewardInfo();
      getIsApproved();
      getBusdAmount();
    } else {
      setMedalData({
        Gold: {
          total: 50,
          mintedTotal: 50,
        },
        Silver: {
          total: 450,
          mintedTotal: 450,
        },
        Bronze: {
          total: 2500,
          mintedTotal: 2500,
        },
        Total: {
          total: 3000,
          mintedTotal: 3000,
        },
      })
    }
  }, [address, isWrongNetWork]);

  useEffect(() => {
    window.addEventListener('message', (ev) => {
      if (ev.origin === 'https://fun.dnft.world') {
        setShowConfirmSuccess(true);
      }
    });
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('message', () => {});
    };
  }, [address]);

  useEffect(() => {
    setIsShowSwitchModal(false)
    let wallet = getWallet();

    if (wallet) {
      if (
        (Number(wallet.networkVersion || wallet.chainId) !== rightChainId) &&
        history.location.pathname === '/igo/syncBtc'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, [getWallet]);

  const goToRightNetwork = useCallback(async () => {
    const ethereum = window.ethereum;
    try {
      if (history.location.pathname !== '/igo/syncBtc') {
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

  return (
    <div className={styleContainer}>
      <Icon className={styleBackArrow} icon="ic:round-arrow-back-ios-new" onClick={() => {history.push('/igo')}}/>
      <img className={styleTopMedal} src={medal} alt="img" />
      <img className={styleTitle} src={title} alt="img" />
      <img className={styleFiveRings} src={fiveRings} alt="img" />
      {!playing && (
        <img
          alt="img"
          className={isTestnet ? stylePlayButton : styleStopPlayButton}
          src={playButton}
          onClick={async () => {
            if (!isTestnet) {
              toast.info('Ended!', {
                position: toast.POSITION.TOP_CENTER,
              });
              return;
            }
            let wallet = getWallet();

            if (medalData.Total.isNotEnough) {
              toast.info('Ended', {
                position: toast.POSITION.TOP_CENTER,
              });
              return;
            }

            if (!address) {

              const accounts = await wallet.request({
                method: 'eth_requestAccounts',
              });
              const account = accounts[0];

              setAddress(account);
              return;
            }

            if (isWrongNetWork && history.location.pathname === '/igo/syncBtc') {
              setIsShowSwitchModal(true);
              return;
            }

            if (!hasAmount) {
              toast.info('Not Enough BUSD', {
                position: toast.POSITION.TOP_CENTER,
              });
              return;
            }

            if (isReward) {
              toast.info('You Have Been Rewarded', {
                position: toast.POSITION.TOP_CENTER,
              });
              return;
            }

            setShowStepGif(true);
            setTimeout(() => {
              setPlaying(true);
              setShowStepGif(false);
            }, 4000);
          }}
        />
      )}
      <span
        className={stylePlayRule}
        onClick={() => {
          setShowRuleModal(true);
        }}
      >
        GAME RULES
      </span>
      <img className={stylePodium} src={podium} alt="img" />
      <img className={stylePeople} src={people} alt="img" />
      <iframe
        style={{ visibility: playing ? 'visible' : 'hidden' }}
        className={styleIframeContainer}
        src={iframeUrl}
      />
      <div className={styleBottomContainer}>
        <div>
          <div className={styleInfoContainer}>
            <span className='title'>Gold Medal NFT</span>
            <span className='goal'>Supply：{medalData.Gold.total}</span>
            <div className='raised' style={{visibility: !isTestnet && 'hidden', height: !isTestnet && '16px' }}>Minted：{medalData.Gold.mintedTotal}</div>
          </div>
          <div className={styleInfoContainer}>
            <span className='title'>Silver Medal NFT</span>
            <span className='goal'>Supply：{medalData.Silver.total}</span>
            <div className='raised' style={{visibility: !isTestnet && 'hidden', height: !isTestnet && '16px' }}>
              Minted：
              {medalData.Silver.mintedTotal}
            </div>
          </div>
        </div>
        <div>
          <div className={styleInfoContainer}>
            <span className='title'>Bronze Medal NFT</span>
            <span className='goal'>Supply：{medalData.Bronze.total}</span>
            <div className='raised' style={{visibility: !isTestnet && 'hidden', height: !isTestnet && '16px' }}>
              Minted：
              {medalData.Bronze.mintedTotal}
            </div>
          </div>
          <div className={styleInfoContainer}>
            <span className='title'>All Medal’s NFT</span>
            <span className='goal'>Supply：{medalData.Total.total}</span>
            <div className='raised' style={{visibility: !isTestnet && 'hidden', height: !isTestnet && '16px' }}>Minted：{medalData.Total.mintedTotal}</div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className={styleChampionModal}>
          <span>Claim Your Prize</span>
          <span>
            It will cost you 20 BUSD to claim a DNFT Medal NFT. You will
            randomly get a Gold/Silver/Bronze Medal NFT for further airdop
            benefit.
          </span>
          {!isApproved && (
            <div
              style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              className={styleButton}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const myBusdContract = new window.web3.eth.Contract(
                    busdAbi,
                    busdContract[currentNetEnv]
                  );

                  await myBusdContract.methods
                    .approve(igoContract[currentNetEnv], WEB3_MAX_NUM)
                    .send({ from: address });

                  setIsApproved(true);
                } catch (e) {
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? 'loading...' : 'Approve'}
            </div>
          )}
          {isApproved && (
            <div
              style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              className={styleButton}
              onClick={async () => {
                await handleRaffle();
              }}
            >
              {isLoading ? 'loading...' : 'Claim'}
            </div>
          )}
          {nftId > 0}
        </div>
      )}
      {showRaffle && (
        <div className={styleMedalGif}>
          <img src={require(`images/igo/${nftId}.gif`).default} />
          <img
            className='asset'
            src={asset}
            onClick={() => {
              history.push('/asset');
            }}
          />
          <span>
            Congratulations! Click the button below to check you DNFT Medal NFT.
          </span>
        </div>
      )}
      {showStepGif && (
        <img
          className={stylStepGif}
          src={require('images/igo/step.gif').default}
        />
      )}
      <div
        className={styleRuleModal}
        style={{
          opacity: showRuleModal ? 0.8 : 0,
          visibility: showRuleModal ? 'visible' : 'hidden',
        }}
      >
        <h1>Olympic BTC Synthesis Game</h1>
        <b>Goal: </b>
        <p>Try to synthesize a Bitcoin</p>
        <b>Rules: </b>
        <p>
          1. 100% Winning a Medal NFT once you have synthesized into BNB, you
          can get your Medal NFT by claiming it.
        </p>
        <p>2.The Medal NFT claiming will cost you 20 BUSD.</p>
        <p>
          {
            '3.The Synthetic path: DNF--> EOS--> HT--> DOT--> UNI--> FIL--> LTC--> BNB--> BCH--> ETH-->BTC.'
          }
        </p>
        <p>
          4.The total amount of Gold/Silver/Bronze medal NFT are 50/450/2500.
        </p>
        <p>5.Each address is only allowed to participate once.</p>
        {!isTestnet && <p>6.Start Date: 2021-08-08, End Date: 2021-08-28.</p>}

        <b>Rewards:</b>
        <p>
          1.Gold/Silver/Bronze medal NFT holders will get an airdrop of
          100/50/25 DNF when TGE.
        </p>
        <p>
          2.Gold/Silver/Bronze medal NFT holders will have the right of
          generation rights of DNFT Protocol, which includes continuous
          activity/airdrop white list, old friends rights, test product
          experience, etc.
        </p>
        <div
          className={styleClose}
          onClick={() => {
            setShowRuleModal(false);
          }}
        >
          ❌
        </div>
      </div>
      {showConfirmSuccess && (
        <div className={styleConfirmSuccessModal}>
          <span>Congratulations on your success!</span>
          <span>Do you wanna get your reward now?</span>
          <div>
            <div
              onClick={() => {
                setShowConfirmSuccess(false);
              }}
            >
              No
            </div>
            <div
              onClick={() => {
                setShowSuccess(true);
                setShowConfirmSuccess(false);
              }}
            >
              Yes
            </div>
          </div>
        </div>
      )}
      <SwitchModal visible={isShowSwitchModal} networkName={'BSC'} goToRightNetwork={goToRightNetwork} onClose={() => {
        setIsShowSwitchModal(false)
      }} />
    </div>
  );
};

const mapStateToProps = ({ profile }) => ({
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(SyncBtcScreen));

const styleBackArrow = css`
  position: absolute;
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 10px;
  top: 10px;
  left: 10px;
  height: 24px;
  width: 24px;
  background: azure;
  color: #b3bac6;
  cursor: pointer;
  transition: all .3s ease-in-out;
  &:hover{
    color: #0834e8;
    opacity: .8;
  }
`;

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

const styleStopPlayButton = css`
  top: 52%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: not-allowed;
  width: 10%;
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
`

const stylePlayButton = css`
  @keyframes slidein {
    0%,
    100% {
      width: 10%;
    }

    50% {
      width: 12%;
    }
  }
  top: 52%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: 2000ms infinite;
  animation-name: slidein;
`;

const stylePlayRule = css`
  top: 62%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  color: #ff504a;
  font-weight: bolder;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid #ff6059;
  padding: 12px 36px;
  border-radius: 100px;
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
  margin: 0 4vw;
  position: absolute;
  bottom: 6vh;
  width: calc(100% - 8vw);
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

const styleIframeContainer = css`
  height: 75vh;
  width: 50vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 6vh;
  border-radius: 30px;
  box-shadow: 0px 0px 12px;
  z-index: 1000;
`;

const styleChampionModal = css`
  background: url(${champion}) no-repeat 100% 100%;
  background-size: contain;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 260px;
  height: 68%;
  top: 20%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  z-index: 1100;
  span {
    position: relative;
    top: 30%;
    padding: 0 40px;
    font-size: 12px;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
    &:first-child {
      color: #003129;
      font-weight: bold;
    }
  }
`;

const styleButton = css`
  background: #ff6059;
  position: relative;
  top: 31%;
  padding: 4px 16px;
  font-size: 12px;
  border-radius: 6px;
  box-shadow: 0px 3px 3px rgb(0 0 0 / 25%), 0px 2px 0px #aa1c16;
  width: fit-content;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: bolder;
  cursor: pointer;
`;

const styleMedalGif = css`
  position: absolute;
  height: 75vh;
  width: 50vh;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    cursor: pointer;
    color: #ff504a;
    font-weight: bolder;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.6);
    border: 2px solid #ff6059;
    padding: 12px 36px;
    border-radius: 100px;
  }
  .asset {
    top: -12vh;
    position: relative;
    width: 20vh;
    cursor: pointer;
  }
  span {
    top: -12vh;
    position: relative;
    font-size: 12px;
    color: white;
    padding: 0 60px;
    top: -8vh;
    text-align: center;
  }

  img {
    width: 30vh;
  }
`;

const stylStepGif = css`
  position: absolute;
  width: 50vh;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
`;

const styleRuleModal = css`
  position: relative;
  width: 800px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  background: #ffffff;
  box-shadow: inset 0px 11px 50px rgba(15, 52, 66, 0.2);
  border-radius: 20px;
  padding: 20px 32px;
  transition: opacity 0.5s;
  h1 {
    font-size: 40px;
    margin: 0;
    margin-bottom: 30px;
    font-weight: bolder;
    line-height: 1.5;
  }
  b {
    margin: 20px 0 0 0;
    display: block;
    line-height: 2;
  }
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const styleClose = css`
  position: absolute;
  right: 30px;
  top: 26px;
  font-size: 24px;
  cursor: pointer;
`;

const styleConfirmSuccessModal = css`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.25) 0%,
      rgba(255, 255, 255, 0.25) 100%
    ),
    #5ae9d7;
  background-blend-mode: soft-light, normal;
  box-shadow: inset 0px 0px 18px 3px rgba(0, 0, 0, 0.5);
  border-radius: 12.2px;
  width: 280px;
  height: 80px;
  padding: 30px 16px;
  color: #006b5a;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 1050;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    top: 30px;
    width: 100%;
    justify-content: space-evenly;
    div {
      background: #ff6059;
      position: relative;
      padding: 4px 20px;
      font-size: 14px;
      border-radius: 6px;
      box-shadow: 0px 3px 3px rgb(0 0 0 / 25%), 0px 2px 0px #aa1c16;
      width: fit-content;
      color: white;
      font-weight: bolder;
      cursor: pointer;
    }
  }
`;
