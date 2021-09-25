const { createProxyMiddleware } = require('http-proxy-middleware');

/* 本地开发跨域代理，部署时需要服务器nginx追加代理*/
module.exports = function (app) {
  app.use(
    createProxyMiddleware(
      '/api',
      {
        target: 'http://192.210.186.210:8077/api',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        },
        secure: false
      },
    )
  );
  app.use(
    createProxyMiddleware(
      '/faucet',
      {
        target: 'http://92.205.29.153:3699/faucet',
        changeOrigin: true,
        pathRewrite: {
          '/ipfsApi': ''
        },
        secure: false
      },
    )
  );
  app.use(
    createProxyMiddleware(
      '/ipfsApi',
      {
        target: 'http://92.205.29.78:4003/api',
        changeOrigin: true,
        pathRewrite: {
          '/ipfsApi': ''
        },
        secure: false
      },
    )
  );
  app.use(
    createProxyMiddleware(
      '/ipfsGet',
      {
        target: 'http://92.205.29.78:4002/ipfs',
        changeOrigin: true,
        pathRewrite: {
          '/ipfsApi': ''
        },
        secure: false
      },
    )
  );
  app.use(
    createProxyMiddleware(
      '/bridgeApi',
      {
        target: 'http://92.205.29.78:8081/bridgeApi',
        changeOrigin: true,
        pathRewrite: {
          '/ipfsApi': ''
        },
        secure: false
      },
    )
  );
};
