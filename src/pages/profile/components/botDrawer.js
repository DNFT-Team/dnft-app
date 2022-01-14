import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { css } from 'emotion';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  FacebookShareButton, TelegramShareButton,
  TwitterShareButton
} from 'react-share';
import  { useTranslation } from 'react-i18next';

const BotDrawer = (props) => {
  const { isOpen, datas, handleLink, onClose } =
    props;
  const shareUrl = window.location.href;
  const { t } = useTranslation();

  const list = [
    {
      label: t('profile.setting.background'),
      value: 'background',
    },
    {
      label: t('profile.setting.profile'),
      value: 'profile',
    },
    {
      label: t('profile.setting.telegram'),
      value: 'telegram',
    },
    {
      label: t('profile.setting.twitter'),
      value: 'twitter',
    },
    {
      label: t('profile.setting.facebook'),
      value: 'facebook',
    },
    {
      label: t('profile.setting.copy'),
      value: 'copy',
    },
    {
      label: t('profile.setting.cancel'),
      value: 'cancel',
    },
  ];
  const config = {
    className: 'shareItem',
    title: t('profile.share.nickName', {name: datas?.nickName || 'user'}),
    // title: `Check out the NFT collection of @${
    //   datas?.nickName || 'user'
    // } on DNFT Protocol!`,
    url: shareUrl,
    hashtags: ['NFT'],
  };
  return (
    <Drawer placement='bottom' isOpen={isOpen} onClose={onClose} size={'xs'}>
      <DrawerOverlay />
      <DrawerContent className={styleModalContainer}>
        {list.map((obj, i) => {
          if (obj.value === 'telegram') {
            return (
              <TelegramShareButton key={i} {...config}>
                <div
                  onClick={() => handleLink(obj.value)}
                  key={i}
                  className='li'
                >
                  {obj.label}
                </div>
              </TelegramShareButton>
            );
          } else if (obj.value === 'twitter') {
            return (
              <TwitterShareButton key={i} via='DNFTProtocol' {...config}>
                <div
                  onClick={() => handleLink(obj.value)}
                  key={i}
                  className='li'
                >
                  {obj.label}
                </div>
              </TwitterShareButton>
            );
          } else if (obj.value === 'facebook') {
            return (
              <FacebookShareButton key={i} {...config}>
                <div
                  onClick={() => handleLink(obj.value)}
                  key={i}
                  className='li'
                >
                  {obj.label}
                </div>
              </FacebookShareButton>
            );
          } else {
            return (
              <div onClick={() => handleLink(obj.value)} key={i} className='li'>
                {obj.label}
              </div>
            );
          }
        })}
      </DrawerContent>
    </Drawer>
  );
};
const mapStateToProps = ({ profile }) => ({
  datas: profile.datas,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(BotDrawer));
const styleModalContainer = css`
  min-height: 30vh;
  overflow: auto;
  box-sizing: border-box;
  background: #fff;
  border-radius: 10px 10px 0px 0px;
  .li {
    height: 50px;
    text-align: center;
    font-family: Helvetica;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 50px;
    color: #4e5057;
    cursor: pointer;
    border-bottom: 0.5px solid rgba(78, 80, 87, 0.43);
  }
`;
