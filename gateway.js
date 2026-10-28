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

// Do not add express.json() here, as it causes POST requests through the gateway to hang[cite: 5].

app.use('/order-service', createProxyMiddleware({ 
  target: 'http://localhost:3001', 
  changeOrigin: true,
  pathRewrite: { '^/order-service': '' } // Strips prefix so Service A receives '/orders'[cite: 5]
}));

app.use('/product-service', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true,
  pathRewrite: { '^/product-service': '' } // Strips prefix so Service B receives '/products/... '[cite: 5]
}));

app.listen(port, () => console.log(`Gateway running on port ${port}`));
