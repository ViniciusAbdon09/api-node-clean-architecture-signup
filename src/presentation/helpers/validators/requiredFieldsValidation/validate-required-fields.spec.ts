import { MissingParamError } from "../../../error";
import { ValidationRequiredFields } from "./validateRequiredFields"

describe('Required Fields Validation', () => {
  test('Should return a missingParam error if validation fails', () => {
    const sut = new ValidationRequiredFields('field');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation success', () => {
    const sut = new ValidationRequiredFields('field');
    const error = sut.validate({ field: 'any_name' });
    expect(error).toBeFalsy()
  })
})
