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
  createNFTContract1155,
  createNFTContract721,
  tokenContract,
  tradableNFTContract,
  tradableNFTContract721,
} from '../../utils/contract';
import { createNFTAbi1155, createNFTAbi721, tokenAbi, tradableNFTAbi, tradableNFTAbi721 } from '../../utils/abi';
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
  const [showPhaseOut, setShowPhaseOut] = useState(false);

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
            className={cx(styleButton)}
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
        closeOnClickModal={false}
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
              disabled={item.contractType == 721}
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
                      const is721Contract = item.contractType == 721;

                      setIsOnLoading(true);
                      const myContract = new window.web3.eth.Contract(
                        is721Contract ? tradableNFTAbi721 : tradableNFTAbi,
                        is721Contract ? tradableNFTContract721 : tradableNFTContract
                      );

                      let putOnResult;
                      if (sellForm.type === 'DNFT') {
                        if (is721Contract) {
                          putOnResult = await myContract.methods
                            .putOnByDnft(
                              item.tokenAddress,
                              item.tokenId,
                              Web3.utils.toWei(String(sellForm.price), 'ether'),
                            )
                            .send({
                              from: address,
                            });
                        } else {
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
                        }

                      } else if (sellForm.type === 'BUSD') {
                        if (is721Contract) {
                          putOnResult = await myContract.methods
                            .putOnByBusd(
                              item.tokenAddress,
                              item.tokenId,
                              Web3.utils.toWei(String(sellForm.price), 'ether'),
                            )
                            .send({
                              from: address,
                            });

                        } else {
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
                      const is721Contract = item.contractType == 721;
                      setIsAprroveLoading(true);
                      const dnfTokenContract = new window.web3.eth.Contract(
                        is721Contract ? createNFTAbi721 : createNFTAbi1155,
                        is721Contract ? createNFTContract721 : createNFTContract1155
                      );

                      let isApproved = await dnfTokenContract.methods
                        .isApprovedForAll(address, is721Contract ? tradableNFTContract721 : tradableNFTContract)
                        .call();

                      if (!isApproved) {
                        let result = await dnfTokenContract.methods
                          .setApprovalForAll(is721Contract ? tradableNFTContract721 : tradableNFTContract, true)
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
        closeOnClickModal={false}
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
                  const is721Contract = item.contractType == 721;

                  const contractAddress = is721Contract ? tradableNFTContract721 : tradableNFTContract;
                  const myContract = new window.web3.eth.Contract(
                    is721Contract ? tradableNFTAbi721 : tradableNFTAbi,
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
  }, [isOffLoading])
  const isEmpty = item.quantity === 0;

  return (
    <div key={`title-${index}`} className={styleCardContainer}>
      {item.sold && <div className={styleSoldOutBanner}>sold out</div>}
      <div
        style={{
          backgroundImage: `url(${item.avatorUrl})`,
        }}
        className="shortPic"
      />
      <span className={styleChainType}><span className='dot'></span>{item.chainType}</span>
      {currentStatus.value === 'ONSALE' &&  <div className={stylePhaseOutContainer} onClick={() => {
        setShowPhaseOut(!showPhaseOut)
      }}>
        <span className='dot'></span>
        <span className='dot'></span>
        <span className='dot'></span>
        <span style={{display: showPhaseOut ? 'flex' : 'none'}} className={stylePhaseOut}><span onClick={() => {
          onShowOffShelfModal()
        }}>Phase Out</span></span>
      </div>}
      {/* <div className={styleCollectionIconContainer} onClick={handleSave}>
        <Icon icon='ant-design:inbox-outlined' style={{ color: item.isLiked ? '#42E78E' : '#c4c4c4' }} />
      </div> */}
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          <div className={styleInfo}>
            <span className="title">{item.name}</span>
            {
              currentStatus.value === 'INWALLET' && <div
                className={cx(styleButton)}
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
            }
            {currentStatus.value !== 'INWALLET' && <span
              style={{ color: '#45B36B', fontSize: '12px', padding: '2px 6px', fontWeight: '600', border: '2px solid #45B36B', borderRadius: '4px' }}
            >
              {item.price > 0 &&
                ['ONSALE', 'SOLD'].includes(currentStatus.value) &&
                `${Web3.utils.fromWei(String(item.price), 'ether')} ${
                  item.type || ''
                }`}
            </span>}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}
          >
            <span style={{
              fontSize: '12px',
              whiteSpace: 'nowrap',
              display: 'flex'
            }}>
              <span style={{marginRight: '24px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '120px',
                textOverflow: 'ellipsis'}}>
                Stock:{' '}
                <span style={{color: 'rgba(17, 45, 242, 1)'}}>
                  {currentStatus.value === 'SOLD'
                    ? item.quantity * -1
                    : item.quantity || 0}
                </span>
              </span>
              <span>Contract type:{item.contractType}</span>
            </span>
            <div
              style={{
                backgroundImage: `url(${item.userAvatorUrl})`,
                backgroundSize: 'contain',
                width: '24px',
                height: '24px',
                borderRadius: '24px',
              }}
            />
            {/* <div className={styleStarInfo}> */}
            {/* <div className={styleStarIconContainer} onClick={handleLike}>
              <Icon icon='ant-design:heart-filled' style={{ color: item.isSaved ? '#F13030' : '#c4c4c4' }} />
            </div> */}
            {/* </div> */}
          </div>
          {currentStatus.value === 'SOLD' && <div>Transaction Time: {dayjs(item.createTime).format('DD/MM/YYYY')}</div>}
        </div>
        {/* {needAction && (
          <div className={styleActionContainer}>{renderAction(item)}</div>
        )} */}
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
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  background: rgba(17, 45, 242, 1);
  color: white;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;
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
  max-width: 270px;
  display: flex;
  flex-direction: column;
  /* cursor: pointer; */
  position: relative;
  flex: 1;
  min-width: 270px;
  margin: 10px;
  padding: 7px;
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
  color: rgba(143, 155, 186, 1);
  font-size: 12px;
`;

const styleCardHeader = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 8px;
  position: relative;
`;

const styleInfo = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  .title {
    color: #11142d;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-right: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #11142d;
  }
`;

const styleChainType = css`
  color: white;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 6px;
  position: absolute;
  font-weight: 500;
  background: rgba(255, 96, 89, 0.8);
  display: flex;
  align-items: center;
  top: 18px;
  left: 12px;
  .dot {
    min-width: 6px;
    min-height: 6px;
    border-radius: 6px;
    background: white;
    margin-right: 6px;
    display: inline-block;
  }
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

const stylePhaseOutContainer = css`
  position: absolute;
  top: 24px;
  right: 18px;
  display: flex;
  cursor: pointer;
  padding: 6px;
  .dot {
    background: #747474;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    margin: 0 1px;
  }
`

const stylePhaseOut = css`
  &:before {
    display:block;
    content:'';
    border-width:6px 4px 6px 12px;
    border-style:solid;
    border-color:transparent transparent white transparent;
    /* 定位 */
    position:absolute;
    right: 16px;
    top:-12px;
  }
  position: absolute;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  padding: 6px 10px;
  white-space: nowrap;
  right: -8px;
  top: 20px;
`
