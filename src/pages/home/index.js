import React, { useCallback, useEffect, useMemo } from 'react';
import SoonModal from './../../components/SoonModal';

import { getHomeList } from 'reduxs/actions/home';
import { _setLng } from 'reduxs/actions/lng';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Carousel } from 'element-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css, cx } from 'emotion';
import {
  HeartOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';

const HomeScreen = (props) => {
  const { dispatch, datas, location } = props;
  useEffect(() => {
    dispatch(getHomeList());
  }, []);
  const changeEn = () => {
    dispatch(_setLng());
  };

  const data = [
    {
      src: "url('http://img02.yohoboys.com/contentimg/2019/03/02/12/0212d8e8832ffd18801979243989648178.jpg')",
      title: 'NFT gallery of the week',
    },
    {
      src: "url('https://s.yimg.com/os/creatr-uploaded-images/2021-01/449bc850-619a-11eb-bfbd-0eb0cfb5ab9a')",
      title: 'NFT gallery of the week',
    },
    {
      src: "url('https://cdnb.artstation.com/p/assets/images/images/014/135/359/medium/xiong-tang-05.jpg?1542638071')",
      title: 'NFT gallery of the week',
    },
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'NFT gallery of the week',
    },
  ];

  const currentWindowWidth = useMemo(() => window.innerWidth, []);

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
        <RightCircleOutlined
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
      <LeftCircleOutlined
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
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    className: styleSliderContainer,
  };

  const ArtCard = (src) => (
    <div className={styleCard}>
      <div
        style={{
          background: `center / cover no-repeat ${src.item.src}`,
          height: 350,
          marginBottom: 20,
          borderRadius: 10,
        }}
      />
      <div>
        <div className={styleContentContainer}>
          <span>Shanghaibar</span>
          <span className={styleStarContainer}>
            <HeartOutlined />
            <span className={styleStarAccount}>234</span>
          </span>
        </div>
        <div className={styleContentContainer}>
          <span>C.K</span>
          <span>1.8ETH</span>
        </div>
      </div>
    </div>
  );

  const renderHotList = useCallback((title) => (
    <div className={styleArtContainer}>
      <h1 className={styleTitle}>{title}</h1>
      <Slider {...settings}>
        {data.slice(0, 3).map((item, i) => <ArtCard item={item} key={i}/>)}
        {data.slice(1, 4).map((item, i) => <ArtCard item={item} key={i}/>)}
        {data.map((item, i) => <ArtCard item={item} key={i}/>)}
        <div className={styleCard}>
          <div
            style={{
              background: 'center / cover no-repeat url(\'http://www.ruanyifeng.com/blogimg/asset/201211/bg2012111401.jpg\')',
              height: 350,
              margin: ' 0 50px 20px 0',
              backgroundSize: 'cover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 900,
              borderRadius: 10,
            }}
          >
              Explore More
          </div>
        </div>
      </Slider>
    </div>
  ), []);

  return (
    <div className={styleContainer}>
      <SoonModal />
      <Carousel trigger="click" height={'70vh'}>
        {data?.map((item, index) => (
          <Carousel.Item key={index}>
            <div style={{
              background: 'center / cover no-repeat ' + item.src,
              height: '100%',
            }}>
              <span style={{
                position: 'absolute',
                bottom: '90px',
                left: '36px',
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
              }}>
                {item.title}
              </span>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      {renderHotList('Hot Art')}
      {renderHotList('Hot Game')}
      {renderHotList('Hot Collections')}
    </div>
  );
};
const mapStateToProps = ({ home }) => ({
  datas: home.datas,
});
export default withRouter(connect(mapStateToProps)(HomeScreen));

const styleContainer = css`
  margin: 10px 16px 0 16px;
  .el-carousel {
    border-radius: 10px;
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
  top: -50px;
  right: 50px;
  width: 36px;
  height: 36px;
  svg {
    width: 36px;
    height: 36px;
    color: #1b2559;
  }
`;

const stylePrevArrow = css`
  display: block;
  position: absolute;
  top: -50px;
  left: calc(100% - 150px);
  width: 36px;
  height: 36px;
  svg {
    width: 36px;
    height: 36px;
    color: #1b2559;
  }
`;

const styleCard = css`
  display: flex;
  margin-right: 50px;
  flex-direction: column;
`;

const styleTitle = css`
  font-size: 40px;
  font-weight: bold;
  padding-bottom: 20px;
  color: #1b2559;
  margin: 0;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const styleArtContainer = css`
  background: #f6f8fd;
  padding: 40px 0 56px 32px;
  margin-top: 30px;
  height: 470px;
  border-radius: 10px;
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
