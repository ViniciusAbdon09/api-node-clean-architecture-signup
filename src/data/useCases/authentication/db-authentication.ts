import { Authentication, AuthenticationModel } from "../../../domain/useCases/authentication/authentication";
import { HashComparer } from "../../protocols/criptography/hash-compare";
import { TokenGenerate } from "../../protocols/criptography/token-generate";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerate: TokenGenerate
  ) { }

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);

    if (account) {
      const isMatch = await this.hashCompare.compare(authentication.password, account.password);

      if (!isMatch) return null;

      return await this.tokenGenerate.generate(account.id);
    }

    return null;
  }
}
