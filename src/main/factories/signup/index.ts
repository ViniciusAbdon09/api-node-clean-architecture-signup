import { DBAddAccount } from '../../../data/useCases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptograph/bcrypt-adapter';
import { SignUpController } from '../../../presentation/controllers/signup-controller/signup';
import { EmailValidatorAdapter } from '../../../utils/email-validator/email-validator-adapter';
import { AccountMomoryRepository } from '../../../infra/db/memoryDB/accountRepository/account';

export const makeSignupController = (): SignUpController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMomoryRepository();
  const addAccount = new DBAddAccount(encrypter, addAccountRepository);
  return new SignUpController(emailValidator, addAccount);
}
