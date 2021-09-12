import { Dialog, InputNumber, Select, Button, Loading } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

import { post } from 'utils/request';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Web3 from 'web3';
import {
  bscTestTokenContact,
  createNFTContract,
  tokenContract,
  tradableNFTContract,
} from '../../utils/contract';
import { createNFTAbi, tokenAbi, tradableNFTAbi } from '../../utils/abi';
import dayjs from 'dayjs';
import './extra.css'

const NFTCard = (props) => {
  const {
    needAction,
    item,
    index,
    currentStatus,
    token,
    address,
    onLike,
    onSave,
    onRefresh,
  } = props;
  const [showSellModal, setShowSellModal] = useState(false);
  const [showOffShelfModal, setShowOffShelfModal] = useState(false);
  const [sellForm, setSellForm] = useState({
    quantity: 1,
  });
  const [isApproved, setIsApproved] = useState(false);
  const [isApproveLoading, setIsAprroveLoading] = useState(false);
  const [isOnLoading, setIsOnLoading] = useState(false);
  const [isOffLoading, setIsOffLoading] = useState(false);

  const onShowSellModal = () => {
    setShowSellModal(true);
  };

  const onShowOffShelfModal = () => {
    setShowOffShelfModal(true);
  };

  const renderFormItem = (label, item) => {
    console.log();
    return (
      <div className={styleFormItemContainer}>
        <div className="label">{label}</div>
        {item}
      </div>
    );
  };

  const renderAction = (item) => {
    const isEmpty = item.quantity === 0;
    switch (currentStatus.value) {
    case 'INWALLET':
      const isEmpty = item.quantity === 0;
      return (
        <div className={styleButtonContainer}>
          <div
            className={cx(styleButton, styleBorderButton)}
            style={{
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (isEmpty) {
                return;
              }
              onShowSellModal();
            }}
          >
              Launch
          </div>
        </div>
      );
    case 'ONSALE':
      return (
        <div className={styleButtonContainer}>
          <div
            className={cx(styleButton, styleBorderButton)}
            onClick={() => {
              onShowOffShelfModal();
            }}
          >
              Phase Out
          </div>
        </div>
      );
    case 'MYFAVORITE':
      return item.sold ? (
        <div className={styleButtonContainer}>
          <span>
            <span className={styleText}>Sold for </span>
            <span className={stylePrice}>{item.price}</span>
          </span>
          <div className={styleText}>14/06/2021</div>
        </div>
      ) : (
        <div className={styleButtonContainer}>
          <span className={stylePrice}>{item.price}ETH</span>
        </div>
      );
    case 'SOLD':
      return (
        <div className={styleButtonContainer}>
          <div className={styleText}>
            Transaction Time: {dayjs(item.createTime).format('DD/MM/YYYY')}
          </div>
        </div>
      );

    default:
      return null;
    }
  };

  const handleLike = async () => {
    if (token && address) {
      await post(
        '/api/v1/nft/like',
        {
          address: address,
          like: item.isLiked ? 0 : 1,
          id: item.id,
        },
        token
      );
      onLike();
    }
  };

  const handleSave = async () => {
    if (token && address) {
      await post(
        '/api/v1/nft/save',
        {
          address: address,
          saved: item.isSaved ? 0 : 1,
          id: item.id,
        },
        token
      );
      onSave();
    }
  };

  const renderSellModal = useMemo(() => {
    const isPriceInvalid =
      typeof sellForm.price !== 'number' ||
      sellForm.price === 0 ||
      String(sellForm.price).split('.')[1]?.length > 4;

    return (
      <Dialog
        customClass={styleModalContainer}
        title="Launch"
        visible
        onCancel={() => {
          setShowSellModal(false);
          setIsAprroveLoading(false);
          setIsOnLoading(false);
          setIsApproved(false);
        }}
      >
        <Dialog.Body>
          {renderFormItem(
            'Quantity',
            <InputNumber
              min={1}
              max={item.quantity}
              defaultValue={1}
              onChange={(value) => {
                setSellForm({
                  ...sellForm,
                  quantity: value,
                });
              }}
            />
          )}
          {renderFormItem(
            'Type',
            <Select
              style={{ width: '100%' }}
              value={sellForm.type}
              placeholder="please choose"
              onChange={(value) => {
                setSellForm({
                  ...sellForm,
                  type: value,
                });
              }}
            >
              <Select.Option key={'DNFT'} label={'DNFT'} value={'DNFT'} />
              <Select.Option key={'BUSD'} label={'BUSD'} value={'BUSD'} />
            </Select>
          )}
          {renderFormItem(
            'Price',
            <InputNumber
              controls={false}
              placeholder="Ethereum"
              value={sellForm.price}
              onChange={(value) => {
                setSellForm({
                  ...sellForm,
                  price: value,
                });
              }}
            />
          )}
          <div
            style={{
              opacity:
                isPriceInvalid || isApproveLoading || isOnLoading ? 0.5 : 1,
            }}
            className={styleCreateNFT}
            onClick={async () => {
              if (isPriceInvalid) {
                return;
              }

              try {
                if (window.ethereum) {
                  let ethereum = window.ethereum;
                  window.web3 = new Web3(ethereum);
                  await ethereum.enable();

                  if (isApproved) {
                    try {
                      setIsOnLoading(true);
                      const contractAddress = tradableNFTContract;
                      const myContract = new window.web3.eth.Contract(
                        tradableNFTAbi,
                        contractAddress
                      );

                      let putOnResult;
                      if (sellForm.type === 'DNFT') {
                        putOnResult = await myContract.methods
                          .putOnByDnft(
                            item.tokenAddress,
                            item.tokenId,
                            Web3.utils.toWei(String(sellForm.price), 'ether'),
                            sellForm.quantity
                          )
                          .send({
                            from: address,
                          });
                      } else if (sellForm.type === 'BUSD') {
                        putOnResult = await myContract.methods
                          .putOnByBusd(
                            item.tokenAddress,
                            item.tokenId,
                            Web3.utils.toWei(String(sellForm.price), 'ether'),
                            sellForm.quantity
                          )
                          .send({
                            from: address,
                          });
                      }
                      const orderId =
                        putOnResult?.events?.PutOn?.returnValues?.orderId;

                      if (orderId != undefined) {
                        const result = await post(
                          '/api/v1/trans/sell_up',
                          {
                            ...sellForm,
                            price: Web3.utils.toWei(
                              String(sellForm.price),
                              'ether'
                            ),
                            nftId: item.nftId,
                            orderId: orderId,
                          },
                          token
                        );
                        setShowSellModal(false);
                        setIsAprroveLoading(false);
                        setIsOnLoading(false);
                        onRefresh(address, token);
                        setIsApproved(false);
                      }
                    } finally {
                      setIsOnLoading(false);
                    }
                  } else {
                    try {
                      setIsAprroveLoading(true);
                      const dnfTokenContract = new window.web3.eth.Contract(
                        createNFTAbi,
                        createNFTContract
                      );

                      let isApproved = await dnfTokenContract.methods
                        .isApprovedForAll(address, tradableNFTContract)
                        .call();

                      if (!isApproved) {
                        let result = await dnfTokenContract.methods
                          .setApprovalForAll(tradableNFTContract, true)
                          .send({
                            from: address,
                          });
                        if (result) {
                          setIsApproved(true);
                        }
                      } else {
                        setIsApproved(true);
                      }
                    } finally {
                      setIsAprroveLoading(false);
                    }
                  }
                }
              } catch (e) {
                console.log(e, 'e');
              }
            }}
          >
            <Loading loading={isApproveLoading || isOnLoading} />
            {isApproved ? 'Confirm' : 'Approve'}
          </div>
        </Dialog.Body>
      </Dialog>
    );
  }, [sellForm, isApproved, isApproveLoading, isOnLoading]);

  const renderOffShelfModal = useMemo(() => {
    console.log('off');
    return (
      <Dialog
        title="Tips"
        size="tiny"
        visible
        customClass={styleOffShelfModal}
        onCancel={() => {
          setShowOffShelfModal(false);
          setIsOffLoading(false);
        }}
      >
        <Dialog.Body>
          <span>Are you sure phase out the nft?</span>
        </Dialog.Body>
        <Dialog.Footer className="dialog-footer">
          <Button
            onClick={() => {
              setShowOffShelfModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            style={{ opacity: isOffLoading ? 0.5 : 1 }}
            onClick={async () => {
              try {
                setIsOffLoading(true);
                if (window.ethereum) {
                  let ethereum = window.ethereum;
                  window.web3 = new Web3(ethereum);
                  await ethereum.enable();

                  const contractAddress = tradableNFTContract;
                  const myContract = new window.web3.eth.Contract(
                    tradableNFTAbi,
                    contractAddress
                  );

                  let offResult = await myContract.methods
                    .off(item.orderId)
                    .send({
                      from: address,
                    });

                  if (offResult) {
                    const result = await post(
                      '/api/v1/trans/sell_back',
                      {
                        orderId: item.orderId,
                      },
                      token
                    );
                    setShowOffShelfModal(false);
                    onRefresh(address, token);
                    setIsOffLoading(false);
                  }
                }
              } finally {
                setIsOffLoading(false);
              }
            }}
          >
            {isOffLoading ? 'Loading...' : 'Confirm'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    )
  },[isOffLoading])

  return (
    <div key={`title-${index}`} className={styleCardContainer}>
      {item.sold && <div className={styleSoldOutBanner}>sold out</div>}
      <div
        style={{
          backgroundImage: `url(${item.avatorUrl})`,
        }}
        className="shortPic"
      />
      {/* <div className={styleCollectionIconContainer} onClick={handleSave}>
        <Icon icon='ant-design:inbox-outlined' style={{ color: item.isLiked ? '#42E78E' : '#c4c4c4' }} />
      </div> */}
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              <span className={styleChainType}>{item.chainType}</span>
              <span className={styleContactype}>{item.contractType}</span>
            </span>
            <span
              style={{ color: '#FF6059', fontSize: '12px', fontWeight: 'bold' }}
            >
              {item.price > 0 &&
                ['ONSALE', 'SOLD'].includes(currentStatus.value) &&
                `${Web3.utils.fromWei(String(item.price), 'ether')} ${
                  item.type || ''
                }`}
            </span>
            {/* <div className={styleStarInfo}> */}
            {/* <div className={styleStarIconContainer} onClick={handleLike}>
              <Icon icon='ant-design:heart-filled' style={{ color: item.isSaved ? '#F13030' : '#c4c4c4' }} />
            </div> */}
            {/* </div> */}
          </div>
          <div className={styleInfo}>
            <span className="title">{item.name}</span>
            <span>
              Stock:{' '}
              {currentStatus.value === 'SOLD'
                ? item.quantity * -1
                : item.quantity || 0}
            </span>
          </div>
        </div>
        {needAction && (
          <div className={styleActionContainer}>{renderAction(item)}</div>
        )}
      </div>
      {showSellModal && renderSellModal}
      {showOffShelfModal && renderOffShelfModal}
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(NFTCard));

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
  border: 1px solid #e6e8ec;
  border-radius: 8px;
  color: #000000;
  font-weight: 500;
`;

const styleConfirmOff = css`
  .circular {
    width: 20px !important;
    height: 20px !important;
    left: -45px !important;
    position: relative;
    top: 24px !important;
  }
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
  border-radius: 20px;
  max-width: 288px;
  display: flex;
  flex-direction: column;
  /* cursor: pointer; */
  position: relative;
  flex: 1;
  min-width: 288px;
  margin: 20px;
  padding: 8px 4px;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  border: 1px solid #E6E8EC;
  &:hover {
    background: white;
    position: relative;
    top: -20px;
  }
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
  padding: 14px 0 0 0 ;
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
`;

const styleInfo = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  color: #11142d;
  .title {
    color: #11142d;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-right: 10px;
  }
`;

const styleChainType = css`
  background: #feddbd;
  color: #a15f1e;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
`;

const styleContactype = css`
  background: #feddbd;
  color: #a15f1e;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
  margin-left: 10px;
`

const styleCreateNFT = css`
  background-color: #0049c6;
  color: white;
  padding: 10px 32px;
  height: fit-content;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: fit-content;
  .circular {
    width: 20px !important;
    height: 20px !important;
    left: -45px !important;
    position: relative;
    top: 24px !important;
  }
`;

const styleModalContainer = css`
  max-width: 564px;
  width: calc(100% - 40px);
  border-radius: 10px;

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 12px;
  }
  .el-dialog__title {
    color: #11142d;
    font-size: 18px;
  }
  .el-dialog__header {
    padding: 32px;
  }
  .el-dialog__body {
    padding: 0 32px 32px 32px;
  }
  .el-input-number {
    width: 100%;
  }
`;

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .label {
    margin-bottom: 10px;
  }
`;

const styleOffShelfModal = css`
  max-width: 564px;
  width: calc(100% - 40px);
`
