const request = require('supertest');

const GATEWAY_URL = 'http://localhost:3000';
const ORDER_SERVICE_URL = 'http://localhost:3001';
const PRODUCT_SERVICE_URL = 'http://localhost:3002';

describe('System Health Checks', () => {
  it('Gateway should be UP', async () => {
    const res = await request(GATEWAY_URL).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('UP');
  });

  it('Product Service should be UP', async () => {
    const res = await request(PRODUCT_SERVICE_URL).get('/health');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Gateway Routing & Integration Tests', () => {
  it('should fetch products through the Gateway', async () => {
    const res = await request(GATEWAY_URL).get('/product-service/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0]).toHaveProperty('name', 'Keyboard Mekanik');
  });

  it('should return 404 for a non-existent product', async () => {
    const res = await request(GATEWAY_URL).get('/product-service/products/999');
    expect(res.statusCode).toEqual(404);
  });

  it('should create an order successfully', async () => {
    const res = await request(GATEWAY_URL)
      .post('/order-service/orders')
      .send({ productId: 1, qty: 1 });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total', 450000);
  });

  it('should intentionally fail (409) if stock is insufficient', async () => {
    const res = await request(GATEWAY_URL)
      .post('/order-service/orders')
      .send({ productId: 1, qty: 50 }); // Exceeds stock of 10
    
    expect(res.statusCode).toEqual(409); 
  });
});
