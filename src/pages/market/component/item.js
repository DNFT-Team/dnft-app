import { Dialog, InputNumber, Select } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';
import {Icon} from '@iconify/react';

import { post } from 'utils/request';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { tradableNFTContract } from 'utils/contract';
import { tradableNFTAbi } from 'utils/abi';

const NFTCard = (props) => {
  const { needAction, item, index, clickDetail, token, address, onLike, onSave } = props;
  const [showSellModal, setShowSellModal] = useState(false);
  const [showOffShelfModal, setShowOffShelfModal] = useState(false);
  const [sellForm, setSellForm] = useState({
    amount: 1
  });

  const onShowSellModal = () => {
    setShowSellModal(true)
  };

  const onShowOffShelfModal = () => {
    setShowOffShelfModal(true)
  }

  const renderFormItem = (label, item) => {
    console.log()
    return(
      <div className={styleFormItemContainer}>
        <div className='label'>{label}</div>
        {item}
      </div>
    )
  };


  const handleLike = async () => {
    if (token && address) {
      await post(
        '/api/v1/nft/like',
        {
          address: address,
          like: item.isLiked ? 0 : 1,
          id: item.id
        },
        token
      );
      onLike()
    }
  }

  const handleSave = async () => {
    if (token && address) {
      await post(
        '/api/v1/nft/save',
        {
          address: address,
          saved: item.isSaved ? 0 : 1,
          id: item.id
        },
        token
      );
      onSave()
    }
  };

  return (
    <div key={`title-${index}`} onClick={clickDetail} className={styleCardContainer}>
      <div
        style={{
          background: `center center / contain no-repeat url(${!item.avatorUrl.includes('http') ? 'http://92.205.29.153:8080/ipfs/' + item.avatorUrl : item.avatorUrl})`,
          backgroundSize: 'contain',
        }}
        className={styleShortPicture}
      />
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          <div className={styleCardHeaderBox}>
            <span className={styleName}>{item.name}</span>
            <div className={styleStarInfo}>{item.price}{item.type}
            </div>
          </div>
          <div className={styleInfo}>
            <div className={styleInfoProfile}>
              <img src={item.userAvatorUrl} />
              <span>{item.nickName}</span>
            </div>
            <span className={styleLike}>
              <Icon
                icon='bx:bx-like'
                style={{
                  color: item.isLiked ? '#F13030' : '#c4c4c4',
                  marginRight: 5,
                }}
              />
              {item?.likeCount}
            </span></div>
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
  // max-width: 288px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  // flex: 1;
  // min-width: 288px;
  width: calc((100% - 80px) / 4);
  margin: 10px;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0px 16.1719px 22.3919px rgba(0, 0, 0, 0.05);
  &:hover {
    background: white;
    position: relative;
    top: -20px;
  }
  &:last-child {
    margin-right: auto;
  }
`;
const styleCardHeaderBox = css`
  display: flex;
  justify-content: space-between;
  align-item: 'center''
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
  display: flex;
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

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .label {
    margin-bottom: 10px;
  }
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
const styleLike = css`
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  padding-left: 20px;
  color: #1b2559;
  display: flex;
  align-items: center;
`;