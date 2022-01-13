import { Icon } from '@iconify/react';
import copy from 'copy-to-clipboard';
import { Popover } from 'element-react';
import { css } from 'emotion';
import share_bg from 'images/profile/share.svg';
import React from 'react';
import {
  FacebookShareButton, TelegramShareButton,
  TwitterShareButton
} from 'react-share';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const SharePopover = (props) => {
  const { datas } = props;
  const shareUrl = window.location.href;
  const { t } = useTranslation();

  return (
    <Popover
      placement='bottom'
      style={{
        borderRadius: 10,
        width: 340,
        padding: 0,
      }}
      trigger='hover'
      content={
        <div className={shareBoxAll}>
          <div className='shareTitle'>{t('share.title')}</div>
          <div className='shareBox'>
            <div className='shareItem'>
              <Icon
                className='shareIcon'
                icon='uil:link'
                style={{ background: '#E6E8EC' }}
                onClick={() => {
                  copy(
                    `Check out the NFT collection of @${
                      datas?.nickName || 'user'
                    } on DNFT Protocol! | ${shareUrl}`
                  );
                  toast.success(t('toast.link.copy'), {
                    position: toast.POSITION.TOP_CENTER,
                  });
                }}
              />
              <label>{t('share.link')}</label>
            </div>
            <TelegramShareButton
              className='shareItem'
              title={`Check out the NFT collection of @${
                datas?.nickName || 'user'
              } on DNFT Protocol!`}
              url={shareUrl}
            >
              <Icon
                className='shareIcon'
                icon='uil:telegram'
                style={{ background: '#e8eeff', color: '#233a7d' }}
              />
              <label>{t('share.telegram')}</label>
            </TelegramShareButton>
            <TwitterShareButton
              className='shareItem'
              title={`Check out the NFT collection of @${
                datas?.nickName || 'user'
              } on DNFT Protocol!`}
              url={shareUrl}
              via='DNFTProtocol'
              hashtags={['NFT']}
            >
              <Icon
                className='shareIcon'
                icon='uil:twitter'
                style={{
                  background: 'rgba(29, 155, 240, 0.1)',
                  color: '#1D9BF0',
                }}
              />
              <label>{t('share.twitter')}</label>
            </TwitterShareButton>
            <FacebookShareButton
              className='shareItem'
              hashtag='#NFT'
              quote={`Check out the NFT collection of @${
                datas?.nickName || 'user'
              } on DNFT Protocol!`}
              url={shareUrl}
            >
              <Icon
                className='shareIcon'
                icon='uil:facebook'
                style={{ background: '#e8eeff', color: '#233a7d' }}
              />
              <label>{t('share.facebook')}</label>
            </FacebookShareButton>
          </div>
        </div>
      }
    >
      <div className={share_bg_header}>
        <span>{t('share.name')}</span>
        <img src={share_bg} />
      </div>
    </Popover>
  );
};
export default SharePopover;
const shareBoxAll = css`
  .shareTitle {
    font-family: Archivo Black;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 20px;
    color: #000000;
    padding: 20px;
  }
  .shareBox {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
  }
  .shareIcon {
    width: 25px;
    height: 25px;
    border-radius: 100%;
    padding: 10px;
    cursor: pointer;
    .label {
      font-family: Helvetica;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 14px;
      margin-top: 10px;
      color: #4e5c7e;
    }
  }
  .shareIcon {
    width: 25px;
    height: 25px;
    border-radius: 100%;
    padding: 10px;
    cursor: pointer;
  }
  .shareItem {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    margin: 0 15px 20px;
  }
`;
const share_bg_header = css`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  border: 2px solid #777e91;
  box-sizing: border-box;
  border-radius: 6px;
  position: absolute;
  bottom: 22px;
  cursor: pointer;
  background: linear-gradient(60deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(4px);
  padding: 0 14px;
  right: 256px;
  span {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    color: #fcfcfd;
  }
  img {
    width: 18px;
    height: 18px;
    margin-left: 10px;
  }
`;
