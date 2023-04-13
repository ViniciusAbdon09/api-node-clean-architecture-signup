import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hashed'))
  },

  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true))
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
  test('Should call hash if correct value', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut();
    const hashed = await sut.hash('any_value');
    expect(hashed).toBe('hashed')
  })

  test('Should throw if hash throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async (): Promise<Error> => {
      return new Promise((resolve, rejects) => rejects(new Error()))
    });

    await expect(sut.hash('any_value')).rejects.toThrow();
  });

  test('Should call compare if correct value', async () => {
    const { sut, salt } = makeSut();
    const compareSty = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSty).toHaveBeenCalledWith('any_value', 'any_hash')
  });

  test('Should return true when compare succeeds', async () => {
    const { sut } = makeSut();
    const isMatch = await sut.compare('any_value', 'hash_value');
    expect(isMatch).toBeTruthy();
  });

  test('Should return false when compare fails', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isMatch = await sut.compare('any_value', 'hash_value');
    expect(isMatch).toBeFalsy();
  });
})
