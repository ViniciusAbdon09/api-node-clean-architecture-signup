import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/useCases/authentication/authentication";
import { HashComparer } from "../../protocols/criptography/hash-compare";
import { TokenGenerate } from "../../protocols/criptography/token-generate";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashComparer;
  tokenGeneratorStub: TokenGenerate;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel | null> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

const makeHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare(password: string, hashed_password: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new HashCompareStub();
}

const makeTokenGenerate = (): TokenGenerate => {
  class TokenGenerateStub implements TokenGenerate {
    async generate(id: string): Promise<string> {
      return Promise.resolve('token')
    }
  }

  return new TokenGenerateStub();
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepository();
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerate();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub, updateAccessTokenRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DB Authentication useCase', () => {
  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
  });

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow()
  });

  test('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull()
  });

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthentication().password, makeFakeAccount().password)
  });

  test('Should throw if hashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow()
  });

  test('Should return null if hashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull()
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow()
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe('token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'token')
  });
})
