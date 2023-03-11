import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from 'bcrypt';

describe('bcrypt adapter', () => {
  test('Should call bcript if correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
