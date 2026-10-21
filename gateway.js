const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: '429 Too Many Requests'
});

app.use(limiter);

app.use('/serviceA', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/serviceB', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

app.listen(port, () => console.log(`Gateway running on port ${port}`));
