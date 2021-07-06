import { Dialog, Input, Loading } from "element-react";
import { css, cx } from "emotion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  firstStakeAbi,
  secondStakeAbi,
  thirdStakeAbi,
  tokenAbi,
} from "utils/abi";
import {
  tokenContract,
  firstStakeContract,
  secondStakeConTract,
  thirdStakeConTract,
} from "utils/contract";
import { miningCloud, miningMoon, nfIconSvg } from "utils/svg";
import Web3 from "web3";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import headerPicture from "images/mining/header.jpg";
import cloneDeep from "lodash.clonedeep";

const Mining = (props) => {
  const initState = useMemo(() => {
    return {
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
    };
  }, []);

  const [balance, setBalance] = useState(0);
  const [selectedTab, setSelectedTab] = useState("onGoing");
  const [stakeTab, setStakeTab] = useState("stake");
  const [isVisible, setIsVisible] = useState(false);
  const [stakeIndex, setStakeIndex] = useState(0);
  const [stakeData, setStakeData] = useState([]);
  const [stakeValue, setStakeValue] = useState();
  const [isWrongNetWork, setIsWrongNetWork] = useState(false);
  const [isBalanceLoading, setBalanceIsLoading] = useState(false);
  const [isStakeInfoLoading, setIsStakeInfoLoading] = useState(false);

  const [stateData, setStateData] = useState(initState);

  const getBalance = async () => {
    try {
      setBalanceIsLoading(true);

      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
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
      console.log(e, "e");
    } finally {
      setBalanceIsLoading(false);
    }
  };

  const getFormatNumber = (count) => {
    return (count * Math.pow(10, -18)).toFixed(2);
  };

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
      rewardRate = getFormatNumber(rewardRate * 100 * (duration / 30));

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

      let isRewardNft = await myContract.methods.isRewardNft().call();

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
          method: "eth_requestAccounts",
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
      console.log(e, "e");
    } finally {
      setIsStakeInfoLoading(false);
    }
  }, [getItemStakeInfoByContract]);

  const init = useCallback(async () => {
    await getBalance();
    await getStakeInfo();
  }, [getStakeInfo]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    console.log(stateData);
  }, [stateData]);

  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      if (Number(ethereum.networkVersion) !== 4) {
        setIsWrongNetWork(true);
        toast.dark(`please choose Rinkeby`, {
          position: toast.POSITION.TOP_CENTER,
        });

        return;
      } else {
        setIsWrongNetWork(false);
      }
    }
  }, []);

  //  get metaMask connect
  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      //监听网络切换
      ethereum.on("networkChanged", (networkIDstring) => {
        setStakeData([]);
        setBalance(undefined);
        setStateData(initState);

        if (Number(networkIDstring) !== 4) {
          setIsWrongNetWork(true);
          toast.dark(`please choose Rinkeby`, {
            position: toast.POSITION.TOP_CENTER,
          });

          return;
        }

        setIsWrongNetWork(false);
        toast.dark(`NetworkChanged:${networkIDstring}`, {
          position: toast.POSITION.TOP_CENTER,
        });
        init();
      });

      //监听账号切换
      ethereum.on("accountsChanged", (accounts) => {
        toast.dark("AccountsChanged", { position: toast.POSITION.TOP_CENTER });
        setBalance(undefined);
        setStateData(initState);
        getBalance();
      });
    } else {
      alert("Please install wallet");
    }
  }, [init, initState]);

  useEffect(() => {
    injectWallet();
  }, [injectWallet]);

  const renderAssetHeader = useMemo(() => {
    return (
      <div className={cx(styleHeader)}>
        <Loading
          loading={isBalanceLoading}
          style={{ position: "absolute", width: "calc(100% - 332px)" }}
        />
        <div
          className={styleHeaderInfo}
          style={{ opacity: isBalanceLoading ? 0.5 : 1 }}
        >
          <h1 className={styleTitle}>
            Earn limited edition NFTs through farming
          </h1>
          <div className={styleAssetAccountContainer}>
            <div className={styleIcon}>{nfIconSvg}</div>
            <span className={styleCoinName}>DNF</span>

            <span className="el-loading-demo">{balance}</span>
          </div>
          <div className={styleCapital}>Mining capital</div>
        </div>
        <div
          className={styleMiningPicture}
          style={{ opacity: isBalanceLoading ? 0.5 : 1 }}
        >
          <span>EARN LIMITED EDITION NFTS THROUGH FARMING </span>
          <img src={headerPicture} />
        </div>
      </div>
    );
  }, [balance, isBalanceLoading]);

  const renderFilter = useMemo(() => {
    return (
      <div className={styleButtonContainer}>
        <div
          className={cx(
            styleButton,
            selectedTab === "onGoing" && styleActiveButton
          )}
          onClick={() => {
            setSelectedTab("onGoing");
          }}
        >
          onGoing
        </div>
        <div
          className={cx(
            styleButton,
            selectedTab === "complete" && styleActiveButton
          )}
          onClick={() => {
            setSelectedTab("complete");
          }}
        >
          complete
        </div>
      </div>
    );
  }, [selectedTab]);

  const renderCard = useCallback(
    (stakeInfo, index) => {
      return (
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
          <div className={styleCardTitle}>DNF Staking Pool</div>
          <div className={styleAPY}>
            <div className={stylePercent}>{stakeInfo?.rewardRate || 0.0}%</div>
            <div>APY(%)</div>
          </div>
          <div className={styleCardInfo}>
            <div className={styleItemContainer}>
              <div className={styleDollar}>{stakeInfo?.totalReward || 0.0}</div>
              <div className={styleText}>Reward</div>
            </div>
            <div className={styleItemContainer}>
              <div className={styleDollar}>
                {(stakeInfo?.totalLocked - stakeInfo?.totalStaked || 0).toFixed(
                  2
                )}
              </div>
              <div className={styleText}>DNF</div>
            </div>
            <div className={styleItemContainer}>
              <div className={styleDollar}>
                {(
                  (stakeInfo?.totalStaked / stakeInfo?.totalLocked) * 100 || 0
                ).toFixed(2)}
                %
              </div>
              <div className={styleText}>DNF</div>
            </div>
          </div>
          <div className={styleCardButton}>Stake</div>
          <div className={styleMiningCloud}>{miningCloud}</div>
          <div className={styleMiningMoon}>{miningMoon}</div>
        </div>
      );
    },
    [isStakeInfoLoading, isWrongNetWork]
  );

  const renderTab = useMemo(() => {
    return (
      <div className={styleTabContainer}>
        <span
          className={cx(styleTab, stakeTab === "stake" && activeTab)}
          onClick={() => {
            setStakeTab("stake");
            setStakeValue(undefined);
          }}
        >
          Stake
        </span>
        <span
          className={cx(styleTab, stakeTab === "unstake" && activeTab)}
          onClick={() => {
            setStakeTab("unstake");
            setStakeValue(undefined);
          }}
        >
          Unstake
        </span>
        <span
          className={cx(styleTab, stakeTab === "claim" && activeTab)}
          onClick={() => {
            setStakeTab("claim");
            setStakeValue(undefined);
          }}
        >
          Claim NFT
        </span>
      </div>
    );
  }, [stakeTab]);

  const renderStake = useCallback(
    (stakeInfo) => {
      const isApproveLoading =
        !stateData[stakeIndex].isApprove && stateData[stakeIndex].isApproving;
      const isStakeLoading =
        stateData[stakeIndex].isApprove && stateData[stakeIndex].isStaking;

      return (
        <div>
          <div className={styleTableHeader}>
            <span>Token</span>
            <span>APY(%)</span>
            <span>Staking Period(Pays)</span>
          </div>
          <div className={styleTableBody}>
            <span>DNF</span>
            <span>{stakeInfo?.rewardRate}</span>
            <span>{stakeInfo?.duration}days</span>
          </div>
          {stateData[stakeIndex].isApprove && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Stake</span>
                <span>Balance: {balance}</span>
              </div>
              <div className={styleInputContainer}>
                <div className={styleStakeDNF}>DNF</div>
                <Input
                  placeholder={"0"}
                  value={stakeValue}
                  onChange={(value) => {
                    setStakeValue(value);
                  }}
                />
              </div>
            </div>
          )}
          <div className={styleStakeTips}>
            Note：you will not be able to UNstake your DNF or claim your rewards
            before the staking period has ended
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className={styleApproveButton}
              style={{
                opacity: isApproveLoading || isStakeLoading ? 0.3 : 1,
                cursor:
                  isApproveLoading || isStakeLoading
                    ? "not-allowed"
                    : "pointer",
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
                  const dealWithStateData = stateData;
                  dealWithStateData[stakeIndex].isStaking = true;

                  setStateData(cloneDeep(dealWithStateData));

                  try {
                    await stakeContract.methods
                      .stake(Web3.utils.toWei(stakeValue, "ether"))
                      .send({
                        amount: Web3.utils.toWei(stakeValue, "ether"),
                        from: stakeInfo.account,
                      });
                  } finally {
                    const dealWithStateData = stateData;
                    dealWithStateData[stakeIndex].isStaking = false;
                    init();

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
                            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
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
              {stateData[stakeIndex].isApprove ? "Stake" : "Approve DNF"}
            </div>
          </div>
        </div>
      );
    },
    [balance, stakeValue, stakeIndex, stateData, init]
  );

  const renderNoData = useMemo(() => {
    return (
      <div className={styleNoDataContainer}>
        {/* <div>{noDataSvg}</div> */}
        <span>No content</span>
      </div>
    );
  }, []);

  const renderUnstake = useCallback(
    (stakeInfo) => {
      return (
        <div className={styleUnstakeContainer}>
          <div className={styleTableHeader}>
            <span>Staked DNF</span>
            <span>Reward (DNF)</span>
            <span>Total（DNF）</span>
            <span>Status</span>
          </div>
          {!(stakeInfo?.stakeInfoList.length > 0)
            ? renderNoData
            : stakeInfo?.stakeInfoList?.map((item, index) => {
                const startDay = dayjs(item[1] * 1000);

                const dealwithDay = startDay.add(
                  stakeInfo?.duration * 24 * 60 * 60,
                  "s"
                );
                const pendingDay = dealwithDay.diff(dayjs(), "day");
                const pendingHour =
                  dealwithDay.diff(dayjs(), "hour") - pendingDay * 24;

                const hasDiff = dealwithDay.diff(dayjs()) > 0;

                const stakeDnf = getFormatNumber(item[0]);
                const rewardDnf = getFormatNumber(
                  stakeInfo?.rewardList?.[index]
                );

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
                      <span style={{ color: "#FF9538" }}>
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
                            getBalance();
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
                          UNstake
                        </div>
                      </span>
                    )}
                  </div>
                );
              })}
        </div>
      );
    },
    [renderNoData, stakeIndex, stateData]
  );

  const renderClaim = useCallback(
    (stakeInfo) => {
      const isValidGetNft =
        stakeInfo?.isRewardNft?.[0] === true &&
        stakeInfo?.isRewardNft?.[1] === false;

      return (
        <div>
          <div className={styleClaimCardContainer}>
            <div className={stylePicture}>
              <img
                src={`https://dnft.world/staking/pool${stakeIndex + 1}.png`}
              />
            </div>
            <div className={styleClaimInfo}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 20,
                  color: "#1B2559",
                }}
              >
                Shanghaibar
              </span>
              <span
                style={{
                  padding: "15px 0 20px 0",
                }}
              >
                Contract
              </span>
              <span>Description ：</span>
              <span style={{ color: "#8F9BBA" }}>
                Version 02 of Editting screen is all about fitting it as a side
                bar. One of the reasons for this is that we wanted to have all
                the content visible on multiple{" "}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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

                  await stakeContract.methods.claimNft().send({
                    from: stakeInfo.account,
                  });
                } finally {
                  const dealWithStateData = stateData;
                  dealWithStateData[stakeIndex].isClaiming = false;

                  setStateData(cloneDeep(dealWithStateData));
                }
              }}
            >
              <Loading loading={stateData[stakeIndex].isClaiming} />
              claim
            </div>
          </div>
        </div>
      );
    },
    [stakeIndex, stateData]
  );

  const renderModal = useCallback(
    (stakeInfo) => {
      return (
        <Dialog
          customClass={styleModalContainer}
          title={renderTab}
          visible={isVisible}
          onCancel={() => {
            setIsVisible(false);
            setStakeTab("stake");
            setStakeValue(undefined);
          }}
        >
          <Dialog.Body>
            <div className={styleBodyTitle}>
              DNF staking（{stakeInfo?.duration}days）
            </div>
            <div className={styleBodyTips}>
              {stakeTab === "stake" &&
                "StakeDNF for DNF under a  fixed APY（Annual percent yield）"}
              {stakeTab === "unstake" &&
                "Click “UNstake” button to get your staked DNF and the rewards back"}
              {stakeTab === "claim" &&
                "If your have staked more than 200 DNF in a single staking，you will be eligible to claim the reward DNF."}
            </div>
            {stakeTab === "stake" && renderStake(stakeInfo)}
            {stakeTab === "unstake" && renderUnstake(stakeInfo)}
            {stakeTab === "claim" && renderClaim(stakeInfo)}
          </Dialog.Body>
        </Dialog>
      );
    },
    [isVisible, renderTab, renderStake, renderUnstake, renderClaim, stakeTab]
  );

  return (
    <div className={styleContainer}>
      {renderAssetHeader}
      <div className={styleBody}>
        <div>
          {renderFilter}
          <Loading loading={isStakeInfoLoading} />
          <div
            className={styleCardList}
            style={{ opacity: isStakeInfoLoading || isWrongNetWork ? 0.3 : 1 }}
          >
            {renderCard(stakeData[0], 0)}
            {renderCard(stakeData[1], 1)}
            {renderCard(stakeData[2], 2)}
          </div>
        </div>
      </div>
      {renderModal(stakeData[stakeIndex])}
    </div>
  );
};
export default Mining;

const styleContainer = css`
  background: #f5f7fa;
  padding: 22px 20px;
  height: 100%;
  & > div {
    border-radius: 10px;
  }
`;

const styleHeader = css`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  margin-bottom: 36px;
  background: white;
  display: flex;
  justify-content: space-between;
  .circular {
    position: relative;
    top: 120px;
  }
`;

const styleHeaderInfo = css`
  padding: 40px;
`;

const styleTitle = css`
  font-size: 14px;
  color: #333333;
  margin-bottom: 64px;
  margin-top: 0;
`;

const styleAssetAccountContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    font-weight: bold;
    font-size: 30px;
  }
`;

const styleCapital = css`
  font-size: 14px;
  color: #8f9bba;
  position: relative;
  left: 62px;
`;

const styleMiningPicture = css`
  position: relative;
  overflow: hidden;
  img {
    width: 720px;
    height: 228px;
  }
  span {
    position: absolute;
    font-size: 30px;
    color: #144934;
    width: 430px;
    right: 60px;
    line-height: 1.5;
    top: 30px;
    font-weight: bolder;
    text-align: left;
    letter-spacing: 2px;
  }
`;

const styleBody = css`
  padding: 40px 20px 44px 36px;
  background: #1c2656;

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
`;

const styleCoinName = css`
  padding: 0 12px 0 20px;
`;

const styleButtonContainer = css`
  display: flex;
  flex-direction: row;
  gap: 18px;
`;

const styleButton = css`
  font-weight: bold;
  font-size: 14px;
  color: #8588a7;
  width: 84px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const styleActiveButton = css`
  color: #1b2559;
  background: #ffffff;
  border-radius: 8px;
`;

const styleCardList = css`
  margin-top: 64px;
  display: flex;
  flex-direction: row;
  gap: 56px;
`;

const styleCardContainer = css`
  display: flex;
  flex: 1;
  background: #121a44;
  border-radius: 20px;
  padding: 18px 26px;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const styleCardIsActive = css`
  cursor: pointer;
  &:hover {
    top: -30px;
  }
`;

const styleCardTitle = css`
  font-weight: bold;
  font-size: 20px;
  color: #fff;
`;

const styleAPY = css`
  font-size: 14px;
  color: #ff313c;
  display: flex;
  flex-direction: column;
  margin: 36px 0 32px 0;
`;

const stylePercent = css`
  font-size: 36px;
  font-weight: bold;
`;

const styleCardInfo = css`
  display: flex;
  flex-direction: row;
  gap: 5%;
`;

const styleItemContainer = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const styleDollar = css`
  font-weight: bold;
  font-size: 14px;
  color: #a5bcff;
`;

const styleText = css`
  font-size: 12px;
  color: #777ba4;
`;

const styleMiningCloud = css`
  position: absolute;
  left: 0;
  bottom: -4px;
`;

const styleMiningMoon = css`
  position: absolute;
  right: 0;
  top: -18px;
`;

const styleCardButton = css`
  background: #ff6059;
  border-radius: 10px;
  width: 40%;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 36px 0 0 32%;
  color: #fff;
`;

const styleTab = css`
  color: #8588a7;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
`;

const activeTab = css`
  color: #ff313c;
`;

const styleModalContainer = css`
  width: 950px;
  border-radius: 10px;
  padding: 24px 42px;
  overflow: auto;

  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    &::before,
    &::after {
      display: none;
    }
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__title {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__body {
    padding: 20px 16px;
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
`;

const styleBodyTips = css`
  font-weight: 600;
  font-size: 17px;
  /* color: #49c1ab; */
`;

const styleTableHeader = css`
  background: #f6f7fc;
  font-size: 14px;
  color: #8f9bba;
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
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
  margin-bottom: 50px;
  span {
    display: flex;
    flex: 1;
  }
  .circular {
    width: 34px;
    height: 25px;
    left: 26px;
    position: relative;
    top: 10px;
  }
`;

const styleStakeTips = css`
  font-size: 14px;
  color: #8f9bba;
`;

const styleApproveButton = css`
  width: 152px;
  height: 46px;
  background: #112df2;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 54px;
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
  height: 64px;
  margin: 10px 0;
  input {
    border: none;
    background: transparent;
    height: 64px;
    font-size: 20px;
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
  padding: 30px;
  display: flex;
  flex-direction: row;
`;

const stylePicture = css`
  width: 250px;
  margin-right: 20px;
`;

const styleClaimInfo = css`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #233a7d;
  span {
    margin-bottom: 4px;
  }
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
  min-height: 300px;
  max-height: 50vh;
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
