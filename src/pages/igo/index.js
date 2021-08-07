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
import champion from '../../images/igo/champion.png';
import { busdContract, igoContract } from 'utils/contract';
import { igoAbi, busdAbi } from 'utils/abi';
import Web3 from 'web3';
import { toast } from 'react-toastify';

const IGOScreen = () => {
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

  const injectWallet = async () => {
    let ethereum = window.ethereum;
    console.log(ethereum, 'ethereum');

    if (ethereum) {
      console.log(ethereum, 'ethereum');
      setAddress(ethereum.selectedAddress);

      if (Number(ethereum.networkVersion) !== 97) {
        console.log(ethereum, '111');
        setIsWrongNetWork(true);
      } else {
        console.log(ethereum, '222');
        setIsWrongNetWork(false);
      }

      ethereum.on('networkChanged', (networkIDstring) => {
        if (Number(networkIDstring) !== 97) {
          setIsWrongNetWork(true);
        } else {
          setIsWrongNetWork(false);
        }
      });

      // 监听账号切换
      ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0]);
      });
    } else {
      alert('Please install wallet');
    }
  };

  const getMedalInfo = useCallback(async () => {
    if (window.ethereum) {
      let ethereum = window.ethereum;
      window.web3 = new Web3(ethereum);
      await ethereum.enable();

      const contractAddress = igoContract;
      const abi = igoAbi;

      const myContract = new window.web3.eth.Contract(abi, contractAddress);

      let medalIds = await Promise.all(
        [0, 1, 2].map((item) => myContract.methods.ids(item).call())
      );

      let data = await Promise.all(
        medalIds.map((item) => myContract.methods.tokenIds(item).call())
      );

      console.log(data,'data')

      const goldMintedTotal = Number(data[0][2]) < 5 ? 5 : Number(data[0][2]);
      const silverMintedTotal = Number(data[1][2]) < 5 ? 5 : Number(data[1][2]);
      const bronzeMintedTotal = Number(data[2][2]) < 5 ? 5 : Number(data[2][2]);
      setMedalData({
        Gold: {
          id: data[0][0],
          total: Number(data[0][1]),
          mintedTotal: goldMintedTotal,
          isValid: data[0][3],
        },
        Silver: {
          id: data[1][0],
          total: Number(data[1][1]),
          mintedTotal: silverMintedTotal,
          isValid: data[1][3],
        },
        Bronze: {
          id: data[2][0],
          total: Number(data[2][1]),
          mintedTotal: bronzeMintedTotal,
          isValid: data[2][3],
        },
        Total: {
          total: Number(data[0][1]) + Number(data[1][1]) + Number(data[2][1]),
          mintedTotal: goldMintedTotal + silverMintedTotal + bronzeMintedTotal,
          isValid: data[0][3] || data[1][3] || data[2][3],
        },
      });
    }
  }, []);

  const getRewardInfo = useCallback(async () => {
    if (address == undefined) {
      return;
    }

    if (window.ethereum) {
      let ethereum = window.ethereum;
      window.web3 = new Web3(ethereum);
      await ethereum.enable();

      const contractAddress = igoContract;
      const abi = igoAbi;

      const myContract = new window.web3.eth.Contract(abi, contractAddress);

      const isReward = await myContract.methods.rewards(address).call({
        from: address,
      });

      setIsReward(isReward > 0);
    }
  }, [address]);

  const handleRaffle = useCallback(async () => {
    setIsLoading(true);

    try {
      const myIgoContract = new window.web3.eth.Contract(igoAbi, igoContract);

      const raffle = await myIgoContract.methods.raffle().send({
        from: address,
      });

      toast.info(`success! txhash:${raffle.transactionHash}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      let nftId = raffle.events.Raffled.returnValues.nftId;
      setNftId(nftId);
      setShowSuccess(false);
      setShowRaffle(true);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const getIsApproved = useCallback(async () => {
    if (window.ethereum) {
      let ethereum = window.ethereum;
      window.web3 = new Web3(ethereum);
      await ethereum.enable();

      try {
        const myBusdContract = new window.web3.eth.Contract(
          busdAbi,
          busdContract
        );

        let allowance = await myBusdContract.methods
          .allowance(address, igoContract)
          .call();

        setIsApproved(allowance > 0);
      } catch (e) {
      } finally {
      }
    }
  }, [address]);

  const getBusdAmount = useCallback(async () => {
    if (window.ethereum) {
      let ethereum = window.ethereum;
      window.web3 = new Web3(ethereum);
      await ethereum.enable();

      try {
        const myBusdContract = new window.web3.eth.Contract(
          busdAbi,
          busdContract
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
  }, [address]);

  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      injectWallet();
    }
  }, [injectWallet, window.ethereum]);

  useEffect(() => {
    getMedalInfo();
    getRewardInfo();
    getIsApproved();
    getBusdAmount();
  }, [address, isWrongNetWork]);

  useEffect(() => {
    window.addEventListener('message', (ev) => {
      if (ev.origin === 'http://192.210.186.210') {
        console.log(ev, 'ev');
        setShowSuccess(true);
      }
    });
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('message', () => {});
    };
  }, [address]);

  return (
    <div className={styleContainer}>
      <img className={styleTopMedal} src={medal} />
      <img className={styleTitle} src={title} />
      <img className={styleFiveRings} src={fiveRings} />
      {!playing && (
        <img
          className={stylePlayButton}
          src={playButton}
          onClick={async () => {
            console.log(address, 'address');
            if (!address) {
              let ethereum = window.ethereum;
              await ethereum.enable();

              const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
              });
              const account = accounts[0];

              setAddress(account);
              return;
            }
            console.log(isWrongNetWork, 'isWrongNetWork');

            if (isWrongNetWork) {
              toast.dark('Please Choose BSC Testnet', {
                position: toast.POSITION.TOP_CENTER,
              });
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

      <img className={stylePodium} src={podium} />
      <img className={stylePeople} src={people} />
      <iframe
        style={{ visibility: playing ? 'visible' : 'hidden' }}
        className={styleIframeContainer}
        src='http://192.210.186.210/'
      ></iframe>
      <div className={styleBottomContainer}>
        <div>
          <div className={styleInfoContainer}>
            <span className='title'>Gold Medal</span>
            <span className='goal'>Goal：{medalData.Gold.total}</span>
            <div className='raised'>
              Raised：{medalData.Gold.total - medalData.Gold.mintedTotal}
            </div>
          </div>
          <div className={styleInfoContainer}>
            <span className='title'>Silver Medal</span>
            <span className='goal'>Goal：{medalData.Silver.total}</span>
            <div className='raised'>
              Raised：
              {medalData.Silver.total - medalData.Silver.mintedTotal}
            </div>
          </div>
        </div>
        <div>
          <div className={styleInfoContainer}>
            <span className='title'>Bronze Medal</span>
            <span className='goal'>Goal：{medalData.Bronze.total}</span>
            <div className='raised'>
              Raised：
              {medalData.Bronze.total - medalData.Bronze.mintedTotal}
            </div>
          </div>
          <div className={styleInfoContainer}>
            <span className='title'>All Medal’s</span>
            <span className='goal'>Goal：{medalData.Total.total}</span>
            <div className='raised'>
              Raised：{medalData.Total.total - medalData.Total.mintedTotal}
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className={styleChampionModal}>
          <span>You can claim your prize</span>
          <span>Participation rules rules rules rules rules</span>
          {!isApproved && (
            <div
              style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              className={styleButton}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const myBusdContract = new window.web3.eth.Contract(
                    busdAbi,
                    busdContract
                  );

                  await myBusdContract.methods
                    .approve(
                      igoContract,
                      Web3.utils.toBN(
                        '115792089237316195423570985008687907853269984665640564039457584007913129639935'
                      )
                    )
                    .send({
                      from: address,
                    });

                  setIsApproved(true);
                } catch (e) {
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? 'loading...' : 'Approved'}
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
              {isLoading ? 'loading...' : 'Raffle'}
            </div>
          )}
          {nftId > 0}
        </div>
      )}
      {showRaffle && (
        <img
          onClick={() => {
            setShowRaffle(false);
            setPlaying(false);
          }}
          className={styleMedalGif}
          src={require(`images/igo/${nftId}.gif`).default}
        />
      )}
      {showStepGif && (
        <img
          className={stylStepGif}
          src={require('images/igo/step.gif').default}
        />
      )}
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
  cursor: pointer;
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
`;

const styleChampionModal = css`
  background: url(${champion}) no-repeat 100% 100%;
  background-size: contain;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30vh;
  height: 50%;
  top: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4%;
  span {
    position: relative;
    top: 22%;
    padding: 0 20%;
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
  top: 25%;
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
  width: 30vh;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
`;

const stylStepGif = css`
  position: absolute;
  width: 50vh;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
`;
