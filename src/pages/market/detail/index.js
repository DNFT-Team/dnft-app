import React, { useState } from 'react';
import globalConf from 'config/index';
import styles from './index.less'
import e2 from 'images/market/e2.png';
import close from 'images/market/close.png';
import ellipse from 'images/market/ellipse.png'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Button, Notification} from 'element-react'
import { withRouter, Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { tradableNFTAbi } from '../../../utils/abi';
import { tradableNFTContract } from '../../../utils/contract';
import Web3 from 'web3';

const MarketDetailScreen = (props) => {
  const {location, address} = props;
  const datas = location?.state;
  const [loading, setLoading] = useState(false);
  console.log(location, 'location')
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

  const clickBuyItem = async () => {
    try {
      if(window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const tradableNFTAddress = tradableNFTContract;

        const myContract = new window.web3.eth.Contract(
          tradableNFTAbi,
          tradableNFTAddress
        );
        const gasNum = 210000, gasPrice = '20000000000';

        console.log(myContract,'myContract',datas,address, Web3.utils.toWei(datas?.price?.toString(), 'ether'))
        const tradableNFTResult = await myContract.methods
          .buyByDnft(
            datas?.address,
            datas.tokenId,
          )
          .send({
            value: Web3.utils.toWei(datas?.price?.toString(), 'ether'),
            from: address,
            gas: gasNum,
            gasPrice: gasPrice
          });
        console.log(ethereum,myContract, tradableNFTResult)
      }
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setLoading(false);
    }
  }

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
          // height: 350,
          height: 467,
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
      {/* <div className={styles.backBtn} onClick={() => {
        history.push('/market')
      }}>Back</div> */}
      <div className={styles.main}>
        <div className={styles.mainL} style={{
          background: `center center / contain no-repeat url(${!datas?.avatorUrl.includes('http') ? (globalConf.ipfsDown + '/ipfs/' + datas?.avatorUrl) : datas?.avatorUrl})`,
          height: 482,
          padding: 10,
          borderRadius: 10,
        }}>
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <p className={styles.proName}>{datas?.name}</p>
            <div className={styles.proPriceBox}>
              <span className={styles.price}>{datas?.price}{datas?.type}</span>
              <span className={styles.price}>$24234.32</span>
              {datas?.supply - datas?.quantity} in stock
            </div>
            <div className={styles.desc}>{datas?.description}</div>
            <div className={styles.chain}>
              <span className={styles.contract}>Contract address:</span>
              <a
                href={`https://www.bscscan.com/address/${datas?.tokenAddress}`}
                className={styles.tokenAddress}
                target='_blank'
                rel="noopener noreferrer"
              >
                {datas?.tokenAddress?.slice(0, 8)}...{datas?.tokenAddress?.slice(38)}
              </a>
            </div>
            <div className={styles.user}>
              <div className={styles.head}>
                <img src={datas?.userAvatorUrl} className={styles.avatar}/>
              </div>
              <div>
                <p className={styles.owner}>Owner</p>
                <p className={styles.userName}>{datas?.nickName}</p>
              </div>
            </div>
            <div className={styles.user}>
              <div className={styles.head}>
                <img className={styles.avatar}/>
              </div>
              <div>
                <p className={styles.owner}>Creator</p>
                <p className={styles.userName}>Raquel</p>
              </div>
            </div>
            <Button disabled={!(datas?.supply - datas?.quantity)} className={styles.buyBtn} onClick={() => {
              // Notification.info('Coming Soon')
              clickBuyItem()
            }}>Buy Now</Button>
          </div>
          <div>
            <img onClick={() => {
              history.push('/market')
            }} className={styles.close} src={close} />
          </div>
        </div>
      </div>
      {/* <div className={styles.ReContainer}>
        <h1 className={styles.title}>Recommend</h1>
        <Slider {...settings}>
          {data.map((item) => {
            console.log(item, 'item');
            return <ArtCard item={item} />;
          })}
        </Slider>
      </div> */}
    </div>
  )
}
const mapStateToProps = ({ profile, market }) => ({
  token: profile.token,
  datas: market.datas,
  address: profile.address
});
export default withRouter(connect(mapStateToProps)(MarketDetailScreen));

