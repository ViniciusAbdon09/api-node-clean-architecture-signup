import request from 'supertest';
import { app } from '../config/app';

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid name',
        email: 'valid@email.com',
        password: '123123',
        passwordConfirm: '123123'
      })
      .expect(200)
  })
})
