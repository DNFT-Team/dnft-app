import { Dialog, InputNumber, Loading } from 'element-react';
import { css, cx } from 'emotion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  firstStakeAbi,
  secondStakeAbi,
  thirdStakeAbi,
  tokenAbi,
} from 'utils/abi';
import {
  tokenContract,
  firstStakeContract,
  secondStakeConTract,
  thirdStakeConTract,
} from 'utils/contract';
import Web3 from 'web3';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import cloneDeep from 'lodash.clonedeep';
import { useHistory } from 'react-router';
import bg from '../../images/mining/bg.svg';
import nft from '../../images/mining/logo.svg';
import label from '../../images/mining/label.svg';
import defaultHeadSvg from '../../images/asset/Head.svg';
import contractSvg from '../../images/mining/contract.svg';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import globalConfig from '../../config'
import helper from '../../config/helper';
import {Icon} from '@iconify/react';
import {Link, Divider} from '@chakra-ui/react';
import { setRem } from 'utils/rem';
import isMobile from 'utils/isMobile';

export const stakingJson = [{
  'name': 'The Spirit Of Silence',
  'description': 'There is a lost story about a mysterious, magical and pure soul woman who lives in the forest, hidden in the roots of a tree. Her beauty is unmatched and her mystery invisible, since she cannot be seen so easily. It could only be present before you, if you connect with the spirit of silence.',
  'image': 'https://www.dnft.world/staking/pool1.png'
}, {
  'name': 'FRIDA\'S TEARS',
  'description': 'I drank to drown my sorrows, but the damned things learned how to swim.',
  'image': 'https://www.dnft.world/staking/pool2.png',
}, {
  'name': 'THERE ARE NO STRANGE LANDS',
  'description': 'There are no strange lands. It is the traveler who is the only stranger.',
  'image': 'https://www.dnft.world/staking/pool3.png',
}]
const Mining = (props) => {
  let history = useHistory();
  const { token } = props;

  const initState = useMemo(
    () => ({
      0: {
        isApprove: false,
        isApproveLoading: false,
        isStaking: false,
        unstakeLoadingIndex: [],
        isClaiming: false,
      },
      1: {
        isApprove: false,
        isApproveLoading: false,
        isStaking: false,
        unstakeLoadingIndex: [],
        isClaiming: false,
      },
      2: {
        isApprove: false,
        isApproveLoading: false,
        isStaking: false,
        unstakeLoadingIndex: [],
        isClaiming: false,
      },
    }),
    []
  );

  const [balance, setBalance] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Ongoing');
  const [stakeTab, setStakeTab] = useState('stake');
  const [isVisible, setIsVisible] = useState(false);
  const [stakeIndex, setStakeIndex] = useState(0);
  const [stakeData, setStakeData] = useState([]);
  const [stakeValue, setStakeValue] = useState();
  const [isWrongNetWork, setIsWrongNetWork] = useState(false);
  const [isBalanceLoading, setBalanceIsLoading] = useState(false);
  const [isStakeInfoLoading, setIsStakeInfoLoading] = useState(false);
  const [isUnStakeLoading, setIsUnStakeLoading] = useState(false);

  const [stateData, setStateData] = useState(initState);
  const rightChainId =  globalConfig.net_env === 'testnet' ? 4 : 56;

  const getBalance = async () => {
    try {
      setBalanceIsLoading(true);

      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });

        const account = accounts[0];

        const contractAddress = tokenContract;
        const myContract = new window.web3.eth.Contract(
          tokenAbi,
          contractAddress
        );
        const dnftBalance = await myContract.methods.balanceOf(account).call({
          from: account,
        });
        setBalance((dnftBalance * Math.pow(10, -18)).toFixed(2));
      }
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setBalanceIsLoading(false);
    }
  };

  const getFormatNumber = (count) => (count * Math.pow(10, -18)).toFixed(2);

  const getItemStakeInfoByContract = useCallback(
    async (abi, stakeContract, account) => {
      const contractAddress = stakeContract;
      const myContract = new window.web3.eth.Contract(abi, contractAddress);

      let totalReward = await myContract.methods.totalReward().call();
      totalReward = getFormatNumber(totalReward);

      let totalStaked = await myContract.methods.totalStaked().call();
      totalStaked = getFormatNumber(totalStaked);

      let totalLocked = await myContract.methods.totalValueLocked().call();
      totalLocked = getFormatNumber(totalLocked);

      let duration = await myContract.methods.duration().call();
      duration = duration / 60 / 60 / 24;

      let rewardRate = await myContract.methods.rewardRate().call();
      rewardRate = getFormatNumber(rewardRate * 100 * (12 / (duration / 30)));

      let stakeListLength = await myContract.methods
        .getStakeInfoLength(account)
        .call({
          _addr: account,
        });

      let stakeInfoList = [];
      let rewardList = [];

      for (let i = 0; i < stakeListLength; i++) {
        let currentStakeInfo = await myContract.methods
          .getStakeInfo(account, i)
          .call({
            _addr: account,
            idx: i,
          });

        let currentRewardInfo = await myContract.methods
          .getReward(account, i)
          .call({
            _addr: account,
            idx: i,
          });

        stakeInfoList.push(currentStakeInfo);
        rewardList.push(currentRewardInfo);
      }

      let isRewardNft = await myContract.methods.isRewardNftOf(account).call();
      let isClaimNft = await myContract.methods.isClaimNftOf(account).call();

      return {
        rewardRate,
        totalReward,
        duration,
        stakeInfoList,
        totalStaked,
        totalLocked,
        abi,
        stakeContract,
        account,
        rewardList,
        isRewardNft,
        isClaimNft
      };
    },
    []
  );

  const getStakeInfo = useCallback(async () => {
    try {
      setIsStakeInfoLoading(true);
      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });

        const account = accounts[0];
        let firstStakeInfo = await getItemStakeInfoByContract(
          firstStakeAbi,
          firstStakeContract,
          account
        );
        let secondStakeInfo = await getItemStakeInfoByContract(
          secondStakeAbi,
          secondStakeConTract,
          account
        );
        let thirdStakeInfo = await getItemStakeInfoByContract(
          thirdStakeAbi,
          thirdStakeConTract,
          account
        );

        setStakeData([firstStakeInfo, secondStakeInfo, thirdStakeInfo]);
      }
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setIsStakeInfoLoading(false);
    }
  }, [getItemStakeInfoByContract]);

  const init = useCallback(async (doNotNeedModalHidden) => {
    if (!doNotNeedModalHidden) {
      setIsVisible(false);
    }
    setStakeValue(undefined);
    await getBalance();
    await getStakeInfo();
    setIsUnStakeLoading(false)
  }, [getStakeInfo]);

  useEffect(() => {
    init();
  }, [init]);

  const goToRightNetwork = useCallback(async (ethereum) => {
    if (history.location.pathname !== '/mining') {
      return;
    }
    try {
      let result;

      if (globalConfig.net_env === 'testnet') {
        result = await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: '0x4',
            },
          ],
        })
      } else {
        result = await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
            },
          ],
        });
      }

      if (result === null) {
        setIsWrongNetWork(false);
      } else {
        setIsWrongNetWork(true);
      }
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  }, []);

  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      if (Number(ethereum.networkVersion) !== rightChainId && history.location.pathname === '/mining') {
        setIsWrongNetWork(true)
        goToRightNetwork(ethereum);
      } else {
        setIsWrongNetWork(false);
      }
    }
  }, [window.ethereum]);

  //  get metaMask connect
  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      // 监听网络切换
      ethereum.on('networkChanged', (networkIDstring) => {
        setStakeData([]);
        setBalance(undefined);
        setStateData(initState);

        if (Number(networkIDstring) !== rightChainId && history.location.pathname === '/mining') {
          setIsWrongNetWork(true)
          goToRightNetwork(ethereum);
          return;
        }

        setIsWrongNetWork(false);
        init();
      });

      // 监听账号切换
      ethereum.on('accountsChanged', (accounts) => {
        setBalance(undefined);
        setStateData(initState);
        init();
      });
    } else {
      alert('Please install wallet');
    }
  }, [init, initState]);

  useEffect(() => {
    injectWallet();
  }, [injectWallet]);

  const renderAssetHeader = useMemo(
    () => (
      <div className={cx(styleHeader)}>
        <Loading
          loading={isBalanceLoading}
          style={{ position: 'absolute', width: 'calc(100% - 76px)' }}
        />
        <div
          className={styleHeaderInfo}
          style={{ opacity: isBalanceLoading ? 0.5 : 1 }}
        >
          <div className={styleAssetAccountContainer}>
            <div className={styleIcon}>
              <img src={defaultHeadSvg} />
            </div>
            <span className={styleCoinName}>DNF</span>

            <span className='el-loading-demo'>{balance}</span>
          </div>
          <div className={styleCapital}>Available balance</div>
        </div>
      </div>
    ),
    [balance, isBalanceLoading]
  );

  const renderFilter = useMemo(
    () => (
      <div className={styleButtonContainer}>
        <div
          className={cx(
            styleButton,
            selectedTab === 'Ongoing' && styleActiveButton
          )}
          onClick={() => {
            setSelectedTab('Ongoing');
          }}
        >
          Ongoing
        </div>
        <div
          className={cx(
            styleButton,
            selectedTab === 'Complete' && styleActiveButton
          )}
          onClick={() => {
            setSelectedTab('Complete');
          }}
        >
          Complete
        </div>
      </div>
    ),
    [selectedTab]
  );

  const renderCard = useCallback(
    (stakeInfo, index) => (
      <div
        className={cx(
          styleCardContainer,
          (!isStakeInfoLoading || isWrongNetWork) && styleCardIsActive
        )}
        onClick={() => {
          if (isStakeInfoLoading || isWrongNetWork) {
            return;
          }

          setIsVisible(true);
          setStakeIndex(index);
        }}
      >
        <div>
          <div className={styleCardTitle}>
            <div>
              <img src={nft} />
              <span>DNF Staking Pool</span>
            </div>
            <span>{(stakeInfo?.duration / 30) || 0} Months</span>
          </div>
          <div className={styleCardInfo}>
            <div className={styleItemContainer}>
              <div className={styleText}>Total DNF Reward</div>
              <div className={styleDollar}>{stakeInfo?.totalReward || 0.0}</div>
            </div>
            <div className={styleItemContainer}>
              <div className={styleText}>Total DNF Staked</div>
              <div className={styleDollar}>
                {Number(stakeInfo?.totalStaked || 0).toFixed(
                  2
                )}
              </div>
            </div>
          </div>
          <div className={styleBottomContainer}>
            <div className={styleAPY}>
              <div className={stylePercent}>{(
                (stakeInfo?.totalStaked / stakeInfo?.totalLocked) * 100 || 0
              ).toFixed(2)}
                %</div>
              <div>Current Progress</div>
            </div>
            <div className={styleCardButton}>Stake</div>
          </div>
        </div>
        <div className={styleLabelContainer}>
          <div className='percent'>{stakeInfo?.rewardRate || 0.0}</div>
          <div>APR(%)</div>
        </div>
      </div>
    ),
    [isStakeInfoLoading, isWrongNetWork]
  );

  const renderTab = useMemo(
    () => (
      <div className={styleTabContainer}>
        <span
          className={cx(styleTab, stakeTab === 'stake' && activeTab)}
          onClick={() => {
            setStakeTab('stake');
            setStakeValue(undefined);
          }}
        >
          Stake
        </span>
        <span
          className={cx(styleTab, stakeTab === 'unstake' && activeTab)}
          onClick={() => {
            setStakeTab('unstake');
            setStakeValue(undefined);
          }}
        >
          Unstake
        </span>
        <span
          className={cx(styleTab, stakeTab === 'claim' && activeTab)}
          onClick={() => {
            setStakeTab('claim');
            setStakeValue(undefined);
          }}
        >
          Claim NFT
        </span>
      </div>
    ),
    [stakeTab]
  );

  const renderStake = useCallback(
    (stakeInfo) => {
      const isApproveLoading =
        !stateData[stakeIndex].isApprove && stateData[stakeIndex].isApproving;
      const isStakeLoading =
        stateData[stakeIndex].isApprove && stateData[stakeIndex].isStaking;

      const isStakeValueInvalid = stateData[stakeIndex].isApprove && (typeof stakeValue !== 'number' || stakeValue === 0 || String(stakeValue).split('.')[1]?.length > 2);

      return (
        <div>
          <div className={styleTableHeader}>
            <span>Token</span>
            <span>APR(%)</span>
            <span>Staking Period(Pays)</span>
          </div>
          <div className={styleTableBody}>
            <span>DNF</span>
            <span>{stakeInfo?.rewardRate}</span>
            <span>{Math.round(stakeInfo?.duration)}days</span>
          </div>
          {stateData[stakeIndex].isApprove && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{color: '#000000'}}>Stake</span>
                <span>Balance: <span style={{color: '#FF313C', fontSize: '17px'}}>{balance}</span></span>
              </div>
              <div className={styleInputContainer}>
                <div className={styleStakeDNF}>DNF</div>
                <InputNumber
                  controls={false}
                  placeholder={0}
                  value={stakeValue}
                  onChange={(value) => {
                    setStakeValue(value);
                  }}
                />
              </div>
            </div>
          )}
          <div className={styleStakeTips}>
            Note：you will not be able to Unstake your DNF or claim your rewards
            before the staking period has ended
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              className={styleApproveButton}
              style={{
                opacity: (isApproveLoading || isStakeLoading || isStakeValueInvalid) ? 0.3 : 1,
                cursor:
                  (isApproveLoading || isStakeLoading || isStakeValueInvalid)
                    ? 'not-allowed'
                    : 'pointer',
              }}
              onClick={async () => {
                if (isApproveLoading || isStakeLoading) {
                  return;
                }

                const contractAddress = stakeInfo.stakeContract;
                const stakeContract = new window.web3.eth.Contract(
                  stakeInfo.abi,
                  contractAddress
                );

                const dnfTokenContract = new window.web3.eth.Contract(
                  tokenAbi,
                  tokenContract
                );

                if (stateData[stakeIndex].isApprove) {
                  if (isStakeValueInvalid) {
                    return;
                  }

                  const dealWithStateData = stateData;
                  dealWithStateData[stakeIndex].isStaking = true;

                  setStateData(cloneDeep(dealWithStateData));

                  try {
                    await stakeContract.methods
                      .stake(Web3.utils.toWei(String(stakeValue), 'ether'))
                      .send({
                        amount: Web3.utils.toWei(String(stakeValue), 'ether'),
                        from: stakeInfo.account,
                      });
                    toast.info('Operation succeeded！', {
                      position: toast.POSITION.TOP_CENTER,
                    });
                  } finally {
                    const dealWithStateData = stateData;
                    dealWithStateData[stakeIndex].isStaking = false;
                    setIsUnStakeLoading(true)
                    setStakeTab('unstake');
                    init(true);

                    setStateData(cloneDeep(dealWithStateData));
                  }
                } else {
                  try {
                    const dealWithStateData = stateData;
                    dealWithStateData[stakeIndex].isApproving = true;

                    setStateData(cloneDeep(dealWithStateData));

                    let allowance = await dnfTokenContract.methods
                      .allowance(stakeInfo.account, stakeInfo.stakeContract)
                      .call();

                    if (!(allowance > 0)) {
                      await dnfTokenContract.methods
                        .approve(
                          stakeInfo.stakeContract,
                          Web3.utils.toBN(
                            '115792089237316195423570985008687907853269984665640564039457584007913129639935'
                          )
                        )
                        .send({
                          from: stakeInfo.account,
                        });
                    }
                  } finally {
                    const dealWithStateData = stateData;
                    dealWithStateData[stakeIndex].isApproving = false;

                    setStateData(cloneDeep(dealWithStateData));
                  }

                  const dealWithStateData = stateData;
                  dealWithStateData[stakeIndex].isApprove = true;

                  setStateData(cloneDeep(dealWithStateData));
                }
              }}
            >
              <Loading loading={isApproveLoading || isStakeLoading} />
              {isApproveLoading || isStakeLoading ? 'loading...' : stateData[stakeIndex].isApprove ? 'Stake' : 'Approve DNF'}
            </div>
          </div>
        </div>
      );
    },
    [balance, stakeValue, stakeIndex, stateData, init]
  );

  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        {/* <div>{noDataSvg}</div> */}
        <span>No content</span>
      </div>
    ),
    []
  );

  const renderUnstake = useCallback(
    (stakeInfo) => (
      <div className={styleUnstakeContainer}>
        <div className={styleTableHeader}>
          <span>Staked (DNF)</span>
          <span>Reward (DNF)</span>
          <span>Total（DNF）</span>
          <span>Status</span>
        </div>
        <Loading
          loading={isUnStakeLoading}
          style={{ position: 'absolute', width: 'calc(100% - 76px)' }}
        />
        {isUnStakeLoading ? null : !(stakeInfo?.stakeInfoList.length > 0)
          ? renderNoData
          : stakeInfo?.stakeInfoList?.map((item, index) => {
            const startDay = dayjs(item[1] * 1000);

            const dealwithDay = startDay.add(
              stakeInfo?.duration * 24 * 60 * 60,
              's'
            );
            const pendingDay = dealwithDay.diff(dayjs(), 'day');
            const pendingHour =
              dealwithDay.diff(dayjs(), 'hour') - pendingDay * 24;

            const hasDiff = dealwithDay.diff(dayjs()) > 0;

            const stakeDnf = getFormatNumber(item[0]);
            const rewardDnf = getFormatNumber(stakeInfo?.rewardList?.[index]);

            const unstakeLoadingIndexArray =
              stateData[stakeIndex].unstakeLoadingIndex;

            return (
              <div key={index} className={styleTableBody}>
                <span>{stakeDnf}</span>
                <span>{rewardDnf}</span>
                <span>
                  {(Number(stakeDnf) + Number(rewardDnf)).toFixed(2)}
                </span>
                {hasDiff ? (
                  <span style={{ color: '#FF9538' }}>
                    {pendingDay}d {pendingHour}h
                  </span>
                ) : (
                  <span
                    onClick={async () => {
                      if (
                        !(item[0] > 0) ||
                        unstakeLoadingIndexArray.includes(index)
                      ) {
                        return;
                      }

                      try {
                        const dealWithIndexArray =
                          unstakeLoadingIndexArray.concat(index);

                        const dealWithStateData = stateData;
                        dealWithStateData[stakeIndex].unstakeLoadingIndex =
                          dealWithIndexArray;

                        setStateData(cloneDeep(dealWithStateData));

                        const contractAddress = stakeInfo.stakeContract;
                        const stakeContract = new window.web3.eth.Contract(
                          stakeInfo.abi,
                          contractAddress
                        );

                        await stakeContract.methods.withdraw(index).send({
                          from: stakeInfo.account,
                          idx: index,
                        });
                        toast.info('Operation succeeded！', {
                          position: toast.POSITION.TOP_CENTER,
                        });
                      } finally {
                        const currentUnstakeLoadingIndex =
                          stateData[stakeIndex].unstakeLoadingIndex;

                        const dealWithIndexArray =
                          currentUnstakeLoadingIndex.filter(
                            (item) => item !== index
                          );

                        const dealWithStateData = stateData;
                        dealWithStateData[stakeIndex].unstakeLoadingIndex =
                          dealWithIndexArray;

                        setStateData(cloneDeep(dealWithStateData));
                        init()
                      }
                    }}
                  >
                    <Loading
                      loading={unstakeLoadingIndexArray.includes(index)}
                    />
                    <div
                      className={cx(
                        styleUnStake,
                        (!(item[0] > 0) ||
                          unstakeLoadingIndexArray.includes(index)) &&
                          styleDisableButton
                      )}
                    >
                      {unstakeLoadingIndexArray.includes(index) ? 'loading...' : 'Unstake'}
                    </div>
                  </span>
                )}
              </div>
            );
          })}
      </div>
    ),
    [renderNoData, stakeIndex, stateData, init, isUnStakeLoading]
  );

  const renderClaim = useCallback(
    (stakeInfo) => {
      const isValidGetNft =
        stakeInfo?.isRewardNft === true &&
        stakeInfo?.isClaimNft === false;

      return (
        <div>
          <div className={styleClaimCardContainer}>
            <div className={stylePicture}>
              <img
                src={stakingJson[stakeIndex].image}
              />
            </div>
            <div className={styleClaimInfo}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    color: '#1B2559',
                    width: '210px'
                  }}
                >
                  {stakingJson[stakeIndex].name}
                </span>
                <span className={styleTag}>On sale</span>
              </div>
              <span
                style={{
                  padding: '10px 0 20px 0',
                  color: '#000',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img style={{width: 18, height: 18, marginRight: '8px'}} src={contractSvg} />
                <span>Contract</span>
              </span>
              <span>Description ：</span>
              <span style={{ color: '#8F9BBA' }}>
                {stakingJson[stakeIndex].description}
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              className={cx(
                styleApproveButton,
                (stateData[stakeIndex].isClaiming || !isValidGetNft) &&
                  styleDisableButton
              )}
              onClick={async () => {
                if (!isValidGetNft || stateData[stakeIndex].isClaiming) {
                  return;
                }

                if (stateData[stakeIndex].isClaiming) {
                  return;
                }

                try {
                  const dealWithStateData = stateData;
                  dealWithStateData[stakeIndex].isClaiming = true;

                  setStateData(cloneDeep(dealWithStateData));

                  const contractAddress = stakeInfo.stakeContract;
                  const stakeContract = new window.web3.eth.Contract(
                    stakeInfo.abi,
                    contractAddress
                  );

                  let result =  await stakeContract.methods.claimNft().send({
                    from: stakeInfo.account,
                  });

                  toast.info('Operation succeeded！', {
                    position: toast.POSITION.TOP_CENTER,
                  });

                  if (result.transactionHash) {
                    const nftTokenId = result.events.Claim.returnValues.nftTokenId;
                    await post(
                      '/api/v1/nft/',
                      {
                        name: stakingJson[Number(nftTokenId) - 1].name,
                        supply: 1,
                        avatorUrl: stakingJson[Number(nftTokenId) - 1].image,
                        address: stakeInfo.account,
                        chainType: 'BSC',
                        hash: result.transactionHash,
                        tokenId: nftTokenId,
                        tokenAddress: contractAddress,
                        category: 'ART',
                        collectionId: -1,
                        description: stakingJson[Number(nftTokenId) - 1].description,
                      },
                      token
                    );
                  }

                } finally {
                  const dealWithStateData = stateData;
                  dealWithStateData[stakeIndex].isClaiming = false;
                  init();

                  setStateData(cloneDeep(dealWithStateData));
                }
              }}
            >
              <Loading loading={stateData[stakeIndex].isClaiming} />
              {stateData[stakeIndex].isClaiming ? 'loading...' : 'Claim'}
            </div>
          </div>
        </div>
      );
    },
    [stakeIndex, stateData]
  );

  const renderModal = useCallback(
    (stakeInfo) => (
      <Dialog
        customClass={styleModalContainer}
        title={renderTab}
        visible={isVisible}
        closeOnClickModal={false}
        onCancel={() => {
          setIsVisible(false);
          setStakeTab('stake');
          setStakeValue(undefined);
        }}
      >
        <Dialog.Body>
          <div className={styleBodyTitle}>
            DNF Staking（{Math.round(stakeInfo?.duration)}days）
          </div>
          <div className={styleBodyTips}>
            {stakeTab === 'stake' &&
              'StakeDNF for DNF under a  fixed APR（Annual percent yield）'}
            {stakeTab === 'unstake' &&
              'Click “Unstake” button to get your staked DNF and the rewards back'}
            {stakeTab === 'claim' &&
              'If your have staked more than 200 DNF in a single staking，you will be eligible to claim the reward DNF.'}
          </div>
          {stakeTab === 'stake' && renderStake(stakeInfo)}
          {stakeTab === 'unstake' && renderUnstake(stakeInfo)}
          {stakeTab === 'claim' && renderClaim(stakeInfo)}
        </Dialog.Body>
      </Dialog>
    ),
    [isVisible, renderTab, renderStake, renderUnstake, renderClaim, stakeTab]
  );

  return (
    <div className={styleContainer}>
      {renderAssetHeader}
      <Divider />
      <Link href={helper.mining.book} isExternal fontWeight="600" color="brand.900"
        mt="2rem" mr="2rem" display="inline-block">
        <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#112df2'}} /> Learn How To Stake
      </Link>
      <Link href={helper.mining.youtube} isExternal fontWeight="600" color="brand.900" mt="2rem"
        display="inline-block">
        <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.mining.title}
      </Link>
      <div className={styleBody}>
        <div>
          {renderFilter}
          {
            selectedTab === 'Ongoing' &&
            <React.Fragment>
              <Loading loading={isStakeInfoLoading} />
              <div
                className={styleCardList}
                style={{ opacity: isStakeInfoLoading || isWrongNetWork ? 0.3 : 1 }}
              >
                {renderCard(stakeData[0], 0)}
                {renderCard(stakeData[1], 1)}
                {renderCard(stakeData[2], 2)}
              </div>
            </React.Fragment>
          }
        </div>
      </div>
      {renderModal(stakeData[stakeIndex])}
    </div>
  );
};

const mapStateToProps = ({ profile }) => ({
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(Mining));

const styleContainer = css`
  background: #f5f7fa;
  padding: 22px 20px 0 20px;
  height: 100%;
  @media (max-width: 768px) {
    padding: 22px 12px;
    background: white;
  }
  & > div {
    border-radius: 14px;
    @media (max-width: 768px) {
      &:first-child{
        background: #F1F1F1;
        padding: 10px 18px 0 18px
      }
    }
  }
`;

const styleHeader = css`
  display: flex;
  flex-direction: row;
  margin-bottom: 22px;
  background: white;
  display: flex;
  justify-content: space-between;
  .circular {
    position: relative;
    top: 120px;
  }
`;

const styleHeaderInfo = css`
  padding: 28px 30px;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const styleAssetAccountContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    font-weight: bold;
    font-size: 30px;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

const styleCapital = css`
  font-size: 14px;
  color: #8f9bba;
  position: relative;
  left: 62px;
  @media (max-width: 768px) {
    transform: scale(0.5);
    top: -10px;
    left: 14px;
  }
`;

const styleBody = css`
  padding: 40px 0 0 0;
  @media (max-width: 768px) {
    padding: 10px 0 0 0;
  }
  .circular {
    position: relative;
    top: 100px;
    width: 100px;
    height: 100px;
  }
`;

const styleIcon = css`
  background: #c0beff;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    border-radius: 24px;
    top: 4px;
    position: relative;
  }
`;

const styleCoinName = css`
  padding: 0 12px 0 20px;
`;

const styleButtonContainer = css`
  display: flex;
  flex-direction: row;
  gap: 40px;
  @media (max-width: 768px) {
    justify-content: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #EDEDED;
  }
`;

const styleButton = css`
  font-weight: 600;
  font-size: 16px;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: Poppins;
  @media (max-width: 768px) {
    border: 2px solid #E6E8EC;
    border-radius: 12px;
    padding: 8px 24px;
  }
`;

const styleActiveButton = css`
  color: #000000;
`;

const styleCardList = css`
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  gap: 56px;
  background: url(${bg}) no-repeat 100% 100%;
  background-size: cover;
  min-height: calc(100vh - 360px);
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 20px;
    background: white;
    margin-top: 20px;
  }
`;

const styleCardContainer = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  filter: drop-shadow(0px 11px 21px rgba(0, 0, 0, 0.05));
  height: fit-content;
  min-width: 370px;
  @media (max-width: 768px) {
    flex: initial;
    min-width: auto;
    width: 100%;
  }
  &>div{
    &:first-child{
      margin: 10px 0;
      padding:16px 16px 20px 30px;
      background:white;
      border-radius: 20px;
      @media (max-width: 768px) {
        padding: 10px 18px;
      }
    }
  }
`;

const styleCardIsActive = css`
  cursor: pointer;
  &:hover {
    top: -30px;
  }
`;

const styleCardTitle = css`
  display: flex;
  font-weight: 600;
  font-size: 20px;
  color: #B3B7DD;
  padding-bottom: 16px;
  border-bottom: 1px dashed #EDEDED;
  flex-direction: column;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  div {
    display: flex;
    align-items: center;
    flex-direction: row;
    & > span{
      color: #0834e8;
      opacity: 0.8;
      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }
  & > span{
    margin-left: 60px;
    font-size: 14px;
    color: #B3B7DD;
    @media (max-width: 768px) {
      margin-left: 40px;
    }
  }
  img {
    margin-right: 20px;
    width: 40px;
    @media (max-width: 768px) {
      width: 28px;
      margin-right: 12px;
    }
  }
`;

const styleBottomContainer = css`
  padding-top: 22px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const styleAPY = css`
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  color: #777BA4;
`;

const stylePercent = css`
  font-size: 24px;
  font-weight: 800;
  color: #ff313c;
  padding-right: 10px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const styleCardInfo = css`
  display: flex;
  flex-direction: row;
  padding: 22px 0 30px 0;
  border-bottom: 1px dashed #EDEDED;
  justify-content: space-around;
  @media (max-width: 768px) {
    padding: 18px 0 10px 0 ;
  }
`;

const styleItemContainer = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const styleDollar = css`
  font-weight: bold;
  font-size: 20px;
  color: #1B2559;
  @media (max-width: 768px) {
    font-size: 12px;
    transform: scale(0.8);
  }
`;

const styleText = css`
  font-size: 14px;
  color: #B2B3B5;
`;

const styleCardButton = css`
  background: #112DF2;
  border-radius: 10px;
  width: 110px;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  @media (max-width: 768px) {
    width: 72px;
    padding: 8px 0;
  }
`;

const styleTab = css`
  color: #8588a7;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
`;

const activeTab = css`
  color: #112DF2;
  font-weight: bold;
`;

const styleModalContainer = css`
  width: 650px;
  border-radius: 10px;
  padding: 30px 20px;
  overflow: auto;
  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%) scale(0.5);
  }

  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 24px 0;
    border-bottom: 1px solid #F2F2F2;
    @media (max-width: 768px) {
      padding: 0 0 10px 0;
    }

    &::before,
    &::after {
      display: none;
    }
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #575D6F;
    font-size: 16px;
  }
  .el-dialog__title {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__body {
    padding: 0;
  }
`;

const styleTabContainer = css`
  display: flex;
  flex-direction: row;
  gap: 30px;

`;

const styleBodyTitle = css`
  font-weight: bold;
  font-size: 24px;
  color: #21242e;
  margin-top: 30px;
  @media (max-width: 768px) {
    margin-top: 16px;
    transform: scale(0.4);
  }

`;

const styleBodyTips = css`
  font-weight: 600;
  font-size: 17px;
  color: #49C1AB;
`;

const styleTableHeader = css`
  background: #f6f7fc;
  font-size: 14px;
  color: #8f9bba;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding: 10px 0 10px 50px;
  span {
    display: flex;
    flex: 1;
  }
`;

const styleTableBody = css`
  font-weight: bold;
  font-size: 17px;
  color: #233a7d;
  display: flex;
  justify-content: space-between;
  padding: 10px 0 10px 50px;
  margin-bottom: 10px;
  align-items: center;
  span {
    display: flex;
    flex: 1;
  }
  .circular {
    width: 34px !important;
    height: 25px !important;
    left: 26px;
    position: relative !important;
    top: 10px !important;
  }
`;

const styleStakeTips = css`
  font-size: 14px;
  color: #8f9bba;
  letter-spacing: -1px;
  margin-top: 15px;
`;

const styleApproveButton = css`
  width: 134px;
  height: 46px;
  background: #112df2;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  cursor: pointer;

  .circular {
    width: 25px;
    height: 25px;
    left: -30px;
    position: relative;
    top: 10px;
  }
`;

const styleInputContainer = css`
  background: #f4f7fe;
  border: 1px solid #8f9bba;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  height: 50px;
  margin: 5px 0;
  .el-input-number {
    width: 100%;
  }
  input {
    border: none;
    background: transparent;
    height: 50px;
    font-size: 20px;
    text-align: right;
  }
`;

const styleStakeDNF = css`
  font-weight: 900;
  font-size: 24px;
  color: #000000;
  border-right: 1px solid #8f9bba;
  width: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const styleClaimCardContainer = css`
  background: #ffffff;
  box-shadow: 0px 12px 22px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 30px 22px;
  display: flex;
  flex-direction: row;
`;

const stylePicture = css`
  min-width: 220px;
  max-width: 220px;
  margin-right: 20px;
  img {
    border-radius: 10px 0 0 10px;
  }
`;

const styleClaimInfo = css`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #233a7d;
`;

const styleTag = css`
  background: #D8F6F0;
  padding: 4px 12px;
  border-radius: 5px;
  color: #169981;
  margin-left: 14px;
`;

const styleUnStake = css`
  padding: 4px 12px;
  background: #112df2;
  border-radius: 5px;
  color: white;
  cursor: pointer;
`;

const styleDisableButton = css`
  cursor: not-allowed !important;
  opacity: 0.2;
`;

const styleUnstakeContainer = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  min-height: 200px;
  max-height: 50vh;
  .circular {
    position: relative;
    top: 100px;
    width: 60px;
    height: 60px;
  }
`;

const styleNoDataContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  color: #233a7d;
  span {
    margin-top: 20px;
  }
`;

const styleLabelContainer = css`
  position: absolute;
  background: url(${label}) no-repeat 100% 100%;
  background-size: cover;
  width: 64px;
  height: 64px;
  top: 5px;
  right: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    transform: scale(0.6);
    right: -12px;
    top: -6px;
  }
  div{
    position: relative;
    left: 3px;
    top: 2px;
  }
  .percent{
    color: white;
    font-size: 16px;
  }
`
