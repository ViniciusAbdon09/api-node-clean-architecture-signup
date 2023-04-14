import { AddAccount, Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
export class DBAddAccount implements AddAccount {
  private readonly hasher: Hasher;
  private readonly addAccountRepository: AddAccountRepository

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.hasher.hash(account.password)
    const accountCreated = await this.addAccountRepository.add(Object.assign({}, account, { password: passwordHashed }))
    return accountCreated;
  }

}
