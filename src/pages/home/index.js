import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Carousel, Loading } from 'element-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css, cx } from 'emotion';
import {Icon} from '@iconify/react';
import { noDataSvg } from 'utils/svg';
import { post } from 'utils/request';
import NFTCard from '../market/component/item';
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

  const SampleNextArrow = useCallback(
    (props) => {
      const { className, style, onClick, currentSlide, slideCount } = props;

      let slidesToShow;
      if (currentWindowWidth > 1560) {
        slidesToShow = 5;
      } else if (currentWindowWidth > 1280) {
        slidesToShow = 4;
      } else if (currentWindowWidth > 1024) {
        slidesToShow = 3;
      } else {
        slidesToShow = 2;
      }
      const isLastShow = slidesToShow + currentSlide >= slideCount;

      return (
        <Icon
          icon='mdi:chevron-right'
          className={cx(className, styleNextArrow)}
          style={{
            ...style,
            opacity: 1,
            color: isLastShow ? '#929AC2' : '#3F4FA5',
            background: isLastShow ? '#E6E8EC' : '#FFFFFF'
          }}
          onClick={onClick}
        />
      );
    },
    [currentWindowWidth]
  );

  function SamplePrevArrow (props) {
    const { className, style, onClick, currentSlide, slideCount } = props;

    const isFirstShow = currentSlide === 0;

    return (
      <Icon
        icon='mdi:chevron-left'
        className={cx(className, stylePrevArrow)}
        style={{
          ...style,
          opacity: 1,
          color: isFirstShow ? '#929AC2' : '#3F4FA5',
          background: isFirstShow ? '#E6E8EC' : '#FFFFFF'
        }}
        onClick={onClick}
      />
    );
  }
  const settings = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1560,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    className: styleSliderContainer,
  };

  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
        <span>No content</span>
      </div>
    ),
    []
  );

  const clickDetail = (item) => {
    console.log(item, 'item');
    history.push('/market/detail', {item, category: item.category, sortTag: item.sortTag})
  }
  const renderCard = useCallback(
    (item, index) => <NFTCard key={index} item={item} index={index} needAction
      clickDetail={() => clickDetail(item)} />,
    []
  );

  console.log(list, 'list');
  const renderHotList = useCallback((title) => (
    <div className={styleArtContainer}>
      <h1 className={styleTitle}>{title}</h1>
      <Loading loading={isLoading} />
      <Slider {...settings}>
        {list?.length > 0
          ? list.map((item, index) =>  renderCard(item, index))
          : renderNoData}
      </Slider>
    </div>
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
  margin: 25px 26px;
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
const styleArtContainer = css`
  border-radius: 0 0 10px 10px;
  margin: 70px 0 44px 0;
  .circular {
    position: fixed;
    width: 100px;
    height: 100px;
  }
  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;
const styleTitle = css`
  font-family: Archivo Black,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 36px;
  margin: 0;
  color: #000000;
`;
const styleSliderContainer = css`
  width: 100%;
  margin-top: 48px;
  .slick-track{
    margin: 0;
  }
`;
const styleNextArrow = css`
  display: block;
  position: absolute;
  top: -66px !important;
  right: 16px !important;
  width: 38px !important;
  height: 38px !important;
  background: #ffffff;
  border-radius: 100%;
  color: #3F4FA5;
  @media (max-width: 768px) {
    right: 14px !important;
  }
  &:hover{
    color: #3F4FA5;
    background: #ffffff;
  }
`;
const stylePrevArrow = css`
  display: block;
  position: absolute;
  top: -66px !important;
  left: calc(100% - 106px) !important;
  width: 38px !important;
  height: 38px !important;
  background: #ffffff;
  border-radius: 100%;
  color: #3F4FA5;
  @media (max-width: 768px) {
    left: calc(100% - 76px) !important;
  }
  &:hover{
    color: #3F4FA5;
    background: #ffffff;
  }
`;
const styleNoDataContainer = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
