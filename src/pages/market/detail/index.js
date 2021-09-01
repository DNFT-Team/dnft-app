import React, { useState, useRef, useEffect } from 'react';
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
import { tradableNFTAbi } from '../../../utils/abi';
import { tradableNFTContract } from '../../../utils/contract';
import Web3 from 'web3';
import {Icon} from '@iconify/react';

import {toDecimal, WEB3_MAX_NUM} from 'utils/web3Tools';
import {
  Select,
} from 'element-react';
import {
  Button, Fade,Modal,
  IconButton,
  Badge, ModalOverlay,
  ModalHeader, ModalFooter,
  ModalBody, ModalContent,
} from '@chakra-ui/react';
import { post } from 'utils/request';
import CreateCollectionModal from '../../../components/CreateCollectionModal';


const MarketDetailScreen = (props) => {
  const {location, address, token, chainType} = props;
  const datas = location?.state;
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const [form, setForm] = useState({});
  const [options, setOptions] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  console.log(location, 'location')
  let history = useHistory();

  useEffect(() => {
    if (token) {
      getCollectionList();
    }
  }, [token]);
  const clickBuyItem = async () => {
    try {
      if(window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const tradableNFTAddress = tradableNFTContract;
        console.log(datas?.type,'datas,',datas)
        const myContract = new window.web3.eth.Contract(
          tradableNFTAbi,
          tradableNFTAddress
        );
        const gasNum = 210000, gasPrice = '20000000000';
        setIsOpen(true);
        return true;
        // console.log(myContract,'myContract',datas,address, Web3.utils.toWei(datas?.price?.toString(), 'ether'))
        // const tradableNFTResult = await myContract.methods
        //   .buyByDnft(
        //     datas?.address,
        //     datas.tokenId,
        //   )
        //   .send({
        //     value: toDecimal(datas?.price, true, 'ether', true),
        //     from: address,
        //     gas: gasNum,
        //     gasPrice: gasPrice
        //   });
        // console.log(ethereum,myContract, tradableNFTResult)
      }
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setLoading(false);
    }
  }

  const createDNFCollect = () => {
    console.log('----1212', form,)
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
          background: `center center / contain no-repeat url(${!datas?.avatorUrl.includes('http') ? (globalConf.ipfsDown + '/ipfs/' + datas?.avatorUrl) : datas?.avatorUrl})`,
          height: 482,
          padding: 10,
          borderRadius: 10,
        }}>
        </div>
        <div className={styles.mainR}>
          <div className={styles.product}>
            <p className={styles.proName}>{datas?.name}</p>
            <div className={styles.proPriceBox}>
              <span className={styles.price}>{datas?.price}{datas?.type}</span>
              <span className={styles.price}>$24234.32</span>
              {datas?.supply - datas?.quantity} in stock
            </div>
            <div className={styles.desc}>{datas?.description}</div>
            <div className={styles.chain}>
              <span className={styles.contract}>Contract address:</span>
              <a
                href={`https://www.bscscan.com/address/${datas?.tokenAddress}`}
                className={styles.tokenAddress}
                target='_blank'
                rel="noopener noreferrer"
              >
                {datas?.tokenAddress?.slice(0, 8)}...{datas?.tokenAddress?.slice(38)}
              </a>
            </div>
            <div className={styles.user}>
              <div className={styles.head}>
                <img src={datas?.userAvatorUrl} className={styles.avatar}/>
              </div>
              <div>
                <p className={styles.owner}>Owner</p>
                <p className={styles.userName}>{datas?.nickName}</p>
              </div>
            </div>
            <div className={styles.user}>
              <div className={styles.head}>
                <img className={styles.avatar}/>
              </div>
              <div>
                <p className={styles.owner}>Creator</p>
                <p className={styles.userName}>Raquel</p>
              </div>
            </div>
            <Button
              // disabled={!(datas?.supply - datas?.quantity)}
              className={styles.buyBtn} onClick={() => {
              // Notification.info('Coming Soon')
                clickBuyItem()
              }}>Buy Now</Button>
          </div>
          <div>
            <img onClick={() => {
              history.push('/market')
            }} className={styles.close} src={close} />
          </div>
        </div>
      </div>
      <Modal style={{minHeight: 509}} visible={false} closeOnOverlayClick={false} blockScrollOnMount scrollBehavior="inside" borderRadius="10px"
        isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="564px" maxW="initial">
          <ModalHeader color="#11142d"
            p="32px" fontSize="18px"
            display="flex" justifyContent="space-between"
            alignItems="center">
            Select your collection
            <IconButton onClick={onClose} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
              icon={<Icon icon="mdi:close"/>}/>
          </ModalHeader>
          <ModalBody p="0 32px">
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
                <Button onClick={() => {
                  setShowCreateCollection(true);
                }}>+ Add</Button>
              </div>
            )}
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Button colorScheme="custom" p="12px 42px" fontSize="16px" width="fit-content" borderRadius="10px"
              onClick={() => createDNFCollect()}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {showCreateCollection && (
        <CreateCollectionModal
          formDs={{ address, chainType }}
          token={token}
          isNew={true}
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

