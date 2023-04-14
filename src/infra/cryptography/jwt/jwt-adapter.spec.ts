import { rejects } from 'assert';
import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/criptography/encrypter';
import { JwtAdapter } from './jwt-adapter';

interface SutTypes {
  sut: Encrypter;
  secret: string;
}

const makeSecretKey = (): string => 'secret';

const makeSut = (): SutTypes => {
  const secret = makeSecretKey();
  const sut = new JwtAdapter(makeSecretKey());

  return {
    sut,
    secret
  }
};

jest.mock('jsonwebtoken', () => ({
  sign: (): Promise<string> => {
    return Promise.resolve('any_token')
  }
}))

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut, secret } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt({ id: 'any_id' });
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })

  test('Should return a token on sign success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.encrypt({ id: 'any_id' });
    expect(accessToken).toBe('any_token')
  });

  test('Should throws if sign throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.reject(() => { throw new Error() }));
    const promise = sut.encrypt({ id: 'any_id' });
    await expect(promise).rejects.toThrow()
  })
})
