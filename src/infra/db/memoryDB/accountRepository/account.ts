import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/useCases/addAccount/addAccount";
import { clientMemoryDB } from "../helpers/repository-in-memory-helper";

export class AccountMomoryRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    clientMemoryDB.addCollection('accouts');

    const result = clientMemoryDB.add<AddAccountModel, AccountModel>('accounts', accountData)

    return result
  }

}
