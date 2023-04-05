import { Authentication } from "../../../domain/useCases/authentication/authentication";
import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, ok, serverError, unauthorizedRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup-controller/signup-protocols";

export class LoginController implements Controller {

  constructor(
    private readonly emailvalidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    try {
      const { email, password } = httpRequest.body;

      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailvalidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorizedRequest();
      }

      return ok({})
    } catch (e: any) {
      return serverError(e)
    }
  }
}
