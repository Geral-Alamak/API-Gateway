const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

//const limiter = rateLimit({
//  windowMs: 60 * 1000, 
//  max: 5, 
//  message: '429 Too Many Requests'
//});

//app.use(limiter);

//Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Do not add express.json() here, as it causes POST requests through the gateway to hang.

app.use('/order-service', createProxyMiddleware({ 
  target: 'http://localhost:3001', 
  changeOrigin: true,
  pathRewrite: { '^/order-service': '' } // Strips prefix so Service A receives '/orders'
}));

app.use('/product-service', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true,
  pathRewrite: { '^/product-service': '' } // Strips prefix so Service B receives '/products/... '
}));

app.listen(port, () => console.log(`Gateway running on port ${port}`));
