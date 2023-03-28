import { DBAddAccount } from '../../../data/useCases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptograph/bcrypt-adapter';
import { SignUpController } from '../../../presentation/controllers/signup-controller/signup';
import { EmailValidatorAdapter } from '../../../utils/email-validator/email-validator-adapter';
import { AccountMomoryRepository } from '../../../infra/db/memoryDB/accountRepository/account';
import { Controller } from '../../../presentation/protocols';
import { AccountModel } from '../../../domain/models/account';
import { LogControllerDecorator } from '../../decorators/logs';

export const makeSignupController = (): Controller => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMomoryRepository();
  const addAccount = new DBAddAccount(encrypter, addAccountRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator<AccountModel>(signUpController);
}
