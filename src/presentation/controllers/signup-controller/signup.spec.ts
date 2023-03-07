import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../domain/useCases/addAccount/addAccount";
import { InvalidParamError, MissingParamError, ServerError } from "../../error";
import { EmailValidator } from "../../protocols";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

const makeAddAccount = (): AddAccount => {
  class AddAccountSub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount: AccountModel = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      };

      return fakeAccount;
    }
  }

  return new AddAccountSub();
}

// Criar um factory para os mocks
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('name'));
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('email'));
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirm: 'any_password'
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password'));
  })

  test('Should return 400 if no passwordConfirm is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('passwordConfirm'));
  })

  test('Should return 400 if passwordConfirm fails', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'invalid-password'
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new InvalidParamError('passwordConfirm'));
  })

  test('Should return 400 if an invalid email provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new InvalidParamError('email'));
  })

  test('Should call emailValidator if an correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should call AddAccount if with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email@email.com',
      password: 'any_password',
    })
  })

  test('Should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error();
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(500);
    expect(httResponse.body).toEqual(new ServerError());
  })
})
