const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.PROXY,
            changeOrigin: true,
        })
    );
};
