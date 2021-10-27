import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styles from './index.less'
import { withRouter,  useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { tradableNFTAbi, tradableNFTAbi721, tokenAbi } from 'utils/abi';
import { tradableNFTContract,  tradableNFTContract721, busdMarketContract, bscTestTokenContact} from 'utils/contract';
import Web3 from 'web3';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import {
  Select, InputNumber, Loading, Dialog
} from 'element-react';
import {
  Button
} from '@chakra-ui/react';
import { get, post } from 'utils/request';
import CreateCollectionModal from '../../../components/CreateCollectionModal';
import globalConfig from 'config/index'
import {css, cx} from 'emotion';
import NftSlider from 'components/NftSlider';
import dnft_unit from 'images/market/dnft_unit.png'
import busd_unit from 'images/market/busd.svg'

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
  const [form, setForm] = useState({});
  const [options, setOptions] = useState([]);
  const [isWrongNetWork, setIsWrongNetWork] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const currentNetEnv = globalConfig.net_env;
  const currentNetName = globalConfig.net_name;
  const rightChainId =  currentNetEnv === 'testnet' ? 4 : 56;
  const currentWindowWidth = useMemo(() => window.innerWidth, []);
  useEffect(() => {
    if (item) {
      setDatas(item || {})
    }
  }, [item])
  useEffect(() => {
    getMarketInfo();
  }, [token])
  const getMarketInfo = async () => {
    try {
      const { data } = await get(
        `/api/v1/trans/market/${item?.orderId}`,
        '',
        token
      )
      setDatas(data?.data?.content?.[0])
    } catch (e) {
      console.log(e, 'e');
    }
  }
  const getNFTList = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await post('/api/v1/info/recommend')
      setList(data?.data?.content || []);
    } finally {
      setIsLoading(false)
    }
  }, [token]);

  useEffect(() => {
    // if (token) {
    //   getCollectionList();
    // }
    getNFTList()
  }, [token]);
  useEffect(() => {
    let ethereum = window.ethereum;

    if (ethereum) {
      if (Number(ethereum.networkVersion) !== rightChainId && history.location.pathname === '/market/detail') {
        setIsWrongNetWork(true)
        goToRightNetwork(ethereum);
      } else {
        setIsWrongNetWork(false);
      }
    }
  }, [window.ethereum]);
  const goToRightNetwork = useCallback(async (ethereum) => {
    if (history.location.pathname !== '/market/detail') {
      return;
    }
    try {
      let result;
      if (currentNetEnv === 'testnet') {
        result = await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'Smart Chain Test',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            },
          ],
        });
      } else {
        result = await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
            },
          ],
        });
      }

      if (result === null) {
        setIsWrongNetWork(false);
      } else {
        setIsWrongNetWork(true);
      }
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  }, []);

  const renderHotList = useCallback((title) => (
    <NftSlider title={title} list={list} loading={isLoading} cww={currentWindowWidth} />
  ), [list, isLoading]);
  const isApproved = async () => {
    setApproveLoading(true)
    const tradableNFTAddress = datas?.contractType == 1155 ? tradableNFTContract[currentNetName] : tradableNFTContract721[currentNetName];

    if (datas?.type === 'DNF') {
      const contract = new window.web3.eth.Contract(tokenAbi, bscTestTokenContact[currentNetName]);
      const dnfAuth = await contract.methods['allowance'](address, tradableNFTAddress).call();
      if (!(dnfAuth > 0)) {
        await contract.methods
          .approve(
            tradableNFTAddress,
            Web3.utils.toBN(
              '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            )
          )
          .send({
            from: address,
          });
      }
    }

    if (datas?.type === 'BUSD') {
      const contract = new window.web3.eth.Contract(tokenAbi, busdMarketContract[currentNetName]);
      const busdAuth = await contract.methods['allowance'](address, tradableNFTAddress).call();
      if (!(busdAuth > 0)) {
        await contract.methods
          .approve(
            tradableNFTAddress,
            Web3.utils.toBN(
              '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            )
          )
          .send({
            from: address,
          });
      }
    }

  }

  const clickBuyItem = async () => {
    try {
      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();
        setLoading(true)

        await isApproved();

        setApproveLoading(false)
        setIsOpen(false)
        const tradableNFTAddress = datas?.contractType == 1155 ? tradableNFTContract[currentNetName] : tradableNFTContract721[currentNetName];
        const tradableNFTAbiType = datas?.contractType == 1155 ? tradableNFTAbi : tradableNFTAbi721;
        const myContract = new window.web3.eth.Contract(
          tradableNFTAbiType,
          tradableNFTAddress
        );
        const gasNum = 210000, gasPrice = '20000000000';
        let format = datas?.contractType == 1155 ? [datas?.orderId, form.quantity] : [datas?.orderId]
        if (datas?.contractType == 721) {
          await myContract.methods[datas?.type === 'BUSD' ? 'buyByBusd' : 'buyByDnft'](
            datas?.orderId
          )
            .send({
              from: address,
              gas: gasNum,
              gasPrice: gasPrice,
            }, function (error, transactionHash) {
              if (!error) {
                console.log('交易hash: ', transactionHash)
              } else {
                console.log('error', error)
              }
            })
            .then(async function (receipt) { // 监听后续的交易情况
              // console.log(receipt)
              setLoading(false)
              const { data } = await post(
                '/api/v1/trans/sell_out',
                {
                  buyerAddress: address,
                  // collectionId: form?.collectionId,
                  collectionId: -1,
                  tokenAddress: datas?.tokenAddress,
                  nftId: datas?.nftId,
                  orderId: datas?.orderId,
                  quantity: form.quantity,
                },
                token
              );
              toast[data?.success ? 'success' : 'error']('Buy success', {
                position: toast.POSITION.TOP_CENTER,
              });
              historyBack();
              console.log('交易状态：', receipt.status)
            });
        } else {
          await myContract.methods[datas?.type === 'BUSD' ? 'buyByBusd' : 'buyByDnft'](
            datas?.orderId, form.quantity
          )
            .send({
              from: address,
              gas: gasNum,
              gasPrice: gasPrice,
            }, function (error, transactionHash) {
              if (!error) {
                console.log('交易hash: ', transactionHash)
              } else {
                console.log('error', error)
              }
            })
            .then(async function (receipt) { // 监听后续的交易情况
              // console.log(receipt)
              setLoading(false)
              const { data } = await post(
                '/api/v1/trans/sell_out',
                {
                  buyerAddress: address,
                  // collectionId: form?.collectionId,
                  collectionId: -1,
                  tokenAddress: datas?.tokenAddress,
                  nftId: datas?.nftId,
                  orderId: datas?.orderId,
                  quantity: form.quantity,
                },
                token
              );
              toast[data?.success ? 'success' : 'error']('Buy success', {
                position: toast.POSITION.TOP_CENTER,
              });
              historyBack();
              console.log('交易状态：', receipt.status)
            });
        }
      }
    } catch (e) {
      setLoading(false)
      setApproveLoading(false)
      console.log(e, 'e');
    } finally {
      console.log('finally')
      setApproveLoading(false)
      setLoading(false);
    }
  }

  const historyBack = () => {
    history.push('/market', {category, sortTag})
  }
  const handleStar = async () => {
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
    getMarketInfo();

  }
  const handleLinkProfile = () => {
    if (!token) {
      toast.warn('Please link wallet', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    history.push(`/profile/address/${datas?.address}`)
  }
  const renderFormItem = (label, item) => (
    <div className={styles.styleFormItemContainer}>
      <div className={styles.label}>{label}</div>
      {item}
    </div>
  );
  const getCollectionList = async () => {
    try {
      const { data } = await post(
        '/api/v1/collection/batch',
        {
          address: address,
          sortOrder: 'ASC',
          sortTag: 'createTime',
          page: 0,
          size: 100,
        },
        token
      );
      setOptions(
        data?.data?.content?.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } catch (e) {
      console.log(e, 'e');
    }
  };
  const transPrice = (amount) => {
    if (isNaN(amount)) {return amount;}
    let _amount;
    try {
      _amount = Number(Number(amount).toFixed(4))
    } catch (e) {}
    return _amount;
  }

  let price = datas?.price > 0 && Web3.utils.fromWei(String(datas.price), 'ether');
  let ipfs_address = datas?.avatorUrl?.split('/')?.[datas.avatorUrl.split('/').length - 1];
  return (
    <div className={styles.marketDetail}>
      <Icon className={styles.close} icon="ic:round-arrow-back-ios-new" onClick={historyBack}/>
      <div className={styles.main}>
        <div className={styles.mainL} style={{ backgroundImage: `url(${datas?.avatorUrl})`}}>
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <div className={styles.proName}>
              <div className={styles.proNameText}>{datas?.name}</div>
              <div className={styles.proNameType}>{datas?.category}</div>
              <Icon className={styles.star}  style={datas?.isSaved && {color: 'red'}}  icon="akar-icons:star" onClick={handleStar}/>
            </div>
            <div className={styles.userInfo}>
              {/* <div className={styles.user}>
                <img onClick={handleLinkProfile} src={datas?.userAvatorUrl} className={styles.avatar}/>
                <div onClick={handleLinkProfile} className={styles.userInfoText}>
                  <p className={styles.owner}>Creater</p>
                  <p className={styles.userName}>{datas?.nickName?.length > 10 ? `${datas?.nickName?.slice(0, 10)}...` : datas?.nickName}</p>
                </div>
              </div> */}
              <div className={styles.user}>
                <img onClick={handleLinkProfile} src={datas?.userAvatorUrl} className={styles.avatar}/>
                <div onClick={handleLinkProfile} className={styles.userInfoText}>
                  <p className={styles.owner}>Owner</p>
                  <p className={styles.userName}>{datas?.nickName?.length > 10 ? `${datas?.nickName?.slice(0, 10)}...` : datas?.nickName}</p>
                </div>
              </div>
              <div className={styles.user}>
                <div className={styles.userInfoText}>
                  <p className={styles.owner}>Collection</p>
                  <p className={styles.userName}>{datas?.collectionName?.length > 10 ? `${datas?.collectionName?.slice(0, 10)}...` : datas?.collectionName}</p>
                </div>
              </div>
            </div>
            <div className={styles.content_box}>
              <p className={styles.description}>Description</p>
              <p className={styles.description_text}>{datas?.description}</p>
              <div className={styles.desc_line} />
              <p className={styles.description}>Contract Details</p>
              <div className={styles.contract_details}>
                <div className={styles.contract_details_item}>
                  <div>Blockchain:</div>
                  <div>{datas?.chainType}</div>
                </div>
                <div className={styles.contract_details_item}>
                  <div>Token Standard:</div>
                  <div>ERC-{datas?.contractType}</div>
                </div>
                <div className={styles.contract_details_item}>
                  <div>Contract address:</div>
                  <div>
                    <a
                      href={`https://${currentNetName === 'mainnet' ? '' : 'testnet.'}bscscan.com/address/${datas?.tokenAddress}`}
                      className={styles.tokenAddress}
                      target='_blank'
                      rel="noopener noreferrer"
                    >
                      {datas?.tokenAddress?.slice(0, 8)}...{datas?.tokenAddress?.slice(38)}
                    </a>
                  </div>
                </div>
                <div className={styles.contract_details_item}>
                  <div>Token Id:</div>
                  <div>{datas?.tokenId}</div>
                </div>
              </div>
            </div>
            <div className={styles.priceBox}>
              <div className={styles.currentPrice}>
                <div className={styles.priceAll}>
                  {datas?.type === 'DNF' ? <img src={dnft_unit} /> :  <img src={busd_unit} />}
                  <h4 className={styles.priceAmount}>{transPrice(price)} {datas?.type}</h4>
                  <div className={styles.worth}>≈$
                    {transPrice(datas?.amount * price)}
                  </div>
                </div>
              </div>
              <div className={styles.stock}>
                {datas?.quantity} in stock
              </div>
            </div>
            <div className={styles.btnBox}>
              <Button
                isLoading={loading}
                disabled={!datas?.quantity || loading}
                loadingText="Buy Now"
                className={styles.buyBtn} onClick={() => {
                  if (!address) {
                    toast.warn('Please link wallet', {
                      position: toast.POSITION.TOP_CENTER,
                    });
                    return;
                  }
                  setIsOpen(true)
                }}>Buy Now</Button>
              <div className={styles.ipfsAddress}>
                <span className={styles.contract}>IPFS address:
                  <a
                    href={datas?.avatorUrl}
                    className={styles.tokenAddress}
                    target='_blank'
                    rel="noopener noreferrer"
                  >
                    {ipfs_address?.slice(0, 8)}...{ipfs_address?.slice(38)}
                    {/* {datas?.avatorUrl?.split('/')?.[datas.avatorUrl.split('/').length - 1]} */}
                  </a>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
      {renderHotList('Hot NFTs')}
      {
        isOpen &&
        <Dialog
          title={'Buy NFT'}
          visible
          customClass={styleModalContainer}

          onCancel={onClose}>
          <Dialog.Body p="0 32px">
            {renderFormItem(`Quantity/${datas?.quantity || 0}`, <InputNumber style={{width: '100%', marginTop: 20, }} min={0} max={datas?.quantity} onChange={(value) => {
              setForm({
                ...form,
                quantity: value > datas?.quantity ? datas?.quantity : value
              })
            }}
            />)}
            {
              1 === 0 &&
                renderFormItem(
                  'Collection',
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                    <Select
                      placeholder='Please choose'
                      defaultValue={form.collectionId}
                      value={form.collectionId}
                      style={{flex: 1, marginRight: '28px'}}
                      className={styleCollection}
                      onChange={(value) => {
                        setForm({
                          ...form,
                          collectionId: value,
                        });
                      }}
                    >
                      {options.map((el) => (
                        <Select.Option key={el.value} label={el.label} value={el.value} />
                      ))}
                    </Select>
                    <Button
                      onClick={() => {
                        setShowCreateCollection(true);
                      }}>+ Add</Button>
                  </div>
                )
            }
          </Dialog.Body>
          <Dialog.Footer justifyContent="flex-start">
            <Button
              isLoading={approveLoading}
              loadingText="Submit"
              disabled={!datas?.quantity || loading}
              colorScheme="custom"
              className={styles.submitBtn}
              onClick={() => {
                if (!form.quantity) {
                  toast.warn('Please enter the purchase quantity！', {
                    position: toast.POSITION.TOP_CENTER,
                  });
                  return;
                }
                // if (!form.collectionId) {
                //   toast.warn('Please select collection！', {
                //     position: toast.POSITION.TOP_CENTER,
                //   });
                //   return;
                // }
                clickBuyItem()
              }}>Submit</Button>
          </Dialog.Footer>
        </Dialog>
      }
      {showCreateCollection && (
        <CreateCollectionModal
          formDs={{ address, chainType }}
          token={token}
          isNew
          onSuccess={(res) => {
            setShowCreateCollection(false);
            getCollectionList();
          }}
          onClose={() => {
            setShowCreateCollection(false);
          }}
        />
      )}
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
const styleCollection = css`  
  .el-select-dropdown__empty {
    width: 0;
    overflow: hidden;
    &:before {
      content: "No Data";
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
`
const styleModalContainer = css`
  max-width: 484px;
  width: calc(100% - 40px);
  border-radius: 10px;
  // height: 50vh;
  overflow: auto;
  .el-dialog__title {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }
  .el-dialog__header {
    padding: 20px 22px 0px 22px;
  }
  .el-dialog__body {
    padding: 49px 22px 26px 22px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #1B1D21;
    font-size: 16px;
  }
  .el-dialog__footer {
    padding: 0px 22px;
    margin-bottom: 50px;
  }
`
