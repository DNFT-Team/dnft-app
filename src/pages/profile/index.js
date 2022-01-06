import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './index.less';
import copyImg from 'images/profile/copy.png';
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
import { noDataSvg } from 'utils/svg';
import NFTCollectionsCard from './components/collectionsCard';
import NFTCard from 'components/NFTCard';
import edit_bg from 'images/profile/edit_bg.png';
import edit_avatar from 'images/profile/edit_avatar.png';
import ins from 'images/profile/ins.png';
import twitter from 'images/profile/twitter.png';
import { post } from 'utils/request';
import { ipfs_post } from 'utils/ipfs-request';
import { toast } from 'react-toastify';
import { Box } from '@chakra-ui/react'

import ProfileEditScreen from './edit';
import globalConf from 'config/index';
import camera from 'images/profile/camera.png';
import youtube from 'images/profile/youtube.png';
import CropperBox from 'components/CropperBox';

import u_twitter from 'images/profile/u_twitter.png';
import u_youtube from 'images/profile/u_youtube.png';
import u_ins from 'images/profile/u_ins.png';
import CollectionAdd from './components/collectionAdd';
import ChangeBg from './changeBg';
import { shortenAddress } from 'utils/tools';
import SharePopover from 'components/SharePopover';

const ProfileScreen = (props) => {
  const { dispatch, address, datas, token, batch, owned, created, location } = props;
  const state = location?.state;
  const readUrl = datas?.avatorUrl
  const nullFlag = !readUrl || readUrl.indexOf('undefined') > -1 || readUrl.indexOf('null') > -1
  const avatarShow = nullFlag ? camera : readUrl;
  const tabArray = ['Collections', 'Owned', 'Created'];
  const [selectedTab, setSelectedTab] = useState('Collections');
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [showBgScreen, setShowBgScreen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  let _newAddress = location?.pathname?.split('/') || [];
  _newAddress = _newAddress[_newAddress.length - 1]
  const [newAddress, setNewAddress] = useState(_newAddress);
  const [srcCropper, setSrcCropper] = useState('');
  const [visible, setVisible] = useState(false)
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
            page: 0,
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
  function isUrl (url) {
    return /^https?:\/\/.+/.test(url)
  }
  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
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
            newAddress={newAddress}
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
            handleDetail={() => {
              history.push('/asset/detail', {item})
            }}
          />
        );
      }
    },
    [selectedTab, newAddress]
  );
  const uploadFile = async (dataUrl, file) => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);
      const data  = await ipfs_post('/v0/add', fileData);
      const ipfsHash = data?.data?.['Hash']

      if (!ipfsHash) {
        toast.error('IPFS upload failed!');
        return
      }
      if (ipfsHash) {
        toast.success('IPFS Upload Success', {
          position: toast.POSITION.TOP_CENTER,
        });
        const data1 = await post(
          '/api/v1/users/updateUserBanner',
          {
            address: newAddress,
            bannerUrl: globalConf.ipfsDown + ipfsHash,
          },
          token,
        );
        data1 &&  toast.success('User Banner Update Success', {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(getMyProfileList({userId: newAddress}, token));
      }
      setShowBgScreen(false)
    } catch (e) {
      console.log(e, 'e');
    }
  }

  const cropperBtn = (dataUrl, file) => {
    setVisible(false)
    uploadFile(dataUrl, file)
  }

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <Box
          style={{
            background: `#b7b7b7 center center / cover no-repeat url(${datas?.bannerUrl})`,
          }}
          className={styles.header}>
          {
            newAddress === address &&
            <Box display={['none', 'none', 'flex']}>
              <div onClick={() => setShowBgScreen(true)} className={styles.edit_bg_header}><span className={styles.edit_bg_span}>Change Background</span><img className={styles.edit_bg_img} src={edit_bg} /></div>
              <SharePopover datas={datas} />
            </Box>
          }
        </Box>
        <div className={styles.profile}>
          <Box display={['none', 'none', 'flex', 'flex'] }>
            <div className={styles.profile_avatar}>
              <img className={styles.authorImg} src={avatarShow} alt=""/>
              {
                newAddress === address &&
                <div onClick={() => setShowEditScreen(true)} className={styles.edit_avatar}>
                  <img className={styles.edit_avatar_img} src={edit_avatar} alt=""/>
                </div>
              }
            </div>
          </Box>
          <Box display={['flex', 'flex', 'none', 'none'] } className={styles.profile_avatar} style={{width: '80px',height: '80px'}}>
            <img className={styles.authorImg} src={avatarShow} alt=""/>
          </Box>
          <div className={styles.authorName}>{datas?.nickName || 'Unknown'}</div>
          <div className={styles.addressBox}>{newAddress && shortenAddress(newAddress)}
            <img
              className={styles.copyAddress}
              onClick={handleCopyAddress}
              src={copyImg}
            />
          </div>
          <div className={styles.contact}>
            <a style={{
              pointerEvents: !isUrl(datas?.twitterAddress) && 'none'
            }} href={datas?.twitterAddress} target='_blank' rel="noopener noreferrer">
              <img className={styles.contact_img} src={isUrl(datas?.twitterAddress) ? twitter : u_twitter} />
            </a>
            <a style={{
              pointerEvents: !isUrl(datas?.facebookAddress) && 'none'
            }} href={datas?.facebookAddress} target='_blank' rel="noopener noreferrer">
              <img className={styles.contact_img} src={isUrl(datas?.facebookAddress) ? ins : u_ins} />
            </a>
            <a style={{
              pointerEvents: !isUrl(datas?.youtubeAddress) && 'none'
            }}  href={datas?.youtubeAddress} target='_blank' rel="noopener noreferrer">
              <img style={{width: 28}} className={styles.contact_img} src={isUrl(datas?.youtubeAddress) ? youtube : u_youtube} />
            </a>
          </div>
        </div>
        {/* DATA */}
        <div className={styles.tabs}>{renderTabList}</div>
        <div className={renderAction(selectedTab)?.length > 0 ? selectedTab === 'Collections' ? styleCollections : styleCardList : styleCardListEmpty}>
          {renderAction(selectedTab)?.length > 0
            ? renderAction(selectedTab)?.map((item, index) => (
              renderCard(item, index)
            ))
            : selectedTab !== 'Collections' && renderNoData}
          {
            selectedTab === 'Collections' && address === newAddress &&
            <CollectionAdd />
          }
        </div>
      </div>
      <ChangeBg
        visible={showBgScreen}
        onSuccess={() => setShowBgScreen(false)}
        newAddress={newAddress}
        datas={datas}
        onOpen={() => {
          setShowBgScreen(true);
        }}
        onClose={() => {
          setShowBgScreen(false);
        }}
      />
      <ProfileEditScreen
        datas={datas}
        visible={showEditScreen}
        onSuccess={() => {
          setShowEditScreen(false);
          getProfileInfo()
        }}
        onOpen={() => {
          setShowEditScreen(true);
        }}
        onClose={() => {
          setShowEditScreen(false);
        }}
      />
      <CropperBox
        srcCropper={srcCropper}
        onCloseModal={() => {
          setVisible(false);
        }}
        tip='banner'
        visible={visible}
        aspectRatio={1800 / 300}
        cropperBtn={cropperBtn}
      />
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
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #DDDDDD;
  margin-right: 30px;
  color: #AAAAAA;
  font-family: Archivo Black;
`;

const styleActiveTabButton = css`
  border: 1px solid #417ED9;
  color: #FFFFFF;
  background: #417ED9;
`;

const styleCardList = css`
  display: grid;
  gap: 20px 19px;
  grid-template-columns: repeat(5,  minmax(250px, 1fr));
    @media (max-width: 1650px) {
      grid-template-columns: repeat(auto-fill,  minmax(250px, 1fr));
    }
`;
const styleCollections = css`
  display: grid;
  gap: 20px 19px;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
`;
const styleCardListEmpty = css`
  display: grid;
  gap: 20px 19px;
  // grid-template-columns: repeat(auto-fill);
 
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
