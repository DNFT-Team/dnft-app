import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './index.less';
import { css, cx } from 'emotion';
import NFTCard from './component/item';
import { noDataSvg } from 'utils/svg';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, Loading } from 'element-react';
import { getMarketList } from 'reduxs/actions/market';
import { toast } from 'react-toastify';
import helper from '../../config/helper';
import { Icon } from '@iconify/react';
import { Link } from '@chakra-ui/react';

const Market = (props) => {
  let history = useHistory();
  const { dispatch, token, datas, categoryList, pending, location, address } = props;
  const categoryBack = location?.state?.category;
  const sortTagBack = location?.state?.sortTag;

  const [category, setCategory] = useState(categoryBack || 'All');
  const [sortTag, setSortTag] = useState(sortTagBack || 'likeCount');
  const [sortOrder, setSortOrder] = useState('ASC');

  const sortTagType = [
    { label: 'Most popular', value: 'likeCount' },
    { label: 'Price:high to low', value: 'ASC-price' },
    { label: 'Price:low to high', value: 'DESC-price' },
  ];

  useEffect(() => {
    // if(!address) {
    //   toast.warn('Please link wallet', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    //   return;
    // }
    if (token) {
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
            page: 0,
            size: 100,
          },
          token
        )
      );
    }
  }, [token, category, sortTag, address]);

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
        <div className={styles.headerT}>
          <span style={{marginRight: '1rem'}}>Market</span>
          <div style={{fontSize: '.8rem', marginTop: '.6rem', display: 'inline-block'}}>
            <Link href={helper.nftMagic.youtube} isExternal color="brand.100"
              display="inline-block">
              <Icon icon="logos:youtube-icon" style={{marginRight: '.6rem'}} /> {helper.nftMagic.title}
            </Link>
            <Link href={helper.nftMagic.book} isExternal color="brand.100"
              display="inline-block" ml="1rem">
              <Icon icon="simple-icons:gitbook" style={{marginRight: '.6rem', color: '#1d90e6'}} /> Learn NFT Magic
            </Link>
          </div>
        </div>
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
