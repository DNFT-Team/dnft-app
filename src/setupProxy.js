const { createProxyMiddleware } = require('http-proxy-middleware')

/* 本地开发跨域代理，部署时需要服务器nginx追加代理*/
module.exports = function (app) {
	app.use(
		createProxyMiddleware('/sensi', {
			target: 'http://92.205.29.78:5033',
			changeOrigin: true,
			pathRewrite: {
				'/sensi': '',
			},
			secure: false,
		}),
	)
}
