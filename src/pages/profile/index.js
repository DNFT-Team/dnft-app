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
import { Box, Tab, Tabs, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
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
import BotDrawer from './components/botDrawer';

const ProfileScreen = (props) => {
  const { dispatch, address, datas, token, batch, owned, created, location } =
    props;
  const state = location?.state;
  const readUrl = datas?.avatorUrl;
  const nullFlag =
    !readUrl ||
    readUrl.indexOf('undefined') > -1 ||
    readUrl.indexOf('null') > -1;
  const avatarShow = nullFlag ? camera : readUrl;
  const [selectedTab, setSelectedTab] = useState(0);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [showBgScreen, setShowBgScreen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  let _newAddress = location?.pathname?.split('/') || [];
  _newAddress = _newAddress[_newAddress.length - 1];
  const [newAddress, setNewAddress] = useState(_newAddress);
  const [srcCropper, setSrcCropper] = useState('');
  const [visible, setVisible] = useState(false);
  const [bottomDrawerVisible, setBottomDrawerVisible] = useState(false);
  let history = useHistory();
  const shareUrl = window.location.href;
  const tabArray = [
    { label: 'Collections', value: 0 },
    { label: 'Owned', value: 1 },
    { label: 'Created', value: 2 },
  ];

  const profileAvatarSettings = {
    w: ['80px', '80px', '80px', '130px'],
    h: ['80px', '80px', '80px', '130px'],
    mt: ['-40px', '-40px', '-40px', '-67px'],
    position: 'relative',
    bg: 'white',
    borderRadius: '50%',
  };
  const contactList = [
    {
      href: datas?.twitterAddress,
      selIcon: twitter,
      unSelIcon: u_twitter,
    },
    {
      href: datas?.facebookAddress,
      selIcon: ins,
      unSelIcon: u_ins,
    },
    {
      href: datas?.youtubeAddress,
      selIcon: youtube,
      unSelIcon: u_youtube,
      style: { width: 28 },
    },
  ];
  useEffect(() => {
    if (address === newAddress || state) {
      setIsOwner(true);
    }
  }, [address, state]);
  useEffect(() => {
    if (isOwner) {
      setNewAddress(address);
      history.push(address);
    }
  }, [address, _newAddress, isOwner]);
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
    dispatch(getMyProfileList({ userId: newAddress }, token));
  };
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
      return dispatch(
        getMyProfileOwned({ address: newAddress, page: 0, size: 100 }, token)
      );
    case 'Created':
      return dispatch(
        getMyProfileCreated(
          { address: newAddress, page: 0, size: 100 },
          token
        )
      );
    default:
      return null;
    }
  };
  const renderAction = (item) => {
    switch (item) {
    case 0:
      return batch;
    case 1:
      return owned;
    case 2:
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
            renderActionDispatch(item);
          }}
        >
          {item}
        </div>
      )),
    [selectedTab, newAddress]
  );
  function isUrl (url) {
    return /^https?:\/\/.+/.test(url);
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
      if (selectedTab == 0) {
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
              history.push('/asset/detail', { item });
            }}
          />
        );
      }
    },
    [selectedTab,batch,owned,created, newAddress]
  );
  const uploadFile = async (dataUrl, file) => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);
      const data = await ipfs_post('/v0/add', fileData);
      const ipfsHash = data?.data?.['Hash'];

      if (!ipfsHash) {
        toast.error('IPFS upload failed!');
        return;
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
          token
        );
        data1 &&
          toast.success('User Banner Update Success', {
            position: toast.POSITION.TOP_CENTER,
          });
        dispatch(getMyProfileList({ userId: newAddress }, token));
      }
      setShowBgScreen(false);
    } catch (e) {
      console.log(e, 'e');
    }
  };

  const handleLink = (value) => {
    switch (value) {
    case 'background':
      setShowBgScreen(true);
      break;
    case 'profile':
      setShowEditScreen(true);
      break;
    case 'copy':
      copyLink(true);
      break;
    case 'cancel':
      setBottomDrawerVisible(false);
      break;
    default:
      return null;
    }
  };
  const copyLink = () => {
    copy(
      `Check out the NFT collection of @${
        datas?.nickName || 'user'
      } on DNFT Protocol! | ${shareUrl}`
    );
    toast.success('The link is copied successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const cropperBtn = (dataUrl, file) => {
    setVisible(false);
    uploadFile(dataUrl, file);
  };

  const handleChangeTab = (i) => {
    setSelectedTab(i);
    let currentlabel = tabArray.filter((obj) => obj.value == i)?.[0]?.label;
    renderActionDispatch(currentlabel);
  };
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <Box
          h={['142px', '142px', '142px', 0]}
          pb={'16.7%'}
          position='relative'
          borderRadius={[0, 0, 0, '10px']}
          style={{
            background: `#b7b7b7 center center / cover no-repeat url(${datas?.bannerUrl})`,
          }}
        >
          {newAddress === address && (
            <Box display={['none', 'none', 'none', 'flex']}>
              <div
                onClick={() => setShowBgScreen(true)}
                className={styles.edit_bg_header}
              >
                <span className={styles.edit_bg_span}>Change Background</span>
                <img className={styles.edit_bg_img} src={edit_bg} />
              </div>
              <SharePopover datas={datas} />
            </Box>
          )}
        </Box>
        <div className={styles.profile}>
          <Box {...profileAvatarSettings}>
            <img className={styles.authorImg} src={avatarShow} alt='' />
            {newAddress === address && (
              <Box
                display={['none', 'none', 'none', 'flex']}
                onClick={() => setShowEditScreen(true)}
                className={styles.edit_avatar}
              >
                <img
                  className={styles.edit_avatar_img}
                  src={edit_avatar}
                  alt=''
                />
              </Box>
            )}
          </Box>
          {newAddress === address && (
            <Box
              onClick={() => {
                setBottomDrawerVisible(true);
              }}
              position='absolute'
              top='6px'
              right='32px'
              display={['flex', 'flex', 'flex', 'none']}
            >
              <Icon
                width='24'
                height='24'
                icon='akar-icons:more-horizontal-fill'
                color='#777e90'
              />
            </Box>
          )}
          <Box
            mt={['10px', '10px', '10px', '20px']}
            className={styles.authorName}
          >
            {datas?.nickName || 'Unknown'}
          </Box>
          <div className={styles.addressBox}>
            {newAddress && shortenAddress(newAddress)}
            <img
              className={styles.copyAddress}
              onClick={handleCopyAddress}
              src={copyImg}
            />
          </div>
          <div className={styles.contact}>
            {contactList.map((obj, i) => (
              <a
                style={{
                  pointerEvents: !isUrl(obj.href) && 'none',
                }}
                href={obj.href}
                target='_blank'
                rel='noopener noreferrer'
              >
                <img
                  style={obj.style || {}}
                  className={styles.contact_img}
                  src={isUrl(obj.href) ? obj.selIcon : obj.unSelIcon}
                />
              </a>
            ))}
          </div>
        </div>
        <Tabs
          onChange={(i) => handleChangeTab(i)}
          defaultIndex={0}
          index={selectedTab}
          variant='unstyled'
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
          <TabList display='flex' justifyContent='center' className={styles.tabs}>
            {tabArray.map((obj) => (
              <Tab
                key={obj.value}
                className={cx(
                  styleTabButton,
                  selectedTab === obj.value && styleActiveTabButton
                )}
                style={{ outline: '0!important' }}
                mr={['4px', '4px', '4px', '30px']}
              >
                {obj.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <div className={renderAction(selectedTab)?.length > 0 ? selectedTab == 0 ? styleCollections : styleCardList : styleCardListEmpty}>
          {renderAction(selectedTab)?.length > 0
            ? renderAction(selectedTab)?.map((item, index) => (
              renderCard(item, index)
            ))
            : selectedTab != 0 && renderNoData}
          {
            selectedTab == 0 && address === newAddress &&
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
          getProfileInfo();
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
      <BotDrawer
        onClose={() => {
          setBottomDrawerVisible(false);
        }}
        isOpen={bottomDrawerVisible}
        handleLink={(value) => {
          handleLink(value);
          setBottomDrawerVisible(false);
        }}
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
  border: 1px solid #dddddd;
  margin-right: 30px;
  color: #aaaaaa;
  font-family: Archivo Black;
  outline: 0;
  outline-offset: 0px;
  background: #fff;
  &:hover {
    outline: 0;
    outline-offset: 0px;
  }
`;

const styleActiveTabButton = css`
  border: 1px solid #417ed9;
  color: #ffffff;
  background: #417ed9;
`;

const styleCardList = css`
  display: grid;
  gap: 20px 19px;
  grid-template-columns: repeat(5, minmax(250px, 1fr));
  @media (max-width: 1650px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
