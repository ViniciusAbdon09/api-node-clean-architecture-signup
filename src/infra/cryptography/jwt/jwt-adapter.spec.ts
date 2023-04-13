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

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut, secret } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt({ id: 'any_id' });
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })
})
