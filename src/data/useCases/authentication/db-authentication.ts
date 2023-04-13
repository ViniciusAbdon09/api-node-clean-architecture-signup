import {
  AuthenticationModel,
  Authentication,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerate: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);

    if (account) {
      const isMatch = await this.hashCompare.compare(authentication.password, account.password);
      if (!isMatch) return null;
      const accessToken = await this.tokenGenerate.encrypt(account.id);
      await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
      return accessToken;
    }

    return null;
  }
}
