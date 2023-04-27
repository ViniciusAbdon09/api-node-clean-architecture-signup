import { MissingParamError } from "../../../presentation/error";
import { ValidationRequiredFields } from "./validateRequiredFields"

const makeSut = (): ValidationRequiredFields => {
  return new ValidationRequiredFields('field');
}

describe('Required Fields Validation', () => {
  test('Should return a missingParam error if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation success', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_name' });
    expect(error).toBeFalsy()
  })
})
