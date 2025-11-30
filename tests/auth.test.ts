import request from 'supertest';
import app from '../src/app';

describe('Auth Service', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /auth/register creates a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'alice@example.com', password: 'password123' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('alice@example.com');
  });

  it('POST /auth/register fails if user exists', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'bob@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'bob@example.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('already exists');
  });

  it('POST /auth/login returns tokens', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'charlie@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'charlie@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('POST /auth/login fails with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid credentials');
  });

  it('POST /auth/refresh returns new access token', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'dave@example.com', password: 'password123' });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'dave@example.com', password: 'password123' });

    const refreshRes = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: loginRes.body.refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
  });
});
