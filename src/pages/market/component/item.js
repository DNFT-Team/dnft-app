import React from 'react';
import {cx} from 'emotion';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import globalConf from 'config/index';
import Web3 from 'web3';
import styles from './index.less';
import noImg from 'images/common/noImg.svg'
const NFTCard = (props) => {
  const { needAction, item, index, clickDetail, token, address, onLike, onSave } = props;
  let price = item.price > 0 && Web3.utils.fromWei(String(item.price), 'ether');

  const url = !item.avatorUrl.includes('http') ? (globalConf.ipfsDown + item.avatorUrl) : item.avatorUrl
  const flag = !url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1
  const viewUrl = !flag ? url : noImg
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
            <span className={styles.styleName}>{item.name}</span>
            <button className={styles.chainType}>{item.chainType}</button>
            {/* <div className={styleStarInfo}>{item.price > 0 && Web3.utils.fromWei(String(item.price), 'ether')}{item.type}</div> */}
          </div>
          <div className={`${styles.styleInfo} ${styles.styleInfoLine}`}>
            <span className={styles.creator}>Price</span>
            <span className={styles.price}>{Number(price) ? (Math.round(price * 100) / 100) : price} {item.type}</span>
          </div>
          <div className={`${styles.styleInfo} ${styles.styleInfoLine}`}>
            <span className={styles.creator}>Quantity</span>
            <span className={styles.price}>{item.quantity}</span>
          </div>
          <div className={styles.styleInfo}>
            <span className={styles.creator}>Creator</span>
            <div className={styles.styleInfoProfile}>
              <img className={styles.styleInfoProfileImg} src={item.userAvatorUrl} alt="author"/>
              <span className={styles.nickName}>{item?.nickName && item.nickName.length > 10 ? `${item.nickName?.slice(0, 10)}...` : item?.nickName}</span>
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
