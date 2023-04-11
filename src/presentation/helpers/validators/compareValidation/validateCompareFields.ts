import { InvalidParamError } from "../../../error";
import { Validation } from "../../../protocols/validation";

export class ValidationCompareFields implements Validation {
  constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) { }

  validate(input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
    return null;
  }
}
