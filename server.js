// server.js
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Define any custom API endpoints here
  server.get('/api/custom-route', (req, res) => {
    res.json({ message: 'Hello from custom API route!' });
  });

  // For all other routes, handle with Next.js
  server.all('*', (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
