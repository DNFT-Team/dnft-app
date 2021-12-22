import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styles from './index.less'
import { withRouter,  useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import {
  Select, InputNumber, Dialog, Button
} from 'element-react';
import {
  Tooltip
} from '@chakra-ui/react';
import { get, post } from 'utils/request';
import CreateCollectionModal from '../../../components/CreateCollectionModal';
import globalConfig from 'config/index'
import {css, cx} from 'emotion';
import NftSlider from 'components/NftSlider';
import dnft_unit from 'images/market/dnft_unit.png'
import busd_unit from 'images/market/busd.svg';
import {
  createNFTContract1155,
  createNFTContract721,
  tradableNFTContract,
  tradableNFTContract721,
} from 'utils/contract';
import { createNFTAbi1155, createNFTAbi721, tradableNFTAbi, tradableNFTAbi721 } from 'utils/abi';
import { getWallet } from 'utils/get-wallet';

const MarketDetailScreen = (props) => {
  const {location, address, token, chainType} = props;
  const item = location?.state?.item;
  const category = location?.state?.category;
  const sortTag = location?.state?.sortTag;
  let history = useHistory();
  const [datas, setDatas] = useState(item || {})
  const [list, setList] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const [isWrongNetWork, setIsWrongNetWork] = useState(false);
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);
  const [lineFlag, setLineFlag] = useState(false);
  const currentNetEnv = globalConfig.net_env;
  const currentNetName = globalConfig.net_name;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const currentWindowWidth = useMemo(() => window.innerWidth, []);
  const [showOffShelfModal, setShowOffShelfModal] = useState(false);
  const [isOffLoading, setIsOffLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setDatas(item || {})
    }
  }, [item])
  useEffect(() => {
    if(item?.status !== 'INWALLET')
      getMarketInfo();
  }, [token])
  const getMarketInfo = async () => {
    try {
      const { data } = await get(
        `/api/v1/trans/asset/${item?.address}/${item?.status}/${item?.nftId}`,
        '',
        token
      )
      console.log(data,'datadata')
      setDatas(data?.data?.content)
    } catch (e) {
      console.log(e, 'e');
    }
  }

  useEffect(() => {
    let wallet = getWallet();

    if (wallet) {
      if (
        (Number(wallet.networkVersion || wallet.chainId) !== rightChainId) && history.location.pathname === '/market/detail') {
        setIsWrongNetWork(true);
        setIsShowSwitchModal(true);
      } else {
        setIsWrongNetWork(false);
      }
    }
  }, [getWallet]);


  const handleStar = async () => {
    if (!address) {
      toast.warn('Please link wallet', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const { data } = await post(
      '/api/v1/nft/save',
      {
        saved: datas?.isSaved ? 0 : 1,
        nftId: datas?.nftId,
      },
      token
    );
    const flag = data?.success;
    const msg = flag ? `${datas?.isSaved ? 'Unmarked' : 'Marked'} Successfully!` : data?.message;
    toast[flag ? 'success' : 'error'](msg, { position: toast.POSITION.TOP_CENTER});
    if(item?.status !== 'INWALLET')
      getMarketInfo();
  }
  const handleLinkProfile = (address) => {
    if (!token) {
      toast.warn('Please link wallet', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    history.push(`/profile/address/${address}`)
  }
  const transPrice = (amount) => {
    if (isNaN(amount)) {return amount;}
    let _amount;
    try {
      _amount = Number(Number(amount).toFixed(4))
    } catch (e) {}
    return _amount;
  };

  const onShowOffShelfModal = () => {
    setShowOffShelfModal(true);
  };
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
                    // onRefresh(address, token);
                    setIsOffLoading(false);
                    history.goBack();
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
  }, [isOffLoading, getWallet])
  console.log(lineFlag, 'lineFlag')
  let price = datas?.price > 0 && Web3.utils.fromWei(String(datas.price), 'ether');
  return (
    <div className={styles.marketDetail}>
      <div className={styles.main}>
        <div className={styles.mainL} style={{ backgroundImage: `url(${datas?.avatorUrl})`}}>
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <div className={styles.proName}>
              <div className={styles.proNameText}>{datas?.name}</div>
            </div>
            <div className={styles.collectionBox}>
              <div className={styles.proNameType}>{datas?.category}</div>
              <Icon className={styles.star} icon={datas?.isSaved ? 'flat-color-icons:like' : 'icon-park-outline:like'} onClick={handleStar}/>
              <span style={{color: datas?.isSaved ? '#FF4242' : '#B8BECC'}} className={styles.saveCount}>{datas?.saveCount}</span>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.user}>
                <div className={styles.userInfoText}>
                  <p className={styles.owner}>Collection</p>
                  <p onClick={() => history.push('/profile/collection', {item: {
                    id: datas?.collectionId,
                    flag: true,
                  }, newAddress: datas?.address})} className={`${styles.userName} ${styles.tokenAddress}`}>{datas?.collectionName?.length > 10 ? `${datas?.collectionName?.slice(0, 10)}...` : datas?.collectionName}</p>
                </div>
              </div>
              <div className={styles.user} onClick={() => handleLinkProfile(datas?.createrAddress)}>
                <img src={datas?.createrAvatorUrl} className={styles.avatar}/>
                <div className={styles.userInfoText}>
                  <p className={styles.owner}>Creater</p>
                  <Tooltip label={`${datas?.createrAddress?.slice(0, 7) || ''}...${datas?.createrAddress?.slice(-6) || ''}`} hasArrow>
                    <a className={`${styles.userName} ${styles.tokenAddress}`}>{datas?.createrName?.length > 10 ? `${datas?.createrName?.slice(0, 10)}...` : datas?.createrName || 'Unknown'}</a>
                  </Tooltip>
                </div>
              </div>
              <div className={styles.user} onClick={() => handleLinkProfile(datas?.address)}>
                <img src={datas?.userAvatorUrl} className={styles.avatar}/>
                <div className={styles.userInfoText}>
                  <p className={styles.owner}>Owner</p>
                  <Tooltip label={`${datas?.address?.slice(0, 7)}...${datas?.address?.slice(-6)}`} hasArrow>
                    <a className={`${styles.userName} ${styles.tokenAddress}`}>{datas?.nickName?.length > 10 ? `${datas?.nickName?.slice(0, 10)}...` : datas?.nickName || 'Unknown'}</a>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className={styles.content_box}>
              <p className={styles.descriptionTitle}>Description</p>
              {/* <p className={`${lineFlag ? styles.description_text : styles.slider}`}>{datas?.description}</p> */}
              <div className={styles.warpperDesc}>
                <input id="exp1" className={styles.exp} type="checkbox" />
                <p className={`${styles.description} ${lineFlag && styles.slider}`}><label htmlFor={'exp1'}><Icon  className={styles.icon}  color='#75819A' onClick={() => {
                  setLineFlag((lineFlag) => !lineFlag)
                }} icon={`akar-icons:chevron-${lineFlag ? 'up' : 'down'}`} /></label>{datas?.description}</p>
              </div>
              {/* <div className={styles.desc_line} /> */}
              <p className={styles.descriptionTitle}>Contract Details</p>
              <div className={styles.contract_details}>
                <div className={styles.contract_details_item}>
                  <div>Blockchain</div>
                  <div>{datas?.chainType}</div>
                </div>
                <div className={styles.contract_details_item}>
                  <div>Token Standard</div>
                  <div>ERC-{datas?.contractType}</div>
                </div>
                <div className={styles.contract_details_item}>
                  <div>Contract Address</div>
                  <div>
                    <a
                      href={`https://${currentNetName === 'mainnet' ? '' : 'testnet.'}bscscan.com/address/${datas?.tokenAddress}`}
                      className={styles.tokenAddress}
                      target='_blank'
                      rel="noopener noreferrer"
                    >
                      {datas?.tokenAddress?.slice(0, 7)}...{datas?.tokenAddress?.slice(-6)}
                    </a>
                  </div>
                </div>
                <div className={styles.contract_details_item}>
                  <div>Token Id</div>
                  <div>{datas?.tokenId}</div>
                </div>
              </div>
            </div>
            {
              item?.status === 'ONSALE' &&
              <>
                <div className={styles.priceBox}>
                  <div className={styles.currentPrice}>
                    <div className={styles.priceAll}>
                      {datas?.type === 'DNF' ? <img src={dnft_unit} /> :  <img src={busd_unit} />}
                      <h4 className={styles.priceAmount}>{transPrice(price)}</h4>
                      <div className={styles.worth}>≈ $
                        {transPrice(datas?.amount * price)}
                      </div>
                    </div>
                  </div>
                  {
                    datas?.contractType == 1155 &&
                    <div className={styles.stock}>
                      {datas?.quantity} Available
                    </div>
                  }
                </div>
                <div className={styles.btnBox}>
                  <Button
                    isLoading={loading}
                    disabled={!datas?.quantity || loading}
                    loadingText="Buy Now"
                    className={styles.buyBtn} onClick={() => {
                      onShowOffShelfModal();
                    }}>Unsell</Button>
                </div>
              </>
            }

          </div>
        </div>
      </div>
      {showOffShelfModal && renderOffShelfModal}
    </div>
  )
}
const mapStateToProps = ({ profile, market }) => ({
  token: profile.token,
  datas: market.datas,
  chainType: profile.chainType,

  address: profile.address
});
export default withRouter(connect(mapStateToProps)(MarketDetailScreen));

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
    top: -10px;
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
      font-family: Archivo Black,sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      letter-spacing: -0.01em;
      color: #000000;
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
  font-family: Judson,sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.01em;
  color: #75819A;
  .dot {
    background: #45B36B;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    margin-right: 6px;
  }
`;


