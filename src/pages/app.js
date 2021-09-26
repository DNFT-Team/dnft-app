import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from 'reduxs/store';
import Router from 'routers';
import { MENU_MAP } from 'routers/config';
import styles from './app.less';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import Logo from 'images/common/dnf.svg';
import GlobalHeader from 'components/GlobalHeader';
import { css, cx } from 'emotion';
import { Icon } from '@iconify/react';
import {Box, Tag, TagLabel} from '@chakra-ui/react'
import globalConf from 'config/index'
import {contactData} from 'config/helper'
import botBg from 'images/common/botBg.png';

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

  const [shrink, setShrink] = useState(false);

  return (
    <section className={styles.container}>
      <Box className={cx(styleLeftNav, shrink && styleLeftFull)} display={['none', 'none', 'block', 'block', 'block']}>
        <div className={styleTop}>
          <div className={'styleLogoContainer'}>
            <img className={styles.logo} src={Logo} alt='logo' />
            <span className='logoText'>DNFT Protocol</span>
          </div>
          <Tag
            borderRadius="full"
            variant="solid"
            color="#5FFFB1"
            textTransform="capitalize"
            bg="transparent"
          >
            <TagLabel>{globalConf.net_name}</TagLabel>
          </Tag>
        </div>
        <section>
          {MENU_MAP.map((obj, index) => {
            const isActive = tab === obj.path;

            return (
              <nav
                onClick={() => handleTo(obj)}
                key={'Nav_' + index}
                className={`${styles.nav} ${
                  isActive && styles.navActive
                } ${shrink ? styles.navRt : styles.navBot} styleNavContainer`}
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
                      isActive && styles.navDeActive
                    } styleNavText`}
                  >
                    {obj.navName}
                  </span>
                }
              </nav>
            );
          })}
        </section>
        <Box textAlign="center" my="1rem">
          <Icon className={cx(styleShrinkIco, shrink && styleShrinkRotate)} icon={'mdi-light:chevron-double-right'} onClick={() => {setShrink(!shrink)}}/>
        </Box>
        <section className={'styleFootNoteContainer'} style={{backgroundImage: `url("${botBg}")`}}>
          <div className={styleContactUs}>
            {contactData.map((item, i) => (
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
            <p>Powered by <b>D LABS</b></p>
            <label>2021 DNFT All rights reserved</label>
          </div>
          <a className={styleFootDoc} target="_blank" href="https://dnft.gitbook.io" rel="noreferrer">DOCUMENTATION</a>
        </section>
      </Box>
      <section id="mainContainer" className={styleRightContainer}>
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
  transition: color .2s ease-in-out;
  &:hover {
    color: #3e9de5;
    transform: scale(1.2);
  }
`;

const styleFootNote = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  font-family: SF Pro Display,sans-serif;
  font-style: normal;
  p{
    font-weight: bold;
    font-size: 12.0493px;
    line-height: 140%;
    color: #FFFFFF;
  }
  label{
    font-weight: normal;
    font-size: 10.328px;
    line-height: 150%;
    color: #A6B3F7;
  }
`;
const styleFootDoc = css`
  font-family: Helvetica,sans-serif;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 8.60664px;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2D3748;
  background: #FFFFFF;
  border-radius: 6px;
  padding: 6px 0;
  margin-top: 7px;
  text-decoration: none;
`;

const styleLeftNav = css`
  width: 56px;
  background-color: #1B2559;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 0 20px;
  overflow: hidden;
  transition: width 0.5s;

  .styleLogoContainer {
    display: flex;
    margin-left: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;

    span {
      color: #D2D3F6;
      font-size: 23px;
      font-weight: bolder;
      margin-left: 14px;
    }
  }
  section{
    margin-top: 10rem;
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
    padding: .6rem .8rem;
    border-radius: 8px;
    left: 50%;
    transform: translateX(-50%);
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
const styleTop = css`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  height: 64px;
  background: #101A4E;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
`;
const styleLeftFull = css`
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
`

const styleRightContainer = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: calc(100% - 256px);
  background: rgba(245, 247, 250, 1);
  height: 100vh;
  overflow: auto;
  @media (max-width: 768px) {
    background-color: white;
  }
`
const styleShrinkIco = css`
  cursor: pointer;
  color: #FFFFFF;
  font-size: 42px;
  transition: all .2s ease-in-out;
  &:hover{
    font-size: 46px;
  }
`
const styleShrinkRotate = css`
 transform: rotate(180deg);
`
