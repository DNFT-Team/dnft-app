import { DownOutlined, HeartFilled } from '@ant-design/icons';
import { Dialog, Input, Select } from 'element-react';
import { css, cx } from 'emotion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { tokenAbi, nftAbi, nft1155Abi } from 'utils/abi';
import { tokenContract, nftContract, nft1155Contract } from 'utils/contract';
import { nfIconSvg, noDataSvg } from 'utils/svg';
import Web3 from 'web3';

const AssetScreen = (props) => {
  const tabArray = ['On Sale', 'In Wallet', 'My favorite', 'Sold'];
  const data = [
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'Shanghaibar',
      account: 123,
      sold: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test',
      account: '1,234',
      onSale: true,
      stared: true,
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'test2',
      account: 12,
      sold: true,
      stared: true,
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'fwefwefwef',
      account: 736,
      inWallet: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'efefef',
      account: 123,
      sold: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'aaaaa',
      account: '1,234',
      sold: true,
      stared: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'Shanghaibar',
      account: 123,
      inWallet: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test',
      account: '1,234',
      inWallet: true,
      stared: true,
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'test2',
      account: 12,
      sold: true,
      stared: true,
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'fwefwefwef',
      account: 736,
      inWallet: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'efefef',
      account: 123,
      onSale: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'aaaaa',
      account: '1,234',
      stared: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'Shanghaibar',
      account: 123,
      inWallet: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test',
      account: '1,234',
      onSale: true,
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'test2',
      account: 12,
      inWallet: true,
      stared: true,
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'fwefwefwef',
      account: 736,
      inWallet: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'efefef',
      account: 123,
      onSale: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'aaaaa',
      account: '1,234',
      stared: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'Shanghaibar',
      account: 123,
      inWallet: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test',
      account: '1,234',
      onSale: true,
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'test2',
      account: 12,
      sold: true,
      stared: true,
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'fwefwefwef',
      account: 736,
      inWallet: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'efefef',
      account: 123,
      onSale: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'aaaaa',
      account: '1,234',
      stared: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'Shanghaibar',
      account: 123,
      inWallet: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test',
      account: '1,234',
      onSale: true,
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'test2',
      account: 12,
      sold: true,
      stared: true,
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'fwefwefwef',
      account: 736,
      inWallet: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'efefef',
      account: 123,
      onSale: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'aaaaa',
      account: '1,234',
      stared: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'Shanghaibar',
      account: 123,
      inWallet: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test',
      account: '1,234',
      onSale: true,
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'test2',
      account: 12,
      sold: true,
      stared: true,
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'fwefwefwef',
      account: 736,
      inWallet: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'efefef',
      account: 123,
      onSale: true,
      stared: true,
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'test4',
      account: '1,234',
      stared: true,
    },
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'test1',
      account: 123,
      sold: true,
      stared: true,
    },
  ];
  const cateType = [
    { label: 'Lasted', value: 0 },
    { label: 'Virtual reality', value: 1 },
    { label: 'Domain', value: 2 },
    { label: 'Art', value: 3 },
    { label: 'Cooection', value: 4 },
    { label: 'Sports', value: 5 },
    { label: 'Game', value: 6 },
  ];
  const cateType1 = [
    { label: 'Most favorited', value: 0 },
    { label: 'Price:high to low', value: 1 },
    { label: 'Price:low to high', value: 2 },
  ];
  const [selectedTab, setSelectedTab] = useState('In Wallet');
  const [isVisible, setIsVisible] = useState(false);
  const [keyword, setKeyword] = useState();
  const [balance, setBalance] = useState(0);
  const [nftData, setNftData] = useState();
  let history = useHistory();

  useEffect(() => {
    injectWallet();
  }, []);

  const init = () => {
    // getBalance();
    getNft();
  };

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
            item === selectedTab && styleActiveTabButton
          )}
          onClick={() => {
            setSelectedTab(item);
          }}
        >
          {item}
        </div>
      )),
    [selectedTab]
  );

  const renderAction = useCallback(
    (item) => {
      switch (selectedTab) {
      case 'In Wallet':
        return (
          <div className={styleButtonContainer}>
            <div className={cx(styleButton, styleFillButton)}>
              Cross-chain
            </div>
            <div className={cx(styleButton, styleBorderButton)}>Sell</div>
          </div>
        );
      case 'On Sale':
        return (
          <div className={styleButtonContainer}>
            <span className={stylePrice}>1.8ETH</span>
            <div className={cx(styleButton, styleFillButton)}>Edit</div>
          </div>
        );
      case 'My favorite':
        return item.sold ? (
          <div className={cx(styleText, styleSoldOut)}>Sold out</div>
        ) : (
          <div className={styleButtonContainer}>
            <span className={stylePrice}>1.8ETH</span>
            <div className={cx(styleButton, styleFillButton)}>Buy</div>
          </div>
        );
      case 'Sold':
        return (
          <div className={styleButtonContainer}>
            <span>
              <span className={styleText}>Sold for </span>
              <span className={stylePrice}>1.8ETH</span>
            </span>
            <div className={styleText}>14/06/2021</div>
          </div>
        );

      default:
        return null;
      }
    },
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

  const renderNft = useCallback(
    (item, index) => (
      <div key={`title-${index}`} className={styleCardContainer}>
        <div
          style={{
            background: `url(${item}) no-repeat`,
            backgroundSize: 'contain',
          }}
          className={styleShortPicture}
        />
        <div className={styleInfoContainer} style={{ height: '400px' }}>
          <div
            className={styleCardHeader}
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <span className={styleCardTitle}>
              {getFormatName(item.split('igo/')[1].split('.')[0])} Medal NFT
            </span>
            <div className={styleStarInfo}>
              <div className={styleStarIconContainer}>
                <HeartFilled style={{ color: '#c4c4c4' }} />
              </div>
              <span>{item.account}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  const renderCard = useCallback(
    (item, index) => {
      const isFavorite = item.stared && selectedTab === 'My favorite';

      return (
        <div key={`title-${index}`} className={styleCardContainer}>
          {item.sold && <div className={styleSoldOutBanner}>sold out</div>}
          <div
            style={{
              background: `center / cover no-repeat ${item.src}`,
            }}
            className={styleShortPicture}
          />
          <div className={styleInfoContainer}>
            <div className={styleCardHeader}>
              <span className={styleCardTitle}>{item.title}</span>
              <div className={styleStarInfo}>
                <div
                  className={styleStarIconContainer}
                  onClick={() => {
                    if (!isFavorite) {
                      return;
                    }
                    setIsVisible(true);
                  }}
                >
                  <HeartFilled
                    style={{ color: item.stared ? '#F13030' : '#c4c4c4' }}
                  />
                </div>
                <span>{item.account}</span>
              </div>
            </div>
            <div className={styleActionContainer}>{renderAction(item)}</div>
          </div>
        </div>
      );
    },
    [renderAction, keyword]
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

  const dealWithData = useMemo(
    () =>
      data?.filter((item) => {
        const isInWallet = item.inWallet && selectedTab === 'In Wallet';
        const isFavorite = item.stared && selectedTab === 'My favorite';
        const isOnSale = item.onSale && selectedTab === 'On Sale';
        const isSold = item.sold && selectedTab === 'Sold';
        const includeKeyword = item.title.includes(keyword);

        if (!isInWallet && !isOnSale && !isFavorite && !isSold) {
          return;
        }
        if (keyword !== '' && keyword !== undefined && !includeKeyword) {
          return;
        }

        return item;
      }),
    [selectedTab, keyword, data]
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
                value={0}
                placeholder='请选择'
              >
                {cateType.map((el) => (
                  <Select.Option
                    key={el.value}
                    label={el.label}
                    value={el.value}
                  />
                ))}
              </Select>
              <Select value={0} placeholder='请选择'>
                {cateType1.map((el) => (
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
            {dealWithData?.length > 0
              ? dealWithData.map((item, index) => {
                console.log('index', index)
                return renderCard(item, index);
              })
              : renderNoData}
          </div>
        </div>
      </div>
      {renderModal}
    </div>
  );
};
export default AssetScreen;

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

const styleFilterContainer = css`
  border: 1px solid #e1e2ed;
  border-radius: 10px;
  width: 100%;
  height: 46px;
  display: flex;
  margin: 24px 0 64px 0;
`;

const styleFilter = css`
  display: flex;
  align-items: center;
  padding: 0 20px 0 14px;
  justify-content: space-between;
  width: 160px;
  border-right: 1px solid #e1e2ed;
  span {
    font-weight: bold;
    font-size: 18px;
    color: #263b79;
  }
  svg {
    font-size: 12px;
    padding-left: 28px;
  }
`;

const styleSearch = css`
  padding-left: 24px;
  display: flex;
  align-items: center;
  color: #263b79;
  flex: 1;
  .el-input__inner {
    border: none;
    font-size: 14px;
    margin-left: 12px;
    width: 100%;
    color: #8f9bba;
  }
`;

const styleCardList = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
  margin-top: 20px;
`;

const styleCardContainer = css`
  height: 340px;
  background: #f5f7fa;
  border-radius: 18px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  flex: 1;
  min-width: 280px;
  margin: 20px;
  &:hover {
    background: white;
    box-shadow: 0px 16.1719px 22.3919px rgba(0, 0, 0, 0.05);
    position: relative;
    top: -20px;
  }
  &:last-child {
    margin-right: auto;
  }
`;

const styleShortPicture = css`
  height: 425px;
  border-radius: 18px 18px 0 0;
`;

const styleStarInfo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8f9bba;
  position: absolute;
  top: -36px;
  right: 0;
`;

const styleStarIconContainer = css`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  &:hover {
    cursor: pointer;
  }
  svg {
    font-size: 20px;
  }
`;

const styleInfoContainer = css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const styleCardHeader = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid #f5f7fa;
  position: relative;
`;

const styleCardTitle = css`
  color: #1b2559;
  font-weight: 900;
  font-size: 20px;
`;

const styleActionContainer = css`
  margin-top: 10px;
`;

const styleButtonContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const styleFillButton = css`
  background: #112df2;
  color: white;
  border-radius: 8px;
`;
const styleBorderButton = css`
  border: 1px solid #112df2;
  border-radius: 8px;
  color: #112df2;
`;

const styleButton = css`
  width: 130px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;

const stylePrice = css`
  color: #ff313c;
  font-size: 20px;
  font-weight: 900;
`;

const styleText = css`
  font-size: 14px;
  color: #8f9bba;
`;

const styleSoldOut = css`
  margin-bottom: 8px;
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

const styleSoldOutBanner = css`
  position: absolute;
  width: 74px;
  height: 47px;
  background: #ff313c;
  border-radius: 0 0 20px 20px;
  font-weight: bold;
  font-size: 14px;
  left: 24px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
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
