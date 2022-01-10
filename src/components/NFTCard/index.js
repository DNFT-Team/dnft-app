import { Dialog, InputNumber, Select, Button, Loading } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo } from 'react';

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
import { createNFTAbi1155, createNFTAbi721, tradableNFTAbi, tradableNFTAbi721 } from '../../utils/abi';
import { toast } from 'react-toastify';
import globalConfig from '../../config';
import noImg from 'images/common/noImg.svg'
import _ from 'lodash';
import NFTCardItem from 'pages/market/component/item';
import { getWallet } from 'utils/get-wallet';
const gasLimit = 3000000;
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
    isProfile,
    fromCollection,
    handleDetail,
    getList
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
            `Quantity/${item.quantity || 0}`,
            <InputNumber
              disabled={item.contractType == 721}
              min={1}
              max={item.quantity}
              defaultValue={1}
              onChange={(value) => {
                setSellForm({
                  ...sellForm,
                  quantity: value > item.quantity ? item.quantity : value,
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
                let wallet = getWallet();
                if (wallet) {
                  window.web3 = new Web3(wallet);

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
                              gasLimit
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
                              gasLimit
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
                              gasLimit,
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
                              gasLimit
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
                        onRefresh(address, token, true);
                        setIsApproved(false);
                        // toast.info('Operation succeeded！', {
                        //   position: toast.POSITION.TOP_CENTER,
                        // });
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
                            gasLimit
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
  }, [sellForm, isApproved, isApproveLoading, isOnLoading, getWallet]);

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
                let wallet = getWallet();
                if (wallet) {
                  window.web3 = new Web3(wallet);
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
                      gasLimit
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
                    onRefresh(address, token, true);
                    setIsOffLoading(false);

                    // toast.info('Operation succeeded！', {
                    //   position: toast.POSITION.TOP_CENTER,
                    // });
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
  }, [isOffLoading, getWallet])
  const isEmpty = item.quantity === 0;

  return (
    <div key={`title-${index}`} className={`${styleCardContainer} ${fromCollection && styleCardCollection}`}>
      <NFTCardItem
        item={item}
        index={index}
        whetherShowPrice={false}
        getMarketList={getList}
        clickDetail={(e) => {handleDetail && handleDetail()}}
      >
        {
          currentStatus.value === 'INWALLET' && <div
            className={cx(styleButton)}
            style={{
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
              background: '#0057D9'
            }}
            onClick={() => {
              if (isEmpty) {
                return;
              }
              if(item?.sellable === false) {
                toast.warn('This nft is not allowed to sell', {
                  position: toast.POSITION.TOP_CENTER,
                });
                return
              }
              onShowSellModal();
            }}
          >
              Sell
          </div>
        }
        {
          currentStatus.value === 'ONSALE' && <div
            className={cx(styleButton)}
            style={{
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation()
              onShowOffShelfModal();
            }}
          >
            Unsell
          </div>
        }
      </NFTCardItem>
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


const styleButton = css`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #ed6160;
  border-radius: 10px;
  font-family: Archivo Black,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: #FCFCFD;
  box-sizing: border-box;
  padding: 8px 12px;
  position: relative;
  width: 140px;
  height: 40px;
  margin: 0 auto 12px auto;
`;


const styleCardContainer = css`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  &:hover {
    position: relative;
  }
  .shortPic{
    min-height: 300px;
    border-radius: 10px 10px 0 0 ;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .imgFlow{
    background-size: cover;
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
const styleCardCollection = css`
  &:hover {
    top: 0px;
  }
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
