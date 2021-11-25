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

const NFTCard = (props) => {
  const { needAction, item, index, clickDetail, token, address, onLike, onSave } = props;
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
  return (
    <div key={`title-${index}`} onClick={clickDetail} className={styles.styleCardContainer}>
      <div
        noDataText="No Data"
        style={{backgroundImage: `url(${viewUrl})`}}
        className={cx(styles.styleShortPicture, flag && styles.styleNoPicture)}
      />
      <div className={styles.styleInfoContainer}>
        <div className={styles.styleCardHeader}>
          <div className={styles.styleCardHeaderBox}>
            <span className={styles.styleName} onClick={() => alert(1)}>{item.name || 'Unknown'}</span>
            <div className={styles.starBox}>
              <Icon className={styles.star}  style={item?.isSaved && {}} icon={item?.isSaved ? 'flat-color-icons:like' : 'icon-park-outline:like'}/>
              <span style={{color: item?.isSaved ? '#FF4242' : '#B8BECC'}} className={styles.saveCount}>{item?.saveCount}</span>
            </div>
          </div>
          <div className={styles.styleInfo}>
            <div className={styles.styleInfoProfile}>
              {/* <div className={styles.styleInfoProfileImg} /> */}
              <span onClick={(e) => {
                e.stopPropagation()
                handleLinkProfile(item?.address)
              }} className={styles.nickName}>{item?.nickName && item.nickName.length > 10 ? `${item.nickName?.slice(0, 10)}...` : item?.nickName}</span>
            </div>
            <div className={styles.price_box}>
              {item.type === 'DNF' ? <img src={dnft_unit} /> :  <img src={busd_unit} />}
              <span className={styles.price}>{Number(price) ? (Math.round(price * 100) / 100) : price} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(NFTCard));
