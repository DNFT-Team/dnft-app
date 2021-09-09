import { Dialog, InputNumber, Select } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import globalConf from 'config/index';
import Web3 from 'web3';
import styles from './index.less';
const NFTCard = (props) => {
  const { needAction, item, index, clickDetail, token, address, onLike, onSave } = props;
  let price = item.price > 0 && Web3.utils.fromWei(String(item.price), 'ether');
  return (
    <div key={`title-${index}`} onClick={clickDetail} className={styles.styleCardContainer}>
      <div
        style={{
          background: `center center / cover no-repeat url(${!item.avatorUrl.includes('http') ? (globalConf.ipfsDown + item.avatorUrl) : item.avatorUrl})`,
        }}
        className={styles.styleShortPicture}
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
              <img className={styles.styleInfoProfileImg} src={item.userAvatorUrl} />
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


const styleCardContainer = css`
  background: #ffffff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  width: calc((100% - 80px) / 4);
  margin: 10px;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0px 16.1719px 22.3919px rgba(0, 0, 0, 0.05);
  &:hover {
    background: white;
    // position: relative;
    // top: -20px;
  }
  &:last-child {
    margin-right: auto;
  }
`;
const styleCardHeaderBox = css`
  display: flex;
  justify-content: space-between;
  align-item: 'center
`;
const styleShortPicture = css`
  min-height: 220px;
  border-radius: 24px;
`;

const styleStarInfo = css`
  border: 2px solid #45B36B;
  box-sizing: border-box;
  border-radius: 4px;
  height: 26px;
  font-weight: bold;
  font-size: 12px;
  line-height: 26px;
  padding: 0 8px;
  text-transform: uppercase;
  color: #45B36B;
`;

const styleInfoContainer = css`
  padding: 9px 0px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const styleCardHeader = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 12px;
  position: relative;
`;

const styleInfo = css`
  // flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  .title {
    color: #11142D;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-right: 10px;
  }
`

const styleName = css`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #23262F;
`;

const styleInfoProfile = css`
  display: flex;
  align-item: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 50%;
  }
  img[src=""],img:not([src]){
    opacity:0;
  }
  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #353945;
  }
`;

