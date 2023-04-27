import { EmailInUseError } from "../../error";
import { badRequest, serverError, ok, forbidden } from "../../helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, AddAccount, AccountModel, Validation, Authentication } from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);

      if (errorValidation) {
        return badRequest(errorValidation);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const token = await this.authentication.auth({
        email,
        password
      });
      return ok({ accessToken: token })
    } catch (e) {
      return serverError(e as Error)
    }
  }
}
