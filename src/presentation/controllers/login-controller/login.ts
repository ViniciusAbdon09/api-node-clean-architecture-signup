import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, ok } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup-controller/signup-protocols";

export class LoginController implements Controller {

  constructor(private readonly emailvalidator: EmailValidator) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    const { email, password } = httpRequest.body;

    if (!email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }

    const isValid = this.emailvalidator.isValid(email)


    if (!isValid) {
      return Promise.resolve(badRequest(new InvalidParamError('email')))
    }

    return Promise.resolve(ok({}))
  }
}
