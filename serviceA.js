const express = require('express');
const amqp = require('amqplib');
const app = express();
const port = 3001;
app.use(express.json());

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
let channel = null;

async function connectQueue() {
  try {
    const conn = await amqp.connect(AMQP_URL);
    conn.on('error', () => {});
    conn.on('close', () => { channel = null; setTimeout(connectQueue, 3000); });
    channel = await conn.createChannel();
    await channel.assertExchange('orders', 'fanout', { durable: true });
    console.log('terhubung ke RabbitMQ');
  } catch (e) {
    console.error('RabbitMQ belum tersedia, coba lagi dalam 3 detik');
    setTimeout(connectQueue, 3000);
  }
}

function publishOrderCreated(order) {
  if (!channel) { console.warn('channel tidak tersedia, event TIDAK terkirim:', order.id); return false; }
  const body = Buffer.from(JSON.stringify({ type: 'order.created', data: order }));
  return channel.publish('orders', '', body,
    { persistent: true, contentType: 'application/json', messageId: `order-${order.id}` });
}

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
    
    const order = { id: orders.length + 1, productId, productName: data.name, qty, total: data.price * qty };
    orders.push(order);
    publishOrderCreated(order); 
    res.status(201).json(order);
    
  } catch (err) {
    res.status(503).json({ error: 'product-service tidak tersedia' });
  }
});

connectQueue();
app.listen(port, () => console.log(`Service A (Order) running on port ${port}`));
