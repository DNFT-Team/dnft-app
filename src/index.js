import 'element-theme-default';
import App from 'pages/app';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'reduxs/store';
import './i18n_config';
import './index.less';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'ui-neumorphism/dist/index.css';
import './assets/font/iconfont.css'

import reportWebVitals from './reportWebVitals';

const browser = {
  versions: function () {
    let u = navigator.userAgent, app = navigator.appVersion;
    return {// 移动终端浏览器版本信息

      trident: u.indexOf('Trident') > -1, // IE内核

      presto: u.indexOf('Presto') > -1, // opera内核

      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核

      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核

      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端

      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端

      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器

      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器

      iPad: u.indexOf('iPad') > -1, // 是否iPad

      webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部

    };
  }(),
  // language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
const isMobile = browser.versions.mobile || browser.versions.ios || browser.versions.android    ||
    browser.versions.iPhone || browser.versions.iPad
ReactDOM.render(
  // Fix---Warning: findDOMNode is deprecated in StrictMode
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {isMobile ? (
        <div>
          <p>Oops,This website is not available on Mobile Device</p>
          <p>Please view on the PC client.</p>
          <p>Or You can play some fun via here<a href="http://fun.dnft.world/syncbtc">SyncBTC!</a></p>
          <p>See more information via here<a href="http://dnft.world">DNFT Official Site</a></p>
        </div>
      ) : (
        <BrowserRouter>
          <App />
          <ToastContainer/>
        </BrowserRouter>
      )}
    </PersistGate>
  </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
