import { Validation } from "./protocols/validation";

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) { }

  validate(input: any): Error | null {
    for (const validation of this.validations) {
      const errorValidation = validation.validate(input);
      if (errorValidation) {
        return errorValidation;
      }
    }
    return null
  }
}
