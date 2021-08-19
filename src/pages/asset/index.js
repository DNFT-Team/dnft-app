import { Dialog, Input, Select } from 'element-react';
import { css, cx } from 'emotion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { tokenAbi, nftAbi, nft1155Abi } from 'utils/abi';
import { tokenContract, nftContract, nft1155Contract } from 'utils/contract';
import { nfIconSvg, noDataSvg } from 'utils/svg';
import Web3 from 'web3';
import NFTCard from '../../components/NFTCard';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const AssetScreen = (props) => {
  const { dispatch, location, address, chainType, token } = props;

  const tabArray = [{
    label: 'On Sale',
    value: 'ONSALE'
  },{
    label: 'In Wallet',
    value: 'INWALLET'
  },{
    label: 'My Favorite',
    value: 'MYFAVORITE'
  },{
    label: 'Sold',
    value: 'SOLD'
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
    { label: 'Most favorited', value: 'likeCount' },
    { label: 'Price:high to low', value: 1 },
    { label: 'Price:low to high', value: 2 },
  ];
  const [selectedTab, setSelectedTab] = useState('INWALLET');
  const [isVisible, setIsVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [nftData, setNftData] = useState();
  const [category, setCategory] = useState('LASTED');
  const [sortTag, setSortTag] = useState('likeCount')
  const [list, setList] = useState()

  let history = useHistory();

  useEffect(() => {
    injectWallet();
  }, []);

  const init = () => {
    // getBalance();
    getNft();
  };

  const getNFTList = async () => {
    const { data } = await post(
      '/api/v1/nft/batch',
      {
        address: '0x39ba0111ae2b073552c4ced8520a5bcb93437628',
        category: category,
        sortOrder: 'ASC',
        status: selectedTab.value,
        sortTag: sortTag,
        page: 0,
        size: 10
      },
      token
    );
    setList(data?.data?.content || [])
  }

  useEffect(() => {
    if (token) {
      getNFTList()
    }
  },[token, category, selectedTab, sortTag])

  const getNft = async () => {
    try {
      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });

        const account = accounts[0];
        let nftDataList = [];
        const contractAddress = nft1155Contract;
        const myContract = new window.web3.eth.Contract(
          nft1155Abi,
          contractAddress
        );
        const nft1 = await myContract.methods.balanceOf(account, 100).call({
          from: account,
        });
        const nft2 = await myContract.methods.balanceOf(account, 200).call({
          from: account,
        });
        const nft3 = await myContract.methods.balanceOf(account, 300).call({
          from: account,
        });
        if (nft1 > 0) {
          nftDataList.push('https://dnft.world/igo/100.png');
        }
        if (nft2 > 0) {
          nftDataList.push('https://dnft.world/igo/200.png');
        }
        if (nft3 > 0) {
          nftDataList.push('https://dnft.world/igo/300.png');
        }

        // const contractAddress = nftContract;
        // let nftDataList = [];
        // const myContract = new window.web3.eth.Contract(
        //   nftAbi,
        //   contractAddress
        // );
        // const nft1 = await myContract.methods.balanceOf(account, 1).call({
        //   from: account,
        // });
        // const nft2 = await myContract.methods.balanceOf(account, 2).call({
        //   from: account,
        // });
        // const nft3 = await myContract.methods.balanceOf(account, 3).call({
        //   from: account,
        // });
        // if (nft1 > 0) {
        //   nftDataList.push('https://dnft.world/staking/pool1.png');
        // }
        // if (nft2 > 0) {
        //   nftDataList.push('https://dnft.world/staking/pool2.png');
        // }
        // if (nft3 > 0) {
        //   nftDataList.push('https://dnft.world/staking/pool3.png');
        // }

        setNftData(nftDataList);
      }
    } catch (e) {
      console.log(e, 'e');
    }
  };

  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      if (Number(ethereum.networkVersion) !== 97) {
        toast.dark('Please Choose BSC Testnet', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  }, []);

  const injectWallet = useCallback(async () => {
    let ethereum = window.ethereum;

    if (ethereum) {
      ethereum.on('networkChanged', (networkIDstring) => {
        if (Number(networkIDstring) !== 97) {
          toast.dark('Please Choose BSC Testnet', {
            position: toast.POSITION.TOP_CENTER,
          });
          setNftData(undefined);
          setBalance(undefined);

          return;
        }

        init();
      });

      ethereum.on('accountsChanged', (accounts) => {
        setBalance(undefined);
        setNftData(undefined);
        init();
      });

      init();
    } else {
      alert('Please install wallet');
    }
  }, []);

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
          <div className={styleIcon}>{nfIconSvg}</div>
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
    (item, index) => <NFTCard item={item} index={index} needAction={true} currentStatus={selectedTab} />,
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
            <div>
              <Select
                style={{ marginRight: 20 }}
                value={category}
                placeholder='请选择'
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
              <Select value={sortTag} placeholder='请选择' onChange={(value) => {
                setSortTag(value)
              }}>
                {sortTagType.map((el) => (
                  <Select.Option
                    key={el.value}
                    label={el.label}
                    value={el.value}
                  />
                ))}
              </Select>
            </div>
          </div>

          <div className={styleCardList}>
            {list?.length > 0
              ? list.map((item, index) =>  renderCard(item, index))
              : renderNoData}
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
  height: 18px;
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
