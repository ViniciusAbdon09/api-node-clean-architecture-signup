import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hashed'))
  }
}))

interface SutTypes {
  sut: BcryptAdapter,
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);

  return {
    sut,
    salt
  }
}

describe('bcrypt adapter', () => {
  test('Should call bcript if correct value', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut();
    const hashed = await sut.encrypt('any_value');
    expect(hashed).toBe('hashed')
  })
})
