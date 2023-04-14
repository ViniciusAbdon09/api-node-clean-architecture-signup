import { AddAccountModel } from "../../../../domain/useCases/addAccount/addAccount";
import { AccountModel } from '../../../../domain/models/account';

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
