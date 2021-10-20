import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import styles from './index.less';
import copyImg from 'images/profile/copy.png';
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
import NFTCollectionsCard from './card';
import NFTCard from 'components/NFTCard';
import edit_bg from 'images/profile/edit_bg.png';
import share_bg from 'images/profile/share.svg';
import edit_avatar from 'images/profile/edit_avatar.png';
import ins from 'images/profile/ins.png';
import twitter from 'images/profile/twitter.png';
import { Upload, Popover } from 'element-react';
import { Tooltip } from '@chakra-ui/react';
import { post } from 'utils/request';
import { ipfs_post } from 'utils/ipfs-request';
import { toast } from 'react-toastify';
import ProfileEditScreen from './edit';
import globalConf from 'config/index';
import camera from 'images/profile/camera.png';
import youtube from 'images/profile/youtube.svg';

import {
  TelegramShareButton,
  TwitterShareButton,
  FacebookShareButton
} from 'react-share';

const ProfileScreen = (props) => {
  const { dispatch, address, datas, token, batch, owned, created, location } = props;
  const state = location?.state;
  const readUrl = datas?.avatorUrl
  const nullFlag = !readUrl || readUrl.indexOf('undefined') > -1 || readUrl.indexOf('null') > -1
  const avatarShow = nullFlag ? camera : readUrl;
  const tabArray = ['Collections', 'Owned', 'Created'];
  const [selectedTab, setSelectedTab] = useState('Collections');
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  let _newAddress = location?.pathname?.split('/') || [];
  _newAddress = _newAddress[_newAddress.length - 1]
  const [newAddress, setNewAddress] = useState(_newAddress);

  let history = useHistory();
  useEffect(() => {
    if (address === newAddress || state) {
      setIsOwner(true)
    }
  }, [address, state])
  useEffect(() => {
    if (isOwner) {
      setNewAddress(address)
      history.push(address);
    }
  }, [address, _newAddress, isOwner])
  useEffect(() => {
    if (token) {
      getProfileInfo();
      dispatch(
        getMyProfileBatch(
          {
            address: newAddress,
            page: 1,
            size: 100,
            sortOrder: 'ASC',
            sortTag: 'createTime',
          },
          token
        )
      );
      dispatch(getMyProfileCreated({ address, page: 0, size: 100 }, token));
      dispatch(getMyProfileOwned({ address, page: 0, size: 100 }, token));
    }
  }, [token, newAddress]);

  const getProfileInfo = () => {
    dispatch(getMyProfileList({userId: newAddress}, token));
  }
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
            sortOrder: 'ASC',
            sortTag: 'createTime',
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
    [selectedTab, newAddress]
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
      if (selectedTab === 'Collections') {
        return (
          <NFTCollectionsCard
            key={`${item.id}_${selectedTab}`}
            item={item}
            index={index}
          />
        );
      } else {
        return (
          <NFTCard
            key={`${item.id}_${selectedTab}`}
            item={item}
            index={index}
            needAction
            isProfile
            currentStatus={selectedTab}
            newAddress={newAddress}
          />
        );
      }
    },
    [selectedTab, newAddress]
  );
  const uploadFile = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);
      const data  = await ipfs_post('/v0/add', fileData);
      if (data?.data?.Hash) {
        const data1 = await post(
          '/api/v1/users/updateUserBanner',
          {
            address: newAddress,
            bannerUrl: globalConf.ipfsDown + data?.data?.Hash,
          },
          token,
        );
        dispatch(getMyProfileList({userId: newAddress}, token));
      } else {
        toast.error(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (e) {
      console.log(e, 'e');
    }
  }
  const shareUrl = window.location.href
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div
          style={{
            background: `#b7b7b7 center center / cover no-repeat url(${datas?.bannerUrl})`,
          }}
          className={styles.header}>
          {
            newAddress === address &&
            <React.Fragment>
              <Upload
                className="upload-demo"
                multiple={false}
                showFileList={false}
                accept={'.png,.gif,.jpeg,.jpg,.svg'}
                action=""
                httpRequest={(e) => {uploadFile(e.file)}}
                listType="picture"
              >
                <Tooltip label="1657*236" hasArrow bg="red.600">
                  <div className={styles.edit_bg_header}><span className={styles.edit_bg_span}>Change Background</span><img className={styles.edit_bg_img} src={edit_bg} /></div>
                </Tooltip>
              </Upload>
              <Popover placement="bottom" width="220" trigger="hover" content={(
                <div className={styles.shareBox}>
                  <div className={styles.shareItem}>
                    <Icon className={styles.shareIcon} icon="uil:link" style={{background: '#E6E8EC'}} onClick={() => {
                      copy(`DNFT_Share | ${shareUrl}`);
                      toast.success('The link is copied successfully!', {
                        position: toast.POSITION.TOP_CENTER,
                      });
                    }
                    }/>
                    <label>Link</label>
                  </div>
                  <TelegramShareButton className={styles.shareItem} title='DNFT_Share' url={shareUrl}>
                    <Icon className={styles.shareIcon} icon="uil:telegram" style={{background: '#e8eeff', color: '#233a7d'}}/>
                    <label>Telegram</label>
                  </TelegramShareButton>
                  <TwitterShareButton className={styles.shareItem}
                    title={`Share@User(${datas?.nickName || '*'})`} url={shareUrl}
                    via="DNFTProtocol" hashtags={['NFT']}>
                    <Icon className={styles.shareIcon} icon="uil:twitter" style={{background: 'rgba(29, 155, 240, 0.1)', color: '#1D9BF0'}}/>
                    <label>Twitter</label>
                  </TwitterShareButton>
                  <FacebookShareButton className={styles.shareItem} hashtag="#NFT" quote={`DNFT_Share@User(${datas?.nickName || '*'})`} url={shareUrl}>
                    <Icon className={styles.shareIcon} icon="uil:facebook" style={{background: '#e8eeff', color: '#233a7d'}}/>
                    <label>Facebook</label>
                  </FacebookShareButton>
                </div>
              )}>
                <div className={styles.share_bg_header}><span className={styles.edit_bg_span}>Share</span><img className={styles.edit_bg_img} src={share_bg} /></div>
              </Popover>
            </React.Fragment>
          }
        </div>
        <div className={styles.profile}>
          <div className={styles.profile_avatar}>
            <img className={styles.authorImg} src={avatarShow} alt=""/>
            {
              newAddress === address &&
              <div onClick={() => setShowEditScreen(true)} className={styles.edit_avatar}>
                <img className={styles.edit_avatar_img} src={edit_avatar} alt=""/>
              </div>
            }
          </div>
          <div className={styles.authorName}>{datas?.nickName}</div>
          <div className={styles.addressBox}>{newAddress && `${newAddress?.slice(0, 8)}...${newAddress?.slice(38)}`}
            <img
              className={styles.copyAddress}
              onClick={handleCopyAddress}
              src={copyImg}
            />
          </div>
          <div className={styles.contact}>
            <a href={datas?.twitterAddress} target='_blank' rel="noopener noreferrer">
              <img className={styles.contact_img} src={twitter} />
            </a>
            <a href={datas?.facebookAddress} target='_blank' rel="noopener noreferrer">
              <img className={styles.contact_img} src={ins} />
            </a>
            <a href={datas?.youtubeAddress} target='_blank' rel="noopener noreferrer">
              <img style={{width: 22, height: 22}} className={styles.contact_img} src={youtube} />
            </a>
          </div>
        </div>
        {/* DATA */}
        <div className={styles.tabs}>{renderTabList}</div>
        <div className={renderAction(selectedTab)?.length > 0 ? styleCardList : styleCardListEmpty}>
          {renderAction(selectedTab)?.length > 0
            ? renderAction(selectedTab)?.map((item, index) => (
              renderCard(item, index)
            ))
            : renderNoData}
        </div>
      </div>
      {showEditScreen && (
        <ProfileEditScreen
          datas={datas}
          onSuccess={(res) => {
            setShowEditScreen(false);
            getProfileInfo();
          }}
          onClose={() => {
            setShowEditScreen(false);
          }}
        />
      )}
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
  height: 38px;
  box-sizing: border-box;
  color: #777E90;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #E6E8EC;
  margin-right: 20px;
`;

const styleActiveTabButton = css`
  background: #112DF2;
  border: 1px solid #112DF2;
  color: white;
`;

const styleCardList = css`
  display: grid;
  gap: 20px 19px;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));

`;
const styleCardListEmpty = css`
  display: grid;
  gap: 20px 19px;
  grid-template-columns: repeat(auto-fill);

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
