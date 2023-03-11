import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hashed'))
  }
}))

describe('bcrypt adapter', () => {
  test('Should call bcript if correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashed = await sut.encrypt('any_value');
    expect(hashed).toBe('hashed')
  })
})
