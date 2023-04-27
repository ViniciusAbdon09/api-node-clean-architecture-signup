import { DbAuthentication } from "../../../../data/useCases/authentication/db-authentication";
import { Authentication } from "../../../../domain/useCases/authentication/authentication";
import { BcryptAdapter } from "../../../../infra/cryptography/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "../../../../infra/cryptography/jwt/jwt-adapter";
import { AccountMomoryRepository } from "../../../../infra/db/memoryDB/accountRepository/account-memory-repository";
import env from '../../../config/env';

export const makeAuthentication = (): Authentication => {
  const accountMemoryRepository = new AccountMomoryRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(accountMemoryRepository, bcryptAdapter, jwtAdapter, accountMemoryRepository);
}
