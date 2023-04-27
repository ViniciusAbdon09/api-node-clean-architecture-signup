import { Validation } from "../../../../presentation/protocols/validation";
import { EmailValidator } from "../../../../validation/protocols/emailValidator";
import { ValidationEmail } from "../../../../validation/validators/emailValidation/validateEmail";
import { ValidationRequiredFields } from "../../../../validation/validators/requiredFieldsValidation/validateRequiredFields";
import { ValidationComposite } from "../../../../validation/validators/ValidationComposite/validation-composite";
import { makeLoginValidation } from "../login/loginValidation-factory"

jest.mock('../../../../validation/validators/ValidationComposite/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('Login validation Factory', () => {
  test('Should call validation composite if all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new ValidationRequiredFields(field))
    }

    validations.push(new ValidationEmail('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
