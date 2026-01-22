process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index');
const db = require('../db');

describe('Auth API', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('POST /api/register → 201', async () => {
    // пользователь не существует
    db.query
      .mockResolvedValueOnce({ rows: [] }) // SELECT
      .mockResolvedValueOnce({});          // INSERT

    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'test@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
  });

  it('POST /api/login → token', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          email: 'test@mail.com',
          password: await require('bcrypt').hash('123456', 10)
        }
      ]
    });

    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
