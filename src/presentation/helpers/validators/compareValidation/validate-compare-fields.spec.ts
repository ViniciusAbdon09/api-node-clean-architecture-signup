import { InvalidParamError } from "../../../error";
import { ValidationCompareFields } from "./validateCompareFields"

describe('Compare Validation Fields', () => {
  test('Should return a invalidaParam error if validation fails', () => {
    const sut = new ValidationCompareFields('pass', 'confirm');
    const error = sut.validate({ password: 'any_pass', passwordConfirm: 'any_confirmation' });
    expect(error).toEqual(new InvalidParamError('passwordConfirm'))
  })
})
