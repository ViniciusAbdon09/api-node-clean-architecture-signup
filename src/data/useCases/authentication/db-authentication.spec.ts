import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/useCases/authentication/authentication";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepository);

  return {
    sut,
    loadAccountByEmailRepository
  }
}

describe('DB Authentication useCase', () => {
  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
