import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './index.less';
import { css, cx } from 'emotion';
import NFTCard from './component/item';
import { noDataSvg } from 'utils/svg';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, Loading } from 'element-react';
import { getMarketList } from 'reduxs/actions/market';
const Market = (props) => {
  let history = useHistory();
  const { dispatch, token, datas, categoryList, pending, location } = props;
  const categoryBack = location?.state?.category;
  const sortTagBack = location?.state?.sortTag;

  const [category, setCategory] = useState(categoryBack || 'All');
  const [sortTag, setSortTag] = useState(sortTagBack || 'likeCount');
  const [sortOrder, setSortOrder] = useState('ASC');

  const cateType = [
    { label: 'All', value: 'ALL' },
    { label: 'Latest', value: 'LASTED' },
    { label: 'Virtual Reality', value: 'VIRTUAL_REALITY' },
    { label: 'Domain', value: 'DOMAIN' },
    { label: 'Art', value: 'ART' },
    { label: 'Cooection', value: 'COOECTION' },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Game', value: 'GAME' },
  ];
  const sortTagType = [
    { label: 'Most popular', value: 'likeCount' },
    { label: 'Price:high to low', value: 'ASC-price' },
    { label: 'Price:low to high', value: 'DESC-price' },
  ];

  useEffect(() => {
    if (token) {
      let _sortTag = sortTag
      if(sortTag?.includes('price')) {
        _sortTag = 'price'
      }
      dispatch(
        getMarketList(
          {
            category: category,
            sortOrder: sortOrder,
            sortTag: _sortTag,
            page: 0,
            size: 100,
          },
          token
        )
      );
    }
  }, [token, category, sortTag]);

  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
        <span>No content</span>
      </div>
    ),
    []
  );

  const clickDetail = (item) => {
    // if(pending) return;
    history.push('/market/detail', {item, category, sortTag})
  }
  const renderCard = useCallback(
    (item, index) => <NFTCard key={index} item={item} index={index} needAction clickDetail={() => {
      clickDetail(item);
    }} />,
    [category, sortTag]
  );
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerT}>
          Market
        </span>
        <div className={styles.headerR}>
          <Select
            // style={{ marginRight: 20 }}
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
          loading={pending}
          style={{ position: 'fixed', top: '50%', width: 'calc(100% - 76px)', zIndex: 10000 }}
        />
        <div className={styles.contentBox} style={{ opacity: pending ? 0.5 : 1 }}>
          {datas?.length > 0
            ? datas.map((item, index) =>  renderCard(item, index))
            : renderNoData}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ profile, market }) => ({
  token: profile.token,
  datas: market.datas,
  categoryList: market.category,
  pending: market.pending,
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
