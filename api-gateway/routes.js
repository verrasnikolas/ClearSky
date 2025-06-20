const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticateToken } = require('./middlewares/authToken.js');


const router = express.Router();

// 🔓 Public route: no authentication
router.use('/api/auth', createProxyMiddleware({
    target: 'http://user-service:3005',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/auth' },
    logLevel: 'debug'
}));

// 🔐 Protected routes (go through auth middleware)

router.use('/api/grades', authenticateToken, createProxyMiddleware({
    target: 'http://grades-service:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/grades': '' },
    logLevel: 'debug'
}));

router.use('/api/stats', authenticateToken, createProxyMiddleware({
    target: 'http://stats-service:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/stats': '' },
    logLevel: 'debug'
}));

router.use('/api/reviews', authenticateToken, createProxyMiddleware({
    target: 'http://review-service:3003',
    changeOrigin: true,
    pathRewrite: { '^/api/reviews': '' },
    logLevel: 'debug'
}));

router.use('/api/users', authenticateToken, createProxyMiddleware({
    target: 'http://user-service:3005',
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' },
    logLevel: 'debug'
}));

router.use('/api/upload', authenticateToken, createProxyMiddleware({
    target: 'http://upload-service:3006',
    changeOrigin: true,
    pathRewrite: { '^/api/upload': '' },
    logLevel: 'debug'
}));

module.exports = router;
