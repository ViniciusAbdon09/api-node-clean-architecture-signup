import { ValidationRequiredFields } from '../../../presentation/helpers/validators/validateRequiredFields';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite';

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new ValidationRequiredFields(field))
  }

  return new ValidationComposite(validations)
}
