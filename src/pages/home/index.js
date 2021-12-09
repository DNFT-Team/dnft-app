import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Carousel, Dialog, Button } from 'element-react';
import { css } from 'emotion';
import { post } from 'utils/request';
import NftSlider from '../../components/NftSlider';
import globalConf from 'config/index'

import banner1 from 'images/home/banner/marketplace.png'
import banner2 from 'images/home/banner/mintNft.png'
import banner3 from 'images/home/banner/mining.png'
import banner4 from 'images/home/banner/gamefi.png'


const HomeScreen = (props) => {
  const { token } = props;
  let history = useHistory();

  const currentNetEnv = globalConf.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const right16ChainId =  currentNetEnv === 'testnet' ? '0x61' : '0x38';
  const rightRpcUrl = currentNetEnv === 'testnet' ? ['https://data-seed-prebsc-1-s1.binance.org:8545/'] : ['https://bsc-dataseed.binance.org/'];

  const [list, setList] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(413);
  const dataTopAll = [
    {
      src: banner1,
      title: 'NFT MARKET',
      route: '/market'
    },
    {
      src: banner2,
      title: 'NFT Mint',
      route: '/asset'
    },
    {
      src: banner3,
      title: 'DNFT MINING',
      position: 'right',
      route: '/mining',
      isHide: globalConf.net_env !== 'mainnet'
    },
    {
      src: banner4,
      title: 'GAMEFI NEWS EARLY',
      route: '/igo'
    },
  ];
  const dataTop = dataTopAll.filter((e) => !e.isHide)

  const currentWindowWidth = useMemo(() => window.innerWidth, []);

  const getNFTList = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(token, 'token')

      const { data } = await post(
        '/api/v1/info/hot',
      )
      setList(data?.data?.content || []);
    } finally {
      setIsLoading(false)
    }
  }, [token]);
  const getMarketList = (id, isSave) => {
    let data = list.slice();
    data.map((obj) => {
      if(obj.id === id) {
        obj.isSaved = isSave;
        obj.saveCount = isSave ? obj.saveCount + 1 : obj.saveCount - 1;
      }
    })
    setList(data);
  }
  useEffect(() => {
    getNFTList()
  }, [token]);

  useEffect(() => {
    window.addEventListener('resize', (e) => currentWindowWidth);
    return () => {
      window.removeEventListener('resize', () => currentWindowWidth);
    };
  }, []);

  const goToRightNetwork = useCallback(async (ethereum) => {
    try {
      if (history.location.pathname !== '/') {
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

  useEffect(() => {
    setIsShowSwitchModal(false)
    let ethereum = window.ethereum;

    if (ethereum) {
      if (
        Number(ethereum.networkVersion) !== rightChainId &&
        history.location.pathname === '/'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, []);

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
  const getWindowSize = () => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  });
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  const handleResize = () => {
    setBannerHeight(
      getWindowSize()?.innerHeight > 900 ? '45vh' : 413
    )
  };

  const renderHotList = useCallback((title) => (
    <NftSlider title={title} list={list} getMarketList={getMarketList} loading={isLoading} cww={currentWindowWidth} />
  ), [list, isLoading]);

  return (
    <div className={styleContainer}>
      <Carousel trigger='click' style={{height: '900px'}} height={bannerHeight} interval={6000}>
        {dataTop?.map((item, index) => (
          <Carousel.Item key={index}>
            <div className={styleBanner} style={{
              backgroundImage: "url('" + item.src + "')",
              backgroundPosition: item.position || 'center'
            }} onClick={() => {
              item.route && history.push(item.route)
            }}>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      {renderHotList('Hot NFTs')}
      {renderShowSwitchModal()}
    </div>
  );
};
const mapStateToProps = ({ home, profile }) => ({
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(HomeScreen));

const styleBanner = css`
  height: 100%;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: cover;
`
const styleContainer = css`
  margin: 50px 50px;
  @media (max-width: 900px) {
    margin: 10px;
  }
  .el-carousel {
    border-radius: 10px;
    background: transparent;
    .el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius: 10px;
      margin-left: 10px;
    }
    .el-carousel__arrow {
      border: 2px solid white;
      background: rgba(143, 143, 143, 0.7);
      width: 36px;
      height: 36px;
      border-radius: 36px;
      .el-icon-arrow-left,
      .el-icon-arrow-right {
        font-weight: bold;
      }
    }
  }
`;

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