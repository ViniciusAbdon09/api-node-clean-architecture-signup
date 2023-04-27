import { ValidationEmail } from "./validateEmail";
import { EmailValidator } from "../../protocols/emailValidator";
import { InvalidParamError } from "../../../presentation/error";

interface SutTypes {
  sut: ValidationEmail,
  emailValidatorStub: EmailValidator,
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

// Criar um factory para os mocks
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new ValidationEmail('email', emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  }
}

describe('Validation Email', () => {
  test('Should return an error if email validation returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'));
  })

  test('Should call emailValidator if an correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  });

  test('Should throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
})
