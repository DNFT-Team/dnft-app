import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { getHomeList } from 'reduxs/actions/home';
import { _setLng } from 'reduxs/actions/lng';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Carousel, Loading } from 'element-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css, cx } from 'emotion';
import {Icon} from '@iconify/react';
import { getMarketList } from 'reduxs/actions/market';
import { noDataSvg } from 'utils/svg';
import { post } from 'utils/request';
import NFTCard from '../market/component/item';
import globalConf from 'config/index'

const HomeScreen = (props) => {
  const { dispatch, location, token, address } = props;
  let history = useHistory();

  // console.log(token, 'token')

  // useEffect(() => {
  //   dispatch(getHomeList());
  // }, []);

  const changeEn = () => {
    dispatch(_setLng());
  };

  const [list, setList] = useState()
  const [isLoading, setIsLoading] = useState(false);

  const dataTopAll = [
    {
      src: 'https://test.dnft.world/temp/top3.png',
      title: 'DNFT MINING',
      position: 'right',
      route: '/mining',
      isHide: globalConf.net_env !== 'mainnet'
    },
    {
      src: 'https://test.dnft.world/temp/top2.jpg',
      title: 'NFT MARKET',
      route: '/market'
    },
    {
      src: 'https://test.dnft.world/temp/top1.png',
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
    window.addEventListener('resize', () => currentWindowWidth);

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
          icon='ant-design:right-circle-outlined'
          className={cx(className, styleNextArrow)}
          style={{
            ...style,
            opacity: isLastShow ? 0.25 : 1,
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
        icon='ant-design:left-circle-outlined'
        className={cx(className, stylePrevArrow)}
        style={{
          ...style,
          opacity: isFirstShow ? 0.25 : 1,
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
    (item, index) => <NFTCard key={index} item={item} index={index} needAction clickDetail={() => clickDetail(item)} />,
    []
  );

  console.log(list, 'list');
  const renderHotList = useCallback((title) => (
    <div className={styleArtContainer}>
      <h1 className={styleTitle}>{title}</h1>
      <Loading
        loading={isLoading}
        style={{ position: 'fixed', width: 'calc(100% - 76px)', zIndex: 10000 }}
      />
      <Slider {...settings}>
        {list?.length > 0
          ? list.map((item, index) =>  renderCard(item, index))
          : renderNoData}
      </Slider>
    </div>
  ), [list, isLoading]);

  return (
    <div className={styleContainer}>
      <Carousel trigger='click' height={'24rem'}>
        {dataTop?.map((item, index) => (
          <Carousel.Item key={index}>
            <div className={styleBanner} style={{
              backgroundImage: "url('" + item.src + "')",
              backgroundPosition: item.position || 'center'
            }} onClick={() => {
              item.route && history.push(item.route)
            }}>
              <span className={styleCaroTitle}>{item.title}</span>
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
const styleCaroTitle = css`
  position: absolute;
  bottom: 90px;
  left: 36px;
  font-family: Poppins , sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 48px;
  letter-spacing: -0.5px;
  color: white;
  background: linear-gradient(60deg, rgba(0,0,0,.6), rgba(0,0,0,.2));
  padding: 1rem 1.2rem;
  backdrop-filter: blur(4px);
  border-radius: 8px;
  @media (max-width: 768px) {
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    font-size: 24px;
    text-align: center;
    padding: 0;
  }
`;
const styleContainer = css`
  margin: 10px 16px 0 16px;
  .el-carousel {
    border-radius: 10px;
    background: white;
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
const styleNextArrow = css`
  display: block;
  position: absolute;
  top: -34px !important;
  right: 16px !important;
  width: 24px !important;
  height: 24px !important;
  color: #000000 !important;
  @media (max-width: 768px) {
    right: 14px !important;
  }
  &:hover{
    color: #1b2559;
  }
  svg {
    width: 24px;
    height: 24px;
    color: #000000;
  }
`;

const stylePrevArrow = css`
  display: block;
  position: absolute;
  top: -34px !important;
  left: calc(100% - 88px) !important;
  width: 24px !important;
  height: 24px !important;
  color: #000000 !important;
  @media (max-width: 768px) {
    left: calc(100% - 76px) !important;
  }
  &:hover{
    color: #1b2559;
  }
  svg {
    width: 24px;
    height: 24px;
    color: #000000;
  }
`;

const styleCard = css`
  display: flex;
  margin-right: 50px;
  flex-direction: column;
`;

const styleTitle = css`
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 20px;
  color: #000000;
  margin: 0 0 0 18px;
`;

const styleArtContainer = css`
  background: white;
  padding: 40px 0 56px 32px;
  height: 470px;
  border-radius: 0 0 10px 10px;
  margin-bottom: 20px;
  .circular {
    position: relative;
    top: 120px;
    width: 100px;
    height: 100px;
  }
  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

const styleSliderContainer = css`
  width: 100%;
`;

const styleContentContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 16px;
  color: #1b2559;
  font-weight: 900;
  margin-bottom: 10px;
  align-items: center;
`;

const styleStarContainer = css`
  color: #b9a2ff;
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 12px;
`;

const styleStarAccount = css`
  margin-left: 8px;
  font-weight: normal;
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
