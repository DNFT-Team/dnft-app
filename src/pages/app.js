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
import { css } from 'emotion';
import { Icon } from '@iconify/react';
import {Box} from '@chakra-ui/react'

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

  const contectIconArray = [
    {
      name: 'github',
      url: 'https://github.com/DNFT-Team/',
      icon: 'jam:github-circle',
    },
    {
      name: 'telegram',
      url: 'https://t.me/dnftprotocol',
      icon: 'ri:telegram-line',
    },
    // {
    //   name: 'discord',
    //   url: 'https://discord.gg/pxEZB7ny',
    //   icon: 'jam:discord',
    // },
    {
      name: 'twitter',
      url: 'https://twitter.com/DNFTProtocol',
      icon: 'jam:twitter-circle',
    },
    {
      name: 'medium',
      url: 'https://medium.com/dnft-protocol',
      icon: 'jam:medium-circle',
    },
  ];
  return (
    <section className={styles.container}>
      <Box className={styleLeftNav} display={['none', 'none', 'block', 'block', 'block']}>
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
                  {<img src={obj.icon} style={{ width: 30 }} alt={obj.navName}/>}
                </div>
                {
                  <span
                    className={`${styles.navDeText} ${
                      isActive && styles.navActive
                    } styleNavText`}
                  >
                    {obj.navName}
                  </span>
                }
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
                <Icon icon={item.icon} />
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
      </Box>
      <section className={styles.rightContainer}>
        <GlobalHeader curPath={tab} skipTo={handleTo}/>
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
    padding: 14px 14px;
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
      padding: 14px 58px 14px 64px;
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
