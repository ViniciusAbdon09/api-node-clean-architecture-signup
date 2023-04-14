import { DbAuthentication } from "../../../data/useCases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt/jwt-adapter";
import { AccountMomoryRepository } from "../../../infra/db/memoryDB/accountRepository/account-memory-repository";
import { LogMomoryRepository } from "../../../infra/db/memoryDB/logRepository/log-memory-repository";
import { LoginController } from "../../../presentation/controllers/login-controller/login";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/logs";
import { makeLoginValidation } from "./loginValidation-factory";
import env from '../../config/env';

export const makeLoginController = (): Controller => {
  const accountMemoryRepository = new AccountMomoryRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const dbAuthentication = new DbAuthentication(accountMemoryRepository, bcryptAdapter, jwtAdapter, accountMemoryRepository);
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication);
  const logErrorRepository = new LogMomoryRepository();
  return new LogControllerDecorator(loginController, logErrorRepository);
}
