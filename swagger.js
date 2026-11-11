const swaggerAutogen = require('swagger-autogen')();
const doc = { info: { title: 'Microservices API', version: '1.0.0' }, host: 'localhost:3000' };
const outputFile = './swagger-output.json';
const routes = ['./serviceA.js', './serviceB.js'];
swaggerAutogen(outputFile, routes, doc);
