import { InvalidParamError } from "../../error";
import { badRequest, serverError, ok } from "../../helpers/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount, AccountModel, Validation } from "./signup-protocols";

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<AccountModel>> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);

      if (errorValidation) {
        return badRequest(errorValidation);
      }

      const { name, email, password, passwordConfirm } = httpRequest.body;

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'));
      }

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({ name, email, password });

      return ok<AccountModel>(account)
    } catch (e) {
      return serverError(e as Error)
    }
  }
}
