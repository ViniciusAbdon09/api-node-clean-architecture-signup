import { LoginController } from "../../../../presentation/controllers/login-controller/login";
import { Controller } from "../../../../presentation/protocols";
import { makeLoginValidation } from "./loginValidation-factory";
import { makeAuthentication } from "../../useCases/authentication/db-authentication-factory";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-fatory";

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeAuthentication());
  return makeLogControllerDecorator(controller);
}
