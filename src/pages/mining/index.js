import { Dialog, InputNumber, Loading, Button } from 'element-react';
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
import { cloneDeep } from 'lodash';
import { useHistory } from 'react-router';
import label from '../../images/mining/label.svg';
import contractSvg from '../../images/mining/contract.svg';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import globalConfig from '../../config'
import helper from '../../config/helper';
import {Icon} from '@iconify/react';
import { Link } from '@chakra-ui/react';
import dnft_unit from 'images/market/dnft_unit.png'

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
  const { token, address } = props;

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

  const [balance, setBalance] = useState(0.00);
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
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);

  const [stateData, setStateData] = useState(initState);
  const currentNetEnv = globalConfig.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 4 : 56;

  const getBalance = async () => {
    try {
      setBalanceIsLoading(true);

      if (window.ethereum) {
        if (!address) {
          setBalance(0.00);
        }
        const account = address;

        const contractAddress = tokenContract[currentNetEnv];
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

      let isRewardNft;
      let isClaimNft;
      let stakeInfoList = [];
      let rewardList = [];

      if (account) {
        let stakeListLength = await myContract.methods
          .getStakeInfoLength(account)
          .call({
            _addr: account,
          });


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

        isRewardNft = await myContract.methods.isRewardNftOf(account).call();
        isClaimNft = await myContract.methods.isClaimNftOf(account).call();
      }

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
        const account = address;
        let firstStakeInfo = await getItemStakeInfoByContract(
          firstStakeAbi,
          firstStakeContract[currentNetEnv],
          account
        );
        let secondStakeInfo = await getItemStakeInfoByContract(
          secondStakeAbi,
          secondStakeConTract[currentNetEnv],
          account
        );
        let thirdStakeInfo = await getItemStakeInfoByContract(
          thirdStakeAbi,
          thirdStakeConTract[currentNetEnv],
          account
        );

        setStakeData([firstStakeInfo, secondStakeInfo, thirdStakeInfo]);
      }
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setIsStakeInfoLoading(false);
    }
  }, [getItemStakeInfoByContract, address]);

  const init = useCallback(async (doNotNeedModalHidden) => {
    if (!doNotNeedModalHidden) {
      setIsVisible(false);
    }
    setStakeValue(undefined);
    await getBalance();
    await getStakeInfo();
    setIsUnStakeLoading(false)
  }, [getStakeInfo, address]);

  useEffect(() => {
    init();
  }, [init]);

  const goToRightNetwork = useCallback(async (ethereum) => {
    if (history.location.pathname !== '/mining') {
      return;
    }
    try {
      let result;

      if (currentNetEnv === 'testnet') {
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
        setIsWrongNetWork(true);
        setIsShowSwitchModal(true);
      } else {
        setIsWrongNetWork(false);
      }
    }
  }, [window.ethereum]);

  const renderAssetHeader = useMemo(
    () => (
      <div className={cx(styleHeader)}>
        <Loading
          loading={isBalanceLoading}
          style={{ position: 'absolute', width: '100%' }}
        />
        <div
          className={styleHeaderInfo}
          style={{ opacity: isBalanceLoading ? 0.5 : 1 }}
        >
          <div className={styleAssetAccountContainer}>
            <div className={styleACBalance}>
              <img src={dnft_unit} alt=""/>
              <span>{balance}</span>
            </div>
            <p>Available balance</p>
            {/* <div className={styleIcon}>
              <img src={defaultHeadSvg} />
            </div>
            <span className={styleCoinName}>DNF</span>

            <span className='el-loading-demo'>{balance}</span> */}
          </div>
          {/* <div className={styleCapital}>Available balance</div> */}
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
            selectedTab === 'Ended' && styleActiveButton
          )}
          onClick={() => {
            setSelectedTab('Ended');
          }}
        >
          Ended
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
          if (!address) {
            toast.warn('Please link wallet', {
              position: toast.POSITION.TOP_CENTER,
            });
            return;
          }

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
              <img src={dnft_unit} />
              <span>DNF Staking Pool</span>
            </div>
            {/* <span>{(stakeInfo?.duration / 30) || 0} Months</span> */}
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
              <div className={styleStakeBalance}>
                <span>Stake</span>
                <span>Balance: <span style={{color: '#FF313C', fontSize: '17px', fontWeight: 'bold'}}>{balance}</span></span>
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
                  tokenContract[currentNetEnv]
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
                <span  style={{ fontFamily: 'Helvetica' }}>Contract</span>
              </span>
              <span  style={{ fontFamily: 'Helvetica' }}>Description ：</span>
              <span style={{ color: '#8F9BBA', fontFamily: 'Helvetica' }}>
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
    <div className={styleContainer}>
      <header className={styleContainerTitle}>
        <div className="headerT">
          <span className="headerTitle">Mining</span>
          <div style={{fontSize: '.8rem', marginTop: '.6rem', display: 'inline-block'}}>
            <Link href={helper.mining.youtube} isExternal color="#0057D9" fontStyle='italic' display="inline-block" >
              <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.mining.title}
            </Link>
            <Link href={helper.mining.book} isExternal color="#0057D9" fontStyle='italic' display="inline-block" ml="1rem">
              <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#1d90e6'}} /> Learn How To Stake
            </Link>
          </div>
        </div>
        <p>Choose <strong>“Single”</strong> if you want your collectible to be one of a kind or <strong>“Multiple”</strong> if you want to sell one collectible multiple times</p>
      </header>
      {renderAssetHeader}
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
      {renderShowSwitchModal()}
    </div>
  );
};

const mapStateToProps = ({ profile }) => ({
  token: profile.token,
  address: profile.address
});
export default withRouter(connect(mapStateToProps)(Mining));

const styleContainer = css`
  background: #f5f7fa;
  padding: 30px 50px;
  box-sizing: border-box;
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
const styleContainerTitle = css`
  padding-bottom: 48px;
  .headerTitle {
    margin-bottom: 10px;
    font-family: Archivo Black, sans-serif;
    font-style: normal;
    font-weight: normal;
    color: #000000;
    margin-right: 1.8rem;
    font-size: 48px;
    height: 78px;
    line-height: 56px;
    @media (max-width: 900px)  {
      font-size: 2rem;
    }
  }
  p {
    font-family: Poppins, sans-serif;
    font-size: 14px;
    line-height: 24px;
    color: #777E91;
    strong {
      color: #23262F;
    }
  }
`;

const styleHeader = css`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: white;
  margin-bottom: 22px;
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
  // display: flex;
  // flex-direction: row;
  // align-items: center;
  // span {
  //   font-weight: bold;
  //   font-size: 30px;
  //   @media (max-width: 768px) {
  //     font-size: 12px;
  //   }
  // }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  p {
    user-select: none;
    font-family: Judson, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 140%;
    color: #718096;
    margin: 0;
  }
`;
const styleACBalance = css`
  font-family: Bahnschrift sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 140%;
  color: #2D3748;
  display: flex;
  align-items: center;
  text-align: right;
  img{
    user-select: none;
    width: 35px;
    height: 35px;
    border-radius: 100%;
    margin-right: 8px;
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
  gap: 20px;
  @media (max-width: 768px) {
    justify-content: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #EDEDED;
  }
`;

const styleButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #E6E8EC;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 8px 24px;
  font-family: DM Sans;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #777E90;
  @media (max-width: 768px) {
    // border: 2px solid #E6E8EC;
    // border-radius: 12px;
    // padding: 8px 24px;
  }
`;

const styleActiveButton = css`
  color: #fff;
  background: #00398D;
  border-color: #00398D;
`;

const styleCardList = css`
  margin-top: 40px;
  display: grid;
  flex-direction: row;
  gap: 42px;
  flex-wrap: wrap;
  grid-template-columns: repeat(auto-fill, minmax(515px, 1fr));
  @media (max-width: 768px) {
    gap: 20px;
    background: white;
    margin-top: 20px;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

  }
`;

const styleCardContainer = css`
  display: flex;
  // flex: 1;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  filter: drop-shadow(0px 11px 21px rgba(0, 0, 0, 0.05));
  height: fit-content;
  // min-width: 370px;
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
/*  &:hover {
    top: -30px;
  }*/
`;

const styleCardTitle = css`
  display: flex;
  color: #B3B7DD;
  font-family: Archivo Black, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 16px;
  flex-direction: column;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  div {
    display: flex;
    align-items: center;
    flex-direction: row;
    & > span{
      // color: #0834e8;
      // opacity: 0.8;
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
  text-transform: uppercase;
  color: #777BA4;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: normal;
`;

const stylePercent = css`
  color: #ff313c;
  font-family: Archivo Black;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  padding-right: 10px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const styleCardInfo = css`
  display: flex;
  flex-direction: row;
  padding: 22px 0 30px 0;
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
  font-size: 20px;
  color: #1B2559;
  font-family: Archivo Black;
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
  background: #00398D;
  border-radius: 10px;
  width: 110px;
  padding: 11px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  letter-spacing: -0.02em;
  font-family: Helvetica;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 24px;
  @media (max-width: 768px) {
    width: 72px;
    padding: 8px 0;
  }
`;

const styleTab = css`
  font-size: 16px;
  font-family: Helvetica;
  font-weight: normal;
  font-size: 17px;
  line-height: 22px;
  color: #8588A7;
  cursor: pointer;
`;

const activeTab = css`
  font-weight: bold;
  color: #00398D;
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
    padding: 0 7px;
  }
`;

const styleTabContainer = css`
  display: flex;
  flex-direction: row;
  gap: 30px;

`;

const styleBodyTitle = css`
  font-size: 24px;
  color: #21242e;
  margin-top: 30px;
  font-family: Helvetica;
  font-style: normal;
  font-weight: bold;
  letter-spacing: -0.02em;
  @media (max-width: 768px) {
    margin-top: 16px;
    transform: scale(0.4);
  }

`;

const styleBodyTips = css`
  font-family: Helvetica;
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: -0.02em;
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
  font-family: Helvetica;
  font-style: normal;
  font-weight: normal;
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

const styleStakeBalance = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 9px;
  font-family: Helvetica;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #777BA4;
  letter-spacing: -0.02em;
  span:first-child {
    font-size: 15px;
    color: #000;
  }
`;

const styleStakeTips = css`
  font-size: 12px;
  color: #8f9bba;
  margin-top: 15px;
  font-family: Helvetica;
  font-style: normal;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: -0.02em;
  text-align: center;
`;

const styleApproveButton = css`
  width: 100%;
  height: 46px;
  background: #00398D;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  cursor: pointer;
  font-size: 17px;
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
  padding: 5px 13px;
  background: #00398D;
  border-radius: 5px;
  line-height: 20px;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: normal;
  letter-spacing: -0.02em;
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
