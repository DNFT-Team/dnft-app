const { createProxyMiddleware } = require('http-proxy-middleware');

/* 本地开发跨域代理，部署时需要服务器nginx追加代理*/
module.exports = function (app) {
  app.use(
    createProxyMiddleware(
      '/ipfsApi',
      {
        target: 'https://bkapi.dnft.world/ipfsApi',
        changeOrigin: true,
        pathRewrite: {
          '/ipfsApi': ''
        },
        secure: false
      },
    )
  );
};
