import { InvalidParamError } from "../../../presentation/error";
import { EmailValidator } from "../../protocols/emailValidator";
import { Validation } from "../../../presentation/protocols/validation";

export class ValidationEmail implements Validation {
  constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidator) { }

  validate(input: any): Error | null {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
