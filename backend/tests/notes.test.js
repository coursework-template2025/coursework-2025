process.env.NODE_ENV = 'test';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');
const db = require('../db');

const token = jwt.sign(
  { id: 1, email: 'test@mail.com' },
  'SECRET_KEY'
);

describe('Notes API', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('POST /api/notes → 201', async () => {
    db.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test note',
        content: 'Test content'
      });

    expect(res.statusCode).toBe(201);
  });

  it('GET /api/notes → array', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          title: 'Test',
          content: 'Content',
          created_at: new Date(),
          user_id: 1
        }
      ]
    });

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
