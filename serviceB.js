// Product

const express = require('express');
const app = express();
const port = 3002;
app.use(express.json());

const products = [
  { id: 1, name: 'Keyboard Mekanik', price: 450000, stock: 10 }
];

app.get('/products', (req, res) => res.json(products));

app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  p ? res.json(p) : res.status(404).json({ error: 'Produk tidak ditemukan' });
});

app.post('/products/:id/reserve', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  const qty = (req.body || {}).qty;
  if (!p) return res.status(404).json({ error: 'Produk tidak ditemukan' });
  if (p.stock < qty) return res.status(409).json({ error: 'Stok tidak cukup' });
  
  p.stock -= qty;
  res.json(p);
});

app.listen(port, () => console.log(`Service B (Product) running on port ${port}`));
