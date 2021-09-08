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
  const { dispatch, token, datas, pending, location } = props;
  const categoryBack = location?.state?.category;
  const sortTagBack = location?.state?.sortTag;

  const [category, setCategory] = useState(categoryBack || 'ALL');
  const [sortTag, setSortTag] = useState(sortTagBack || 'likeCount');
  const [sortOrder, setSortOrder] = useState('ASC');

  const cateType = [
    { label: 'All', value: 'ALL' },
    { label: 'Latest', value: 'LASTED' },
    { label: 'Virtual reality', value: 'VIRTUAL_REALITY' },
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
      dispatch(
        getMarketList(
          {
            category: category,
            sortOrder: sortOrder,
            sortTag: sortTag,
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
    console.log(item,'item');
    history.push('/market/detail',{item,category,sortTag})
  }
  const renderCard = useCallback(
    (item, index) => <NFTCard key={index} item={item} index={index} needAction={true} clickDetail={() => clickDetail(item)} />,
    [category, sortTag]
  );
  console.log(datas, 'datas');
  return (
    <div className={styles.container}>
      {/* <SoonModal /> */}
      <div className={styles.header}>
        <span className={styles.headerT}>
          Market
          {/* /Coming Soon */}
        </span>
        <div className={styles.headerR}>
          <Select
            style={{ marginRight: 20 }}
            value={category}
            placeholder='请选择'
            onChange={(value) => {
              setCategory(value);
            }}
          >
            {cateType.map((el) => (
              <Select.Option key={el.value} label={el.label} value={el.value} />
            ))}
          </Select>
          <Select
            value={sortTag}
            placeholder='please choose'
            onChange={(value) => {
              if (value.includes('price')) {
                setSortTag('price');
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
          style={{ position: 'absolute', top: '50%', width: 'calc(100% - 76px)' }}
        />
        <div className={styles.content1} style={{ opacity: pending ? 0.5 : 1 }}>
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
  pending: market.pending,
});
export default withRouter(connect(mapStateToProps)(Market));
const styleNoDataContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  color: #233a7d;
  span {
    margin-top: 20px;
  }
`;