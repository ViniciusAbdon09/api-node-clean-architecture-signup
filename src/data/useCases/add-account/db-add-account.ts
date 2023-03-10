import { AddAccount, Encrypter, AddAccountModel, AccountModel } from './db-add-account-protocols'
export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve({ id: '', name: '', email: '', password: '' }))
  }

}