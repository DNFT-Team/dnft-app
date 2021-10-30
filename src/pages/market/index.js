import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import styles from './index.less';
import { css, cx } from 'emotion';
import NFTCard from './component/item';
import { noDataSvg } from 'utils/svg';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, Loading } from 'element-react';
import { getMarketList } from 'reduxs/actions/market';
import helper from '../../config/helper';
import { Icon } from '@iconify/react';
import { Link } from '@chakra-ui/react';

const Market = (props) => {
  let history = useHistory();
  const { dispatch, token, datas, pageAble, categoryList, pending, location, address } = props;
  const categoryBack = location?.state?.category;
  const sortTagBack = location?.state?.sortTag;
  const [category, setCategory] = useState(categoryBack || 'All');
  const [sortTag, setSortTag] = useState(sortTagBack || 'like_count');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const domRef = useRef(null);
  const sortTagType = [
    { label: 'Most popular', value: 'like_count' },
    { label: 'Price:high to low', value: 'ASC-price' },
    { label: 'Price:low to high', value: 'DESC-price' },
  ];

  useEffect(() => {
    if (token) {
      let _sortTag = sortTag
      if (sortTag?.includes('price')) {
        _sortTag = 'price'
      }
      fetchData(true);
    }
  }, [token, category, sortTag, address]);
  let reachBottom = domRef?.current?.getBoundingClientRect()?.bottom;

  const fetchData =  (tag) => {
    let _sortTag = sortTag
    if (sortTag?.includes('price')) {
      _sortTag = 'price'
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
    if (reachBottom <= window.innerHeight && pageAble && datas?.length > 0) {
      fetchData()
    }
  }, [reachBottom, pageAble, datas?.length, category, sortTag, address])

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
  const renderCard = useCallback(
    (item, index) => <NFTCard key={item.id} item={item} index={index} needAction clickDetail={() => {
      clickDetail(item);
    }} />,
    [category, sortTag]
  );
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerT}>
          <span className={styles.headerTitle}>Market</span>
          <div style={{fontSize: '.8rem', marginTop: '.6rem', display: 'inline-block'}}>
            <Link href={helper.nftMagic.youtube} isExternal color="#75819A"
              display="inline-block">
              <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.nftMagic.title}
            </Link>
            <Link href={helper.nftMagic.book} isExternal color="#75819A"
              display="inline-block" ml="1rem">
              <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#1d90e6'}} /> Learn NFT Magic
            </Link>
          </div>
        </div>
        <div className={styles.headerR}>
          <Select
            className={styles.selectType}
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
            className={styles.selectType}
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
        <Loading
          loading={pending && page === 0}
          style={{ position: 'fixed', top: '50%', width: 'calc(100% - 76px)', zIndex: 10000 }}
        />
        <InfiniteScroll
          dataLength={datas?.length}
          next={fetchData}
          hasMore={pageAble}
          height={600}
          loader={<h4 className={styles.loading} style={{ textAlign: 'center' }}>Loading...</h4>}
          endMessage={
            <p className={styles.noData} >
              <b>Yay! You have seen it all</b>
            </p >
          }
        >
          <div className={styles.contentBox} ref={domRef}>
            {datas?.length > 0
              ? datas?.map((item, index) =>  renderCard(item, index))
              : renderNoData}
          </div>
        </InfiniteScroll>
      </div>
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
