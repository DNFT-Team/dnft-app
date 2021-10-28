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
import {Box} from '@chakra-ui/react';
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

  const [shrink, setShrink] = useState(true);

  return (
    <section className={styles.container}>
      <Box className={cx(styleLeftNav, shrink && styleLeftFull)} display={['none', 'none', 'flex', 'flex', 'flex']}>
        <div className={styleTop}>
          <img src={Logo} alt='' />
          <span>DNFT PROTOCOL</span>
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
                <div className={styles.navImg}>
                  {<img src={obj.icon} style={{ width: 25 }} alt={obj.navName}/>}
                </div>
                <span
                  className={`${styles.navDeText} ${
                    isActive && styles.navDeActive
                  } styleNavText`}
                >
                  {obj.navName}
                </span>
              </nav>
            );
          })}
        </section>
        <section className={'styleFootNoteContainer'}>
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
          <a className={styleFootDoc} target="_blank" href="https://dnft.gitbook.io" rel="noreferrer">DOCUMENTATION</a>
          <div className={styleFootNote}>
            <label>© 2021 DNFT Protocol</label>
          </div>
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
  gap: 16px;
  justify-content: center;
`;
const styleContactItem = css`
  text-decoration: none;
  font-size: 23px;
  color: white;
  transition: color .2s ease-in-out;
  &:hover {
    color: #00398D;
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
  label{
    font-family: Helvetica,sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 10.328px;
    line-height: 150%;
    display: flex;
    align-items: center;
    color: #FFFFFF;
  }
`;
const styleFootDoc = css`
  font-family: Helvetica,sans-serif;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2D3748;
  background: #FFFFFF;
  border-radius: 6px;
  padding: 6px 0;
  margin: 14px 0;
  text-decoration: none;
`;

const styleLeftNav = css`
  width: 56px;
  background-color: #00398D;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 0 20px;
  overflow: auto;
  transition: width 0.5s;
  &::-webkit-scrollbar{
    display: none;
  }

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
    padding-top: 50px;
  }

  .styleNavText {
    visibility: hidden;
  }
  .logoText {
    display: none;
    white-space: nowrap;
  }
  .styleFootNoteContainer {
    display: none;
    margin-bottom: 40px;
    padding: .6rem .8rem;
    border-radius: 8px;
    flex-grow: 0;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("${botBg}");
  }
`;
const styleTop = css`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  height: 30px;
  width: 100%;
  color: #EDF3FF;
  img{
    width: 30px;
  }
  span{
    display: inline-block;
    margin-left: 10px;
    width: 90px;
    font-family: Archivo Black,sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 15px;
    color: #FFFFFF;
  }
`;
const styleLeftFull = css`
  width: 200px;
  box-sizing: border-box;
  z-index: 100000;
  display: flex;
  flex-flow: column nowrap;
  section{
    flex-grow: 1;
  }
  .logoText {
    display: block;
  }
  .styleNavText {
    visibility: visible;
  }

  .styleLogoContainer {
    img {
      position: relative;
      left: 0;
    }
  }

  .styleFootNoteContainer {
    display: inline-block;
  }
`

const styleRightContainer = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: calc(100% - 200px);
  background: #F5F7FA;
  height: 100vh;
  overflow: auto;
  @media (max-width: 768px) {
    background-color: white;
  }
`
