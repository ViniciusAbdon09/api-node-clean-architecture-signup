import { Router } from 'express';
import { adapteRoute } from '../adapters/express-routes-adapter';
import { makeSignupController } from '../factories/controllers/signup';
import { makeLoginController } from '../factories/controllers/login';

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignupController()))
  router.post('/login', adapteRoute(makeLoginController()))
}
