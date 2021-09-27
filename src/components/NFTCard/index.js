import { Dialog, InputNumber, Select, Button, Loading } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

import { post } from 'utils/request';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Web3 from 'web3';
import {
  createNFTContract1155,
  createNFTContract721,
  tradableNFTContract,
  tradableNFTContract721,
} from '../../utils/contract';
import { createNFTAbi1155, createNFTAbi721, tokenAbi, tradableNFTAbi, tradableNFTAbi721 } from '../../utils/abi';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import globalConfig from '../../config';
import noImg from 'images/common/noImg.svg'

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
    isProfile
  } = props;
  const url = item.avatorUrl
  const flag = !url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1
  const viewUrl = !flag ? url : noImg
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
  const currentNetEnv = globalConfig.net_env;
  const currentNetName = globalConfig.net_name;

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
              <Select.Option key={'DNF'} label={'DNF'} value={'DNF'} />
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
                        is721Contract ? tradableNFTContract721[currentNetName] : tradableNFTContract[currentNetName]
                      );

                      let putOnResult;
                      if (sellForm.type === 'DNF') {
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
                            collectionId: item.collectionId,
                            tokenAddress: item.tokenAddress
                          },
                          token
                        );
                        setShowSellModal(false);
                        setIsAprroveLoading(false);
                        setIsOnLoading(false);
                        onRefresh(address, token);
                        setIsApproved(false);
                        toast.info('Operation succeeded！', {
                          position: toast.POSITION.TOP_CENTER,
                        });
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
                        is721Contract ? createNFTContract721[currentNetName] : createNFTContract1155[currentNetName]
                      );

                      let isApproved = await dnfTokenContract.methods
                        .isApprovedForAll(address, is721Contract ? tradableNFTContract721[currentNetName] : tradableNFTContract[currentNetName])
                        .call();

                      if (!isApproved) {
                        let result = await dnfTokenContract.methods
                          .setApprovalForAll(is721Contract ? tradableNFTContract721[currentNetName] : tradableNFTContract[currentNetName], true)
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

                  const contractAddress = is721Contract ? tradableNFTContract721[currentNetName] : tradableNFTContract[currentNetName];
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
                        tokenAddress: item.tokenAddress
                      },
                      token
                    );
                    setShowOffShelfModal(false);
                    onRefresh(address, token);
                    setIsOffLoading(false);

                    toast.info('Operation succeeded！', {
                      position: toast.POSITION.TOP_CENTER,
                    });
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
  console.log(item, 'item')

  return (
    <div key={`title-${index}`} className={styleCardContainer}>
      {item.sold && <div className={styleSoldOutBanner}>sold out</div>}
      <div
        style={{
          backgroundImage: `url(${viewUrl})`,
        }}
        className="shortPic"
      />
      <div className={styleInfoContainer}>
        <div className={styleCardHeader}>
          <div className={styleInfo} style={{
            borderBottom: currentStatus.value !== 'SOLD' ? '1px solid #F3F7F9' : 'none'
          }}>
            <div className="headLine">
              <span className="title">{item.name}</span>
              <span className={styleNickNameContainer}><span className='dot'></span>{item?.nickName && item.nickName.length > 10 ? `${item.nickName?.slice(0, 10)}...` : item?.nickName}</span>
            </div>
            {currentStatus.value === 'ONSALE' && !isProfile && <span
              style={{ color: '#000000', fontSize: '12px', padding: '2px 6px', fontWeight: '600', borderRadius: '4px' }}
            >
              {item.price > 0 &&
                ['ONSALE', 'SOLD'].includes(currentStatus.value) &&
                `${Web3.utils.fromWei(String(item.price), 'ether')} ${
                  item.type || ''
                }`}
            </span>}
          </div>
          {
            currentNetEnv !== 'mainnet' && currentStatus.value === 'INWALLET' && <div
              className={cx(styleButton)}
              style={{
                opacity: isEmpty ? 0.5 : 1,
                cursor: isEmpty ? 'not-allowed' : 'pointer',
                background: '#0834e8'
              }}
              onClick={() => {
                if (isEmpty) {
                  return;
                }
                onShowSellModal();
              }}
            >
                Sell
            </div>
          }
          {
            currentNetEnv !== 'mainnet' && currentStatus.value === 'ONSALE' && <div
              className={cx(styleButton)}
              style={{
                opacity: isEmpty ? 0.5 : 1,
                cursor: isEmpty ? 'not-allowed' : 'pointer',
              }}
              onClick={() => {
                onShowOffShelfModal()();
              }}
            >
                Unsell
            </div>
          }
        </div>
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
  background: #ed6160;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  margin-bottom: 12px;
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
  border-radius: 10px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  /* cursor: pointer; */
  position: relative;
  flex: 1;
  min-width: 300px;
  &:hover {
    position: relative;
    box-shadow: rgb(218 218 218) 5px 5px 20px 0px inset, rgb(255 255 255) -5px -5px 20px 0px inset;
    //top: -10px;
  }
  .shortPic{
    min-height: 300px;
    border-radius: 10px 10px 0 0 ;
    background-repeat: no-repeat;
    animation: nftFlow 6s infinite cubic-bezier(0.42, 0.13, 0, 1.04);
  }
  @keyframes nftFlow {
    0%,100%{
      background-position: 0 0;
    }
    50%{
      background-position: 100% 100%;
    }
  }
`;

const styleInfoContainer = css`
  padding: 18px 14px 0 14px;
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  .headLine{
    width: 80%;
    .title {
      color: #11142d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      margin-right: 10px;
      font-size: 16px;
      font-weight: 600;
    }
  }
`;

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


