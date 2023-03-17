import { Router, Request, Response } from 'express';

export default (router: Router): void => {
  router.post('/signup', (request: Request, response: Response) => {
    response.json({ ok: 'ok' })
  })
}
