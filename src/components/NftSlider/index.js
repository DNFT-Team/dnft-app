import { useHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css, cx } from 'emotion';
import { Icon } from '@iconify/react';
import { noDataSvg } from 'utils/svg';
import NFTCard from '../../pages/market/component/item';
import React, { useCallback, useMemo } from 'react';
import { Loading } from 'element-react';

const NftSlider = (props) => {
  const { title, list, loading, cww, getMarketList } = props;
  let history = useHistory();

  const SampleNextArrow = useCallback(
    (props) => {
      const { className, style, onClick, currentSlide, slideCount } = props;

      let slidesToShow;
      if (cww > 1560) {
        slidesToShow = 5;
      } else if (cww > 1280) {
        slidesToShow = 4;
      } else if (cww > 1024) {
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
    [cww]
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
      <div className={styleNoDataContainer}>{noDataSvg}</div>
    ),
    []
  );
  const clickDetail = (item) => {
    console.log(item, 'item');
    history.push('/market/detail', {item, category: item.category, sortTag: item.sortTag})
  }
  const renderCard = useCallback(
    (item, index) => <NFTCard  key={index} item={item} getMarketList={getMarketList} index={index} needAction
      clickDetail={() => clickDetail(item)} />,
    [list]
  );
  return (
    <div className={styleArtContainer}>
      <h1 className={styleTitle}>{title}</h1>
      <Loading loading={loading} />
      <Slider {...settings}>
        {
          list?.length > 0
            ? list.map((item, index) =>  renderCard(item, index))
            : renderNoData
        }
      </Slider>
    </div>
  )
};
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(NftSlider));

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
  @media (max-width: 900px)  {
    font-size: 2rem;
  }
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
`;
