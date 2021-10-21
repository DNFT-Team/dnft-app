import { Dialog, InputNumber, Select, Button, Loading } from 'element-react';
import { css, cx } from 'emotion';
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from  './index.less';
import noImg from 'images/common/noImg.svg'
import LoadingIcon from 'images/asset/loading.gif'
import NFTCard from '../../components/NFTCard';
import { noDataSvg } from 'utils/svg';

import { get, post } from 'utils/request';

const CollectionScreen = (props) => {
  const {
    item,
    index,
    location: {state},
    dispatch,
    token
  } = props;
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(state,'state')
  useEffect(async () => {
    if(token) {
      try {
        setIsLoading(true)
        const { data } = await get(
          `/api/v1/collection/detail/${state?.item?.id}`,
          '',
          token
        );
        setList(data?.data?.content || [])
        setIsLoading(false)

        console.log(data,'data')
      }catch(e) {
        setIsLoading(true)
      }
    }
  },[token])
  console.log(list,'list')

  const renderCard = useCallback(
    (item, index) => (
      <NFTCard
        item={item}
        index={index}
        // needAction={isTestNet}
        currentStatus={'11'}
        // onLike={getNFTList}
        // onSave={getNFTList}
        // onRefresh={(currentAddress, currentToken) =>
        //   getNFTList(currentAddress, currentToken)
        // }
      />
    ),
    []
  );
  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
        <span>No content</span>
      </div>
    ),
    []
  );
  return (
    <div className={styleCardContainer}>
      <header>
        <div className={styleCardHeader}>
          <h4>{state?.item.name}</h4>
          <div>{state?.item.description}</div>
        </div>
        {/* <div></div> */}
      </header>
      <div className={styleInfoContainer}>
        {!isLoading && list?.length > 0
          ? list.map((item, index) => renderCard(item, index))
          : renderNoData}
      </div>
      {isLoading && <div className={styleLoadingIconContainer}>
        <img src={LoadingIcon}/>
      </div>}
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(CollectionScreen));

const styleLoadingIconContainer = css`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 1000000000;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 158px;
    height: 145px;
    border-radius: 26px;
  }
`

const styleCardContainer = css`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  padding: 30px;

`;
const styleCardHeader = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 30px;
  h4 {
    font-size: 32px;
    line-height: 30px;
    margin: 15px 0;
  }
  div {
    font-size: 14px;
    line-height: 16px;
    color: #75819A;
  }
`;

const styleInfoContainer = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  gap: 30px 16px;
  margin-top: 20px;
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const styleInfo = css`
  align-items: center;
  .title {
    color: #000;
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 19px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .desc {
    color: #23262F;
    height: 32px;
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow:hidden;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }
`;

const styleNickNameContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  .dot {
    background: #45B36B;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    margin-right: 6px;
  }
`;
const styleNoDataContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  color: #233a7d;
  min-height: calc(100vh - 400px);
  span {
    margin-top: 20px;
  }
`;

