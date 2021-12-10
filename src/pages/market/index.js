import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Dialog, Button, Select, Loading } from 'element-react';
import styles from './index.less';
import { css, cx } from 'emotion';
import NFTCard from './component/item';
import { noDataSvg } from 'utils/svg';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMarketList, setMarketList } from 'reduxs/actions/market';
import helper from '../../config/helper';
import { Icon } from '@iconify/react';
import { Link } from '@chakra-ui/react';
import globalConfig from '../../config/index';

const Market = (props) => {
  let history = useHistory();
  const { dispatch, token, datas, pageAble, categoryList, pending, location, address } = props;
  const categoryBack = location?.state?.category;
  const sortTagBack = location?.state?.sortTag;
  const [category, setCategory] = useState(categoryBack || 'All');
  const [sortTag, setSortTag] = useState(sortTagBack || 'like_count');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);

  const domRef = useRef(null);
  const sortTagType = [
    { label: 'Most popular', value: 'like_count' },
    { label: 'Price:high to low', value: 'ASC-price' },
    { label: 'Price:low to high', value: 'DESC-price' },
  ];

  const currentNetEnv = globalConfig.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const right16ChainId =  currentNetEnv === 'testnet' ? '0x61' : '0x38';
  const rightRpcUrl = currentNetEnv === 'testnet' ? ['https://data-seed-prebsc-1-s1.binance.org:8545/'] : ['https://bsc-dataseed.binance.org/'];

  useEffect(() => {
    if (token) {
      let _sortTag = sortTag
      if (sortTag?.includes('price')) {
        _sortTag = 'totalPrice'
      }
      fetchData(true);
    }
  }, [token, category, sortTag, address]);
  let reachBottom = domRef?.current?.getBoundingClientRect()?.bottom;

  const fetchData =  (tag) => {
    let _sortTag = sortTag
    if (sortTag?.includes('price')) {
      _sortTag = 'totalPrice'
    }
    dispatch(
      getMarketList(
        {
          category: category,
          sortOrder: sortOrder,
          sortTag: _sortTag,
          page: tag ? 1 :  page + 1,
          size,
        },
        token
      )
    );
    setPage(tag ? 1 : page + 1);

  }
  useEffect(() => {
    // domRef?.current?.getBoundingClientRect()?.bottom <= window.innerHeight &&
    if (pageAble && datas?.length > 0) {
      fetchData()
    }
  }, [pageAble, datas?.length, category, sortTag, address])

  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
      </div>
    ),
    []
  );
  const clickDetail = (item) => {
    // if(pending) return;
    history.push('/market/detail', {item, category, sortTag})
  }
  const getMarketStarList = (id, isSave) => {
    let data = datas.slice();
    data.map((obj) => {
      if(obj.id === id) {
        obj.isSaved = isSave;
        obj.saveCount = isSave ? obj.saveCount + 1 : obj.saveCount - 1;
      }
    })
    dispatch(
      setMarketList(data)
    );
  }
  const renderCard = useCallback(
    (item, index) => <NFTCard key={item.id} item={item} index={index} needAction fromMarket={true} getMarketList={getMarketStarList} clickDetail={() => {
      clickDetail(item);
    }} />,
    [category, sortTag, datas]
  );

  const goToRightNetwork = useCallback(async (ethereum) => {
    try {
      if (history.location.pathname !== '/market') {
        return;
      }

      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: right16ChainId,
            chainName: 'Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: rightRpcUrl,
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  }, []);

  useEffect(() => {
    setIsShowSwitchModal(false)
    let ethereum = window.ethereum;

    if (ethereum) {
      if (
        Number(ethereum.networkVersion) !== rightChainId &&
        history.location.pathname === '/market'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, []);

  const renderShowSwitchModal = () => {
    console.log(isShowSwitchModal, 'isShowSwitchModal')
    return (
      <Dialog
        size="tiny"
        className={styleSwitchModal}
        visible={isShowSwitchModal}
        closeOnClickModal={false}
        closeOnPressEscape={false}
      >
        <Dialog.Body>
          <span>You’ve connected to unsupported networks, please switch to BSC network.</span>
        </Dialog.Body>
        <Dialog.Footer className="dialog-footer">
          <Button onClick={() => {
            let ethereum = window.ethereum;
            goToRightNetwork(ethereum);
          }}>Switch Network</Button>
        </Dialog.Footer>
      </Dialog>
    )
  }

  return (
    <div className={styles.container}>
      <Loading
        loading={pending && page === 0}
        style={{ position: 'fixed', top: '50%', width: 'calc(100% - 76px)', zIndex: 10000 }}
      />
      <InfiniteScroll
        dataLength={datas?.length}
        next={fetchData}
        pullDownToRefreshThreshold={50}
        hasMore={pageAble}
        height={'100%'}
        loader={<h4 className={styles.loading} style={{ textAlign: 'center' }}>Loading...</h4>}
        endMessage={
          datas?.length && <p className={styles.noData} >
            <b>Yay! You have seen it all</b>
          </p> || null
        }
      >
        <div className={styles.header}>
          <div className={styles.headerT}>
            <span className={styles.headerTitle}>Market</span>
            <div style={{fontSize: '.8rem', marginTop: '.6rem', display: 'inline-block'}}>
              <Link href={helper.nftMagic.youtube} isExternal color="#0057D9" fontStyle='italic'
                display="inline-block">
                <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.nftMagic.title}
              </Link>
              <Link href={helper.nftMagic.book} isExternal color="#0057D9" fontStyle='italic'
                display="inline-block" ml="1rem">
                <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#1d90e6'}} /> Learn NFT Magic
              </Link>
            </div>
          </div>
          <div className={styles.headerR}>
            <Select
              className={`${styles.selectType} ${styleSelectContainer}`}
              value={category}
              placeholder='please choose'
              onChange={(value) => {
                setCategory(value);
              }}
            >
              {categoryList?.map((el) => (
                <Select.Option key={el} label={el} value={el} />
              ))}
            </Select>
            <Select
              value={sortTag}
              className={`${styles.selectType} ${styleSelectContainer}`}
              placeholder='please choose'
              onChange={(value) => {
                setSortTag(value);
                if (value.includes('price')) {
                  // setSortTag('price');
                  setSortOrder(value.split('-')[0]);
                } else {
                  setSortTag(value);
                }
              }}
            >
              {sortTagType.map((el) => (
                <Select.Option key={el.value} label={el.label} value={el.value} />
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.ArtContainer}>
          <div className={`${styles.contentBox} ${stylesContentBoxScreen}`} ref={domRef}>
            {datas?.length > 0
              ? datas?.map((item, index) =>  renderCard(item, index))
              : renderNoData}
          </div>
        </div>
      </InfiniteScroll>
      {renderShowSwitchModal()}
    </div>
  );
};
const mapStateToProps = ({ profile, market }) => ({
  token: profile.token,
  datas: market.datas,
  pageAble: market.pageAble,
  categoryList: market.category,
  pending: market.pending,
  address: profile.address
});
export default withRouter(connect(mapStateToProps)(Market));
const styleNoDataContainer = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  padding: 2rem 0;
  color: #233a7d;
  span {
    margin-top: 20px;
  }
`;
const stylesContentBoxScreen = css`
  grid-template-columns: repeat(5,  minmax(250px, 1fr));
  @media (max-width: 1650px) {
    grid-template-columns: repeat(auto-fill,  minmax(250px, 1fr));
  }
`;
const styleSelectContainer = css`
  .el-select .el-input .el-input__icon {
    color: #777E90;
  }
  .el-icon-caret-top:before {
    content: \e603;
  }
  .el-input__inner {
    border: 1px solid #DDDDDD;
    color: #AAAAAA;
    border-radius: 10px;
    background: transparent;
    height: 40px;
    font-family: Archivo Black;

  }
  .el-select-dropdown__item {
    color: #888888;
    font-family: Archivo Black;
  }
  
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover, .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background: #DDDDDD;
  }
  .el-select-dropdown__item.selected {
    color: #FFFFFF; 
    font-family: Archivo Black;
    background: #417ED9;
  }
`;
const styleSwitchModal = css`
  @media (max-width: 900px) {
    width: calc(100% - 32px);
  }
  border-radius: 10px;
  width: 400px;
  padding: 40px 30px 30px 30px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    font-family: Archivo Black;
    color: #000000;
    font-size: 18px;
    line-height: 30px;
    span {
      display: flex;
      text-align: center;
    }
  }
  .dialog-footer {
    padding: 0;
    text-align: center;
    margin-top: 16px;
    button {
      background: rgba(0, 87, 217, 1);
      color: #FCFCFD;
      font-size: 16px;
      border-radius: 10px;
      font-family: Archivo Black;
      padding: 18px 24px;
    }
  }
`