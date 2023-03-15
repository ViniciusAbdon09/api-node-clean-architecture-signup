import { clientMemoryDB } from "../helpers/repository-in-memory-helper";
import { AccountMomoryRepository } from "./account";


describe('Account Mongo Repository', () => {
  afterAll(() => {
    clientMemoryDB.reset();
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMomoryRepository();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  });
})
