import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols';
import { AddAccount, Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
export class DBAddAccount implements AddAccount {
  private readonly hasher: Hasher;
  private readonly addAccountRepository: AddAccountRepository;
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository, loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(account.email);
    const passwordHashed = await this.hasher.hash(account.password)
    const accountCreated = await this.addAccountRepository.add(Object.assign({}, account, { password: passwordHashed }))
    return accountCreated;
  }

}
