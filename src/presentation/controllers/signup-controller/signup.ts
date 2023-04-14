import { badRequest, serverError, ok } from "../../helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, AddAccount, AccountModel, Validation } from "./signup-protocols";

type SignUpReturnType = {
  name: string,
  email: string
}
export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<SignUpReturnType>> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);

      if (errorValidation) {
        return badRequest(errorValidation);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });

      return ok<SignUpReturnType>({ name: account.name, email: account.email })
    } catch (e) {
      return serverError(e as Error)
    }
  }
}
