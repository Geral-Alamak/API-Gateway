// Order

const express = require('express');
const app = express();
const port = 3001;
app.use(express.json());

const orders = [];

app.post('/orders', async (req, res) => {
  const { productId, qty } = req.body || {};
  
  try {
    const resp = await fetch(`http://localhost:3002/products/${productId}/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty }),
      signal: AbortSignal.timeout(2000),
    });
    
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json(data);
    
    const order = { id: orders.length + 1, productId, qty, total: data.price * qty };
    orders.push(order);
    res.status(201).json(order);
    
  } catch (err) {
    res.status(503).json({ error: 'product-service tidak tersedia' });
  }
});

app.listen(port, () => console.log(`Service A (Order) running on port ${port}`));
