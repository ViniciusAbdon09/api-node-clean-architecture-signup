import { InvalidParamError } from "../../../error";
import { ValidationCompareFields } from "./validateCompareFields"

const makeSut = (): ValidationCompareFields => {
  return new ValidationCompareFields('field', 'fieldToCompare');
}

describe('Compare Validation Fields', () => {
  test('Should return a invalidaParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'round-value' });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' });
    expect(error).toBeFalsy()
  })
})
