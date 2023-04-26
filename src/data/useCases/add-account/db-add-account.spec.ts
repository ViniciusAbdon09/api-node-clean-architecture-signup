import { AccountModel, AddAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols";
import { DBAddAccount } from "./db-add-account";
import { AuthenticationModel, LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols";

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_mail',
        password: 'hashed_password',
        accessToken: ''
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: ''
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

interface SutTypes {
  sut: DBAddAccount;
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DBAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DB Add Account', () => {
  test('Should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut();

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, rejects) => {
      return rejects(new Error())
    }))

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_mail',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, rejects) => {
      return rejects(new Error())
    }))

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }

    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_mail',
      password: 'hashed_password',
      accessToken: ''
    })
  })

  test('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    const account = await sut.add(makeFakeAccount());
    expect(account).toBeNull()
  });

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    await sut.add(makeFakeAccount());
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAccount().email)
  });
});
