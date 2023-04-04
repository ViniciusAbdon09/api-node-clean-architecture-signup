import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest } from "../../helpers/http-helper";
import { EmailValidator, HttpRequest } from "../signup-controller/signup-protocols";
import { LoginController } from "./login";

type SutTypes = {
  sut: LoginController;
  emailValidatorStub: EmailValidator
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makefakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  };
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call emailvalidator if correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isvalidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makefakeRequest();

    await sut.handle(httpRequest);
    expect(isvalidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('Should returns 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = makefakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });
})
