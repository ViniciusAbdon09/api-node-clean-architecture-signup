import { ValidationRequiredFields } from '../../../../presentation/helpers/validators/requiredFieldsValidation/validateRequiredFields';
import { Validation } from '../../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../../presentation/helpers/validators/ValidationComposite/validation-composite';
import { ValidationEmail } from '../../../../presentation/helpers/validators/emailValidation/validateEmail';
import { EmailValidatorAdapter } from '../../../../utils/email-validator/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ['email', 'password']) {
    validations.push(new ValidationRequiredFields(field))
  }

  validations.push(new ValidationEmail('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
