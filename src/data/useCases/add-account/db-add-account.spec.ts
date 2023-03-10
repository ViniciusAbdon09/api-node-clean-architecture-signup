import { Encrypter } from "../../protocols/encrypter";
import { DBAddAccount } from "./db-add-account";


interface SutTypes {
  sut: DBAddAccount;
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DBAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub
  }
}

describe('DB Add Account', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
});
