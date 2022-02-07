import React, { useCallback, useEffect, useState } from 'react';
import { css } from 'emotion';
import bg from 'images/igo/poke-bg.png';
import vedioCut from 'images/igo/vedio-cut.png';
import card from 'images/igo/card.png';
import { useHistory } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import globalConfig from '../../../config/index';
import  { useTranslation } from 'react-i18next';

const iframeUrl = `https://fun.dnft.world/${globalConfig.net_env === 'mainnet' ? 'syncbtc' : 'test_syncbtc'}/`

const pokeScreen = (props) => {
  const { t } = useTranslation();

  let history = useHistory();
  const { token } = props;

  const renderCard = () => {
    console.log('card')
    return (
      <div className={styleItem}>
        <img src={card} alt='' />
        <div className='content'>
          <div>{t('igo.shark.ticket')}</div>
          <p>{t('igo.shark.tickettitle')}</p>
          <div className='button'>{t('market.buy')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styleContainer}>
      <div className={styleHeader}>
        <h1>{t('igo.pokeGameList.title')}</h1>
        <p>{t('igo.pokeGameList.content')}</p>
        <div className='mask'></div>
      </div>
      <div className={styleVedioContainer}>
        <div>
          <div>
            <h1>{t('igo.pokemine.game')}</h1>
            <span>{t('igo.pokemine.gamecontent')}</span>
            <div className='button'>{t('igo.expore.more')}</div>
          </div>
          <img src={vedioCut} alt='' />
        </div>
      </div>
      <div className={styleListContainer}>
        <h1>NFT</h1>
        {renderCard()}
        {renderCard()}
      </div>
    </div>
  );
};

const mapStateToProps = ({ profile }) => ({
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(pokeScreen));

const styleContainer = css`
  min-height: 100vh;
  padding: 50px;
  border-radius: 20px;
  font-family: Archivo Black;
  color: white;
  .button {
    margin-top: 30px;
    background: #0057D9;
    padding: 12px 16px;
    font-size: 14px;
    width: fit-content;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const styleHeader = css`
  background: url(${bg}) no-repeat center;
  background-size: cover;
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  flex-direction: column;
  border-radius: 20px 20px 0 0;
  position: relative;
  h1 {
    font-size: 100px;
    line-height: 109px;
    margin: 220px 0 56px 0;
  }
  p {
    font-size: 40px;
    line-height: 44px;
    text-align: center;
    max-width: 800px;
    margin-bottom: 180px;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 50%;
    background: linear-gradient(rgba(255,255,255,0.1) 0%,rgba(3,42,101,0.3) 100%);
    bottom: 0;
  }
`;

const styleVedioContainer = css`
  background: linear-gradient(180deg, #032A65 0%, #001C45 100%);
  width: 100%;
  padding: 140px 0;
  & > div {
    justify-content: space-between;
    align-items: center;
    display: flex;
    flex-direction: row;
    max-width: 1440px;
    padding: 0 150px;
    margin: 0 auto;
    div {
      padding-right: 100px;
      h1 {
        margin: 0;
        font-size: 48px;
      }
      span {
        font-size: 16px;
        line-height: 22px;
      }
    }
  }
  img {
    width: 40%;
  }
`

const styleListContainer = css`
  background: linear-gradient(180deg, #033073 0%, #00112B 100%);
  padding: 160px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 48px;
    color: #fff;
  }
`;

const styleItem = css`
  display: flex;
  align-items: center;
  max-width: 1440px;
  padding: 0 150px;
  margin: 0 auto;
  justify-content: space-between;
  margin-bottom: 100px;
  img {
    width: 30%;
  }
  .content {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    width: 50%;
    margin-left: 15%;
    padding: 30px;
    .button {
      padding: 8px 40px;
    }
  }
`
