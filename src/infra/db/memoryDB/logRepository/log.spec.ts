import { clientMemoryDB } from "../helpers/repository-in-memory-helper";
import { LogMomoryRepository } from "./log";

interface SutTypes {
  sut: LogMomoryRepository
};

const makeSut = (): SutTypes => {
  const sut = new LogMomoryRepository();

  return { sut };
}

describe('Log DB Memory', () => {
  afterAll(() => {
    clientMemoryDB.reset();
  })

  beforeEach(() => {
    clientMemoryDB.reset();
    clientMemoryDB.addCollection('errors');
  })

  test('Should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('any_error');

    const count = clientMemoryDB.getAll('errors').length;

    expect(count).toBe(1)
  })
})
