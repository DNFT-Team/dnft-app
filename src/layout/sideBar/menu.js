import React, { useEffect, useState } from 'react';
import {
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { css, cx } from 'emotion';
import Logo from 'images/home/dnftLogo.png';
import { Icon } from '@iconify/react';
import assetSvg from 'images/menu/asset.svg';
import { getMyProfileList } from 'reduxs/actions/profile';
import { MENU_MAP } from 'routers/config';
import { shortenAddress, shortenNameString } from 'utils/tools';
import { contactData } from 'config/helper';
import { Btn } from 'components/Button';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get, post } from 'utils/request';

const DrawerMenu = (props) => {
  const { isOpen, dispatch, skipTo, location, onClose, token, address, datas } =
    props;
  const [profile, setprofile] = useState({})
  useEffect(async () => {
    if (address && token) {
      // dispatch(getMyProfileList({ userId: address }, token));
      const data = await post(`/api/v1/users/address/${address}`, {}, token);
      setprofile(data?.data?.data || {})
      console.log(data,'data')
    }
  }, [address, token]);
  const menuNav = [
    {
      style: { marginTop: 0 },
      navName: 'Profile',
      path: `/profile/address/${address}`,
    },
    {
      icon: assetSvg,
      style: { marginTop: 5 },
      navName: 'Asset',
      path: '/asset',
      divider: true,
    },
    ...MENU_MAP,
  ];
  return (
    <Drawer placement='left' isOpen={isOpen} onClose={onClose} size={'sm'}>
      <DrawerOverlay />
      <DrawerContent className={styleModalContainer}>
        <div className={styleModalContainer}>
          <div className='header'>
            <div className='left'>
              <Avatar className='logo' src={Logo} />
              <span>
                DNFT
                <br />
                PROTOCOL
              </span>
            </div>
            <Icon
              onClick={onClose}
              icon='ci:close-big'
              color='white'
              width='30'
              height='30'
            />
          </div>
          {menuNav.map((item) => (
            <>
              <div
                key={item.navName}
                style={item.style || {}}
                onClick={() => {
                  onClose();
                  if(address || item.navName !== 'Profile')
                    skipTo(item);
                }}
                className={cx(
                  styleMenuLi,
                  ((location?.pathname.includes(item.path) && item.path !== '/') || (location.pathname === '/' && item.path === '/')) && styleMenuActive
                )}
              >
                <Flex justifyContent='space-between' alignItems='center'>
                  <div className='menuLeft'>
                    <Flex alignItems='center'>
                      {item.navName === 'Profile' ? (
                        <>
                          <img src={profile?.avatorUrl} className='userLogo' />
                          <div className='user'>
                            <span className='menuSpan'>{shortenNameString(profile?.nickName)}</span>
                            <span>{address && shortenAddress(address)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={item.icon} className='menuLogo' />
                          <span className='navName'>{item.navName}</span>
                        </>
                      )}
                    </Flex>
                  </div>
                  <div className='menuRight'>
                    <Icon
                      icon='akar-icons:chevron-right'
                      color='#c0beff'
                      width='19'
                      height='19'
                    />
                  </div>
                </Flex>
              </div>
              {item.divider && (
                <Divider
                  bg='rgba(255, 255, 255, 0.25)'
                  width='calc(100% - 52px)'
                  mt='25px'
                  mb='25px'
                />
              )}
            </>
          ))}
          <div className={styleContactUs}>
            {contactData.map((item, i) => (
              <a
                className='item'
                href={item.url}
                target='_blank'
                key={i}
                rel='noreferrer'
              >
                <Icon icon={item.icon} />
              </a>
            ))}
          </div>
          <a
            className={styleFootDoc}
            target='_blank'
            href='https://dnft.gitbook.io'
            rel='noreferrer'
          >
            <Btn
              style={{
                margin: '0 auto',
                background: '#fff',
                paddingLeft: '40px',
                paddingRight: '40px',
                color: '#000',
                fontFamily: 'Helvetica',
                fontWeight: 'bold',
              }}
            >
              DOCUMENTATION
            </Btn>
          </a>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
const mapStateToProps = ({ profile }) => ({
  datas: profile.datas,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(DrawerMenu));
const styleModalContainer = css`
  min-height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  background: #00398d;
  .header {
    display: flex;
    padding: 39px 26px 0;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    .left {
      display: flex;
      align-items: center;
      padding: 10px;
      span {
        font-family: Archivo Black;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 15px;
        color: #ffffff;
      }
    }
    .logo {
      width: 40px;
      margin-right: 7px;
    }
  }
`;
const styleMenuLi = css`
  padding: 10px 0;
  margin: 19px 33px 0 34px;
  .menuLeft {
    .menuLogo {
      height: 22px;
      width: 22px;
      margin-right: 20px;
      margin-left: 10px;
    }
    .userLogo {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      margin-right: 10px;
      padding: 10px 0;
    }
    span {
      font-family: Archivo Black;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 17px;
      letter-spacing: 0.02em;
      color: #929ac2;
    }
    .user {
      display: flex;
      flex-direction: column;
      span {
        font-family: Helvetica;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 18px;
        color: #929ac2;
        &:first-child {
          font-size: 18px;
          line-height: 32px;
          color: #ffffff;
        }
      }
    }
  }
`;
const styleMenuActive = css`
  .navName {
    color: #fff!important;
  }
`;
const styleContactUs = css`
  display: flex;
  flex-direction: row;
  gap: 25px;
  margin-top: 111px;
  justify-content: center;
  .item {
    text-decoration: none;
    font-size: 1.84rem;
    color: white;
    &:hover {
      svg {
        transform: scale(1.2);
      }
    }
  }
`;
const styleFootDoc = css`
  cursor: pointer;
  display: flex;
  margin: 40px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;
