import { SignUpController } from '../../../../presentation/controllers/signup-controller/signup';
import { Controller } from '../../../../presentation/protocols';
import { makeSignupValidation } from './signupValidation';
import { makeAuthentication } from '../../useCases/authentication/db-authentication-factory';
import { makeAddAccount } from '../../useCases/add-account/add-account-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-fatory';

export const makeSignupController = (): Controller => {
  const controller = new SignUpController(makeAddAccount(), makeSignupValidation(), makeAuthentication());
  return makeLogControllerDecorator(controller);
}
