import { ValidationCompareFields } from '../../../presentation/helpers/validators/compareValidation/validateCompareFields';
import { ValidationRequiredFields } from '../../../presentation/helpers/validators/requiredFieldsValidation/validateRequiredFields';
import { Validation } from '../../../presentation/helpers/validators/protocols/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite/validation-composite';
import { ValidationEmail } from '../../../presentation/helpers/validators/emailValidation/validateEmail';
import { EmailValidatorAdapter } from '../../../utils/email-validator/email-validator-adapter';

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new ValidationRequiredFields(field))
  }

  validations.push(new ValidationCompareFields('password', 'passwordConfirm'));

  validations.push(new ValidationEmail('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
