import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { withRouter } from 'react-router-dom';
import styles from  '../index.less';
import noImg from 'images/common/collection_noImg.svg'

const NFTCard = (props) => {
  const {
    item,
    index,
  } = props;
  const url = item.avatorUrl
  const flag = !url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1;
  let randomLen = Math.floor(Math.random() * (item?.nftAvatorUrls?.length || 0));
  const viewUrl = !flag ? url : item?.nftAvatorUrls?.[randomLen] || noImg;
  let history = useHistory();

  return (
    <div key={`title-${index}`} className={styleCardContainer} onClick={() => history.push('/profile/collection', {item})}>
      <div
        style={{
          backgroundImage: `url(${viewUrl})`,
        }}
        className={styles.shortPic}
      />
      <div className={styleInfoAvatarUrl}>
        {
          item?.nftAvatorUrls?.map((obj, index) => {
            if (index > 2) {return;}
            return <img key={index} src={obj} />
          })
        }
        {
          new Array(3 - (item?.nftAvatorUrls?.length || 0)).fill().map((obj, index) =>
            <div />
            // <img key={index} src={noImg} />
          )
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
    border-radius: 6px;
    width: calc((100% - 12px)/3);
    object-fit: cover;
    &:last-child {
      margin-right: 0
    }
  }
  div {
    height: 88px;
    margin-right: 6px;
    border-radius: 6px;
    width: calc((100% - 12px)/3);
    background: #E5E5E5;
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
    font-weight: bold;
    font-family: DM Sans;
    margin-bottom: 19px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .desc {
    color: #23262F;
    font-family: DM Sans;
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
