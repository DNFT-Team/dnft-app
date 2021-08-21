import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import styles from './index.less';
import copyImg from 'images/profile/copy.png';
import dnftLogo from 'images/home/dnftLogo.png';
import contact_t from 'images/profile/t.png';
import contact_m from 'images/profile/m.png';
import like from 'images/profile/like.png';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getMyProfileList,
  getMyProfileBatch,
  getMyProfileCreated,
  getMyProfileOwned,
} from 'reduxs/actions/profile';
import copy from 'copy-to-clipboard';
import { css, cx } from 'emotion';
import { nfIconSvg, noDataSvg } from 'utils/svg';
import NFTCard from './card';
import { toast } from 'react-toastify';

const ProfileScreen = (props) => {
  const { dispatch, address, token, batch, owned, created, location } = props;
  const tabArray = ['Collections', 'Owned', 'Created'];
  const [selectedTab, setSelectedTab] = useState('Collections');
  let newAddress = location?.pathname?.split('/') || [];
  newAddress = newAddress[newAddress.length - 1]
  console.log(newAddress,'newAddress')
  let history = useHistory();
  useEffect(() => {
    if (token) {
      dispatch(getMyProfileList({}, token));
      dispatch(
        getMyProfileBatch(
          {
            address: newAddress,
            page: 0,
            size: 100,
            category: 'GAME',
            sortOrder: 'ASC',
            sortTag: 'createTime',
            status: 'INWALLET',
          },
          token
        )
      );
      // dispatch(getMyProfileCreated({ address, page: 0, size: 100 }, token));
      // dispatch(getMyProfileOwned({ address, page: 0, size: 100 }, token));
    }
  }, [token]);
  const handleCopyAddress = () => {
    copy(newAddress);
    toast.success('The address is copied successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const renderActionDispatch = (item) => {
    switch (item) {
    case 'Collections':
      return dispatch(
        getMyProfileBatch(
          {
            address: newAddress,
            page: 0,
            size: 100,
            category: 'GAME',
            sortOrder: 'ASC',
            sortTag: 'createTime',
            status: 'INWALLET',
          },
          token
        )
      );
    case 'Owned':
      return dispatch(getMyProfileOwned({ address: newAddress, page: 0, size: 100 }, token));
    case 'Created':
      return dispatch(getMyProfileCreated({ address: newAddress, page: 0, size: 100 }, token));
    default:
      return null;
    }
  };
  const renderAction = (item) => {
    switch (item) {
    case 'Collections':

      return batch;
    case 'Owned':
      return owned;
    case 'Created':
      return created;
    default:
      return null;
    }
  };
  const renderTabList = useMemo(
    () =>
      tabArray.map((item) => (
        <div
          className={cx(
            styleTabButton,
            item === selectedTab && styleActiveTabButton
          )}
          onClick={() => {
            setSelectedTab(item);
            renderActionDispatch(item)
          }}
        >
          {item}
        </div>
      )),
    [selectedTab]
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
  const renderCard = useCallback(
    (item, index) => {
      console.log(item, 'item');
      return (
        <NFTCard
          key={`${item.id}_${selectedTab}`}
          item={item}
          index={index}
          needAction={true}
          currentStatus={selectedTab}
          newAddress={newAddress}
        />
      );
    },
    [selectedTab]
  );
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <div className={styles.left}>
            <img className={styles.authorImg} src={copyImg} />
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>daljj</div>
              <div className={styles.addressBox}>
                <span className={styles.address}>
                  {newAddress && `${newAddress?.slice(0, 8)}...${newAddress?.slice(28)}`}
                </span>
                <img
                  className={styles.copyAddress}
                  onClick={handleCopyAddress}
                  src={copyImg}
                />
              </div>
              <div className={styles.contactImg}>
                <a>
                  <Icon icon='ri:telegram-line' />
                </a>
                <a>
                  <Icon icon='jam:twitter-circle' />
                </a>
                <a>
                  <Icon icon='jam:medium-circle' />
                </a>
              </div>
            </div>
          </div>
          {
            newAddress === address &&
            <div className={styles.profileEdit}>
              <div
                onClick={() => history.push('/profile/edit')}
                className={styles.edit}
              >
                Edit Profile
              </div>
            </div>
          }
        </div>
        {/* DATA */}
        <div className={styles.tabs}>{renderTabList}</div>
        <div className={styleCardList}>
          {renderAction(selectedTab)?.map((item, index) => {
            console.log('index', index);
            return renderCard(item, index);
          }) ?? renderNoData}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  datas: profile.datas,
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
  batch: profile.batch,
  owned: profile.owned,
  created: profile.created,
});
export default withRouter(connect(mapStateToProps)(ProfileScreen));

const styleTabButton = css`
  height: 32px;
  color: #8588a7;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
`;

const styleActiveTabButton = css`
  background: #1b2559;
  color: white;
`;

const styleCardList = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  // height: 100%;
  margin-top: 20px;
`;

const styleModalContainer = css`
  width: 340px;
  border-radius: 40px;
  padding: 36px 32px;
  .el-dialog__headerbtn {
    color: #112df2;
    background: #f4f7fe;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    .el-dialog__close {
      transform: scale(0.6);
      color: #112df2;
    }
  }

  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__title {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__body {
    padding: 0;
    position: relative;
    top: -10px;
    color: #8f9bba;
    h1 {
      font-weight: bold;
      font-size: 28px;
      line-height: 36px;
      color: #000000;
      text-align: center;
      margin: 0;
      margin-bottom: 24px;
    }
    span {
      text-align: center;
      display: flex;
      font-size: 12px;
      line-height: 1.5;
    }
  }
`;

const styleModalActionContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;
const styleModalConfirm = css`
  background: #112df2;
  border-radius: 70px;
  color: white;
  font-size: 14px;
  width: 180px;
  height: 46px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

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
