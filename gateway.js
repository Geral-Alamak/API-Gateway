const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

////Limiter
//const limiter = rateLimit({
//  windowMs: 60 * 1000, 
//  max: 5, 
//  message: '429 Too Many Requests'
//});

//app.use(limiter);

//Docker
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

app.use('/order-service', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: { '^/order-service': '' }
}));

app.use('/product-service', createProxyMiddleware({ 
  target: PRODUCT_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: { '^/product-service': '' }
}));

//Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Do not add express.json() here, as it causes POST requests through the gateway to hang.

//app.use('/order-service', createProxyMiddleware({ 
//  target: 'http://localhost:3001', 
//  changeOrigin: true,
//  pathRewrite: { '^/order-service': '' } // Strips prefix so Service A receives '/orders'
//}));

//app.use('/product-service', createProxyMiddleware({ 
//  target: 'http://localhost:3002', 
//  changeOrigin: true,
//  pathRewrite: { '^/product-service': '' } // Strips prefix so Service B receives '/products/... '
//}));

//Test
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'gateway' }); 
});

app.listen(port, () => console.log(`Gateway running on port ${port}`));
