import { MissingParamError } from '../../../error';
import { Validation } from '../protocols/validation';
import { ValidationComposite } from './validation-composite';

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: any): Error | null {
        return new MissingParamError('field');
      }

    }
    const validationStub = new ValidationStub();
    const sut = new ValidationComposite([validationStub]);
    const error = sut.validate({ field: 'anyValue' });
    expect(error).toEqual(new MissingParamError('field'))
  })
})
