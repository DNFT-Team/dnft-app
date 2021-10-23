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
import CreateCollectionModal from 'components/CreateCollectionModal';

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
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  useEffect(() => {
    getCollectionNftList()
  },[token])
  const getCollectionNftList = async () => {
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

      }catch(e) {
        setIsLoading(true)
      }
    }
  }

  const renderCard = useCallback(
    (item, index) => (
      <NFTCard
        item={item}
        index={index}
        currentStatus={''}
      />
    ),
    []
  );
  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
        {/* <span>No content</span> */}
      </div>
    ),
    []
  );
  return (
    <div className={styleCardContainer}>
      <header className={styleCardHeaderBox}>
        <div className={styleCardHeader}>
          <h4>{list?.[0]?.collectionName}</h4>
          <div>{list?.[0]?.collectionDesc}</div>
        </div>
        <div
          className={styleEditCollection}
          onClick={() => {
            setShowCreateCollection(true)
          }}
        >
          Edit Collection
        </div>
      </header>
      <div className={styleInfoContainer}>
        {list?.length > 0
          ? list.map((item, index) => renderCard(item, index))
          : renderNoData}
      </div>
      {isLoading && <div className={styleLoadingIconContainer}>
        <img src={LoadingIcon}/>
      </div>}
      {showCreateCollection && (
        <CreateCollectionModal
          formDs={{ name: list?.[0]?.collectionName, description: list?.[0]?.collectionDesc, id: state?.item.id, chainType: state?.item.chainType }}
          token={token}
          isNew={false}
          isProfile
          onSuccess={(res) => {
            setShowCreateCollection(false);
            getCollectionNftList();
          }}
          onClose={() => {
            setShowCreateCollection(false);
          }}
        />
      )}
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
const styleCardHeaderBox = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: 30px 16px;
  margin-top: 20px;
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const styleEditCollection = css`
  background-color: #112df2;
  color: white;
  padding: 14px 18px;
  font-size: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  @media (max-width: 900px) {
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    margin-top: 20px;
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

