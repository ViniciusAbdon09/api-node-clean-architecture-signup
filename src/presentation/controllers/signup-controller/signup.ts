import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, serverError } from "../../helpers/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from "./signup-protocols";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirm } = httpRequest.body;

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'));
      }

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this.addAccount.add({ name, email, password });

      return {
        statusCode: 200,
        body: {}
      }
    } catch (e) {
      return serverError()
    }
  }
}
