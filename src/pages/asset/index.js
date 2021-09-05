import { Dialog, Loading, Select } from 'element-react';
import { css, cx } from 'emotion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { tokenAbi, nftAbi, nft1155Abi } from 'utils/abi';
import { tokenContract, nftContract, nft1155Contract } from 'utils/contract';
import { noDataSvg } from 'utils/svg';
import Web3 from 'web3';
import NFTCard from '../../components/NFTCard';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import defaultHeadSvg from '../../images/asset/Head.svg'
import globalConfig from '../../config'
import { stakingJson } from 'pages/mining';

const AssetScreen = (props) => {
  const { dispatch, location, address, chainType, token } = props;
  const isTestNet = globalConfig.net_env === 'testnet';

  const tabArray =  isTestNet ? [{
    label: 'On Sale',
    value: 'ONSALE'
  }, {
    label: 'In Wallet',
    value: 'INWALLET'
  }, {
    label: 'Sold',
    value: 'SOLD'
  }] : [{
    label: 'In Wallet',
    value: 'INWALLET'
  }];

  const cateType = [
    { label: 'Lasted', value: 'LASTED' },
    { label: 'Virtual reality', value: 'VIRTUAL_REALITY' },
    { label: 'Domain', value: 'DOMAIN' },
    { label: 'Art', value: 'ART' },
    { label: 'Cooection', value: 'COOECTION' },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Game', value: 'GAME' },
  ];

  const sortTagType = [
    { label: 'Price:high to low', value: 'ASC-price' },
    { label: 'Price:low to high', value: 'DESC-price' },
  ];
  const [selectedTab, setSelectedTab] = useState({
    label: 'In Wallet',
    value: 'INWALLET'
  });
  const [isVisible, setIsVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState('ART');
  const [sortTag, setSortTag] = useState('ASC-price')
  const [list, setList] = useState();
  const [sortOrder, setSortOrder] = useState('ASC');
  const rightChainId =  globalConfig.net_env === 'testnet' ? 97 : 56;
  const [isLoading, setIsLoading] = useState(false);

  let history = useHistory();

  useEffect(() => {
    injectWallet();
  }, []);

  const init = () => {
    getBalance();
  };

  const getNFTList = async (currentAddress, currentToken) => {
    try {
      setIsLoading(true)
      // if (selectedTab.value === 'INWALLET' && category === 'ART') {
      //   const contractAddress = nftContract;
      //   let nftDataList = [];
      //   const myContract = new window.web3.eth.Contract(
      //     nftAbi,
      //     contractAddress
      //   );
      //   const nft1 = await myContract.methods.balanceOf(address, 1).call({
      //     from: address,
      //   });
      //   const nft2 = await myContract.methods.balanceOf(address, 2).call({
      //     from: address,
      //   });
      //   const nft3 = await myContract.methods.balanceOf(address, 3).call({
      //     from: address,
      //   });

      //   if (nft1 > 0) {
      //     nftDataList.push({
      //       name: stakingJson[Number(1) - 1].name,
      //       supply: 1,
      //       avatorUrl: stakingJson[Number(1) - 1].image,
      //       address: address,
      //       chainType: 'BSC',
      //       tokenId: 1,
      //       tokenAddr: contractAddress,
      //       category: 'ART',
      //       collectionId: -1,
      //       description: stakingJson[Number(1) - 1].description,
      //     });
      //   }
      //   if (nft2 > 0) {
      //     nftDataList.push({
      //       name: stakingJson[Number(2) - 1].name,
      //       supply: 1,
      //       avatorUrl: stakingJson[Number(2) - 1].image,
      //       address: address,
      //       chainType: 'BSC',
      //       tokenId: 1,
      //       tokenAddr: contractAddress,
      //       category: 'ART',
      //       collectionId: -1,
      //       description: stakingJson[Number(2) - 1].description,
      //     });
      //   }
      //   if (nft3 > 0) {
      //     nftDataList.push({
      //       name: stakingJson[Number(3) - 1].name,
      //       supply: 1,
      //       avatorUrl: stakingJson[Number(3) - 1].image,
      //       address: address,
      //       chainType: 'BSC',
      //       tokenId: 1,
      //       tokenAddr: contractAddress,
      //       category: 'ART',
      //       collectionId: -1,
      //       description: stakingJson[Number(3) - 1].description,
      //     });
      //   }
      //   setList(nftDataList)
      // } else if (selectedTab.value === 'INWALLET' && category === 'GAME') {
      //   let ethereum = window.ethereum;
      //   window.web3 = new Web3(ethereum);
      //   await ethereum.enable();

      //   const accounts = await ethereum.request({
      //     method: 'eth_requestAccounts',
      //   });

      //   const account = accounts[0];
      //   let nftDataList = [];
      //   const contractAddress = nft1155Contract;
      //   const myContract = new window.web3.eth.Contract(
      //     nft1155Abi,
      //     contractAddress
      //   );
      //   const nft1 = await myContract.methods.balanceOf(account, 100).call({
      //     from: account,
      //   });
      //   const nft2 = await myContract.methods.balanceOf(account, 200).call({
      //     from: account,
      //   });
      //   const nft3 = await myContract.methods.balanceOf(account, 300).call({
      //     from: account,
      //   });
      //   if (nft1 > 0) {
      //     nftDataList.push({
      //       name: 'Gold Medal NFT',
      //       supply: 1,
      //       avatorUrl: 'https://dnft.world/igo/100.png',
      //       address: address,
      //       chainType: 'BSC',
      //       tokenId: 1,
      //       tokenAddr: contractAddress,
      //       category: 'GAME',
      //       collectionId: -1,
      //     });
      //   }
      //   if (nft2 > 0) {
      //     nftDataList.push({
      //       name: 'Silver Medal NFT',
      //       supply: 1,
      //       avatorUrl: 'https://dnft.world/igo/200.png',
      //       address: address,
      //       chainType: 'BSC',
      //       tokenId: 1,
      //       tokenAddr: contractAddress,
      //       category: 'GAME',
      //       collectionId: -1,
      //     });
      //   }
      //   if (nft3 > 0) {
      //     nftDataList.push({
      //       name: 'Bronze Medal NFT',
      //       supply: 1,
      //       avatorUrl: 'https://dnft.world/igo/300.png',
      //       address: address,
      //       chainType: 'BSC',
      //       tokenId: 1,
      //       tokenAddr: contractAddress,
      //       category: 'GAME',
      //       collectionId: -1,
      //     });
      //   }
      //   setList(nftDataList)
      // } else {
      const { data } = await post(
        '/api/v1/trans/personal',
        {
          address: currentAddress || address,
          category: category,
          sortOrder: sortOrder,
          status: selectedTab.value,
          sortTag: 'price',
          page: 0,
          size: 100
        },
        currentToken || token
      );
      setList(data?.data?.content || [])
      // }
    } finally {
      setIsLoading(false)
    }
  }

  const goToRightNetwork = useCallback(async (ethereum) => {
    if (history.location.pathname !== '/asset') {
      return;
    }
    try {
      if (globalConfig.net_env === 'testnet') {
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

      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  }, []);

  useEffect(() => {
    if (token) {
      getNFTList()
    }
  }, [token, category, selectedTab, sortTag, address, chainType])

  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      if (Number(ethereum.networkVersion) !== rightChainId && history.location.pathname === '/asset') {
        goToRightNetwork(ethereum);
      }
    }
  }, []);

  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      ethereum.on('networkChanged', (networkIDstring) => {
        if (Number(networkIDstring) !== rightChainId && history.location.pathname === '/asset') {
          setBalance(undefined)
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
    }
  };

  const renderAssetHeader = useMemo(
    () => (
      <div className={styleHeader}>
        <div className={styleAssetAccountContainer}>
          <div className={styleIcon}>
            <img src={defaultHeadSvg} />
          </div>
          <span className={styleCoinName}>DNF</span>
          <span>{balance}</span>
        </div>
        <div
          className={styleCreateNFT}
          onClick={() => {
            history.push('/asset/create');
          }}
        >
          Create NFT
        </div>
      </div>
    ),
    [balance]
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
    (item, index) => <NFTCard item={item} index={index} needAction={isTestNet} currentStatus={selectedTab} onLike={getNFTList}
      onSave={getNFTList} onRefresh={(currentAddress, currentToken) => getNFTList(currentAddress, currentToken)} />,
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
        <span>No content</span>
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
            <Loading
              loading={isLoading}
              style={{ position: 'fixed', width: 'calc(100% - 76px)' }}
            />
            <div>
              <Select
                value={category}
                placeholder='please choose'
                onChange={(value) => {
                  setCategory(value)
                }}
              >
                {cateType.map((el) => (
                  <Select.Option
                    key={el.value}
                    label={el.label}
                    value={el.value}
                  />
                ))}
              </Select>
              {isTestNet && <Select value={sortTag} style={{ marginLeft: 20 }} placeholder='please choose' onChange={(value) => {
                setSortTag(value)
                setSortOrder(value.split('-')[0])
              }}>
                {sortTagType.map((el) => (
                  <Select.Option
                    key={el.value}
                    label={el.label}
                    value={el.value}
                  />
                ))}
              </Select>}
            </div>
          </div>

          <div className={styleCardList} style={{opacity: isLoading ? 0.5 : 1}}>
            {!isLoading && list?.length > 0
              ? list.map((item, index) =>  renderCard(item, index))
              : renderNoData}
            {/* {nftData?.length > 0
              ? nftData.map((item, index) => renderCard(item, index))
              : renderNoData} */}
          </div>
        </div>
      </div>
      {renderModal}
    </div>
  );
};

const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(AssetScreen));

const styleContainer = css`
  background: #f5f7fa;
  padding: 10px 16px;
  height: 100%;
  & > div {
    &:first-child {
      background: white;
      border-radius: 10px;
      padding: 32px 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      height: calc(100% - 64px);
    }
  }
`;

const styleHeader = css`
  border-bottom: 1px solid #efefef;
  padding: 28px 36px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const styleCreateNFT = css`
  background-color: #112df2;
  color: white;
  padding: 16px 36px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
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

const styleBody = css`
  padding: 24px 36px;
  display: flex;
  flex-direction: column;
  .circular {
    position: relative;
    top: 120px;
    width: 100px;
    height: 100px;
  }
`;

const styleTabContainer = css`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  &>div{
    display: flex;
    flex-direction: row;
  }
`;

const styleIcon = css`
  width: 70px;
  height: 70px;
  border-radius: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const styleCoinName = css`
  padding: 0 12px 0 20px;
`;

const styleTabButton = css`
  height: 32px;
  color: #8588a7;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
`;

const styleActiveTabButton = css`
  background: #1b2559;
  color: white;
`;

const styleCardList = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  margin-top: 20px;
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
  span {
    margin-top: 20px;
  }
`;
