import { css, cx } from 'emotion';
import React from 'react';
import {Icon} from '@iconify/react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setProfileLike,
  setProfileSave
} from 'reduxs/actions/profile';
const NFTCard = (props) => {
  const { needAction, item, index, currentStatus, address, dispatch, token, newAddress  } = props;

  const renderAction = (item) => {
    switch (currentStatus) {
    case 'Collections':
      return 'batch';
    case 'Owned':
      return 'owned';
    case 'Created':
      return 'created';
    case 'On Sale':
      return (
        <div className={styleButtonContainer}>
          <div className={cx(styleButton, styleBorderButton)}>Off Shelf</div>
        </div>
      );
    case 'My favorite':
      return item.sold ? (
        <div className={styleButtonContainer}>
          <span>
            <span className={styleText}>Sold for </span>
            <span className={stylePrice}>1.8ETH</span>
          </span>
          <div className={styleText}>14/06/2021</div>
        </div>
      ) : (
        <div className={styleButtonContainer}>
          <span className={stylePrice}>1.8ETH</span>
        </div>
      );
    case 'Sold':
      return (
        <div className={styleButtonContainer}>
          <span>
            <span className={styleText}>Sold for </span>
            <span className={stylePrice}>1.8ETH</span>
          </span>
          <div className={styleText}>14/06/2021</div>
        </div>
      );

    default:
      return null;
    }
  };


  const handleLike = () => {
    dispatch(setProfileLike({
      address: newAddress,
      nftId: item.id,
      like: item.isLiked ? 0 : 1,
      type: renderAction()
    },token))
  }

  const handleSave = () => {
    dispatch(setProfileSave({
      address: newAddress,
      nftId: item.id,
      saved: item.isSaved ? 0 : 1,
      type: renderAction()
    },token))
  }

  return (
    <div key={`title-${index}`} className={styleCardContainer}>
      <div
        style={{
          background: `center / cover no-repeat url(${item.avatorUrl})`,
        }}
        className={styleShortPicture}
      />
      <div className={styleSoldOutBanner} onClick={() => {handleSave(item)}}>
        <Icon icon="ic:sharp-stars" style={{ color: item.isSaved ? '#F13030' : '#c4c4c4' }} />
      </div>
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          {/* 1212 */}
          <div className={styleCardContent}>
            <span className={styleCardTitle}>{item.name}</span>
            <div className={styleStarInfo}>
              <div className={styleStarIconContainer} onClick={() => {handleLike(item)}}>
                <Icon icon="bx:bx-like" style={{ color: item.isLiked ? '#F13030' : '#c4c4c4' }} />
              </div>
              <span>{item.likeCount}</span>
            </div>
          </div>
          <span className="description">{item.description}</span>
        </div>
        {/* {needAction && (
          <div className={styleActionContainer}>{renderAction(item)}</div>
        )} */}
      </div>
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  datas: profile.datas,
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
  batch: profile.batch,
  owned: profile.owned,
  created: profile.created,
});
export default withRouter(connect(mapStateToProps)(NFTCard));

// export default NFTCard;

const styleActionContainer = css`
  margin-top: 10px;
`;

const styleButtonContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const styleFillButton = css`
  background: #112df2;
  color: white;
  border-radius: 8px;
`;
const styleBorderButton = css`
  border: 1px solid #112df2;
  border-radius: 8px;
  color: #112df2;
`;

const styleButton = css`
  display: flex;
  flex: 1;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;

const stylePrice = css`
  color: #ff313c;
  font-size: 20px;
  font-weight: 900;
`;

const styleText = css`
  font-size: 14px;
  color: #8f9bba;
`;


const styleSoldOutBanner = css`
  position: absolute;
  // width: 20px;
  // height: 20px;
  // background: #ff313c;
  // border-radius: 20px;
  // font-weight: bold;
  // font-size: 14px;
  right: 15px;
  top: 15px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 40px;
  }
`;

const styleCardContainer = css`
  background: #f5f7fa;
  border-radius: 18px;
  max-width: 270px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  flex: 1;
  min-width: 270px;
  margin: 20px;
  &:hover {
    background: white;
    box-shadow: 0px 16.1719px 22.3919px rgba(0, 0, 0, 0.05);
    position: relative;
    top: -20px;
  }
  &:last-child {
    margin-right: auto;
  }
`;

const styleShortPicture = css`
  min-height: 220px;
  border-radius: 18px 18px 0 0;
`;
const styleCardContent = css`
  display: flex;
`;
const styleStarInfo = css`
  display: flex;
  // flex-direction: column;
  align-items: center;
  color: #8f9bba;
  position: absolute;
  // top: -36px;
  right: 0;
`;

const styleStarIconContainer = css`
  // background: #ffffff;
  // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-bottom: 4px;
  &:hover {
    cursor: pointer;
  }
  svg {
    font-size: 20px;
  }
`;

const styleCollectionIconContainer = css`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 198px;
  right: 64px;
  &:hover {
    cursor: pointer;
  }
  svg {
    font-size: 20px;
  }
`;

const styleInfoContainer = css`
  padding: 14px 16px;
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
  border-bottom: 1px solid #f5f7fa;
  position: relative;
  .description {
    color: #11142D;
    margin-top: 4px;
  }
`;

const styleCardTitle = css`
  color: #1b2559;
  font-weight: 900;
  font-size: 20px;
`;
