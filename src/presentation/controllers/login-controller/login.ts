import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, ok, serverError, unauthorizedRequest } from "../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from "./login-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);

      if (errorValidation) {
        return badRequest(errorValidation);
      }

      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorizedRequest();
      }

      return ok({ accessToken })
    } catch (e) {
      return serverError(e as Error)
    }
  }
}
