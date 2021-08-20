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
//  global-Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// [ui-neumorphism/](https://akaspanion.github.io/ui-neumorphism)
import 'ui-neumorphism/dist/index.css';
// Chakra-UI(https://chakra-ui.com/docs/getting-started)
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
const theme = extendTheme({
  colors: {
    brand: {
      100: '#AFB5D3',    //  文本描述
      300: 'rgba(17, 45, 242, 0.5)',    //  次辅助色-禁用
      600: '#112DF2',   //  主明亮色-激活
      900: '#1B2559',   //  主暗色-大背景块
    },
    custom: {
      500: '#112DF2',
      600: '#112DF2',
      700: '#1B2559',
    },
  },
  components: {
    Button: {
      baseStyle: {
        '_hover': {opacity: .8},
        '_focus': {outline: 'none', boxShadow: 'none'},
        '_active': {outline: 'none', boxShadow: 'none'},
      }
    }
  }
})

//  measuring performance
import reportWebVitals from './reportWebVitals';
//  check device platform
import isMobile from './utils/isMobile';
const mobileVal = isMobile()

ReactDOM.render(
  // Fix---Warning: findDOMNode is deprecated in StrictMode
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {mobileVal ? (
        <div>
          <p>Oops,This website is not available on Mobile Device</p>
          <p>Please view on the PC client.</p>
          <p>Or You can play some fun via here<a href="http://fun.dnft.world/syncbtc">SyncBTC!</a></p>
          <p>See more information via here<a href="http://dnft.world">DNFT Official Site</a></p>
        </div>
      ) : (
        <BrowserRouter>
          <ChakraProvider resetCSS theme={theme}>
            <App />
          </ChakraProvider>
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
