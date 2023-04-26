import { ValidationCompareFields } from "../../../../presentation/helpers/validators/compareValidation/validateCompareFields";
import { ValidationRequiredFields } from "../../../../presentation/helpers/validators/requiredFieldsValidation/validateRequiredFields";
import { Validation } from "../../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../../presentation/helpers/validators/ValidationComposite/validation-composite";
import { makeSignupValidation } from "./signupValidation"
import { ValidationEmail } from "../../../../presentation/helpers/validators/emailValidation/validateEmail";
import { EmailValidator } from "../../../../presentation/protocols/emailValidator";

jest.mock('../../../../presentation/helpers/validators/ValidationComposite/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUp validation Factory', () => {
  test('Should call validation composite if all validations', () => {
    makeSignupValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new ValidationRequiredFields(field))
    }

    validations.push(new ValidationCompareFields('password', 'passwordConfirm'))
    validations.push(new ValidationEmail('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
