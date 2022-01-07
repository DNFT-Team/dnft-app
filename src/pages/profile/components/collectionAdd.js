import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { css, cx } from 'emotion';
import CreateCollectionModal from 'components/CreateCollectionModal';
import {
  getMyProfileBatch,
} from 'reduxs/actions/profile';
import add from 'images/profile/add.png';

const CollectionAdd = (props) => {
  const {
    address,
    dispatch,
    token,
    chainType,
    style  = {},
    handleCollect,
  } = props;
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const getCollectionNftList = () => {
    dispatch(
      getMyProfileBatch(
        {
          address,
          page: 0,
          size: 100,
          sortOrder: 'ASC',
          sortTag: 'createTime',
        },
        token
      )
    );
  }
  return (
    <>
      <div style={style}  className={styleCardContainer}>
        <img src={add} />
        <div onClick={() => setShowCreateCollection(true)} >Create Collection</div>
      </div>
      {showCreateCollection && (
        <CreateCollectionModal
          formDs={{ chainType }}
          token={token}
          isProfile
          isNew={true}
          onSuccess={(res) => {
            setShowCreateCollection(false);
            getCollectionNftList();
          }}
          onClose={() => {
            setShowCreateCollection(false);
          }}
        />
      )}
    </>
  )
}
const mapStateToProps = ({ profile }) => ({
  datas: profile.datas,
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
  batch: profile.batch,
  owned: profile.owned,
  created: profile.created,
});
export default withRouter(connect(mapStateToProps)(CollectionAdd));

const styleCardContainer = css`
  background: #ffffff;
  border-radius: 10px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  flex: 1;
  min-width: 300px;
  padding: 6px;
  @media (max-width: 992px) {
    margin: 0 auto;
  }
  &:hover {
    background: white;
    position: relative;
    top: -10px;
  }
  img {
    width: 84px;
    height: 84px;
    margin: 124px 0;
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