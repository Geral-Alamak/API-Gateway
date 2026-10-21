const express = require('express');
const app = express();
const port = 3001;

app.get('/serviceA', (req, res) => res.json({ message: 'Response from Service A' }));

app.listen(port, () => console.log(`Service A running on port ${port}`));
