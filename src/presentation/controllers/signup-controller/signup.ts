import { badRequest, serverError, ok } from "../../helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, AddAccount, AccountModel, Validation } from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<AccountModel>> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);

      if (errorValidation) {
        return badRequest(errorValidation);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });

      return ok<AccountModel>(account)
    } catch (e) {
      return serverError(e as Error)
    }
  }
}
