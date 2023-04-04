import { MissingParamError } from "../../error";
import { badRequest, ok } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    if (!httpRequest.body?.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!httpRequest.body?.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }

    return Promise.resolve(ok({}))
  }
}
