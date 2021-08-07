import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from 'reduxs/store';
import Router from 'routers';
import { MENU_MAP } from 'routers/config';
import styles from './app.less';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import Logo from 'images/home/dnftLogo.png';
import GlobalHeader from 'components/GlobalHeader';
import {
  AppstoreOutlined,
  BookOutlined,
  CalendarOutlined,
  ContactsOutlined,
  SnippetsOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { css } from 'emotion';

const App = (props) => {
  const { t, i18n } = useTranslation();
  const {
    location: { pathname },
  } = props;
  const [tab, setTab] = useState(pathname);
  let history = useHistory();
  useEffect(() => {
    try {
      i18n.changeLanguage(store.getState().lng.lng.value);
    } catch (e) {
      i18n.changeLanguage('zh');
      console.log('getLngFromState error : ', e);
    }
  }, []);
  const handleTo = (value) => {
    history.push(value.path);
    setTab(value.path);
  };

  const navIconArray = [
    <AppstoreOutlined />,
    <BookOutlined />,
    <SnippetsOutlined />,
    <CalendarOutlined />,
    // <ContactsOutlined />,
    <CrownOutlined />
  ];

  const contectIconArray = [
    {
      name: 'github',
      url: 'https://github.com/DNFT-Team/',
      icon: 'icon-github',
    },
    {
      name: 'telegram',
      url: 'https://t.me/dnftprotocol',
      icon: 'icon-telegram',
    },
    // {
    //   name: 'discord',
    //   url: 'https://discord.gg/pxEZB7ny',
    //   icon: 'icon-discord',
    // },
    {
      name: 'twitter',
      url: 'https://twitter.com/DNFTProtocol',
      icon: 'icon-twitter',
    },
    {
      name: 'medium',
      url: 'https://medium.com/dnft-protocol',
      icon: 'icon-medium',
    },
  ];
  return (
    <section className={styles.container}>
      <section className={styleLeftNav}>
        <div className={'styleLogoContainer'}>
          <img className={styles.logo} src={Logo} alt='logo' />
          <span className='logoText'>DNFT Protocol</span>
        </div>
        <section className={styles.menu}>
          {MENU_MAP.map((obj, index) => {
            const isActive = tab === obj.path;

            return (
              <nav
                onClick={() => handleTo(obj)}
                key={'Nav_' + index}
                className={`${styles.nav} ${
                  isActive && styles.navActive
                } styleNavContainer`}
              >
                <div
                  className={`${styles.navImg} ${
                    isActive && styles.navActive
                  } `}
                >
                  {navIconArray[index]}
                </div>
                {obj.deActive ? (
                  <span
                    className={`${styles.navDeText} ${
                      isActive && styles.navActive
                    } styleNavText`}
                  >
                    {obj.navName}*
                  </span>
                ) : (
                  <span
                    className={`${styles.navText} ${
                      isActive && styles.navActive
                    } styleNavText`}
                  >
                    {obj.navName}
                    {obj.deActive ? '*' : ''}
                  </span>
                )}
              </nav>
            );
          })}
        </section>
        <section className={'styleFootNoteContainer'}>
          <div className={styleContactUs}>
            {contectIconArray.map((item, i) => (
              <a
                className={styleContactItem}
                href={item.url}
                target='_blank'
                rel='noreferrer'
                key={i}
              >
                <i className={'iconfont ' + item.icon} />
              </a>
            ))}
          </div>
          <div className={styleFootNote}>
            <div>
              Powered by <b>D LABS</b>
            </div>
            <div>2021 DNFT All rights reserved</div>
          </div>
        </section>
      </section>
      <section className={styles.rightContainer}>
        <GlobalHeader />
        <Router />
      </section>
    </section>
  );
};
export default withRouter(connect()(App));

const styleContactUs = css`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
`;
const styleContactItem = css`
  text-decoration: none;
  font-size: 23px;
  color: white;
`;

const styleFootNote = css`
  margin-top: 3vh;
  color: #c0beff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 300;
  white-space: nowrap;
`;

const styleLeftNav = css`
  width: 56px;
  cursor: pointer;
  background-color: rgb(20, 23, 74);
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 0 20px;
  overflow: hidden;
  transition: width 0.5s;

  .styleLogoContainer {
    margin-left: 0;
    display: flex;

    margin-top: 16px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      position: relative;
      left: 10px;
    }

    span {
      color: white;
      font-size: 23px;
      font-weight: bolder;
      margin-left: 14px;
    }
  }

  .styleNavText {
    visibility: hidden;
  }
  .logoText {
    display: none;
    white-space: nowrap;
  }
  .styleNavContainer {
    padding: 18px 17px;
    & > div {
      margin: 0;
    }
  }
  .styleFootNoteContainer {
    position: absolute;
    bottom: 5vh;
    display: none;
  }
  &:hover {
    width: 216px;
    z-index: 100000;
    .logoText {
      display: block;
    }
    .styleNavText {
      visibility: visible;
    }

    .styleNavContainer {
      padding: 18px 58px 18px 64px;
      & > div {
        margin-right: 20px;
      }
    }

    .styleLogoContainer {
      margin-left: 6px;
      img {
        position: relative;
        left: 0;
      }
    }

    .styleFootNoteContainer {
      position: absolute;
      bottom: 5vh;
      display: block;
    }
  }
`;
