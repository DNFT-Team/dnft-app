import { Dialog, Loading, Select } from 'element-react';
import { css, cx } from 'emotion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { tradableNFTAbi, nftAbi, nft1155Abi } from 'utils/abi';
import { noDataSvg } from 'utils/svg';
import Web3 from 'web3';
import NFTCard from '../../components/NFTCard';
import { get, post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import globalConfig from '../../config';
import { stakingJson } from 'pages/mining';
import { busdAbi, tokenAbi } from '../../utils/abi';
import { bscTestTokenContact, busdContract } from '../../utils/contract';
// import { getCategoryList } from 'reduxs/actions/market';
import CreateNFTModal from './create/index';
import LoadingIcon from 'images/asset/loading.gif'
import dnft_unit from 'images/market/dnft_unit.png'

const AssetScreen = (props) => {
  const { dispatch, location, address, chainType, token, categoryList } = props;
  const currentNetEnv = globalConfig.net_env;
  const isTestNet = currentNetEnv === 'testnet';

  const tabArray = isTestNet
    ? [
      {
        label: 'On Sale',
        value: 'ONSALE',
      },
      {
        label: 'In Wallet',
        value: 'INWALLET',
      },
      {
        label: 'Sold',
        value: 'SOLD',
      },
    ]
    : [
      {
        label: 'On Sale',
        value: 'ONSALE',
      },
      {
        label: 'In Wallet',
        value: 'INWALLET',
      },
      {
        label: 'Sold',
        value: 'SOLD',
      },
    ];

  const sortTagType = [
    { label: 'Price:high to low', value: 'ASC-price' },
    { label: 'Price:low to high', value: 'DESC-price' },
  ];
  const [selectedTab, setSelectedTab] = useState({
    label: 'In Wallet',
    value: 'INWALLET',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState('All');
  const [sortTag, setSortTag] = useState('ASC-price');
  const [list, setList] = useState();
  const [sortOrder, setSortOrder] = useState('ASC');
  const rightChainId = currentNetEnv === 'testnet' ? 97 : 56;
  const [isLoading, setIsLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState('');
  const [avatorUrl, setAvatorUrl] = useState('');
  const [showCreateNft, setShowCreateNft] = useState(false);

  let history = useHistory();

  const getBannerUrl = async () => {
    const { data } = await post(
      `/api/v1/users/address/${address}`,
      {},
      token
    );
    setBannerUrl(data?.data?.bannerUrl)
    setAvatorUrl(data?.data?.avatorUrl)
  }

  useEffect(() => {
    injectWallet();
  }, []);

  useEffect(() => {
    getBannerUrl()
  }, [address, token])

  const init = () => {
    getBalance();
  };

  const getNFTList = async (currentAddress, currentToken) => {
    try {
      setIsLoading(true);

      const { data } = await post(
        '/api/v1/trans/personal',
        {
          address: currentAddress || address,
          category: category,
          sortOrder: sortOrder,
          status: selectedTab.value,
          sortTag: 'price',
          page: 0,
          size: 100,
        },
        currentToken || token
      );
      setList(data?.data?.content || []);
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const goToRightNetwork = useCallback(async (ethereum) => {
    if (history.location.pathname !== '/asset') {
      return;
    }
    try {
      if (currentNetEnv === 'testnet') {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'Smart Chain Test',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            },
          ],
        });
      } else {
        await ethereum.request({
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

      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (token) {
      getNFTList();
    }
  }, [token, category, selectedTab, sortTag, address, chainType]);

  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      if (
        Number(ethereum.networkVersion) !== rightChainId &&
        history.location.pathname === '/asset'
      ) {
        goToRightNetwork(ethereum);
      }
    }
  }, []);

  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      ethereum.on('networkChanged', (networkIDstring) => {
        if (
          Number(networkIDstring) !== rightChainId &&
          history.location.pathname === '/asset'
        ) {
          setBalance(undefined);
          goToRightNetwork(ethereum);
          return;
        }

        init();
      });

      ethereum.on('accountsChanged', (accounts) => {
        setBalance(undefined);
        init();
      });

      init();
    } else {
      alert('Please install wallet');
    }
  }, [init]);

  const getBalance = async () => {
    try {
      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });

        const account = accounts[0];

        const myContract = new window.web3.eth.Contract(
          tokenAbi,
          bscTestTokenContact[currentNetEnv]
        );
        console.log(myContract, 'myContract');
        const dnftBalance = await myContract.methods.balanceOf(account).call({
          from: account,
        });
        setBalance((dnftBalance * Math.pow(10, -18)).toFixed(2));
      }
    } catch (e) {
      console.log(e, 'e');
    }
  };

  const renderAssetHeader = useMemo(
    () => (
      <div
        style={{
          background: `#b7b7b7 center center / cover no-repeat url(${bannerUrl})`,
          height: '236px',
          borderRadius: '10px',
          position: 'relative',
          marginBottom: '90px'
        }}>
        <div className={styleHeader}>

          <div className={styleAssetAccountContainer}>
            <div className={styleACBalance}>
              <img src={dnft_unit} alt=""/>
              <span>{balance}</span>
            </div>
            <p>Available balance</p>
          </div>

          {currentNetEnv !== 'otherNet' &&
            <div
              className={styleCreateNFT}
              onClick={() => {
                setShowCreateNft(true)
              }}
            >
              Create NFT
            </div>
          }
        </div>
      </div>
    ),
    [balance, bannerUrl, avatorUrl]
  );

  const renderTabList = useMemo(
    () =>
      tabArray.map((item) => (
        <div
          className={cx(
            styleTabButton,
            item?.value === selectedTab?.value && styleActiveTabButton
          )}
          onClick={() => {
            setSelectedTab(item);
          }}
        >
          {item.label}
        </div>
      )),
    [selectedTab]
  );

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

  const renderCard = useCallback(
    (item, index) => (
      <NFTCard
        item={item}
        index={index}
        needAction={isTestNet}
        currentStatus={selectedTab}
        onLike={getNFTList}
        onSave={getNFTList}
        onRefresh={(currentAddress, currentToken) =>
          getNFTList(currentAddress, currentToken)
        }
      />
    ),
    [selectedTab]
  );

  const renderModal = useMemo(
    () => (
      <Dialog
        customClass={styleModalContainer}
        visible={isVisible}
        onCancel={() => {
          setIsVisible(false);
        }}
      >
        <Dialog.Body>
          <div>
            <h1>Venus Design Introduction Tour</h1>
            <span>
              Venus is a complex Design System Tool with more than 2000+
              components for busy designers, developers, entrepreneurs,
              agencies, etc...
            </span>
          </div>
          <div className={styleModalActionContainer}>
            <div className={styleModalConfirm}>Start the tour</div>
            <div>Skip for now</div>
          </div>
        </Dialog.Body>
      </Dialog>
    ),
    [isVisible]
  );

  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
      </div>
    ),
    []
  );

  return (
    <div className={styleContainer}>
      <div>
        {renderAssetHeader}
        <div className={styleBody}>
          <div className={styleTabContainer}>
            <div>{renderTabList}</div>
            {isLoading && <div className={styleLoadingIconContainer}>
              <img src={LoadingIcon}/>
            </div>}
            {/* <Loading
              loading={isLoading}
              style={{ position: 'fixed', width: 'calc(100% - 76px)', zIndex: 10000 }}
            /> */}
            <div>
              <Select
                value={category}
                placeholder="please choose"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categoryList?.map((el) => (
                  <Select.Option key={el} label={el} value={el} />
                ))}
              </Select>
              {isTestNet && (
                <Select
                  value={sortTag}
                  placeholder="please choose"
                  onChange={(value) => {
                    setSortTag(value);
                    setSortOrder(value.split('-')[0]);
                  }}
                >
                  {sortTagType.map((el) => (
                    <Select.Option
                      key={el.value}
                      label={el.label}
                      value={el.value}
                    />
                  ))}
                </Select>
              )}
            </div>
          </div>

          <div
            className={styleCardList}
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            {!isLoading && list?.length > 0
              ? list.map((item, index) => renderCard(item, index))
              : renderNoData}
            {/* {nftData?.length > 0
              ? nftData.map((item, index) => renderCard(item, index))
              : renderNoData} */}
          </div>
        </div>
      </div>
      {renderModal}
      {showCreateNft && <CreateNFTModal onClose={(isCreate) => {
        if (isCreate) {
          getNFTList();
        }
        setShowCreateNft(false);
      }}/>}
    </div>
  );
};

const mapStateToProps = ({ profile, market }) => ({
  address: profile.address,
  chainType: profile.chainType,
  categoryList: market.category,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(AssetScreen));

const styleLoadingIconContainer = css`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 1000000000;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 158px;
    height: 145px;
    border-radius: 26px;
  }
`
const styleContainer = css`
  background: #f5f7fa;
  padding: 10px 16px;
  & > div {
    &:first-child {
      border-radius: 10px;
      padding: 32px 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      height: calc(100% - 64px);
      @media (max-width: 900px) {
        padding:0;
      }
    }
  }
`;

const styleHeader = css`
  border-bottom: 1px solid #efefef;
  padding: 0 36px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  width: calc(100% - 146px);
  left: 50%;
  top: 180px;
  transform: translate(-50%, 0);
  background: linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%);
  border: 1.5px solid #FFFFFF;
  box-shadow: 0px 2px 5.5px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(21px);
  height: 110px;
  border-radius: 15px;
  @media (max-width: 900px) {
    padding: 24px 12px;
    flex-wrap: wrap;
    top: 60%;
    width: 80%;
  }
`;

const styleCreateNFT = css`
  background: #0057D9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 40px;
  padding: 10px 8px;
  width: 120px;
  border-radius: 10px;
  font-family: Archivo Black,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: #fcfcfd;
  cursor: pointer;
  user-select: none;
  @media (max-width: 900px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const styleAssetAccountContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const styleBody = css`
  padding: 24px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .circular {
    position: relative;
    top: 120px;
    width: 100px;
    height: 100px;
  }
  @media (max-width: 900px) {
    padding: 24px 12px 80px 12px;
  }
`;

const styleTabContainer = css`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24px;

    @media (max-width: 900px) {
      gap: 0px;
      div {
        min-width: auto;
      }
      &:first-child{
        width: 100%;
        display: flex;
        margin-bottom: 20px;
      }
      &:last-child {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
      }
      .el-select {
        flex: 1;
        display: flex;
        min-width: 160px;
      }
    }
  }
`;

const styleTabButton = css`
  height: 38px;
  box-sizing: border-box;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid #E6E8EC;
  margin-right: 20px;
  color: #BBBBBB;
  font-family: Archivo Black,sans-serif;
  user-select: none;
  @media (max-width: 900px) {
    flex: 1;
    justify-content: center;
    font-size: 12px;
  }
`;

const styleActiveTabButton = css`
  border: 1px solid #000000;
  color: #000000;
  @media (max-width: 900px) {
    flex: 1;
    justify-content: center;
    font-size: 12px;
  }
`;

const styleCardList = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  gap: 30px 16px;
  margin-top: 20px;
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const styleModalContainer = css`
  width: 340px;
  border-radius: 40px;
  padding: 36px 32px;
  .el-dialog__headerbtn {
    color: #112df2;
    background: #f4f7fe;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    .el-dialog__close {
      transform: scale(0.6);
      color: #112df2;
    }
  }

  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__title {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__body {
    padding: 0;
    position: relative;
    top: -10px;
    color: #8f9bba;
    h1 {
      font-weight: bold;
      font-size: 28px;
      line-height: 36px;
      color: #000000;
      text-align: center;
      margin: 0;
      margin-bottom: 24px;
    }
    span {
      text-align: center;
      display: flex;
      font-size: 12px;
      line-height: 1.5;
    }
  }
`;

const styleModalActionContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;
const styleModalConfirm = css`
  background: #112df2;
  border-radius: 70px;
  color: white;
  font-size: 14px;
  width: 180px;
  height: 46px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const styleNoDataContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  color: #233a7d;
  min-height: calc(100vh - 400px);
  span {
    margin-top: 20px;
  }
`;
