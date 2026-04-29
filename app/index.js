const express = require('express');
const app = express();
const PORT = 3000;

// Health check endpoint (useful for Kubernetes probes)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main route
app.get('/', (req, res) => {
  res.send('Hello from Kubernetes CI/CD');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
