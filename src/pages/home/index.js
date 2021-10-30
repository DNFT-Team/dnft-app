import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Carousel } from 'element-react';
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

  const [list, setList] = useState()
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    getNFTList()
  }, [token]);

  useEffect(() => {
    window.addEventListener('resize', (e) => currentWindowWidth);
    return () => {
      window.removeEventListener('resize', () => currentWindowWidth);
    };
  }, []);

  console.log('[list]', list);
  const renderHotList = useCallback((title) => (
    <NftSlider title={title} list={list} loading={isLoading} cww={currentWindowWidth} />
  ), [list, isLoading]);

  return (
    <div className={styleContainer}>
      <Carousel trigger='click' height="413px" interval={6000}>
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
  margin: 30px 50px;
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
