import { MissingParamError } from "../../error";
import { badRequest, ok } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup-controller/signup-protocols";

export class LoginController implements Controller {

  constructor(private readonly emailvalidator: EmailValidator) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    if (!httpRequest.body?.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!httpRequest.body?.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }

    this.emailvalidator.isValid(httpRequest.body.email)
    return Promise.resolve(ok({}))
  }
}
