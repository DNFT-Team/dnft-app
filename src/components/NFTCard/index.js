import { css, cx } from 'emotion';
import React from 'react';
import {Icon} from '@iconify/react';

const NFTCard = (props) => {
  const { needAction, item, index, currentStatus } = props;

  const renderAction = (item) => {
    switch (currentStatus.value) {
    case 'INWALLET':
      return (
        <div className={styleButtonContainer}>
          <div className={cx(styleButton, styleBorderButton)}>Sell</div>
        </div>
      );
    case 'ONSALE':
      return (
        <div className={styleButtonContainer}>
          <div className={cx(styleButton, styleBorderButton)}>Off Shelf</div>
        </div>
      );
    case 'MYFAVORITE':
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
    case 'SOLD':
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

  return (
    <div key={`title-${index}`} className={styleCardContainer}>
      {item.sold && <div className={styleSoldOutBanner}>sold out</div>}
      <div
        style={{
          background: `100% 100% no-repeat url(http://92.205.29.153:8080/ipfs/${item.avatorUrl})`,
          backgroundSize: 'contain',
        }}
        className={styleShortPicture}
      />
      <div className={styleCollectionIconContainer} onClick={() => {}}>
        <Icon icon="ant-design:inbox-outlined" style={{ color: item.isLiked ? '#42E78E' : '#c4c4c4' }} />
      </div>
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          <div>
            <span className={styleChainType}>{item.chainType}</span>
            <div className={styleStarInfo}>
              <div className={styleStarIconContainer} onClick={() => {}}>
                <Icon icon="ant-design:heart-filled" style={{ color: item.isSaved ? '#F13030' : '#c4c4c4' }} />
              </div>
              <span>{item.account}</span>
            </div>
          </div>
          <span className="title">{item.name}</span>
        </div>
        {needAction && (
          <div className={styleActionContainer}>{renderAction(item)}</div>
        )}
      </div>
    </div>
  );
};
export default NFTCard;

const styleActionContainer = css`
  margin-top: 14px;
`;

const styleButtonContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;


const styleBorderButton = css`
  border: 1px solid #E6E8EC;
  border-radius: 8px;
  color: #000000;
  font-weight: 500;
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
  width: 74px;
  height: 47px;
  background: #ff313c;
  border-radius: 0 0 20px 20px;
  font-weight: bold;
  font-size: 14px;
  left: 24px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const styleCardContainer = css`
  background: #ffffff;
  border-radius: 18px;
  max-width: 288px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  flex: 1;
  min-width: 288px;
  margin: 20px;
  padding: 8px;
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

const styleShortPicture = css`
  min-height: 220px;
  border-radius: 24px;
`;

const styleStarInfo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8f9bba;
  position: absolute;
  top: -36px;
  right: 0;
`;

const styleStarIconContainer = css`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
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
  top: 205px;
  right: 76px;
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
  .title {
    color: #11142D;
    margin-top: 14px;
  }
`;

const styleChainType = css`
  background: #FEDDBD;
  color: #A15F1E;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
`;
