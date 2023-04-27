import { ValidationCompareFields } from '../../../../validation/validators/compareValidation/validateCompareFields';
import { ValidationRequiredFields } from '../../../../validation/validators/requiredFieldsValidation/validateRequiredFields';
import { Validation } from '../../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../../validation/validators/ValidationComposite/validation-composite';
import { ValidationEmail } from '../../../../validation/validators/emailValidation/validateEmail';
import { EmailValidatorAdapter } from '../../../../utils/email-validator/email-validator-adapter';

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new ValidationRequiredFields(field))
  }

  validations.push(new ValidationCompareFields('password', 'passwordConfirm'));

  validations.push(new ValidationEmail('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
