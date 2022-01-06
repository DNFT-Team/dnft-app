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
import SwitchModal from 'components/SwitchModal';
import { getWallet } from 'utils/get-wallet';
import Title from 'components/Title'
const Market = (props) => {
  let history = useHistory();
  const { dispatch, token, datas, pageAble, categoryList, pending, location, address } = props;
  const categoryBack = location?.state?.category;
  const sortTagBack = location?.state?.sortTag;
  const [category, setCategory] = useState(categoryBack || 'All');
  const [sortTag, setSortTag] = useState(sortTagBack || 'save_count');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [isShowSwitchModal, setIsShowSwitchModal] = useState(false);

  const domRef = useRef(null);
  const sortTagType = [
    { label: 'Most Likes', value: 'save_count' },
    { label: 'Price: High to Low', value: 'DESC-price' },
    { label: 'Price: Low to High', value: 'ASC-price' },
  ];

  const currentNetEnv = globalConfig.net_env;
  const rightChainId =  currentNetEnv === 'testnet' ? 97 : 56;
  const right16ChainId =  currentNetEnv === 'testnet' ? '0x61' : '0x38';
  const rightRpcUrl = currentNetEnv === 'testnet' ? ['https://data-seed-prebsc-1-s1.binance.org:8545/'] : ['https://bsc-dataseed.binance.org/'];

  useEffect(() => {
    if (token) {
      let _sortTag = sortTag
      if (sortTag?.includes('price')) {
        _sortTag = 'total_price'
      }
      fetchData(true);
    }
  }, [token, category, sortTag, address]);
  let reachBottom = domRef?.current?.getBoundingClientRect()?.bottom;

  const fetchData =  (tag) => {
    let _sortTag = sortTag
    if (sortTag?.includes('price')) {
      _sortTag = 'total_price'
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
  // useEffect(() => {
  //   if (pageAble && datas?.length > 0) {
  //     fetchData()
  //   }
  // }, [pageAble, datas?.length, category, sortTag, address])

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
  const handleMore = () => {
    fetchData()
  }
  const goToRightNetwork = useCallback(async () => {
    const ethereum = window.ethereum;
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
    let wallet = getWallet();

    if (wallet) {
      if (
        (Number(wallet.networkVersion || wallet.chainId) !== rightChainId) &&
        history.location.pathname === '/market'
      ) {
        setIsShowSwitchModal(true);
      }
    }
  }, [window.onto, window.walletProvider, window.ethereum, address]);

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
      >
        <div className={styles.header}>
          <Title title='Market' linkHelper={{
            youtubeLink: helper.nftMagic.youtube,
            youtubeTitle: helper.nftMagic.title,
            bookLink: helper.nftMagic.book,
            bookTitle: 'Mechanism'
          }} />
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
        {
          pageAble && <div className={stylesNextPage} >
            <Button onClick={handleMore} loading={pending}>{pending ? 'Loading' : 'Next page'}</Button>
          </div>
        }
      </InfiniteScroll>
      <SwitchModal visible={isShowSwitchModal} networkName={'BSC'} goToRightNetwork={goToRightNetwork} onClose={() => {
        setIsShowSwitchModal(false)
      }} />
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
  .el-select-dropdown__list {
    padding: 0;
    border-radius: 10px;
    overflow: hidden;
  }
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
  ..el-select-dropdown__item {
    height: 40px;
  }
  .el-input__inner:hover {
    color: #888;
    border: 1px solid #aaa;

  }
  .el-select-dropdown__item {
    color: #888888;
    font-family: Archivo Black;
  }
  .el-select-dropdown {
    left: 0!important;
    border-radius: 10px;

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
const stylesNextPage = css`
  display: flex;
  justify-content: center;
  .el-button {
    border: 0;
    background: transparent;
    font-family: Helvetica;
    //font-style: italic;
    font-weight: normal;
    font-size: 14px;
    line-height: 15px;
    color: #0057D9;
  }
  .el-button.is-loading:before {
    background: transparent;

  }
`