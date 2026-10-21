const express = require('express');
const app = express();
const port = 3002;

app.get('/serviceB', (req, res) => res.json({ message: 'Response from Service B' }));

app.listen(port, () => console.log(`Service B running on port ${port}`));
