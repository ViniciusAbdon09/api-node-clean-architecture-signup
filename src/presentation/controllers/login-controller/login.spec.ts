import { InvalidParamError, MissingParamError } from "../../error";
import { badRequest, serverError, unauthorizedRequest, ok } from "../../helpers/http-helper";
import { EmailValidator, HttpRequest, Authentication } from "./login-protocols";
import { LoginController } from "./login";

type SutTypes = {
  sut: LoginController;
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }

  return new AuthenticationStub();
}

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
  const authenticationStub = makeAuthentication();

  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  test('Should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    })

    const httpRequest = makefakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call authentication if correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = makefakeRequest();

    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password);
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve('')))

    const httpRequest = makefakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorizedRequest());
  });

  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpRequest = makefakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makefakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
})
