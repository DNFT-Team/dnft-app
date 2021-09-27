import { Dialog, InputNumber, Select, Button, Loading } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from  './index.less';
import noImg from 'images/common/noImg.svg'

const NFTCard = (props) => {
  const {
    item,
    index,
  } = props;
  const url = item.avatorUrl
  const flag = !url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1
  const viewUrl = !flag ? url : noImg
  return (
    <div key={`title-${index}`} className={styleCardContainer}>
      <div
        style={{
          backgroundImage: `url(${viewUrl})`,
        }}
        className={styles.shortPic}
      />
      <div className={styleInfoAvatarUrl}>
        {
          item?.nftAvatorUrls?.map((obj,index) => {
            if(index > 2) return;
            return <img key={index} src={obj} />
          })
        }
      </div>
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          <div className={styleInfo} >
            <div className="title">{item.name}</div>
            <span className='desc'>{item.description}</span>
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

const styleInfoAvatarUrl = css`
  display: flex;
  align-items: center;
  margin-top: 5px;
  img {
    height: 88px;
    margin-right: 6px;
    width: calc((100% - 12px)/3);
    object-fit: cover;
    &:last-child {
      margin-right: 0
    }
  }
`;

const styleCardContainer = css`
  background: #ffffff;
  border-radius: 10px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  /* cursor: pointer; */
  position: relative;
  flex: 1;
  min-width: 300px;
  padding: 6px;
  &:hover {
    background: white;
    position: relative;
    top: -10px;
  }
`;

const styleInfoContainer = css`
  padding: 20px 0px 0 0px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  color: rgba(117, 129, 154, 1);
  font-size: 12px;
`;

const styleCardHeader = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const styleInfo = css`
  align-items: center;
  .title {
    color: #000;
    display: block;
    font-size: 14px;
    line-height: 14px;
    font-weight: bold;
    margin-bottom: 19px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .desc {
    color: #23262F;
    height: 32px;
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow:hidden;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }
`;

const styleNickNameContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  .dot {
    background: #45B36B;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    margin-right: 6px;
  }
`;


