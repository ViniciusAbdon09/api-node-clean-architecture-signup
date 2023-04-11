import { MissingParamError } from "../../error";
import { Validation } from "./validation";

export class ValidationRequiredFields implements Validation {
  constructor(private readonly fieldName: string) { }

  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
