import { Router } from 'express';
import { adapteRoute } from '../adapters/express-routes-adapter';
import { makeSignupController } from '../factories/signup';
import { makeLoginController } from '../factories/login';

export default (router: Router): void => {
  router.post('/signup', adapteRoute(makeSignupController()))
  router.post('/login', adapteRoute(makeLoginController()))
}
