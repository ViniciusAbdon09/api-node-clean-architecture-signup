import { resolve } from 'path';
import { AddAccount, Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository

  constructor(encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(account.password)
    const accountCreated = await this.addAccountRepository.add(Object.assign({}, account, { password: passwordHashed }))
    return accountCreated;
  }

}
