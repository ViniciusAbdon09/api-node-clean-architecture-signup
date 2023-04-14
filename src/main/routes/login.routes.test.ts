import request from 'supertest';
import { clientMemoryDB } from '../../infra/db/memoryDB/helpers/repository-in-memory-helper';
import { app } from '../config/app';

describe('Login Routes', () => {
  afterAll(() => {
    clientMemoryDB.reset();
  })

  beforeEach(() => {
    clientMemoryDB.reset();
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'valid name',
          email: 'valid@email.com',
          password: '123123',
          passwordConfirm: '123123'
        })
        .expect(200)
    });
  });
})
