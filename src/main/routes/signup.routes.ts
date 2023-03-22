import { Router } from 'express';
import { adapteRoute } from '../adapters/express-routes-adapter';
import { makeSignupController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignupController()))
}
