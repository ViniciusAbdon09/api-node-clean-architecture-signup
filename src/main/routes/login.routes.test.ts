import { hash } from 'bcrypt';
import request from 'supertest';
import { AccountModel } from '../../domain/models/account';
import { AddAccountModel } from '../../domain/useCases/addAccount/addAccount';
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      clientMemoryDB.addCollection('accounts');
      const passHash = await hash('123123', 12);
      clientMemoryDB.add<AddAccountModel, AccountModel>('accounts',
        {
          name: 'valid name',
          email: 'valid@email.com',
          password: passHash,
        });

      await request(app)
        .post('/api/login')
        .send({
          email: 'valid@email.com',
          password: '123123',
        })
        .expect(200)
    });

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid@email.com',
          password: '123123',
        })
        .expect(401)
    });
  });
})
