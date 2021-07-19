import React from 'react';
import styles from './index.less'
import e2 from 'images/market/e2.png';
import e1 from 'images/market/e1.png';
import ellipse from 'images/market/ellipse.png'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Notification} from 'element-react'
import { useHistory } from 'react-router-dom';

const AssetsScreen = (props) => {
  let history = useHistory();
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
    {
      src: "url('http://crawl.ws.126.net/901d09e9cb27673f0b0d852cc6fe411f.jpg')",
      title: 'NFT gallery of the week',
    },
  ];
  function SampleNextArrow (props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          position: 'absolute',
          top: '-30px',
          right: '50px',
          color: '#1B2559',
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow (props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          position: 'absolute',
          top: '-30px',
          left: 'calc(100% - 112px)',
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    className: styles.sliderContainer,
  };
  const ArtCard = (src) => (
    <div className={styles.card}>
      <div
        style={{
          background: `center / cover no-repeat ${src.item.src}`,
          height: 350,
          marginBottom: 20,
          borderRadius: 10,
        }}
      />
      <div>
        <div className={styles.contentContainer}>
          <span>Shanghaibar</span>
          <span className={styles.starContainer}>
            <i className="el-icon-star-off"></i>
            <span className={styles.starAccount}>123,000</span>
          </span>
        </div>
        <div className={styles.contentContainer}>
          <span>C.K</span>
          <span>1.8ETH</span>
        </div>
      </div>
    </div>
  );
  return (
    <div className={styles.marketDetail}>
      <div className={styles.backBtn} onClick={() => {
        history.push('/market')
      }}>Back</div>
      <div className={styles.main}>
        <div className={styles.mainL} style={{
          background: `center / cover no-repeat url(${e2})`,
          height: 682,
          padding: 10,
          borderRadius: 10,
        }}>
          {/* <img className={styles.detail_img} src={e2} /> */}
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <div className={styles.productItem}>
              <span className={styles.proName}>Geometry#01</span>
              <span className={styles.proStars}>
                <i style={{ marginRight: 10 }} className="el-icon-star-off"></i>
                                123,000
              </span>
            </div>
            <div className={styles.productInfo}>
              <span className={styles.proCustom}>
                <img className={styles.proImg} src={ellipse} />
                                Daniele Fortuna</span>
            </div>
          </div>
          <div className={styles.intro}>
            <div className={styles.introText}>IntroDuction</div>
            <div className={styles.introInfoText}>
                            To commemorate the Conflux Network's success as the third-largest decentralized network in the world during the testing phase, the Conflux community minted exclusive NFTs for the 5,405 miners who participated the testing phase of mining, which the community's talented designers designed to highlight their outstanding contributions.To commemorate the Conflux Network's success as the third-largest decentralized network in the world during the testing phase,To commemorate the Conflux Network's
                            success as the third-largest decentralized network in the world
            </div>
            <div className={styles.introText}>Hash</div>
            <div className={styles.hashText}>wuwghdisauhiusahiugfpiqughdpasudiusahdiusagiudgasipudgisaudjsah

            </div>
            <div className={styles.currentText}>
                            Current price
            </div>
            <div className={styles.introMain}>
              <div className={styles.mainLeft}>
                <div className={styles.currentAll}>
                  <span className={styles.priceToken}>0.7BNB</span>
                  <span className={styles.line} />
                  <span className={styles.currency}>¥344</span>
                </div>
                <div className={styles.buyBtn} onClick={() => {
                  Notification.info('Coming Soon')
                }}>Buy Now</div>
              </div>
              <div className={styles.mainRight}>
                <div className={styles.ownerTitle}>Owner</div>
                <div className={styles.owner}> <img className={styles.proImg} src={ellipse} />Daniele Fortuna</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.ReContainer}>
        <h1 className={styles.title}>Recommend</h1>
        <Slider {...settings}>
          {data.map((item) => {
            console.log(item, 'item');
            return <ArtCard item={item} />;
          })}
        </Slider>
      </div>
    </div>
  )
}
export default AssetsScreen;
