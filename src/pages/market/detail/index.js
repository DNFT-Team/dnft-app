import React, { useState, useMemo, useEffect, useCallback } from 'react';
import globalConf from 'config/index';
import styles from './index.less'
import e2 from 'images/market/e2.png';
import close from 'images/market/close.png';
import ellipse from 'images/market/ellipse.png'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import {Button, Notification} from 'element-react'
import { withRouter,  useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { tradableNFTAbi, tokenAbi } from '../../../utils/abi';
import { tradableNFTContract, tokenContract, busdMarketContract, bscTestTokenContact} from '../../../utils/contract';
import Web3 from 'web3';
import {Icon} from '@iconify/react';
import { toast } from 'react-toastify';

import {toDecimal, WEB3_MAX_NUM} from 'utils/web3Tools';
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
    if(datas?.type === 'DNFT') {
      const contract = new window.web3.eth.Contract(tokenAbi, bscTestTokenContact);
      const dnfAuth = await contract.methods['allowance'](address, tradableNFTContract).call();
      if (!(dnfAuth > 0)) {
        console.log(dnfAuth,'dnfAuth-allowance')
        await contract.methods
          .approve(
            tradableNFTContract,
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
      const busdAuth = await contract.methods['allowance'](address, tradableNFTContract).call();
      if (!(busdAuth > 0)) {
        console.log(busdAuth,'busdAuth-allowance')
        await contract.methods
          .approve(
            tradableNFTContract,
            Web3.utils.toBN(
              '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            )
          )
          .send({
            from: address,
          });
      }
    }


    const contractAddress = tradableNFTContract;
    const myContract = new window.web3.eth.Contract(
      tradableNFTAbi,
      contractAddress
    );
    let putOnResult;
    // if (datas.type === 'DNFT') {
    //   putOnResult = await myContract.methods
    //     .putOnByDnft(datas.tokenAddress, datas.tokenId, datas.price, form.quantity)
    //     .send({
    //       from: address,
    //     });
    // } else if (datas.type === 'BUSD') {
    //   putOnResult = await myContract.methods
    //     .putOnByBusd(datas.tokenAddress, datas.tokenId, datas.price, form.quantity)
    //     .send({
    //       from: address,
    //     });
    // }
    return putOnResult;
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
        const tradableNFTAddress = tradableNFTContract;
        const myContract = new window.web3.eth.Contract(
          tradableNFTAbi,
          tradableNFTAddress
        );
        const gasNum = 210000, gasPrice = '20000000000';

        const tradableNFTResult = await myContract.methods[datas?.type === 'BUSD' ? 'buyByBusd' : 'buyByDnft'](
          datas?.orderId,
          form.quantity,
        )
          .send({
            from: address,
            gas: gasNum,
            gasPrice: gasPrice,
            // value: datas.price,
            // value: window.web3.utils.toBN(datas.price),
          }, function (error, transactionHash) {
            if(!error) {
              console.log('交易hash: ', transactionHash)
            } else {
              console.log('error' ,error)
            }
          }).then(async function (receipt) { // 监听后续的交易情况
            console.log(receipt)
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
            toast[data?.success ? 'success' : 'error'](data?.message, {
              position: toast.POSITION.TOP_CENTER,
            });
            historyBack();
            console.log('交易状态：', receipt.status)
          });
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

  return (
    <div className={styles.marketDetail}>
      {/* <div className={styles.backBtn} onClick={() => {
        history.push('/market')
      }}>Back</div> */}
      <div className={styles.main}>
        <div className={styles.mainL} style={{
          background: `center center / contain no-repeat url(${!datas?.avatorUrl.includes('http') ? (globalConf.ipfsDown + datas?.avatorUrl) : datas?.avatorUrl})`,
          height: 482,
          padding: 10,
          borderRadius: 10,
        }}>
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <p className={styles.proName}>{datas?.name}</p>
            <div className={styles.proPriceBox}>
              <span className={styles.price}>{datas.price > 0 && Web3.utils.fromWei(String(datas.price), 'ether')}{datas?.type}</span>
              {/* <span className={styles.price}>$0</span> */}
              {datas?.quantity} in stock
            </div>
            <div className={styles.desc}>{datas?.description}</div>
            <div className={styles.chain}>
              <span className={styles.contract}>Contract address:</span>
              <a
                href={`https://testnet.bscscan.com/address/${datas?.tokenAddress}`}
                className={styles.tokenAddress}
                target='_blank'
                rel="noopener noreferrer"
              >
                {datas?.tokenAddress?.slice(0, 8)}...{datas?.tokenAddress?.slice(38)}
              </a>
            </div>
            <div className={styles.user}>
              <div className={styles.head} onClick={() => {history.push(`/profile/address/${datas?.address}`)}}>
                <img src={datas?.userAvatorUrl} className={styles.avatar}/>
              </div>
              <div>
                <p className={styles.owner}>Owner</p>
                <p className={styles.userName}>{datas?.nickName}</p>
              </div>
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

