import {
  AuthenticationModel,
  Authentication,
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerate,
  UpdateAccessTokenRepository
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerate: TokenGenerate,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);

    if (account) {
      const isMatch = await this.hashCompare.compare(authentication.password, account.password);
      if (!isMatch) return null;
      const accessToken = await this.tokenGenerate.generate(account.id);
      await this.updateAccessTokenRepository.update(account.id, accessToken)
      return accessToken;
    }

    return null;
  }
}
