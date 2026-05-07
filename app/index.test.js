const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('should return 200 and HTML page', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('AutoDeploy');
    expect(res.text).toContain('Cloud-Native CI/CD Pipeline');
    expect(res.text).toContain('Kubernetes');
  });
});

describe('GET /health', () => {
  it('should return 200 and JSON with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /unknown', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });
});
