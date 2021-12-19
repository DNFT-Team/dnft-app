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
import add from 'images/profile/add.png';
import CreateNFTModal from '../asset/create/index';

import { get, post } from 'utils/request';

const CollectionScreen = (props) => {
  const {
    address,
    location: {state},
    dispatch,
    token
  } = props;
  const [list, setList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showCreateNft, setShowCreateNft] = useState(false);

  useEffect(() => {
    getCollectionNftList()
  }, [token])
  const getCollectionNftList = async () => {
    if (token) {
      try {
        setIsLoading(true)
        const { data } = await get(
          `/api/v1/collection/detail/${state?.item?.id}`,
          '',
          token
        );
        setList(data?.data)
        setIsLoading(false)

      } catch (e) {
        setIsLoading(true)
      }
    }
  }

  const renderCard = useCallback(
    (item, index) => (
      <NFTCard
        item={item}
        index={index}
        fromCollection={true}
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
  console.log(state,'state')
  return (
    <div className={styleCardContainer}>
      <header className={styleCardHeaderBox}>
        <div className={styleCardHeader}>
          <h4>{list?.name}</h4>
          <div>{list?.collectionDesc}</div>
        </div>
        {
          address === state?.newAddress &&
          <div
            className={styleEditCollection}
            onClick={() => {
              setShowCreateCollection(true)
            }}
          >
            Edit Collection
          </div>
        }
      </header>
      <div className={styleInfoContainer}>
        {list?.content?.length > 0
          ? list.content.map((item, index) => renderCard(item, index))
          : null}
        <div className={styleCardContainerNFT}>
          <img src={add} />
          <div onClick={() => setShowCreateNft(true)} >Create NFT</div>
        </div>
      </div>
      {isLoading && <div className={styleLoadingIconContainer}>
        <img src={LoadingIcon} alt=""/>
      </div>}
      {showCreateCollection && (
        <CreateCollectionModal
          formDs={{ name: list?.name, description: list?.collectionDesc, id: state?.item.id, chainType: state?.item.chainType }}
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
      {showCreateNft && <CreateNFTModal collectionId={state?.item?.id} onClose={(isCreate) => {
        if (isCreate) {
          getCollectionNftList();
        }
        setShowCreateNft(false);
      }}/>}
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
  width: 100%;
  height: 100%;
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
  padding: 50px;

`;
const styleCardHeaderBox = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;
const styleCardHeader = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h4 {
    font-family: Archivo Black;
    font-style: normal;
    font-weight: normal;
    font-size: 36px;
    line-height: 36px;
    color: #000000;
    margin: 0;
    margin-bottom: 20px;
  }
  div {
    font-family: Helvetica;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #888888;
  }
`;

const styleInfoContainer = css`
  margin-top:30px;
  display: grid;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 30px 16px;
  grid-template-columns: repeat(5,  minmax(250px, 1fr));
  @media (max-width: 1650px) {
    grid-template-columns: repeat(auto-fill,  minmax(250px, 1fr));
  }
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const styleEditCollection = css`
  padding: 0px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  height: 40px;
  background: #0057D9;
  border-radius: 10px;
  font-family: Archivo Black;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  color: #FFFFFF;
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
const styleCardContainerNFT = css`
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  flex: 1;
  margin: 0 .6rem;
  width: calc(100% - 1.2rem);

  img {
    width: 84px;
    height: 84px;
    margin: 113px 0;
  }
  div {
    width: 181px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #0057D9;
    border-radius: 10px;
    font-family: Archivo Black;
    font-size: 14px;
    text-align: center;
    color: #FCFCFD;
    cursor: pointer;
  }
`;
