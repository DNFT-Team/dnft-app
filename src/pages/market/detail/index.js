import React, { useState, useMemo, useEffect, useCallback } from 'react';
import globalConf from 'config/index';
import styles from './index.less'
import close from 'images/market/close.png';
import { withRouter,  useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { tradableNFTAbi, tradableNFTAbi721, tokenAbi } from '../../../utils/abi';
import { tradableNFTContract,  tradableNFTContract721, busdMarketContract, bscTestTokenContact} from '../../../utils/contract';
import Web3 from 'web3';
import {Icon} from '@iconify/react';
import { toast } from 'react-toastify';
import {
  Select, InputNumber
} from 'element-react';
import {
  Button, Fade, Modal,
  IconButton,
  Badge, ModalOverlay,
  ModalHeader, ModalFooter,
  ModalBody, ModalContent,
} from '@chakra-ui/react';
import { post } from 'utils/request';
import CreateCollectionModal from '../../../components/CreateCollectionModal';
import globalConfig from '../../../config'


const MarketDetailScreen = (props) => {
  const {location, address, token, chainType} = props;
  const datas = location?.state?.item;
  const category = location?.state?.category;
  const sortTag = location?.state?.sortTag;
  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const [form, setForm] = useState({});
  const [options, setOptions] = useState([]);
  const [isWrongNetWork, setIsWrongNetWork] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const rightChainId =  globalConfig.net_env === 'testnet' ? 4 : 56;

  useEffect(() => {
    if (token) {
      getCollectionList();
    }
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
      if (globalConfig.net_env === 'testnet') {
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
  const isApproved = async () => {
    setApproveLoading(true)
    const tradableNFTAddress = datas?.contractType == 1155 ? tradableNFTContract : tradableNFTContract721;

    if(datas?.type === 'DNFT') {
      const contract = new window.web3.eth.Contract(tokenAbi, bscTestTokenContact);
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

    if(datas?.type === 'BUSD') {
      const contract = new window.web3.eth.Contract(tokenAbi, busdMarketContract);
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
        const tradableNFTAddress = datas?.contractType == 1155 ? tradableNFTContract : tradableNFTContract721;
        const tradableNFTAbiType = datas?.contractType == 1155 ? tradableNFTAbi : tradableNFTAbi721;
        const myContract = new window.web3.eth.Contract(
          tradableNFTAbiType,
          tradableNFTAddress
        );
        const gasNum = 210000, gasPrice = '20000000000';
        let format = datas?.contractType == 1155 ? [datas?.orderId, form.quantity] : [datas?.orderId]
        if(datas?.contractType == 721) {
          await myContract.methods[datas?.type === 'BUSD' ? 'buyByBusd' : 'buyByDnft'](
            datas?.orderId
          )
            .send({
              from: address,
              gas: gasNum,
              gasPrice: gasPrice,
            }, function (error, transactionHash) {
              if(!error) {
                console.log('交易hash: ', transactionHash)
              } else {
                console.log('error' ,error)
              }
            }).then(async function (receipt) { // 监听后续的交易情况
              // console.log(receipt)
              setLoading(false)
              const { data } = await post(
                '/api/v1/trans/sell_out',
                {
                  buyerAddress: address,
                  collectionId: form?.collectionId,
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
        }else {
          await myContract.methods[datas?.type === 'BUSD' ? 'buyByBusd' : 'buyByDnft'](
            datas?.orderId, form.quantity
          )
            .send({
              from: address,
              gas: gasNum,
              gasPrice: gasPrice,
            }, function (error, transactionHash) {
              if(!error) {
                console.log('交易hash: ', transactionHash)
              } else {
                console.log('error' ,error)
              }
            }).then(async function (receipt) { // 监听后续的交易情况
              // console.log(receipt)
              setLoading(false)
              const { data } = await post(
                '/api/v1/trans/sell_out',
                {
                  buyerAddress: address,
                  collectionId: form?.collectionId,
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
  const renderFormItem = (label, item) => (
    <div className={styles.styleFormItemContainer}>
      <div className='label'>{label}</div>
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
    if(isNaN(amount)) return amount;
    let _amount;
    try {
      _amount = Number(Number(amount).toFixed(4))
    }catch(e) {}
    return _amount;
  }
  let price = datas?.price > 0 && Web3.utils.fromWei(String(datas.price), 'ether');
  let ipfs_address = datas?.avatorUrl?.split('/')?.[datas.avatorUrl.split('/').length - 1];
  return (
    <div className={styles.marketDetail}>
      <div className={styles.main}>
        <div className={styles.mainL} style={{
          background: `center center / cover no-repeat url(${!datas?.avatorUrl.includes('http') ? (globalConf.ipfsDown + datas?.avatorUrl) : datas?.avatorUrl})`,
        }}>
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <div className={styles.proName}>
              <div className={styles.proNameText}>{datas?.name}</div>
              <div className={styles.proNameType}>{datas?.category}</div>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.user}>
                <img onClick={() => {history.push(`/profile/address/${datas?.address}`)}} src={datas?.userAvatorUrl} className={styles.avatar}/>
                <div className={styles.userInfoText}>
                  <p className={styles.owner}>Owner</p>
                  <p className={styles.userName}>{datas?.nickName?.length > 10 ? `${datas?.nickName?.slice(0, 10)}...` : datas?.nickName}</p>
                </div>
              </div>
            </div>
            <div className={styles.desc}>{datas?.description}</div>
            <div className={styles.priceBox}>
              <div className={styles.currentPrice}>
                <div className={styles.currentPriceTitle}>Current Price</div>
                <div className={styles.priceAll}>
                  <h4 className={styles.priceAmount}>{transPrice(price)} {datas?.type}</h4>
                  <div className={styles.worth}>≈ $
                    {transPrice(datas?.amount * price)}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stock}>
              {datas?.quantity} in stock
            </div>
            <div className={styles.chainInfo}>
              <div className={styles.chain}>
                <span className={styles.contract}>Contract address:</span>
                <a
                  href={`https://testnet.bscscan.com/address/${datas?.tokenAddress}`}
                  className={styles.tokenAddress}
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  {/* {datas?.tokenAddress} */}
                  {datas?.tokenAddress?.slice(0, 8)}...{datas?.tokenAddress?.slice(38)}
                </a>
              </div>
              <div>
                <span className={styles.contract}>Token Id:</span>
                <span className={styles.tokenId}>{datas?.tokenId}</span>
              </div>
            </div>
            <div className={`${styles.chain} ${styles.ipfsAddress}`}>
              <span className={styles.contract}>ipfs address:</span>
              <a
                href={datas?.avatorUrl}
                className={styles.tokenAddress}
                target='_blank'
                rel="noopener noreferrer"
              >
                {ipfs_address?.slice(0, 8)}...{ipfs_address?.slice(38)}
                {/* {datas?.avatorUrl?.split('/')?.[datas.avatorUrl.split('/').length - 1]} */}
              </a>
            </div>
            <Button
              isLoading={loading}
              disabled={!datas?.quantity || loading}
              loadingText="Buy Now"
              className={styles.buyBtn} onClick={() => {
                setIsOpen(true)
              }}>Buy Now</Button>
          </div>
          <div>
            <img onClick={historyBack} className={styles.close} src={close} />
          </div>
        </div>
      </div>
      <Modal style={{minHeight: 509}} visible={false} closeOnOverlayClick={false} blockScrollOnMount scrollBehavior="inside"
        borderRadius="10px"
        isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="564px" maxW="initial">
          <ModalHeader color="#11142d"
            p="32px" fontSize="18px"
            display="flex" justifyContent="space-between"
            alignItems="center">
            Buy
            <IconButton onClick={onClose} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
              icon={<Icon icon="mdi:close"/>}/>
          </ModalHeader>
          <ModalBody p="0 32px">
            {renderFormItem('Quantity', <InputNumber style={{width: '100%', marginTop: 20,}} min={0} max={datas?.quantity} onChange={(value) => {
              setForm({
                ...form,
                quantity: value
              })
            }}
            />)}
            {renderFormItem(
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
            )}
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Button
              isLoading={approveLoading}
              loadingText="Submit"
              disabled={!datas?.quantity || loading}
              colorScheme="custom" p="12px 42px" fontSize="16px" width="fit-content" borderRadius="10px"
              onClick={() => {
                if(!form.quantity) {
                  toast.warn('Please enter the purchase quantity！', {
                    position: toast.POSITION.TOP_CENTER,
                  });
                  return;
                }
                if(!form.collectionId) {
                  toast.warn('Please select collection！', {
                    position: toast.POSITION.TOP_CENTER,
                  });
                  return;
                }
                clickBuyItem()
              }}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

