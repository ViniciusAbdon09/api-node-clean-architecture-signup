import { Validation } from "../../../../presentation/protocols/validation";
import { EmailValidator } from "../../../../validation/protocols/emailValidator";
import { ValidationCompareFields } from "../../../../validation/validators/compareValidation/validateCompareFields";
import { ValidationEmail } from "../../../../validation/validators/emailValidation/validateEmail";
import { ValidationRequiredFields } from "../../../../validation/validators/requiredFieldsValidation/validateRequiredFields";
import { ValidationComposite } from "../../../../validation/validators/ValidationComposite/validation-composite";
import { makeSignupValidation } from "./signupValidation";

jest.mock('../../../../validation/validators/ValidationComposite/validation-composite');

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
