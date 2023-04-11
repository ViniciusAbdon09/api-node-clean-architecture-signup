import { ValidationRequiredFields } from "../../../presentation/helpers/validators/validateRequiredFields";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validationComposite";
import { makeSignupValidation } from "./signupValidation"

jest.mock('../../../presentation/helpers/validators/validationComposite');

describe('SignUp validation Factory', () => {
  test('Should call validation composite if all validations', () => {
    makeSignupValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new ValidationRequiredFields(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
