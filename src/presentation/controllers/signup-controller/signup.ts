import { InvalidParamError } from "../../error/invalid-param-error";
import { MissingParamError } from "../../error/missing-param-error"
import { ServerError } from "../../error/server-error";
import { badRequest } from "../../helpers/http-helper"
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/emailValidator";
import { HttpRequest, HttpResponse } from "../../protocols/http"

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }


  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: {}
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
