import { DBAddAccount } from "../../../../data/useCases/add-account/db-add-account";
import { AddAccount } from "../../../../domain/useCases/addAccount/addAccount";
import { BcryptAdapter } from "../../../../infra/cryptography/bcrypt/bcrypt-adapter";
import { AccountMomoryRepository } from "../../../../infra/db/memoryDB/accountRepository/account-memory-repository";

export const makeAddAccount = (): AddAccount => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMomoryRepository();
  return new DBAddAccount(hasher, addAccountRepository, addAccountRepository);
}
