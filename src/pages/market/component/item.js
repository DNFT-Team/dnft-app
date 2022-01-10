import React from 'react';
import {cx} from 'emotion';
import { connect } from 'react-redux';
import { withRouter,  useHistory } from 'react-router-dom';
import globalConf from 'config/index';
import Web3 from 'web3';
import styles from './index.less';
import noImg from 'images/common/noImg.svg'
import dnft_unit from 'images/market/dnft_unit.png'
import busd_unit from 'images/market/busd.svg'
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { get, post } from 'utils/request';
import { Tooltip } from '@chakra-ui/react';
import { shortenAddress } from 'utils/tools'

const NFTCard = (props) => {
  const { fromHot, item, index, clickDetail, token, address, getMarketList, onSave, children, whetherShowPrice = true } = props;
  let price = item.price > 0 && Web3.utils.fromWei(String(item.price), 'ether');
  let history = useHistory();

  // const url = !item.avatorUrl.includes('http') ? (globalConf.ipfsDown + item.avatorUrl) : item.avatorUrl
  const url = item.avatorUrl
  const flag = !url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1
  const viewUrl = !flag ? url : noImg
  const handleLinkProfile = (address) => {
    if (!token) {
      toast.warn('Please link wallet', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    history.push(`/profile/address/${address}`)
  }
  const handleStar = async () => {

    if (!address) {
      toast.warn('Please link wallet', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const { data } = await post(
      '/api/v1/nft/save',
      {
        saved: item?.isSaved ? 0 : 1,
        nftId: item?.nftId,
      },
      token
    );
    const flag = data?.success;
    const msg = flag ? `${item?.isSaved ? 'Unmarked' : 'Marked'} Successfully!` : data?.message;
    toast[flag ? 'success' : 'error'](msg, { position: toast.POSITION.TOP_CENTER});
    // getMarketInfo();
    if(flag) getMarketList && getMarketList(item.id, !item?.isSaved);
  }
  return (
    <div key={`title-${index}`} style={fromHot && { margin: '0 0.6rem'}} className={styles.styleCardContainer}>
      <div
        noDataText="No Data"
        onClick={clickDetail}
        style={{backgroundImage: `url(${viewUrl})`}}
        className={cx(styles.styleShortPicture, flag && styles.styleNoPicture)}
      />
      <div className={styles.styleInfoContainer}>
        <div className={styles.styleCardHeader}>
          <div className={styles.styleCardHeaderBox}>
            <span className={styles.styleName}>{item.name}</span>
            <div className={styles.starBox}>
              <Icon className={styles.star} onClick={(e) => {
                e.stopPropagation()
                handleStar()
              }} icon={item?.isSaved ? 'flat-color-icons:like' : 'icon-park-outline:like'}/>
              <span style={{color: item?.isSaved ? '#FF4242' : '#B8BECC'}} className={styles.saveCount}>{item?.saveCount}</span>
            </div>
          </div>
          <div className={styles.styleInfo}>
            <div className={styles.styleInfoProfile}>
              {/* <div className={styles.styleInfoProfileImg} /> */}
              <Tooltip label={item?.address && shortenAddress(item.address)} hasArrow>
                <a onClick={(e) => {
                  e.stopPropagation()
                  handleLinkProfile(item?.address)
                }} className={styles.nickName}>{item?.nickName && item.nickName.length > 10 ? `${item.nickName?.slice(0, 10)}...` : item?.nickName  || 'Unknown'}</a>
              </Tooltip>
            </div>
            {
              whetherShowPrice &&
              <div className={styles.price_box}>
                {item.type === 'DNF' ? <img src={dnft_unit} /> :  <img src={busd_unit} />}
                <span className={styles.price}>{Number(price) ? (Math.round(price * 100) / 100) : price} </span>
              </div>
            }
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(NFTCard));
