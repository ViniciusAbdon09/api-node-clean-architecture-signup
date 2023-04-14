import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "../../../../data/useCases/authentication/db-authentication-protocols";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/useCases/addAccount/addAccount";
import { clientMemoryDB } from "../helpers/repository-in-memory-helper";

export class AccountMomoryRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    clientMemoryDB.addCollection('accounts');
    const result = clientMemoryDB.add<AddAccountModel, AccountModel>('accounts', accountData)
    return result
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    clientMemoryDB.addCollection('accounts');
    const result = clientMemoryDB.getByOne<AccountModel>('accounts', 'email', email);
    return result
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    clientMemoryDB.addCollection('accounts');
    const account = clientMemoryDB.getByOne<AccountModel>('accounts', 'id', id);
    if (!account) return;
    clientMemoryDB.update<AccountModel>('accounts', { ...account, accessToken: token })
  }
}
