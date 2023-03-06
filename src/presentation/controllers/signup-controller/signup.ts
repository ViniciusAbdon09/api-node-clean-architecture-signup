import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, serverError } from "../../helpers/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../../protocols";

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

      if (httpRequest.body.passwordConfirm !== httpRequest.body.password) {
        return badRequest(new InvalidParamError('passwordConfirm'));
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
      return serverError()
    }
  }
}
