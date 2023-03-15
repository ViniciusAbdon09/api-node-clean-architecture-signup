import request from 'supertest';
import { app } from '../config/app';

describe('Body Parser middleware', () => {
  test('Should parser body json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'vinicius' })
      .expect({ name: 'vinicius' })
  })
})
