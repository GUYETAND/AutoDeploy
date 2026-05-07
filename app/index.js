const express = require('express');
const app = express();
const PORT = 3000;

// Health check endpoint (useful for Kubernetes probes)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main route
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoDeploy!!</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f1a;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .logo {
      width: 80px; height: 80px;
      border-radius: 20px;
      background: linear-gradient(135deg, #61afef, #c678dd);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #61afef, #c678dd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 1.1rem;
      color: #7f849c;
      margin-bottom: 2.5rem;
    }
    .pipeline {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }
    .step {
      background: #1e1e2e;
      border: 1px solid #2d2d44;
      border-radius: 12px;
      padding: 1rem 1.2rem;
      min-width: 110px;
    }
    .step .icon { font-size: 1.5rem; margin-bottom: 0.3rem; }
    .step .label { font-size: 0.75rem; color: #7f849c; }
    .arrow { color: #3e4451; font-size: 1.2rem; padding: 0 0.3rem; }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #1e1e2e;
      border: 1px solid #2d2d44;
      border-radius: 100px;
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #98c379;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .footer {
      margin-top: 2rem;
      font-size: 0.8rem;
      color: #3e4451;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">&#9729;</div>
    <h1>AutoDeploy</h1>
    <p class="subtitle">Cloud-Native CI/CD Pipeline</p>
    <div class="pipeline">
      <div class="step"><div class="icon">&#128190;</div><div class="label">Git Push</div></div>
      <div class="arrow">&#8594;</div>
      <div class="step"><div class="icon">&#9881;</div><div class="label">Build</div></div>
      <div class="arrow">&#8594;</div>
      <div class="step"><div class="icon">&#128230;</div><div class="label">Registry</div></div>
      <div class="arrow">&#8594;</div>
      <div class="step"><div class="icon">&#9783;</div><div class="label">Kubernetes</div></div>
      <div class="arrow">&#8594;</div>
      <div class="step"><div class="icon">&#127760;</div><div class="label">Live</div></div>
    </div>
    <div class="status">
      <span class="dot"></span>
      Deployed on GKE &mdash; Google Cloud Platform
    </div>
    <p class="footer">Docker &bull; GitHub Actions &bull; GKE &bull; Artifact Registry</p>
  </div>
</body>
</html>
  `);
});

// Export app for testing
module.exports = app;

// Only start the server when run directly (not when imported by Jest)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}
