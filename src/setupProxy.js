const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware(
      '/nerve',
      {
        target: 'https://public.nerve.network',
        changeOrigin: true,
        pathRewrite: {
          '/nerve': ''
        }
      }
    )
  );
};
